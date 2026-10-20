// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title ClaimRegistry
 * @notice Records Netra checks of public climate claims. Does not mint, hold or retire credits:
 *         credits are retired in their own registry; this contract anchors the check report and the
 *         registry serial ranges behind the claim, so the same retired tonnes cannot back two claims.
 *
 *         Two ways to bind serial ranges (a "nullifier" = keccak256(registry, serial range)):
 *         - record():     strict. Every nullifier is stored; a reused one reverts. Best for small claims.
 *         - recordRoot(): cheap. Only a Merkle root of the nullifiers is stored (constant gas). If any
 *                         nullifier appears in two claims, anyone can submit the two Merkle proofs to
 *                         challenge(); the later claim is flagged as a double claim on-chain.
 */
contract ClaimRegistry is AccessControl {
    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");

    struct Check {
        bytes32 subject;     // keccak256 of the claimant name as shown in Netra
        bytes32 reportHash;  // keccak256 of the published check report (JSON)
        bytes32 serialRoot;  // Merkle root of nullifiers (recordRoot), zero for strict records
        uint32 serialCount;  // number of serial ranges behind the claim
        uint64 timestamp;
        address attester;
        bool doubleClaim;    // set by a successful challenge
        string uri;          // where the report and its serial list can be fetched
    }

    Check[] public checks;
    // strict mode: nullifier => check id + 1 (0 = unused)
    mapping(bytes32 => uint256) public claimedBy;

    event CheckRecorded(uint256 indexed id, bytes32 indexed subject, bytes32 reportHash, bytes32 serialRoot, uint32 serialCount, string uri);
    event SerialBound(bytes32 indexed nullifier, uint256 indexed id);
    event DoubleClaim(bytes32 indexed nullifier, uint256 indexed earlierId, uint256 indexed laterId, address challenger);

    error AlreadyClaimed(bytes32 nullifier, uint256 checkId);
    error EmptyHash();
    error BadChallenge();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ATTESTER_ROLE, msg.sender);
    }

    function record(bytes32 subject, bytes32 reportHash, string calldata uri, bytes32[] calldata nullifiers)
        external
        onlyRole(ATTESTER_ROLE)
        returns (uint256 id)
    {
        id = _push(subject, reportHash, bytes32(0), uint32(nullifiers.length), uri);
        for (uint256 i; i < nullifiers.length; ++i) {
            bytes32 n = nullifiers[i];
            uint256 prev = claimedBy[n];
            if (prev != 0) revert AlreadyClaimed(n, prev - 1);
            claimedBy[n] = id + 1;
            emit SerialBound(n, id);
        }
    }

    function recordRoot(bytes32 subject, bytes32 reportHash, string calldata uri, bytes32 serialRoot, uint32 serialCount)
        external
        onlyRole(ATTESTER_ROLE)
        returns (uint256 id)
    {
        if (serialRoot == bytes32(0)) revert EmptyHash();
        id = _push(subject, reportHash, serialRoot, serialCount, uri);
    }

    /// @notice Prove that one serial range backs two claims. Anyone can call. The later claim is flagged.
    function challenge(bytes32 nullifier, uint256 idA, bytes32[] calldata proofA, uint256 idB, bytes32[] calldata proofB)
        external
    {
        if (idA == idB || idA >= checks.length || idB >= checks.length) revert BadChallenge();
        if (!_contains(idA, nullifier, proofA) || !_contains(idB, nullifier, proofB)) revert BadChallenge();
        (uint256 earlier, uint256 later) = idA < idB ? (idA, idB) : (idB, idA);
        checks[later].doubleClaim = true;
        emit DoubleClaim(nullifier, earlier, later, msg.sender);
    }

    function count() external view returns (uint256) {
        return checks.length;
    }

    function leaf(bytes32 nullifier) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(nullifier));
    }

    function _contains(uint256 id, bytes32 nullifier, bytes32[] calldata proof) internal view returns (bool) {
        Check storage c = checks[id];
        if (c.serialRoot == bytes32(0)) return claimedBy[nullifier] == id + 1; // strict record: proof not needed
        return MerkleProof.verifyCalldata(proof, c.serialRoot, leaf(nullifier));
    }

    function _push(bytes32 subject, bytes32 reportHash, bytes32 root, uint32 n, string calldata uri) internal returns (uint256 id) {
        if (subject == bytes32(0) || reportHash == bytes32(0)) revert EmptyHash();
        id = checks.length;
        checks.push(Check(subject, reportHash, root, n, uint64(block.timestamp), msg.sender, false, uri));
        emit CheckRecorded(id, subject, reportHash, root, n, uri);
    }
}
