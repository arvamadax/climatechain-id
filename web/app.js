"use strict";

let CHAIN = null; // from data/deployment.json, written by contracts/scripts/deploy.js
const ABI = [
  "function count() view returns (uint256)",
  "function checks(uint256) view returns (bytes32 subject, bytes32 reportHash, bytes32 serialRoot, uint32 serialCount, uint64 timestamp, address attester, bool doubleClaim, string uri)",
];
const EXAMPLES = ["Shell", "Delta Air Lines", "Netflix, Inc.", "Volkswagen Marke Pkw", "Eni Upstream", "Apple Inc.", "Not Disclosed"];
const CAT_COLORS = { redd: "#1d4e89", cookstove: "#e8590c", wind_china: "#4c82c3", ifm_us: "#8a6fb0", hfc23: "#b83a0e",
  grid_re: "#9fb8d6", other: "#d9d4cb" };
const CCP = { approved: ["CCP-approved methodology", "--a"], not_approved: ["Rejected by ICVCM", "--e"],
  not_assessed: ["Not assessed / not listed", "--na"] };


let INDEX, FACTORS, SHARD, rows;
const shards = new Map();
let onchain = null; // Promise<Array<check>>


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
    if (e.key === "Enter" && hits.length) { e.preventDefault(); pick(hits[Math.max(sel, 0)]); close(); }
    if (e.key === "Escape") close();
  });
  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    hits = search(q.value);
    if (hits.length) { pick(hits[0]); close(); } else if (q.value.trim().length >= 2) draw();
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
  if (years.length < 2) return `<p class="muted small">All retirements were in ${years[0]}, so there is no trend to show.</p>`;
  const pts = years.map((y) => [y, ys[y][2] ? ys[y][1] / ys[y][2] : null]);
  const W = 260, H = 70, pad = 18, x0 = years[0], x1 = years[years.length - 1];
  const X = (y) => pad + ((y - x0) / Math.max(1, x1 - x0)) * (W - 2 * pad);
  const Y = (v) => H - 14 - v * (H - 26);
  const valid = pts.filter((p) => p[1] !== null);
  const path = valid.map((p, k) => `${k ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join("");
  const tonnes = years.map((y) => ys[y][0]), tmax = Math.max(...tonnes);
  const bars = years.map((y, k) => `<rect x="${X(y) - 6}" y="${H - 14 - (tonnes[k] / tmax) * 22}" width="12" height="${(tonnes[k] / tmax) * 22}" fill="${css("--line")}"/>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Likely-real share by retirement year">
    ${bars}<path d="${path}" fill="none" stroke="${css("--signal")}" stroke-width="2"/>
    ${valid.map((p) => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="2.6" fill="${css("--signal")}"><title>${p[0]}: ${pct(p[1])} likely real</title></circle>`).join("")}
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
  const isCo = o.g.type === "company";
  const group = isCo && o.g.group && o.g.group !== o.n ? `Part of <b>${esc(o.g.group)}</b>` : "";
  const extra = isCo && o.g.note ? ` (${esc(o.g.note)})` : "";
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

// Reasons a company group has no reported emissions, from data/emissions_gaps.csv via companies.json.
let GAPS = {};
// Unusual retirement patterns from pipeline/anomalies.py (Isolation Forest); a reason to look closer, not proof.
let ANOM = {};
const anomReady = getJSON("data/anomalies.json").then((x) => (ANOM = x.flags || {})).catch(() => {});
const gapsReady = getJSON("data/companies.json").then((cs) => cs.forEach((c) => c.gap && (GAPS[c.group] = c.gap))).catch(() => {});

function gapBox(o) {
  const gap = o.g && GAPS[o.g.group];
  if (gap) return `<div class="box"><h3>Company-reported emissions</h3><p><b>Not published, or not readable.</b> ${esc(gap.reason)}</p>
    <p class="muted small">What we checked: ${esc(gap.checked)}.</p></div>`;
  if (o.g && o.g.type === "company") return "";
  return `<div class="box"><h3>Emissions</h3><p class="muted small">${o.g ? "This account is not a company, so there is no company report to read." : "This buyer is outside the 167 largest names reviewed by hand, so no emissions report has been matched to it."}</p></div>`;
}

function emissionsBox(o) {
  if (!o.ct) return reportedBox(o) || gapBox(o);
  if (o.rep && o.ct.coverage === "partial") return reportedBox(o);
  const c = o.ct;
  const range = c.low === c.high ? mt(c.low) : `${mt(c.low)} – ${mt(c.high)}`;
  const note = c.coverage === "partial"
    ? `<div class="flag">⚠ Climate TRACE's ownership data covers oil and gas, coal, power, cement, steel, aluminium, chemicals, pulp and paper, and mining. ${esc(c.parent)}'s main emissions (for example vehicle production or flights) are outside that coverage, so this figure is far below its real footprint.</div>`
    : "";
  return `<div class="box"><h3>Independent emissions</h3>
    <p><b class="num">${range}</b> CO₂e in ${c.year}</p>
    <p class="muted small">Ownership-weighted emissions of ${fmt(c.assets)} assets linked to <b>${esc(c.parent)}</b> (${esc(c.match)}) in Climate TRACE v5.7.0. The range is wide where ownership shares are unknown. This is an equity-share estimate from satellite and model data, not the company's own reported scope 1, so the two can differ by a factor of two or more.</p>
    ${note}</div>${reportedBox(o) || gapBox(o)}`;
}

// "How we know": the basis of every number on the result, with sources. No claim without a reason.
function howWeKnow(o, g) {
  const types = Object.entries(o.c).filter(([, t]) => t > 0).sort((a, b) => b[1] - a[1]).map(([c, t]) => {
    const f = FACTORS.factors[c];
    return `<li>${esc(f.label)}: ${mt(t)}, ${f.oar === null ? "no published estimate, so not scored" : `${pct(f.oar)} likely real (range ${pct(f.lo)}–${pct(f.hi)}); ${esc(f.source)}`}</li>`;
  }).join("");
  const r = o.rep;
  return `<details class="how"><summary>How we know</summary>
    <dl>
      <div><dt>Retired</dt><dd>${fmt(o.r)} retirement records naming "${esc(o.n)}" as beneficiary on Verra and Gold Standard, ${o.y[0]}–${o.y[1]}, from the Berkeley Voluntary Registry Offsets Database v2026-08 (CC BY 4.0). Names are shown as published.</dd></div>
      ${o.g ? `<div><dt>Who this is</dt><dd>Reviewed by hand against the registry retirement details${o.g.group !== o.n ? ` and linked to <b>${esc(o.g.group)}</b>` : ""}${o.g.note ? ` (${esc(o.g.note)})` : ""}.</dd></div>` : ""}
      <div><dt>Project types</dt><dd>A type counts only when three sources agree: Berkeley's curated type, CarbonPlan OffsetsDB and the registry methodology code. Otherwise: no estimate.<ul>${types}</ul></dd></div>
      <div><dt>Likely real</dt><dd>Tonnes × the share of real reductions measured for that type in peer-reviewed research. The range is the study's uncertainty. ${o.k ? `Here: ${mt(o.e)} of ${mt(o.k)} researched tonnes (range ${mt(o.el)}–${mt(o.eh)}).` : "None of these tonnes are in a researched type."}</dd></div>
      <div><dt>Grade</dt><dd>${g ? `${g[1]}, because ${pct(o.e / o.k)} of researched tonnes are likely real.` : "No grade: research covers less than a quarter of the tonnes."} Bands: A ≥ 60%, B 40–60%, C 20–40%, D 10–20%, E &lt; 10%.</dd></div>
      <div><dt>Quality label</dt><dd>Each methodology's status in the ICVCM Core Carbon Principles assessment, snapshot 18 Aug 2026.</dd></div>
      <div><dt>Emissions</dt><dd>${r ? `Read by hand from <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.source)}</a>, ${esc(r.section)}; checked ${esc(r.checked)}.` : "No figure is shown unless it comes from the company's own document."}${o.ct ? ` Independent estimate: Climate TRACE v5.7.0 ownership data, ${fmt(o.ct.assets)} assets of ${esc(o.ct.parent)}.` : ""}</dd></div>
    </dl>
    <p class="muted small">Full rules: <a href="https://github.com/rofiperlungoding/climatechain-id/blob/main/docs/METHODS.md" target="_blank" rel="noopener">METHODS.md</a>. Plain-English terms: <a href="glossary.html">glossary</a>.</p>
  </details>`;
}

let CURRENT = null;
async function render(i, scroll = true) {
  CURRENT = i;
  const box = $("#result");
  box.hidden = false;
  if (scroll) box.innerHTML = `<p class="muted">Loading ${esc(rows[i][0])}…</p>`;
  let o;
  try { o = await owner(i); await Promise.all([logosReady, gapsReady, anomReady]); } catch (err) { box.innerHTML = `<p class="bad">${esc(err.message)}. Check your connection and try again.</p>`; return; }
  const g = grade(o.e, o.k, o.t);
  const group = o.g?.type === "company" ? o.g.group : null;
  const cover = o.k / o.t, real = o.k ? o.e / o.k : 0;
  const anonymous = o.n === "(no owner listed)" || /^not disclosed$/i.test(o.n);
  const short = /^0x[0-9a-f]{20,}$/i.test(o.n) ? `${o.n.slice(0, 6)}…${o.n.slice(-4)}` : o.n; // wallet addresses
  const years = o.y[0] === o.y[1] ? `in ${o.y[0]}` : `since ${o.y[0]}`;
  const sentence = anonymous
    ? `<b>${mt(o.t)}</b> of credits were retired since ${o.y[0]} without naming who the climate benefit belongs to. Nobody can be held to these claims.`
    : o.k
      ? `Of every 100 tonnes <b>${esc(short)}</b> retired ${years}, research covers <b>${Math.round(cover * 100)}</b>${g ? "" : ", too few for a grade"}. Of those, about <b>${Math.round(real * 100)}</b> likely cut real emissions${o.el === o.eh ? "" : ` (research range ${Math.round(o.el / o.k * 100)}–${Math.round(o.eh / o.k * 100)})`}.`
      : `None of the ${mt(o.t)} <b>${esc(short)}</b> retired ${years} comes from a project type with a published research estimate, so Netra cannot estimate how much was real.`;

  const cats = Object.entries(o.c).sort((a, b) => b[1] - a[1]);
  const ccp = ["approved", "not_approved", "not_assessed"].map((s) => [s, o.ccp[s] || 0]);
  const types = Object.entries(o.bt);
  box.innerHTML = `
    <div class="res-head">
      <div><p class="eyebrow">Retired ${o.y[0] === o.y[1] ? o.y[0] : `${o.y[0]}–${o.y[1]}`} · ${fmt(o.r)} retirements</p><div class="res-id">${group ? logo(group, 56) : ""}<h2 class="${short !== o.n ? "addr" : ""}">${esc(o.n)}</h2></div>${buyerLine(o)}
        <p class="muted small">${mt(o.t)} retired${g ? ` · grade on the ${pct(cover)} covered by research` : " · not enough research coverage for a grade"}</p></div>
      <div class="grade ${g ? "" : "na"}" data-g="${g ? g[1] : ""}" style="${g ? `background:var(${g[2]})` : ""}" role="img" aria-label="Grade ${g ? g[1] : "not available"}">${g ? g[1] : "?"}</div>
    </div>
    <p class="plain">${sentence}</p>
    ${o.k ? `<div class="claim">
      <div class="row"><b>Likely real, in researched project types</b><span class="num">${mt(o.e)} of ${mt(o.k)}</span></div>
      ${claimBar(o.e, o.el, o.eh, o.k)}
      <div class="key"><span>Filled: best estimate ${pct(real)}</span><span>Hatched: research range ${pct(o.el / o.k)}–${pct(o.eh / o.k)}</span><span>Outline: claimed</span></div>
    </div>` : ""}
    <div class="grid2">
      <div class="box"><h3>Research estimate</h3>
        ${bar([[o.e / o.t, css("--signal"), "Likely real"], [(o.k - o.e) / o.t, css("--notreal"), "Likely not real"], [1 - cover, css("--noest"), "No estimate"]])}
        <div class="legend">
          <div><span><i style="background:var(--signal)"></i>Likely real</span><span class="num">${mt(o.e)}</span></div>
          <div><span><i style="background:var(--notreal)"></i>Likely not real</span><span class="num">${mt(o.k - o.e)}</span></div>
          <div><span><i style="background:var(--noest)"></i>No published estimate</span><span class="num">${mt(o.t - o.k)}</span></div>
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
    ${(o.ccp.not_approved || 0) / o.t > 0.2 ? `<div class="flag">⚠ ${pct(o.ccp.not_approved / o.t)} come from methodologies ICVCM found do not meet its Core Carbon Principles.</div>` : ""}
    ${ANOM[i] ? `<div class="unusual"><b>Unusual pattern</b> <span class="tag">machine learning</span>
      <ul>${ANOM[i].reasons.map((r) => `<li>${esc(r[0].toUpperCase() + r.slice(1))}.</li>`).join("")}</ul>
      <p class="muted small">Flagged by an Isolation Forest model among 540 buyers with at least 100,000 t retired. An unusual pattern is a reason to look closer, not proof of wrongdoing. <a href="data.html#unusual">How it works</a></p></div>` : ""}
    ${howWeKnow(o, g)}
    <p class="note"><b>Selling in the EU?</b> Since 27 September 2026, EU Directive 2024/825 bans calling a product climate neutral, reduced or positive because of offsets, whatever the credit quality.</p>
    <div id="chainStatus" class="flag ok">Checking on-chain records…</div>
    <div class="actions"><a href="#buyer-${i}">Link to this result</a>
      <a href="https://github.com/rofiperlungoding/climatechain-id/issues/new?title=${encodeURIComponent("Correction request: " + o.n)}" target="_blank" rel="noopener">Request a correction</a>
      <span class="muted mono">report ${reportHash(o).slice(0, 18)}…</span></div>`;
  box.className = "result tinted";
  box.style.cssText = tint(group || o.n, g);
  if (!scroll) { chainStatus(o); return; }
  box.classList.remove("in-view"); void box.offsetWidth; box.classList.add("in-view");
  box.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  chainStatus(o);
}

async function chainStatus(o) {
  const el = $("#chainStatus");
  try {
    const list = await onchain;
    const mine = list.filter((c) => c.subject === subjectHash(o.n));
    if (!mine.length) { el.className = "note"; el.textContent = "Not published on-chain yet. Published checks are listed under On-chain proof."; return; }
    const last = mine[mine.length - 1], match = last.reportHash === reportHash(o);
    el.className = match && !last.doubleClaim ? "flag ok" : "flag";
    el.innerHTML = match
      ? `${last.doubleClaim ? "⚠ Flagged on-chain as a double claim: at least one serial range also backs an earlier claim." : "✓ Published on-chain " + new Date(last.timestamp * 1000).toISOString().slice(0, 10) + " and matches the open data."} <a href="#verify">See record #${last.id}</a>`
      : `On-chain record #${last.id} exists but does not match the current data (the dataset was updated after it was published).`;
  } catch {
    el.className = "flag"; el.textContent = CHAIN ? `Could not reach the ${CHAIN.label || CHAIN.network} to check on-chain records.` : "On-chain records are not published for this build yet.";
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
    <path d="${line}" fill="none" stroke="${css("--signal")}" stroke-width="2.5"/>
    ${vals.map((v, k) => `<circle cx="${X(k)}" cy="${Y(v)}" r="4" fill="${css("--signal")}"/><text x="${X(k)}" y="${Y(v) - 10}" text-anchor="middle">${pct(v)}</text><text x="${X(k)}" y="${H - 10}" text-anchor="middle">${years[k]}${years[k] === 2026 ? "*" : ""}</text>`).join("")}
    </svg><p class="muted small">* 2026 up to August. The likely-real share has stayed between 18% and 22% every year.</p>`;

  const cats = Object.entries(m.cats).sort((a, b) => b[1] - a[1]);
  $("#cats").innerHTML = cats.map(([c, t]) => {
    const f = FACTORS.factors[c];
    const est = f.oar === null ? "no estimate" : `${pct(f.oar)} real`;
    return `<div class="catrow"><span>${esc(f.label)}</span>${bar([[t / m.tonnes, CAT_COLORS[c], f.label]])}<span class="num">${pct(t / m.tonnes)} · ${est}</span></div>`;
  }).join("");
}

/* ---------- hidden buyers ---------- */
// [label, colour, plain explanation]; order = data/hidden.json kinds.
const KIND = {
  company: ["Named companies", "var(--ink)", "A real company, reviewed by hand and matched to its group (Gucci is counted under Kering)."],
  unreviewed: ["Other named buyers", "#8a857c", "A name is given, but it is one of 44,000+ smaller names Netra has not reviewed one by one."],
  public_body: ["Public bodies", "#4c82c3", "A government or public authority."],
  intermediary: ["Resellers, for clients", "#f2a36b", "An offset seller retires credits on behalf of its customers. Who the customers are is not in the registry."],
  wallet: ["Crypto wallets", "#d9480f", "Retired to a blockchain address. Who holds the climate claim cannot be seen."],
  tokenization: ["Turned into tokens", "#b83a0e", "Retired to create crypto tokens. Verra stopped allowing this in 2022."],
  unidentified: ["Codes nobody can trace", "#7a2e0c", "A short code (for example \"DL\") that matches no organisation in the registry details. Netra does not guess."],
  anonymous: ["No name at all", "var(--signal)", "The beneficiary field is blank or says \"Not Disclosed\". Nobody can be held to this claim."],
};
const HIDDEN_KINDS = ["intermediary", "wallet", "tokenization", "unidentified", "anonymous"];

async function hiddenSection() {
  const el = $("#hiddenBody");
  let h;
  try { h = await getJSON("data/hidden.json"); } catch (err) { el.innerHTML = `<p class="bad">${esc(err.message)}.</p>`; return; }
  const kinds = Object.entries(h.kinds).filter(([, v]) => v.t > 0);
  const hid = HIDDEN_KINDS.reduce((s, k) => s + (h.kinds[k]?.t || 0), 0);
  const named = h.kinds.company.t + h.kinds.unreviewed.t + h.kinds.public_body.t;
  el.innerHTML = `
    <div class="split">
      <div class="stat big"><b>${pct(hid / h.total)}</b><span>of ${mt(h.total)} retired cannot be tied to a named claimant</span></div>
      <div class="stat big"><b>${pct(named / h.total)}</b><span>name someone. Only ${pct(h.kinds.company.t / h.total)} are companies Netra has reviewed</span></div>
    </div>
    <div class="panel">
      <h3>Every tonne retired since 2020, by who claims it</h3>
      ${bar(kinds.map(([k, v]) => [v.t / h.total, KIND[k][1].startsWith("var") ? css(KIND[k][1].slice(4, -1)) : KIND[k][1], KIND[k][0]]))}
      <div class="kinds">${kinds.map(([k, v]) => `<div class="kind">
        <i style="background:${KIND[k][1]}"></i>
        <div><b>${KIND[k][0]}</b> <span class="num">${mt(v.t)} · ${pct(v.t / h.total)}</span>${HIDDEN_KINDS.includes(k) ? ` <span class="tag">hidden</span>` : ""}
        <p class="muted small">${KIND[k][2]} ${fmt(v.buyers)} account${v.buyers === 1 ? "" : "s"}.</p></div></div>`).join("")}</div>
    </div>
    <div class="panel">
      <h3>The biggest accounts that hide who claims</h3>
      <div class="tablewrap"><table><thead><tr><th>#</th><th>Account as written in the registry</th><th>What it is</th><th>Tonnes</th><th>Likely real</th></tr></thead><tbody>
      ${h.top.map((x, r) => `<tr><td class="num">${r + 1}</td><td><a href="#buyer-${x.i}" class="${x.n.startsWith("0x") ? "mono" : ""}">${esc(x.n)}</a></td>
        <td>${KIND[x.kind][0]}</td><td class="num">${mt(x.t)}</td><td class="num">${x.k ? `${pct(x.e / x.k)} of ${mt(x.k)} researched` : "no estimate"}</td></tr>`).join("")}
      </tbody></table></div>
    </div>
    <div class="why">
      <div class="box"><h3>Why it matters</h3><p>A company can say "we offset our emissions". If the registry does not name it, nobody can check which credits back that sentence, or whether the same credits back someone else's.</p></div>
      <div class="box"><h3>Double claiming</h3><p>Resellers and wallets can pass one retirement to many customers. The registry cannot see it. Netra's on-chain registry lets anyone flag a serial range claimed twice.</p></div>
      <div class="box"><h3>What would fix it</h3><p>A mandatory, public beneficiary for every retirement, and claims that point to exact serial numbers. Until then, treat unnamed volume as unverifiable.</p></div>
    </div>`;
}

/* ---------- verify ---------- */
// Public RPCs tried in order; the first that answers is kept (public nodes drop connections now and then).
const BACKUP_RPC = { 11155111: ["https://ethereum-sepolia-rpc.publicnode.com", "https://sepolia.drpc.org", "https://1rpc.io/sepolia"] };
let REG = null;
async function registry() {
  if (REG) return REG;
  for (const url of [CHAIN.rpc, ...(BACKUP_RPC[CHAIN.chainId] || [])].filter((u, k, a) => u && a.indexOf(u) === k)) {
    try {
      const reg = new ethers.Contract(CHAIN.address, ABI, new ethers.JsonRpcProvider(url, CHAIN.chainId, { staticNetwork: true }));
      await reg.count();
      return (REG = reg);
    } catch { /* try the next node */ }
  }
  throw new Error("no RPC answered");
}

async function loadChecks() {
  if (!CHAIN) throw new Error("no deployment");
  const reg = await registry();
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
  $("#contractLink").textContent = `${CHAIN.address} (${CHAIN.label || CHAIN.network})`;
  try {
    const list = await onchain;
    $("#checkCount").textContent = list.length;
    if (!list.length) { $("#checks").innerHTML = `<p class="muted">No checks published yet.</p>`; return; }
    const names = new Map(rows.map((r, i) => [subjectHash(r[0]), i]));
    const out = await Promise.all(list.slice().reverse().map(async (c) => {
      const i = names.get(c.subject);
      const file = i === undefined ? await getJSON(c.uri).catch(() => null) : null;
      let status = `<span class="muted">${file ? "not in the dataset (demo claimant)" : "unknown buyer"}</span>`;
      if (i !== undefined) {
        const match = reportHash(await owner(i)) === c.reportHash;
        status = match ? `<span class="ok">✓ matches data</span>` : `<span class="bad">differs from current data</span>`;
      }
      const serial = await serialStatus(c);
      if (c.doubleClaim) status += ` <span class="bad">· flagged double claim</span>`;
      return `<tr><td class="num">#${c.id}</td><td>${i !== undefined ? `<a href="#buyer-${i}">${esc(rows[i][0])}</a>` : (file ? esc(file.buyer) : `<span class="mono">${c.subject.slice(0, 12)}…</span>`)}</td>
        <td class="mono">${c.reportHash.slice(0, 14)}…</td><td class="num">${new Date(c.timestamp * 1000).toISOString().slice(0, 10)}</td><td>${status}</td><td>${serial}</td></tr>`;
    }));
    $("#checks").innerHTML = `<div class="tablewrap"><table><thead><tr><th>Record</th><th>Buyer</th><th>Report hash</th><th>Date</th><th>Report</th><th>Serial ranges</th></tr></thead><tbody>${out.join("")}</tbody></table></div>`;
  } catch {
    $("#checkCount").textContent = "unavailable";
    $("#checks").innerHTML = `<p class="bad">Could not reach the ${esc(CHAIN.label || CHAIN.network)}.${CHAIN.explorer ? `Records are still public on <a href="${contractUrl()}" target="_blank" rel="noopener">the block explorer</a>.` : "Start the local chain to see records."}</p>`;
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
  hiddenSection();
  verifyPanel();
  liveFeed();
  // #buyer-N opens that buyer: on load, and from in-page links (verify table, hidden buyers, data page).
  const open = () => { const m = location.hash.match(/^#buyer-(\d+)$/); if (m && rows[+m[1]]) pick(+m[1]); };
  addEventListener("hashchange", open);
  open();
  // Charts draw with the current theme's colours: redraw them when the theme changes.
  document.addEventListener("themechange", () => { market(INDEX.meta); hiddenSection(); if (CURRENT !== null) render(CURRENT, false); });
})();

/* ---------- live feed: new on-chain checks and double-claim flags appear without a reload ---------- */
function liveFeed() {
  if (!CHAIN || !CHAIN.explorer) return; // public networks only
  const dot = $("#live");
  let known = null, flags = null;
  const tick = async () => {
    try {
      const reg = await registry();
      const n = Number(await reg.count());
      const list = n === known ? null : await loadChecks();
      const f = list ? list.filter((c) => c.doubleClaim).length : flags;
      if (known !== null && (n > known || f > flags)) {
        onchain = Promise.resolve(list);
        await verifyPanel();
        toast(n > known ? `New on-chain check #${n - 1} recorded` : "A double claim was just flagged on-chain");
      }
      known = n; flags = f;
      dot.className = "live on"; dot.textContent = "Live";
    } catch {
      REG = null;
      dot.className = "live off"; dot.textContent = "Reconnecting";
    }
  };
  tick();
  setInterval(tick, 15000);
}

