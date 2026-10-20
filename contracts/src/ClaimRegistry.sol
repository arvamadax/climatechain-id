// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ClaimRegistry
 * @notice Records Netra checks of public climate claims. Does not mint, hold or retire credits:
 *         credits are retired in their own registry; this contract anchors the check report and
 *         binds each registry serial range to at most one claim, so the same retired tonnes
 *         cannot back two different claims.
 */
contract ClaimRegistry is AccessControl {
    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");

    struct Check {
        bytes32 subject;     // keccak256 of the normalized claimant name
        bytes32 reportHash;  // keccak256 of the published check report (JSON)
        string uri;          // where the report can be fetched
        uint64 timestamp;
        address attester;
    }

    Check[] public checks;
    // keccak256(registry, serial range) => check id + 1 (0 = unused)
    mapping(bytes32 => uint256) public claimedBy;

    event CheckRecorded(uint256 indexed id, bytes32 indexed subject, bytes32 reportHash, string uri, address attester);
    event SerialBound(bytes32 indexed nullifier, uint256 indexed id);

    error AlreadyClaimed(bytes32 nullifier, uint256 checkId);
    error EmptyHash();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ATTESTER_ROLE, msg.sender);
    }

    function record(bytes32 subject, bytes32 reportHash, string calldata uri, bytes32[] calldata nullifiers)
        external
        onlyRole(ATTESTER_ROLE)
        returns (uint256 id)
    {
        if (subject == bytes32(0) || reportHash == bytes32(0)) revert EmptyHash();
        id = checks.length;
        for (uint256 i; i < nullifiers.length; ++i) {
            bytes32 n = nullifiers[i];
            uint256 prev = claimedBy[n];
            if (prev != 0) revert AlreadyClaimed(n, prev - 1);
            claimedBy[n] = id + 1;
            emit SerialBound(n, id);
        }
        checks.push(Check(subject, reportHash, uri, uint64(block.timestamp), msg.sender));
        emit CheckRecorded(id, subject, reportHash, uri, msg.sender);
    }

    function count() external view returns (uint256) {
        return checks.length;
    }
}
