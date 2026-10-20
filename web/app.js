"use strict";

let CHAIN = null; // from data/deployment.json, written by contracts/scripts/deploy.js
const ABI = [
  "function count() view returns (uint256)",
  "function checks(uint256) view returns (bytes32 subject, bytes32 reportHash, bytes32 serialRoot, uint32 serialCount, uint64 timestamp, address attester, bool doubleClaim, string uri)",
];
const EXAMPLES = ["Shell", "Delta Air Lines", "Netflix, Inc.", "Volkswagen Marke Pkw", "Eni Upstream", "Apple Inc.", "Not Disclosed"];
const GRADES = [[0.6, "A", "--a"], [0.4, "B", "--b"], [0.2, "C", "--c"], [0.1, "D", "--d"], [0, "E", "--e"]];
const CAT_COLORS = { redd: "#3f7f5f", cookstove: "#c07a2c", wind_china: "#5a7fb0", ifm_us: "#7a6aa8", hfc23: "#8a8f3a",
  grid_re: "#9fb3c8", other: "#c9cfca" };
const CCP = { approved: ["CCP-approved methodology", "--a"], not_approved: ["Rejected by ICVCM", "--e"],
  not_assessed: ["Not assessed / not listed", "--na"] };

const $ = (s) => document.querySelector(s);
const fmt = (n) => Math.round(n).toLocaleString("en-US");
const mt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + " Mt" : n >= 1e3 ? (n / 1e3).toFixed(1) + " kt" : fmt(n) + " t");
const pct = (x) => (x * 100).toFixed(x < 0.1 && x > 0 ? 1 : 0) + "%";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

let INDEX, FACTORS, SHARD, rows;
const shards = new Map();
let onchain = null; // Promise<Array<check>>

function grade(e, k, t) {
  if (!k || k / t < 0.25) return null;
  const r = e / k;
  return GRADES.find(([min]) => r >= min);
}

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Could not load ${url} (${r.status})`);
  return r.json();
}

async function owner(i) {
  const s = Math.floor(i / SHARD);
  if (!shards.has(s)) shards.set(s, getJSON(`data/o/${s}.json`));
  return (await shards.get(s))[i % SHARD];
}

// Canonical report = the owner record exactly as published; the same rule is used by contracts/scripts/record.js.
const reportHash = (o) => ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(o)));
const subjectHash = (name) => ethers.id(name);

// Sorted-pair Merkle root of serial-range nullifiers, identical to contracts/scripts/merkle.js.
const nullifier = (s) => { const [r, ...x] = s.split(":"); return ethers.solidityPackedKeccak256(["string", "string"], [r, x.join(":")]); };
function serialRoot(serials) {
  let level = [...new Set(serials.map((s) => ethers.keccak256(nullifier(s))))].sort();
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 === level.length) { next.push(level[i]); continue; }
      const [a, b] = level[i].toLowerCase() < level[i + 1].toLowerCase() ? [level[i], level[i + 1]] : [level[i + 1], level[i]];
      next.push(ethers.keccak256(ethers.concat([a, b])));
    }
    level = next;
  }
  return level[0];
}
async function serialStatus(c) {
  if (c.serialRoot === ethers.ZeroHash) return `${c.serialCount} ranges (strict)`;
  try {
    const f = await getJSON(c.uri);
    return serialRoot(f.serials) === c.serialRoot
      ? `<span class="ok">✓ ${fmt(c.serialCount)} serial ranges match</span>`
      : `<span class="bad">serial list does not match root</span>`;
  } catch { return `<span class="muted">${fmt(c.serialCount)} ranges (list unavailable)</span>`; }
}

/* ---------- search ---------- */
function search(q) {
  q = q.trim().toLowerCase();
  if (q.length < 2) return [];
  const out = [];
  for (let i = 0; i < rows.length && out.length < 200; i++) {
    const n = rows[i][0].toLowerCase();
    const at = n.indexOf(q);
    if (at >= 0) out.push([at === 0 ? 0 : 1, i]);
  }
  return out.sort((a, b) => a[0] - b[0] || a[1] - b[1]).slice(0, 10).map((x) => x[1]);
}

function setupSearch() {
  const q = $("#q"), list = $("#suggest");
  let hits = [], sel = -1;
  const close = () => { list.hidden = true; q.setAttribute("aria-expanded", "false"); };
  const draw = () => {
    list.innerHTML = hits.map((i, k) => `<li role="option" data-i="${i}" aria-selected="${k === sel}">
      <span>${esc(rows[i][0])}</span><span class="t">${mt(rows[i][1])}</span></li>`).join("")
      || `<li aria-disabled="true"><span class="muted">No buyer with that name. Try a shorter part of the name.</span></li>`;
    list.hidden = false; q.setAttribute("aria-expanded", "true");
  };
  q.addEventListener("input", () => { hits = search(q.value); sel = -1; q.value.trim().length < 2 ? close() : draw(); });
  q.addEventListener("keydown", (e) => {
    if (list.hidden) return;
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, hits.length - 1); draw(); e.preventDefault(); }
    if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); draw(); e.preventDefault(); }
    if (e.key === "Enter" && hits.length) { pick(hits[Math.max(sel, 0)]); close(); }
    if (e.key === "Escape") close();
  });
  list.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) { pick(+li.dataset.i); close(); } });
  document.addEventListener("click", (e) => { if (!e.target.closest(".search")) close(); });
  $("#examples").innerHTML = EXAMPLES.map((n) => {
    const i = rows.findIndex((r) => r[0] === n);
    return i < 0 ? "" : `<button type="button" data-i="${i}">${esc(n)}</button>`;
  }).join("");
  $("#examples").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) pick(+b.dataset.i); });
}

function pick(i) {
  $("#q").value = rows[i][0];
  history.replaceState(null, "", `#buyer-${i}`);
  render(i);
}