function toast(text) {
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 6000);
}

/* ---------- claim checker: an AI reader extracts, Netra's data decides ---------- */
let COMPANIES = null;
const companiesReady = getJSON("data/companies.json").then((x) => (COMPANIES = x)).catch(() => []);
const nm = (x) => String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\(.*?\)/g, " ")
  .replace(/\b(inc|plc|ag|sa|spa|se|ltd|limited|llc|corp|corporation|co|group|holdings|the|company)\b/g, " ").replace(/[^a-z0-9]+/g, " ").trim();

function matchCompany(name) {
  const q = nm(name);
  if (q.length < 2) return null;
  for (const c of COMPANIES || []) {
    const cands = [c.group, ...c.names].map(nm).filter((x) => x.length >= 2);
    if (cands.some((x) => x === q || (" " + q + " ").includes(" " + x + " ") || (" " + x + " ").includes(" " + q + " "))) return c;
  }
  return null;
}

async function claimVerdict(c, fields) {
  const g = grade(c.e, c.k, c.t);
  const o = await owner(c.i);
  const year = fields.year && fields.year.value;
  const inYear = year && o.ys[year] ? o.ys[year][0] : null;
  const words = ((fields.claim_words && fields.claim_words.value) || "") + " " + ((fields.claim_words && fields.claim_words.quote) || "");
  const productLike = fields.scope && ["product", "service", "event"].includes(fields.scope.value);
  const offsetClaim = /neutral|zero|positive|negative|compensat|offset|balanc/i.test(words);
  const stated = fields.tonnes && fields.tonnes.value;
  return `<article class="ccard tinted verdict" style="${tint(c.group, g)}">
    <div class="ccard-head"><div class="name-row">${logo(c.group, 48)}<div><p class="eyebrow">What Netra's data shows</p><h3>${esc(c.group)}</h3></div></div>
      ${g ? `<span class="chip-grade" data-g="${g[1]}" style="background:var(${g[2]})">${g[1]}</span>` : ""}</div>
    <ul class="checks">
      <li>Retired <b>${mt(c.t)}</b> of credits since 2020${c.k ? `; research covers ${mt(c.k)}, of which about <b>${mt(c.e)}</b> are likely real (${pct(c.e / c.k)}).` : ", none in a project type with a research estimate."}</li>
      ${year ? `<li>${inYear ? `In ${year}, ${esc(o.n)} retired <b>${mt(inYear)}</b>.` : `No retirement by ${esc(o.n)} is recorded for ${year} on Verra or Gold Standard.`}${stated ? ` The claim mentions <b>${mt(stated)}</b>.` : ""}</li>` : ""}
      ${c.rep ? `<li>Its own report: ${c.rep.scope1 != null ? `Scope 1 <b>${mt(c.rep.scope1)}</b>` : `total <b>${mt(c.rep.total)}</b>`} in ${c.rep.year}. Offsets do not reduce these emissions.</li>` : c.gap ? `<li>No reported emissions figure: ${esc(c.gap.reason)}</li>` : ""}
      ${productLike && offsetClaim ? `<li class="eu"><b>EU rule:</b> since 27 Sep 2026, Directive 2024/825 bans calling a product, service or event climate neutral, reduced or positive because of offsets. This claim reads as one.</li>` : ""}
    </ul>
    <a class="btn" href="#buyer-${c.i}">Open the full result</a>
  </article>`;
}