/* ---------- result ---------- */
function bar(parts) {
  return `<div class="bar">${parts.filter((p) => p[0] > 0).map(([w, c, t]) =>
    `<span style="width:${(w * 100).toFixed(2)}%;background:${c}" title="${esc(t)}"></span>`).join("")}</div>`;
}

function sparkline(ys) {
  const years = Object.keys(ys).map(Number).sort();
  const pts = years.map((y) => [y, ys[y][2] ? ys[y][1] / ys[y][2] : null]);
  const W = 260, H = 70, pad = 18, x0 = years[0], x1 = years[years.length - 1];
  const X = (y) => pad + ((y - x0) / Math.max(1, x1 - x0)) * (W - 2 * pad);
  const Y = (v) => H - 14 - v * (H - 26);
  const valid = pts.filter((p) => p[1] !== null);
  const path = valid.map((p, k) => `${k ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join("");
  const tonnes = years.map((y) => ys[y][0]), tmax = Math.max(...tonnes);
  const bars = years.map((y, k) => `<rect x="${X(y) - 6}" y="${H - 14 - (tonnes[k] / tmax) * 22}" width="12" height="${(tonnes[k] / tmax) * 22}" fill="${css("--line")}"/>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Likely-real share by retirement year">
    ${bars}<path d="${path}" fill="none" stroke="${css("--accent")}" stroke-width="2"/>
    ${valid.map((p) => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="2.6" fill="${css("--accent")}"><title>${p[0]}: ${pct(p[1])} likely real</title></circle>`).join("")}
    <text x="${pad}" y="${H - 2}">${x0}</text><text x="${W - pad}" y="${H - 2}" text-anchor="end">${x1}</text></svg>`;
}

const TYPE_NOTE = {
  intermediary: "An offset provider or account that retires credits on behalf of its clients. The end claimants are not named here.",
  wallet: "A crypto wallet address. These credits were retired to back tokens on a blockchain; who holds the climate claim is not visible in the registry.",
  anonymous: "No identifiable beneficiary. Nobody can be held to claims based on these credits.",
  unidentified: "A code that could not be matched to any organisation from the registry details. Netra does not guess who it is.",
  tokenization: "Credits retired to create crypto tokens. Verra stopped allowing retired credits to be tokenized in 2022.",
  public_body: "A public authority.",
};

function buyerLine(o) {
  if (!o.g) return "";
  const note = TYPE_NOTE[o.g.type];
  const group = o.g.group && o.g.group !== o.n ? `Part of <b>${esc(o.g.group)}</b>` : "";
  const extra = o.g.note ? ` (${esc(o.g.note)})` : "";
  return `<p class="muted small">${group}${group && extra ? extra : ""}${note ? `${group ? " · " : ""}${note}` : ""}</p>`;
}

function reportedBox(o) {
  const r = o.rep;
  if (!r) return "";
  const comp = o.ct && o.ct.coverage === "core"
    ? `<p class="muted small">Climate TRACE's ownership-weighted estimate for the same group: ${o.ct.low === o.ct.high ? mt(o.ct.low) : `${mt(o.ct.low)} – ${mt(o.ct.high)}`}. The two use different boundaries, so neither replaces the other.</p>` : "";
  return `<div class="box"><h3>Company-reported emissions</h3>
    <p>${r.scope1 != null ? `<b class="num">${mt(r.scope1)}</b> Scope 1` : ""}${r.scope1 != null && r.total ? " · " : ""}${r.total ? `<b class="num">${mt(r.total)}</b> reported total` : ""} in ${r.year}</p>
    <p class="muted small">${esc(r.group)}, ${esc(r.boundary)}. Source: <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.source)}</a>, ${esc(r.section)}.</p>
    <p class="muted small">Credits retired since ${o.y[0]}: ${mt(o.t)}; of those, research suggests about ${mt(o.e)} were real reductions.</p>
    ${comp}</div>`;
}

function emissionsBox(o) {
  if (!o.ct) {
    return reportedBox(o) || `<div class="box"><h3>Emissions</h3><p class="muted small">No independent (Climate TRACE) match and no company-reported figure is linked to this buyer yet.</p></div>`;
  }
  if (o.rep && o.ct.coverage === "partial") return reportedBox(o);
  const c = o.ct;
  const range = c.low === c.high ? mt(c.low) : `${mt(c.low)} – ${mt(c.high)}`;
  const note = c.coverage === "partial"
    ? `<div class="flag">⚠ Climate TRACE's ownership data covers oil and gas, coal, power, cement, steel, aluminium, chemicals, pulp and paper, and mining. ${esc(c.parent)}'s main emissions (for example vehicle production or flights) are outside that coverage, so this figure is far below its real footprint.</div>`
    : "";
  return `<div class="box"><h3>Independent emissions</h3>
    <p><b class="num">${range}</b> CO₂e in ${c.year}</p>
    <p class="muted small">Ownership-weighted emissions of ${fmt(c.assets)} assets linked to <b>${esc(c.parent)}</b> (${esc(c.match)}) in Climate TRACE v5.7.0. The range is wide where ownership shares are unknown. This is an equity-share estimate from satellite and model data, not the company's own reported scope 1, so the two can differ by a factor of two or more.</p>
    ${note}</div>${reportedBox(o)}`;
}

async function render(i) {
  const box = $("#result");
  box.hidden = false;
  box.innerHTML = `<p class="muted">Loading ${esc(rows[i][0])}…</p>`;
  let o;
  try { o = await owner(i); } catch (err) { box.innerHTML = `<p class="bad">${esc(err.message)}. Check your connection and try again.</p>`; return; }
  const g = grade(o.e, o.k, o.t);
  const cover = o.k / o.t, real = o.k ? o.e / o.k : 0;
  const anonymous = o.n === "(no owner listed)" || /^not disclosed$/i.test(o.n);
  const sentence = anonymous
    ? `<b>${mt(o.t)}</b> of credits were retired since ${o.y[0]} without naming who the climate benefit belongs to. Nobody can be held to these claims.`
    : o.k
      ? `Of every 100 tonnes <b>${esc(o.n)}</b> retired since ${o.y[0]}, research covers <b>${Math.round(cover * 100)}</b>. Of those, about <b>${Math.round(real * 100)}</b> likely cut real emissions (research range ${Math.round(o.el / o.k * 100)}–${Math.round(o.eh / o.k * 100)}).`
      : `None of the ${mt(o.t)} <b>${esc(o.n)}</b> retired since ${o.y[0]} comes from a project type with a published research estimate, so Netra cannot estimate how much was real.`;

  const cats = Object.entries(o.c).sort((a, b) => b[1] - a[1]);
  const ccp = ["approved", "not_approved", "not_assessed"].map((s) => [s, o.ccp[s] || 0]);
  const types = Object.entries(o.bt);
  box.innerHTML = `
    <div class="res-head">
      <div class="grade ${g ? "" : "na"}" style="${g ? `background:var(${g[2]})` : ""}" aria-label="Grade ${g ? g[1] : "not available"}">${g ? g[1] : "?"}</div>
      <div><p class="eyebrow">Retired ${o.y[0]}–${o.y[1]} · ${fmt(o.r)} retirements</p><h2>${esc(o.n)}</h2>${buyerLine(o)}
        <p class="muted small">${mt(o.t)} retired${g ? ` · grade on the ${pct(cover)} covered by research` : " · not enough research coverage for a grade"}</p></div>
    </div>
    <p class="plain">${sentence}</p>
    <div class="grid2">
      <div class="box"><h3>Research estimate</h3>
        ${bar([[o.e / o.t, css("--a"), "Likely real"], [(o.k - o.e) / o.t, css("--e"), "Likely not real"], [1 - cover, css("--na"), "No estimate"]])}
        <div class="legend">
          <div><span><i style="background:var(--a)"></i>Likely real</span><span class="num">${mt(o.e)}</span></div>
          <div><span><i style="background:var(--e)"></i>Likely not real</span><span class="num">${mt(o.k - o.e)}</span></div>
          <div><span><i style="background:var(--na)"></i>No published estimate</span><span class="num">${mt(o.t - o.k)}</span></div>
        </div></div>
      <div class="box"><h3>Project types</h3>
        <div class="legend">${types.map(([b, t]) => `<div><span>${esc(b)}</span><span class="num">${pct(t / o.t)}</span></div>`).join("")}</div></div>
      <div class="box"><h3>ICVCM integrity label</h3>
        ${bar(ccp.map(([s, t]) => [t / o.t, css(CCP[s][1]), CCP[s][0]]))}
        <div class="legend">${ccp.map(([s, t]) => `<div><span><i style="background:var(${CCP[s][1]})"></i>${CCP[s][0]}</span><span class="num">${pct(t / o.t)}</span></div>`).join("")}</div></div>
      ${emissionsBox(o)}
      <div class="box"><h3>Past to present</h3>${sparkline(o.ys)}
        <p class="muted small">Grey bars: tonnes retired per year. Line: likely-real share of research-covered tonnes.</p></div>
    </div>
    ${o.o / o.t > 0.2 ? `<div class="flag">⚠ ${pct(o.o / o.t)} of these credits have a vintage before 2016, which the aviation scheme CORSIA does not accept.</div>` : ""}
    ${(o.ccp.not_approved || 0) / o.t > 0.2 ? `<div class="flag">⚠ ${pct(o.ccp.not_approved / o.t)} come from methodologies ICVCM found do not meet its Core Carbon Principles. Verra retires ACM0002 and AMS-I.D for new registrations on 1 January 2027.</div>` : ""}
    <label class="toggle"><input type="checkbox" id="euToggle"> This is a "carbon neutral" claim on a product sold in the EU</label>
    <div id="euFlag" hidden class="flag">⚠ Since 27 September 2026, EU Directive 2024/825 bans claims that a product has a neutral, reduced or positive climate impact based on offsetting. Credit quality does not change that.</div>
    <div id="chainStatus" class="flag ok">Checking on-chain records…</div>
    <div class="actions"><a href="#buyer-${i}">Link to this result</a>
      <a href="https://github.com/rofiperlungoding/climatechain-id/issues/new?title=${encodeURIComponent("Correction request: " + o.n)}" target="_blank" rel="noopener">Request a correction</a>
      <span class="muted mono">report ${reportHash(o).slice(0, 18)}…</span></div>`;
  $("#euToggle").addEventListener("change", (e) => { $("#euFlag").hidden = !e.target.checked; });
  box.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  chainStatus(o);
}

async function chainStatus(o) {
  const el = $("#chainStatus");
  try {
    const list = await onchain;
    const mine = list.filter((c) => c.subject === subjectHash(o.n));
    if (!mine.length) { el.className = "flag"; el.textContent = "No check for this buyer has been published on-chain yet."; return; }
    const last = mine[mine.length - 1], match = last.reportHash === reportHash(o);
    el.className = match && !last.doubleClaim ? "flag ok" : "flag";
    el.innerHTML = match
      ? `${last.doubleClaim ? "⚠ Flagged on-chain as a double claim: at least one serial range also backs an earlier claim." : "✓ Published on-chain " + new Date(last.timestamp * 1000).toISOString().slice(0, 10) + " and matches the open data."} <a href="#verify">See record #${last.id}</a>`
      : `On-chain record #${last.id} exists but does not match the current data (the dataset was updated after it was published).`;
  } catch {
    el.className = "flag"; el.textContent = CHAIN ? `Could not reach the ${CHAIN.network} network to check on-chain records.` : "On-chain records are not published for this build yet.";
  }
}

/* ---------- market ---------- */
function market(m) {
  const named = m.named_share, cover = m.known / m.tonnes, real = m.eff / m.known;
  $("#marketStats").innerHTML = [
    [mt(m.tonnes), "retired on Verra and Gold Standard since 2020"],
    [pct(1 - named), "of those tonnes name no beneficiary at all"],
    [pct(cover), "come from project types with a research estimate"],
    [pct(real), `of covered tonnes likely real (range ${pct(m.eff_lo / m.known)}–${pct(m.eff_hi / m.known)})`],
    [pct((m.ccp.approved || 0) / m.tonnes), "use a methodology with the ICVCM CCP label"],
  ].map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join("");

  const years = Object.keys(m.ys).map(Number).sort();
  const W = 720, H = 240, L = 44, R = 16, T = 16, B = 32;
  const X = (k) => L + (k + 0.5) * ((W - L - R) / years.length);
  const Y = (v) => T + (1 - v) * (H - T - B);
  const vals = years.map((y) => m.ys[y][1] / m.ys[y][2]);
  const grid = [0, 0.25, 0.5, 0.75, 1].map((v) => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="${css("--line")}"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${v * 100}%</text>`).join("");
  const line = vals.map((v, k) => `${k ? "L" : "M"}${X(k)},${Y(v)}`).join("");
  $("#trend").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Likely-real share by year">${grid}
    <path d="${line}" fill="none" stroke="${css("--accent")}" stroke-width="2.5"/>
    ${vals.map((v, k) => `<circle cx="${X(k)}" cy="${Y(v)}" r="4" fill="${css("--accent")}"/><text x="${X(k)}" y="${Y(v) - 10}" text-anchor="middle">${pct(v)}</text><text x="${X(k)}" y="${H - 10}" text-anchor="middle">${years[k]}${years[k] === 2026 ? "*" : ""}</text>`).join("")}
    </svg><p class="muted small">* 2026 up to August. The likely-real share has stayed between 18% and 22% every year.</p>`;

  const cats = Object.entries(m.cats).sort((a, b) => b[1] - a[1]);
  $("#cats").innerHTML = cats.map(([c, t]) => {
    const f = FACTORS.factors[c];
    const est = f.oar === null ? "no estimate" : `${pct(f.oar)} real`;
    return `<div class="catrow"><span>${esc(f.label)}</span>${bar([[t / m.tonnes, CAT_COLORS[c], f.label]])}<span class="num">${pct(t / m.tonnes)} · ${est}</span></div>`;
  }).join("");
}

/* ---------- verify ---------- */
async function loadChecks() {
  if (!CHAIN) throw new Error("no deployment");
  const provider = new ethers.JsonRpcProvider(CHAIN.rpc, CHAIN.chainId, { staticNetwork: true });
  const reg = new ethers.Contract(CHAIN.address, ABI, provider);
  const n = Number(await reg.count());
  const ids = [...Array(n).keys()];
  return Promise.all(ids.map(async (id) => {
    const c = await reg.checks(id);
    return { id, subject: c.subject, reportHash: c.reportHash, serialRoot: c.serialRoot, serialCount: Number(c.serialCount),
      timestamp: Number(c.timestamp), attester: c.attester, doubleClaim: c.doubleClaim, uri: c.uri };
  }));
}

const contractUrl = () => (CHAIN.explorer ? `${CHAIN.explorer}/address/${CHAIN.address}` : "#verify");

async function verifyPanel() {
  if (!CHAIN) {
    $("#checkCount").textContent = "–";
    $("#checks").innerHTML = `<p class="muted">The ClaimRegistry deployment for this build is not published yet.</p>`;
    return;
  }
  $("#contractLink").href = contractUrl();
  $("#contractLink").textContent = `${CHAIN.address} (${CHAIN.network})`;
  try {
    const list = await onchain;
    $("#checkCount").textContent = list.length;
    if (!list.length) { $("#checks").innerHTML = `<p class="muted">No checks published yet.</p>`; return; }
    const names = new Map(rows.map((r, i) => [subjectHash(r[0]), i]));
    const out = await Promise.all(list.slice().reverse().map(async (c) => {
      const i = names.get(c.subject);
      let status = `<span class="muted">unknown buyer</span>`;
      if (i !== undefined) {
        const match = reportHash(await owner(i)) === c.reportHash;
        status = match ? `<span class="ok">✓ matches data</span>` : `<span class="bad">differs from current data</span>`;
      }
      const serial = await serialStatus(c);
      if (c.doubleClaim) status += ` <span class="bad">· flagged double claim</span>`;
      return `<tr><td class="num">#${c.id}</td><td>${i !== undefined ? `<a href="#buyer-${i}">${esc(rows[i][0])}</a>` : `<span class="mono">${c.subject.slice(0, 12)}…</span>`}</td>
        <td class="mono">${c.reportHash.slice(0, 14)}…</td><td class="num">${new Date(c.timestamp * 1000).toISOString().slice(0, 10)}</td><td>${status}</td><td>${serial}</td></tr>`;
    }));
    $("#checks").innerHTML = `<div class="tablewrap"><table><thead><tr><th>Record</th><th>Buyer</th><th>Report hash</th><th>Date</th><th>Report</th><th>Serial ranges</th></tr></thead><tbody>${out.join("")}</tbody></table></div>`;
  } catch {
    $("#checkCount").textContent = "unavailable";
    $("#checks").innerHTML = `<p class="bad">Could not reach the Polygon Amoy network. ${CHAIN.explorer ? `Records are still public on <a href="${contractUrl()}" target="_blank" rel="noopener">the block explorer</a>.` : "Start the local chain to see records."}</p>`;
  }
}

/* ---------- boot ---------- */
(async function boot() {
  try {
    [INDEX, FACTORS] = await Promise.all([getJSON("data/index.json"), getJSON("data/factors.json")]);
    CHAIN = await getJSON("data/deployment.json").catch(() => null);
  } catch (err) {
    $("#check").insertAdjacentHTML("beforeend", `<p class="bad">${esc(err.message)}.</p>`);
    return;
  }
  SHARD = INDEX.shard; rows = INDEX.rows;
  $("#ownerCount").textContent = fmt(rows.length);
  onchain = loadChecks();
  setupSearch();
  market(INDEX.meta);
  verifyPanel();
  const m = location.hash.match(/^#buyer-(\d+)$/);
  if (m && rows[+m[1]]) pick(+m[1]);
})();