function setupClaim() {
  const form = $("#claimForm"), out = $("#claimOut"), ta = $("#claimText");
  if (!form) return;
  $("#claimExamples").addEventListener("click", (e) => { const b = e.target.closest("[data-ex]"); if (b) { ta.value = b.dataset.ex; form.requestSubmit(); } });
  const setMode = (claim) => {
    $("#modeCompany").setAttribute("aria-selected", String(!claim));
    $("#modeClaim").setAttribute("aria-selected", String(claim));
    $("#search").hidden = claim; $("#examples").hidden = claim;
    form.hidden = !claim; $("#claimExamples").hidden = !claim; $("#claimNote").hidden = !claim;
    if (!claim) out.innerHTML = "";
    (claim ? ta : $("#q")).focus();
  };
  $("#modeCompany").addEventListener("click", () => setMode(false));
  $("#modeClaim").addEventListener("click", () => setMode(true));
  ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) form.requestSubmit(); });
  const picker = () => `<div class="panel"><label for="claimPick" class="label">Or pick the company</label>
    <select id="claimPick" class="filter"><option value="">Choose a reviewed company…</option>${(COMPANIES || []).map((c, k) => `<option value="${k}">${esc(c.group)}</option>`).join("")}</select></div>`;
  out.addEventListener("change", async (e) => {
    if (e.target.id !== "claimPick" || e.target.value === "") return;
    out.querySelector(".verdict-slot").innerHTML = await claimVerdict(COMPANIES[+e.target.value], {});
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await companiesReady;
    const text = ta.value.trim();
    if (text.length < 30) { out.innerHTML = `<p class="bad">Paste at least a full sentence (30 characters).</p>`; return; }
    out.innerHTML = `<p class="muted claim-wait">Reading the claim…</p>`;
    let r;
    try {
      const res = await fetch("api/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
      r = await res.json().catch(() => ({ error: `The claim reader answered ${res.status}.` }));
      if (!res.ok) throw new Error(r.error || `HTTP ${res.status}`);
    } catch (err) {
      out.innerHTML = `<p class="bad">${esc(err.message)}</p>${picker()}<div class="verdict-slot"></div>`;
      return;
    }
    const f = r.fields, labels = { company: "Who", claim_words: "Claim", scope: "Covers", year: "Year", tonnes: "Tonnes offset" };
    const found = f.company ? matchCompany(f.company.value) : null;
    const read = Object.keys(labels).filter((k) => f[k]).map((k) => `<div><dt>${labels[k]}</dt><dd><b>${esc(k === "tonnes" ? mt(f[k].value) : f[k].value)}</b><br><span class="quote">“${esc(f[k].quote)}”</span></dd></div>`).join("");
    $("#result").hidden = true;
    out.innerHTML = `<div class="claim-grid">
      <div class="panel"><p class="eyebrow">What the AI read</p>
        <dl class="facts">${read || "<p class='muted'>Nothing could be read with a supporting quote.</p>"}</dl>
        ${r.dropped.length ? `<p class="muted small">Dropped because the quote was not in the text: ${r.dropped.map((k) => labels[k] || k).join(", ")}.</p>` : ""}</div>
      <div class="verdict-slot">${found ? await claimVerdict(found, f) : `<div class="panel"><p>${f.company ? `“${esc(f.company.value)}” is not one of the 94 company groups Netra has reviewed.` : "No company could be read from the text."} <a href="#check" id="claimSearch">Search all 44,465 buyers</a></p></div>${picker()}`}</div>
    </div>`;
    const sl = $("#claimSearch");
    if (sl && f.company) sl.addEventListener("click", (ev) => { ev.preventDefault(); setMode(false); $("#q").value = f.company.value; $("#q").dispatchEvent(new Event("input")); });
  });
}
setupClaim();
