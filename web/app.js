"use strict";

let CHAIN = null; // from data/deployment.json, written by contracts/scripts/deploy.js
const ABI = [
  "function count() view returns (uint256)",
  "function checks(uint256) view returns (bytes32 subject, bytes32 reportHash, bytes32 serialRoot, uint32 serialCount, uint64 timestamp, address attester, bool doubleClaim, string uri)",
];
// Shortcut cards beside the search: registry name (n), group for the logo (g), and why it is worth a look (why).
const EXAMPLES = [
  { n: "Shell", g: "Shell plc", why: "The biggest named buyer" },
  { n: "Delta Air Lines", g: "Delta Air Lines Inc", why: "An airline's offsets" },
  { n: "Netflix, Inc.", g: "Netflix, Inc.", why: "A streaming company" },
  { n: "Volkswagen Marke Pkw", g: "Volkswagen AG", why: "A car maker" },
  { n: "Eni Upstream", g: "Eni SpA", why: "Own report vs independent estimate" },
  { n: "Not Disclosed", g: "?", why: "No one named as the claimant" },
];
const CAT_COLORS = { redd: "#1d4e89", cookstove: "#e8590c", wind_china: "#4c82c3", ifm_us: "#8a6fb0", hfc23: "#b83a0e",
  grid_re: "#9fb8d6", other: "#d9d4cb" };
const CCP = { approved: ["CCP-approved methodology", "--a"], not_approved: ["Rejected by ICVCM", "--e"],
  not_assessed: ["Not assessed / not listed", "--na"] };


let INDEX, FACTORS, SHARD, rows;
const ON_CHECK = !!document.getElementById("check");
// Old in-page anchors moved to their own pages; keep shared links working.
const MOVED = { market: "report.html#market", hidden: "report.html#hidden", method: "report.html#method", verify: "proof.html" };
if (ON_CHECK && MOVED[location.hash.slice(1)]) location.replace(MOVED[location.hash.slice(1)]);
const buyerHref = (i) => `${ON_CHECK ? "" : "index.html"}#buyer-${i}`;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  q.addEventListener("input", () => {
    hits = search(q.value); sel = -1; q.value.trim().length < 2 ? close() : draw();
    const away = q.value.trim() !== ""; // the shortcut cards fold away while you type, and come back when the box is empty
    $("#examples").classList.toggle("away", away); $("#examples").inert = away;
  });
  q.addEventListener("keydown", (e) => {
    if (list.hidden) return;
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, hits.length - 1); draw(); e.preventDefault(); }
    if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); draw(); e.preventDefault(); }
    if (e.key === "Enter" && hits.length) { e.preventDefault(); pick(hits[Math.max(sel, 0)], list.querySelector(`li[data-i="${hits[Math.max(sel, 0)]}"] span`)); close(); }
    if (e.key === "Escape") close();
  });
  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    hits = search(q.value);
    if (hits.length) { pick(hits[0]); close(); } else if (q.value.trim().length >= 2) draw();
  });
  list.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) { pick(+li.dataset.i, li.querySelector("span")); close(); } });
  document.addEventListener("click", (e) => { if (!e.target.closest(".search")) close(); });
  logosReady.then(() => $("#examples .pick-list").innerHTML = EXAMPLES.map(({ n, g, why }, k) => {
    const i = rows.findIndex((r) => r[0] === n);
    if (i < 0) return "";
    const [, t, kk, e] = rows[i], gr = grade(e, kk, t);
    return `<button type="button" class="pickcard tinted" data-i="${i}" style="${tint(g, gr)};--k:${k}">
      ${logo(g, 40)}<span class="pc-body"><span class="pc-name">${esc(n)}</span>${why ? `<span class="pc-why">${esc(why)}</span>` : ""}</span>
      <span class="chip-grade${gr ? "" : " na"}" data-g="${gr ? gr[1] : ""}" style="background:${gr ? `var(${gr[2]})` : "var(--soft)"}">${gr ? gr[1] : "–"}</span>
      <span class="pc-meta"><span class="num">${mt(t)}</span><span>${kk ? `${pct(e / kk)} likely real` : "no estimate"}</span></span></button>`;
  }).join(""));
  $("#examples").addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (b) pick(+b.dataset.i, b.querySelector(".pc-name")); });
}

// View Transition: the picked name moves into the result title; without support (or with less motion) it just renders.
async function pick(i, from) {
  $("#q").value = rows[i][0];
  history.replaceState(null, "", `#buyer-${i}`);
  if (!from || !document.startViewTransition || reduced()) return render(i); // only a click gets the transition
  await owner(i).catch(() => {}); // load first, so the page is not frozen while the transition waits
  from.style.viewTransitionName = "buyer";
  let ran = false;
  const vt = document.startViewTransition(async () => {
    ran = true;
    from.style.viewTransitionName = "";
    await render(i);
    const h = $("#result h2");
    if (h) h.style.viewTransitionName = "buyer";
  });
  vt.ready.catch(() => {});
  await vt.updateCallbackDone.catch(() => {});
  if (!ran) { from.style.viewTransitionName = ""; await render(i); } // a skipped transition must not lose the result
  vt.finished.catch(() => {}).then(() => { const h = $("#result h2"); if (h) h.style.viewTransitionName = ""; });
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
  anonymous: "No identifiable beneficiary. The public record names no one who could be held to claims based on these credits.",
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
  return `<dl class="how">
      <div><dt>Retired</dt><dd>${fmt(o.r)} retirement records naming "${esc(o.n)}" as beneficiary on Verra and Gold Standard, ${o.y[0]}–${o.y[1]}, from the Berkeley Voluntary Registry Offsets Database v2026-08 (CC BY 4.0). Names are shown as published.</dd></div>
      ${o.g ? `<div><dt>Who this is</dt><dd>Reviewed by hand against the registry retirement details${o.g.group !== o.n ? ` and linked to <b>${esc(o.g.group)}</b>` : ""}${o.g.note ? ` (${esc(o.g.note)})` : ""}.</dd></div>` : ""}
      <div><dt>Project types</dt><dd>A type counts only when three sources agree: Berkeley's curated type, CarbonPlan OffsetsDB and the registry methodology code. Otherwise: no estimate.<ul>${types}</ul></dd></div>
      <div><dt>Likely real</dt><dd>Tonnes × the share of real reductions measured for that type in peer-reviewed research. The range is the study's uncertainty. ${o.k ? `Here: ${mt(o.e)} of ${mt(o.k)} researched tonnes (range ${mt(o.el)}–${mt(o.eh)}).` : "None of these tonnes are in a researched type."}</dd></div>
      <div><dt>Grade</dt><dd>${g ? `${g[1]}, because ${pct(o.e / o.k)} of researched tonnes are likely real.` : "No grade: research covers less than a quarter of the tonnes."} Bands: A ≥ 60%, B 40–60%, C 20–40%, D 10–20%, E &lt; 10%.</dd></div>
      <div><dt>Quality label</dt><dd>Each methodology's status in the ICVCM Core Carbon Principles assessment, snapshot 18 Aug 2026.</dd></div>
      <div><dt>Emissions</dt><dd>${r ? `Read by hand from <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.source)}</a>, ${esc(r.section)}; checked ${esc(r.checked)}.` : "No figure is shown unless it comes from the company's own document."}${o.ct ? ` Independent estimate: Climate TRACE v5.7.0 ownership data, ${fmt(o.ct.assets)} assets of ${esc(o.ct.parent)}.` : ""}</dd></div>
    </dl>
    <p class="muted small">Full rules: <a href="https://github.com/rofiperlungoding/climatechain-id/blob/main/docs/METHODS.md" target="_blank" rel="noopener">METHODS.md</a>. Plain-English terms: <a href="glossary.html">glossary</a>.</p>`;
}

let CURRENT = null;
async function render(i, scroll = true) {
  CURRENT = i;
  const box = $("#result");
  box.hidden = false;
  const scan = $("#search");
  if (scroll) { box.innerHTML = `<p class="muted">Loading ${esc(rows[i][0])}…</p>`; scan?.classList.add("scanning"); }
  let o;
  try { o = await owner(i); await Promise.all([logosReady, gapsReady, anomReady]); } catch (err) { box.innerHTML = `<p class="bad">${esc(err.message)}. Check your connection and try again.</p>`; return; }
  finally { scan?.classList.remove("scanning"); }
  if (CURRENT !== i) return; // a later pick finished loading first: do not draw over it
  const g = grade(o.e, o.k, o.t);
  const group = o.g?.type === "company" ? o.g.group : null;
  const cover = o.k / o.t, real = o.k ? o.e / o.k : 0;
  const anonymous = o.n === "(no owner listed)" || /^not disclosed$/i.test(o.n);
  const short = /^0x[0-9a-f]{20,}$/i.test(o.n) ? `${o.n.slice(0, 6)}…${o.n.slice(-4)}` : o.n; // wallet addresses
  const years = o.y[0] === o.y[1] ? `in ${o.y[0]}` : `since ${o.y[0]}`;
  const sentence = anonymous
    ? `<b>${mt(o.t)}</b> of credits were retired since ${o.y[0]} without naming who the climate benefit belongs to. The public record names no one who could be held to these claims.`
    : o.k
      ? `Of every 100 tonnes <b>${esc(short)}</b> retired ${years}, research covers <b>${Math.round(cover * 100)}</b>${g ? "" : ", too few for a grade"}. Of those, about <b>${Math.round(real * 100)}</b> likely cut real emissions${o.el === o.eh ? "" : ` (research range ${Math.round(o.el / o.k * 100)}–${Math.round(o.eh / o.k * 100)})`}.`
      : `None of the ${mt(o.t)} <b>${esc(short)}</b> retired ${years} comes from a project type with a published research estimate, so Netra cannot estimate how much was real.`;

  const ccp = ["approved", "not_approved", "not_assessed"].map((s) => [s, o.ccp[s] || 0]);
  const types = Object.entries(o.bt);
  const span = o.y[0] === o.y[1] ? o.y[0] : `${o.y[0]}–${o.y[1]}`;
  // The claim receipt: what was retired, minus what research does not cover, minus what it finds not real.
  const receipt = `<ol class="struk" aria-label="What these credits are likely worth">
      <li style="--i:0"><span>Retired for ${esc(short)}, ${span}</span><b class="num">${mt(o.t)}</b></li>
      <li style="--i:1" class="minus"><span>not covered by published research</span><b class="num">−${mt(o.t - o.k)}</b></li>
      ${o.k ? `<li style="--i:2" class="minus"><span>research says likely not real</span><b class="num">−${mt(o.k - o.e)}</b></li>` : ""}
      <li style="--i:3" class="total"><span data-term="likely-real">Likely real, best estimate</span><b class="num">${o.k ? mt(o.e) : "no estimate"}</b></li>
    </ol>
    ${o.k ? `<div class="claim">
      ${claimBar(o.e, o.el, o.eh, o.k)}
      <div class="key"><span>Filled: best estimate ${pct(real)} of researched</span><span>Hatched: range ${mt(o.el)}–${mt(o.eh)}</span><span>Outline: researched ${mt(o.k)}</span></div>
      ${o.e ? `<p class="small">At the 2024 market average of $6.34 per credit, each likely-real tonne costs about <b>$${(6.34 * o.k / o.e).toFixed(2)}</b> (range $${(6.34 * o.k / o.eh).toFixed(2)}–$${o.el ? (6.34 * o.k / o.el).toFixed(2) : "?"}). <span class="muted">Price: <a href="https://www.ecosystemmarketplace.com/publications/2025-state-of-the-voluntary-carbon-market-sovcm/" target="_blank" rel="noopener">Ecosystem Marketplace, State of the Voluntary Carbon Market 2025</a>, p. 10. What this buyer paid is not public.</span></p>` : ""}
    </div>` : ""}`;
  const TABS = [
    ["credits", "Credits", `<div class="box"><h3>Project types</h3>
        <div class="legend">${types.map(([b, t]) => `<div><span>${esc(b)}</span><span class="num">${pct(t / o.t)}</span></div>`).join("")}</div></div>
      <div class="box"><h3>ICVCM integrity label</h3>
        ${bar(ccp.map(([s, t]) => [t / o.t, css(CCP[s][1]), CCP[s][0]]))}
        <div class="legend">${ccp.map(([s, t]) => `<div><span><i style="background:var(${CCP[s][1]})"></i>${CCP[s][0]}</span><span class="num">${pct(t / o.t)}</span></div>`).join("")}</div></div>`],
    ["emissions", "Emissions", emissionsBox(o)],
    ["years", "Over time", `<div class="box"><h3>Past to present</h3>${sparkline(o.ys)}
        <p class="muted small">Grey bars: tonnes retired per year. Line: likely-real share of research-covered tonnes.</p></div>`],
    ["how", "How we know", howWeKnow(o, g)],
    ["chain", "On-chain", `<div class="box"><h3>Fingerprint of this result</h3>
        <p class="small">keccak256 of this buyer's record, exactly as published in <a href="data/o/${Math.floor(i / SHARD)}.json">data/o/${Math.floor(i / SHARD)}.json</a> (entry ${i % SHARD}).</p>
        <button type="button" class="btn ghost" id="recompute">Recompute in your browser</button>
        <p id="recomputed" class="small" aria-live="polite"></p></div>`],
  ];
  box.innerHTML = `
    <div class="res-head">
      <div><p class="meta">Retired ${span} · ${fmt(o.r)} retirements</p><div class="res-id">${group ? logo(group, 56) : ""}<h2 class="${short !== o.n ? "addr" : ""}">${esc(o.n)}</h2></div>${buyerLine(o)}
        <p class="muted small">${mt(o.t)} retired${g ? ` · grade on the ${pct(cover)} covered by research` : " · not enough research coverage for a grade"}</p></div>
      <div class="grade no-line ${g ? "" : "na"}" data-term="grade" data-g="${g ? g[1] : ""}" style="${g ? `background:var(${g[2]})` : ""}" role="img" aria-label="Grade ${g ? g[1] : "not available"}">${g ? g[1] : "?"}</div>
    </div>
    <p class="plain">${sentence}</p>
    <div class="res-layout">
      <div class="res-main">
        ${receipt}
        ${o.o / o.t > 0.2 ? `<div class="flag">⚠ ${pct(o.o / o.t)} of these credits have a vintage before 2016, which the aviation scheme CORSIA does not accept.</div>` : ""}
        ${(o.ccp.not_approved || 0) / o.t > 0.2 ? `<div class="flag">⚠ ${pct(o.ccp.not_approved / o.t)} come from methodologies ICVCM found do not meet its Core Carbon Principles.</div>` : ""}
        ${ANOM[i] ? `<div class="unusual"><b>Unusual pattern</b> <span class="tag">machine learning</span>
          <ul>${ANOM[i].reasons.map((r) => `<li>${esc(r[0].toUpperCase() + r.slice(1))}.</li>`).join("")}</ul>
          <p class="muted small">Flagged by an Isolation Forest model among 540 buyers with at least 100,000 t retired. An unusual pattern is a reason to look closer, not proof of wrongdoing. <a href="data.html#unusual">How it works</a></p></div>` : ""}
        <div id="chainStatus" class="flag ok pending">Checking on-chain records…</div>
        <p class="note"><b>Selling in the EU?</b> Since 27 September 2026, EU Directive 2024/825 bans calling a product climate neutral, reduced or positive because of offsets, whatever the credit quality.</p>
      </div>
      <div class="res-side">
        <div class="tabs" role="tablist" aria-label="Evidence">${TABS.map(([k, label], n) => `<button type="button" role="tab" id="tab-${k}" aria-controls="pan-${k}" aria-selected="${!n}" tabindex="${n ? -1 : 0}">${label}</button>`).join("")}</div>
        ${TABS.map(([k, , html], n) => `<div class="tabpanel" role="tabpanel" id="pan-${k}" aria-labelledby="tab-${k}" tabindex="0"${n ? " hidden" : ""}>${html}</div>`).join("")}
      </div>
    </div>
    <div class="actions"><a href="#buyer-${i}">Link to this result</a>
      <a href="https://github.com/rofiperlungoding/climatechain-id/issues/new?title=${encodeURIComponent("Correction request: " + o.n)}" target="_blank" rel="noopener">Request a correction</a>
      <span class="muted mono">report ${reportHash(o).slice(0, 18)}…</span></div>`;
  tabs(box);
  $("#recompute").addEventListener("click", async () => {
    const h = reportHash(o), out = $("#recomputed");
    let mine = [];
    try { mine = (await onchain).filter((c) => c.subject === subjectHash(o.n)); } catch { /* chain unreachable: show the hash alone */ }
    const last = mine[mine.length - 1];
    out.innerHTML = `<code class="hash">${h}</code><br>${last ? (last.reportHash === h ? `<span class="ok">✓ Same as on-chain record #${last.id}.</span>` : `<span class="bad">On-chain record #${last.id} holds ${last.reportHash.slice(0, 18)}…: the data changed after it was published.</span>`) : "No on-chain record for this buyer yet, so there is nothing to compare."}`;
  });
  box.className = "result tinted";
  box.style.cssText = tint(group || o.n, g);
  glossTips();
  if (!scroll) { chainStatus(o); return; }
  box.classList.remove("in-view");
  await document.fonts.ready; // a shared #buyer-N link renders before the web font: the hero shrinks after it loads
  if (CURRENT !== i) return;
  window.ScrollTrigger?.refresh(); // the page below moved down; measure before scrolling, a refresh mid-scroll would undo the scroll
  box.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" }); // measured before the entrance offset applies
  if (window.gsap && !reduced()) printReceipt(box); else { void box.offsetWidth; box.classList.add("in-view"); }
  chainStatus(o);
}

// The result prints like a receipt: the card unrolls, lines arrive, bars fill, the grade lands, the evidence follows.
// Numbers are final in every frame; only position, opacity, scale and clip move.
function printReceipt(box) {
  const q = (s) => box.querySelectorAll(s);
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .fromTo(box, { clipPath: "inset(0 0 100% 0 round 14px)" }, { clipPath: "inset(0 0 0% 0 round 14px)", duration: 0.75, ease: "power2.inOut", clearProps: "clipPath" })
    .from(q(".res-head > :not(.grade)"), { y: 14, opacity: 0, duration: 0.5 }, 0.15)
    .from(q(".struk li:not(.minus)"), { x: -14, opacity: 0, duration: 0.45, stagger: 0.09 }, 0.3)
    .from(q(".struk li.minus"), { x: 16, opacity: 0, duration: 0.45, stagger: 0.09 }, 0.4)
    .fromTo(q(".struk .total"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.5, clearProps: "clipPath" }, 0.62)
    .fromTo(q(".claimbar .range"), { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 0.7)
    .fromTo(q(".claimbar .real"), { scaleX: 0 }, { scaleX: 1, duration: 0.75 }, 0.85)
    .from(q(".grade"), { y: -40, rotate: -12, opacity: 0, duration: 0.65, ease: "back.out(2.6)" }, 1)
    .from(q(".plain, .claim .key, .res-side .tabs, .res-side .tabpanel:not([hidden]) > *"), { y: 12, opacity: 0, duration: 0.45, stagger: 0.05 }, 0.95)
    .from(q(".flag, .note, .unusual, .actions"), { y: 10, opacity: 0, duration: 0.4, stagger: 0.07 }, 1.15);
}

function tabs(root) {
  const list = root.querySelector('[role="tablist"]');
  if (!list) return;
  const all = [...list.querySelectorAll('[role="tab"]')];
  const show = (t) => {
    all.forEach((b) => { const on = b === t; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; root.querySelector(`#${b.getAttribute("aria-controls")}`).hidden = !on; });
  };
  list.addEventListener("click", (e) => { const t = e.target.closest('[role="tab"]'); if (t) show(t); });
  list.addEventListener("keydown", (e) => {
    const k = all.indexOf(document.activeElement), step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (k < 0 || !step) return;
    const t = all[(k + step + all.length) % all.length]; show(t); t.focus(); e.preventDefault();
  });
}

async function chainStatus(o) {
  const el = $("#chainStatus");
  try {
    const list = await onchain;
    const mine = list.filter((c) => c.subject === subjectHash(o.n));
    if (!mine.length) { el.className = "note"; el.innerHTML = `Not published on-chain yet. Published checks are listed on <a href="proof.html">Proof</a>.`; return; }
    const last = mine[mine.length - 1], match = last.reportHash === reportHash(o);
    el.className = match && !last.doubleClaim ? "flag ok" : "flag";
    el.innerHTML = match
      ? `${last.doubleClaim ? "⚠ Flagged on-chain as a double claim: at least one serial range also backs an earlier claim." : "✓ Published on-chain " + new Date(last.timestamp * 1000).toISOString().slice(0, 10) + " and matches the open data."} <a href="proof.html">See record #${last.id}</a>`
      : `On-chain record #${last.id} exists but does not match the current data (the dataset was updated after it was published).`;
  } catch {
    el.className = "flag"; el.textContent = CHAIN ? `Could not reach the ${CHAIN.label || CHAIN.network} to check on-chain records.` : "On-chain records are not published for this build yet.";
  } finally {
    if (window.gsap && !reduced()) gsap.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }); // the answer settles in
  }
}

/* ---------- market ---------- */
function market(m) {
  if (!$("#funnel")) return;
  const named = m.named_share, cover = m.known / m.tonnes, real = m.eff / m.known, w = (t) => (t / m.tonnes * 100).toFixed(2) + "%";
  const steps = [
    [m.tonnes, "Retired on Verra and Gold Standard since 2020", ""],
    [m.known, "From project types with a published research estimate", `${pct(cover)} of all tonnes`],
    [m.eff, "Likely real, best estimate", `${pct(real)} of researched tonnes; range ${mt(m.eff_lo)}–${mt(m.eff_hi)}`],
  ];
  $("#funnel").setAttribute("aria-label", steps.map(([t, l]) => `${l}: ${mt(t)}`).join("; "));
  $("#funnel").innerHTML = steps.map(([t, label, note], k) => `<div class="frow" style="--i:${k}">
      <div class="flabel"><span>${label}</span><b class="num">${mt(t)}</b>${note ? `<span class="muted small">${note}</span>` : ""}</div>
      <div class="fbar">${k === 2 ? `<span class="frange" style="width:${w(m.eff_hi)}"></span>` : ""}<span class="ffill" style="width:${w(t)}"></span></div></div>`).join("");
  $("#marketLine").textContent = `${pct(1 - named)} of all tonnes have a blank beneficiary field, and only ${pct((m.ccp.approved || 0) / m.tonnes)} use a methodology with the ICVCM quality label.`;

  const years = Object.keys(m.ys).map(Number).sort();
  const W = 720, H = 240, L = 44, R = 16, T = 16, B = 32;
  const X = (k) => L + (k + 0.5) * ((W - L - R) / years.length);
  const Y = (v) => T + (1 - v) * (H - T - B);
  const vals = years.map((y) => m.ys[y][1] / m.ys[y][2]);
  const grid = [0, 0.25, 0.5, 0.75, 1].map((v) => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="${css("--line")}"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${v * 100}%</text>`).join("");
  const line = vals.map((v, k) => `${k ? "L" : "M"}${X(k)},${Y(v)}`).join("");
  $("#trend").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Likely-real share by year">${grid}
    <path d="${line}" pathLength="1" fill="none" stroke="${css("--signal")}" stroke-width="2.5"/>
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
  unidentified: ["Codes that match no organisation", "#7a2e0c", "A short code (for example \"DL\") that matches no organisation in the registry details. Netra does not guess."],
  anonymous: ["No name at all", "var(--signal)", "The beneficiary field is blank or says \"Not Disclosed\". The public record names no one who could be held to this claim."],
};
const HIDDEN_KINDS = ["intermediary", "wallet", "tokenization", "unidentified", "anonymous"];

async function hiddenSection() {
  const el = $("#hiddenBody");
  if (!el) return;
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
    <div class="panel wide-right">
      <h3>The biggest accounts that hide who claims</h3>
      <div class="tablewrap"><table><thead><tr><th>#</th><th>Account as written in the registry</th><th>What it is</th><th>Tonnes</th><th>Likely real</th></tr></thead><tbody>
      ${h.top.map((x, r) => `<tr><td class="num">${r + 1}</td><td><a href="${buyerHref(x.i)}" class="${x.n.startsWith("0x") ? "mono" : ""}">${esc(x.n)}</a></td>
        <td>${KIND[x.kind][0]}</td><td class="num">${mt(x.t)}</td><td class="num">${x.k ? `${pct(x.e / x.k)} of ${mt(x.k)} researched` : "no estimate"}</td></tr>`).join("")}
      </tbody></table></div>
    </div>
    <div class="why">
      <div class="box"><h3>Why it matters</h3><p>A company can say "we offset our emissions". If the registry does not name it, no one can check in public which credits back that sentence, or whether the same credits back someone else's.</p></div>
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

const contractUrl = () => (CHAIN.explorer ? `${CHAIN.explorer}/address/${CHAIN.address}` : "proof.html");

const SEEN = new Map(); // record id -> doubleClaim, to mark what changed since the last draw
async function verifyPanel() {
  if (!$("#checks")) return;
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
      const isNew = SEEN.size && !SEEN.has(c.id), newFlag = SEEN.size && c.doubleClaim && SEEN.get(c.id) === false;
      if (c.doubleClaim) status += ` <span class="bad flagged${newFlag ? " stamp" : ""}">· flagged double claim</span>`;
      return `<tr class="${isNew ? "fresh" : ""}"><td class="num">#${c.id}</td><td>${i !== undefined ? `<a href="${buyerHref(i)}">${esc(rows[i][0])}</a>` : (file ? esc(file.buyer) : `<span class="mono">${c.subject.slice(0, 12)}…</span>`)}</td>
        <td class="mono">${c.reportHash.slice(0, 14)}…</td><td class="num">${new Date(c.timestamp * 1000).toISOString().slice(0, 10)}</td><td>${status}</td><td>${serial}</td></tr>`;
    }));
    list.forEach((c) => SEEN.set(c.id, c.doubleClaim));
    $("#checks").innerHTML = `<div class="tablewrap"><table><thead><tr><th>Record</th><th>Buyer</th><th>Report hash</th><th>Date</th><th>Report</th><th>Serial ranges</th></tr></thead><tbody>${out.join("")}</tbody></table></div>`;
  } catch {
    $("#checkCount").textContent = "unavailable";
    $("#checks").innerHTML = `<p class="bad">Could not reach the ${esc(CHAIN.label || CHAIN.network)}. ${CHAIN.explorer ? `Records are still public on <a href="${contractUrl()}" target="_blank" rel="noopener">the block explorer</a>.` : "Start the local chain to see records."}</p>`;
  }
}

/* ---------- story (home): one figure of 100 dots that changes as each chapter scrolls in ---------- */
// Every number is computed from the same data as the rest of the site; a dot is 1 in 100 tonnes (or one buyer, or one check).
async function story(m) {
  const viz = $("#figViz");
  if (!viz) return;
  const n100 = (share) => Math.round(share * 100);
  const spread = (k) => { const s = new Set(); for (let i = 0; s.size < k && i < 400; i++) s.add((i * 37 + 11) % 100); return s; }; // even scatter, same every load
  // --k = delay in ms by distance from the grid centre, so a recolour spreads out as a ripple
  const dots = (cls) => { const rows = Math.ceil(cls.length / 20);
    return `<div class="dots">${cls.map((c, i) => `<i style="--k:${Math.round(Math.hypot(i % 20 - 9.5, Math.floor(i / 20) - (rows - 1) / 2) * 26)}" class="${c}"></i>`).join("")}</div>`; };
  const hidden = await getJSON("data/hidden.json").catch(() => null);
  await companiesReady;
  const known = n100(m.known / m.tonnes), real = n100(m.eff / m.known), realSet = spread(real);
  const shares = Object.keys(m.ys).sort().map((y) => [y, m.ys[y][1] / m.ys[y][2]]);
  const hid = hidden ? ["intermediary", "wallet", "tokenization", "unidentified", "anonymous"].reduce((s, k) => s + (hidden.kinds[k]?.t || 0), 0) / hidden.total : null;
  const graded = (COMPANIES || []).map((c) => grade(c.e, c.k, c.t)).filter(Boolean).map((g) => g[1]).sort();
  const count = (l) => graded.filter((g) => g === l).length;
  const mid = (c) => (c.ct.low + c.ct.high) / 2;
  const both = (COMPANIES || []).filter((c) => c.rep && c.rep.scope1 && c.ct);
  const gap = both.filter((c) => mid(c) / c.rep.scope1 >= 2);

  // one 10×10 grid per year: filled dots = likely-real share of measured tonnes; the best year is marked
  const years = () => {
    const top = Math.max(...shares.map(([, v]) => v));
    return `<div class="years" role="img" aria-label="Likely-real share by year">${shares.map(([y, v]) => {
      const n = Math.round(v * 100);
      return `<div class="yr${v === top ? " best" : ""}"><div class="dots mini">${Array.from({ length: 100 }, (_, i) => `<i style="--k:${i * 3}" class="${i < n ? "r" : ""}"></i>`).join("")}</div>
        <span class="num">${pct(v)}</span><span>${y}</span></div>`;
    }).join("")}</div>`;
  };
  // one row per group in the gap: own Scope 1 report next to the independent estimate, one shared scale
  const gapBars = () => {
    const rows = gap.slice().sort((a, b) => mid(b) / b.rep.scope1 - mid(a) / a.rep.scope1);
    const max = Math.max(...rows.flatMap((c) => [c.rep.scope1, mid(c)]));
    const o = matchMedia("(max-width: 640px)").matches ? 1.45 : 1; // phones draw labels larger (style.css), so rows get more room
    const W = 520, RH = 70 * o, barW = 340, H = rows.length * RH + 8;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Reported Scope 1 next to the independent estimate">
      ${rows.map((c, i) => {
        const y = i * RH + 16 * o, rw = c.rep.scope1 / max * barW, iw = mid(c) / max * barW;
        return `<text x="0" y="${y}" fill="${css("--ink")}">${esc(c.group)}</text>
        <rect x="0" y="${y + 10 * o}" height="${14 * o}" width="${rw}" fill="${css("--accent")}"/><text x="${rw + 8}" y="${y + 21 * o}">${mt(c.rep.scope1)}</text>
        <rect x="0" y="${y + 30 * o}" height="${14 * o}" width="${iw}" fill="${css("--pale")}"/><text x="${iw + 8}" y="${y + 41 * o}">${mt(mid(c))}</text>`;
      }).join("")}</svg>`;
  };
  const STATES = [
    { big: mt(m.tonnes), cap: "retired since 2020, each counted as a real tonne", src: "Verra and Gold Standard, Berkeley Voluntary Registry Offsets Database v2026-08",
      viz: () => dots(Array(100).fill("r")), legend: [["r", "each dot: 1 in 100 tonnes, all counted as real"]] },
    { big: `${known} of 100`, cap: "tonnes come from kinds of project that research has measured", src: "A kind counts only when Berkeley, CarbonPlan and the methodology code agree",
      viz: () => dots(Array.from({ length: 100 }, (_, i) => (i < known ? "r" : "x"))), legend: [["r", "measured by research"], ["x", "no published estimate"]] },
    { big: `${real} of 100`, cap: `measured tonnes likely cut real emissions (range ${pct(m.eff_lo / m.known)} to ${pct(m.eff_hi / m.known)})`, src: "Probst et al. 2024, Nature Communications, applied per kind of project",
      viz: () => dots(Array.from({ length: 100 }, (_, i) => (realSet.has(i) ? "r" : ""))), legend: [["r", "likely a real cut"], ["", "counted, not real"]] },
    { big: `${pct(Math.min(...shares.map((s) => s[1])))} to ${pct(Math.max(...shares.map((s) => s[1])))}`, cap: "likely real, every year since 2020", src: "Measured tonnes by year of retirement; 2026 up to August",
      viz: years, legend: [["r", "likely a real cut"], ["", "counted, not real"]] },
    hid === null ? null : { big: `${n100(hid)} of 100`, cap: "tonnes since 2020 name no one you could hold to the claim", src: "Beneficiary field of every retirement, reviewed by hand for the largest accounts",
      viz: () => { const s = spread(n100(hid)); return dots(Array.from({ length: 100 }, (_, i) => (s.has(i) ? "x" : "r"))); }, legend: [["r", "a named claimant"], ["x", "no one named"]] },
    { big: `${graded.filter((g) => g === "A" || g === "B").length} of ${graded.length}`, cap: "big buyers that research covers well enough to grade reach a B", src: "Netra grades: A at least 60% likely real, B 40 to 60%, C 20 to 40%, D 10 to 20%, E under 10%",
      viz: () => dots(graded.map((g) => `g${g.toLowerCase()}`)), legend: ["A", "B", "C", "D", "E"].filter(count).map((l) => [`g${l.toLowerCase()}`, `${l}: ${count(l)}`]) },
    { big: `${gap.length} of ${both.length}`, cap: "reviewed groups whose independent estimate is at least twice their own Scope 1 report", src: "Company reports, read by hand; Climate TRACE v5.7.0 ownership data. Different boundaries, never merged",
      viz: gapBars, legend: [["r", "own report, Scope 1"], ["", "independent estimate (Climate TRACE)"]] },
    { big: "…", cap: "checks on a public blockchain", src: "ClaimRegistry on the Ethereum Sepolia test network", viz: () => "", legend: [], chain: true },
    { big: "27 Sep 2026", cap: "EU ban on offset-based climate-neutral claims for products", src: "Directive (EU) 2024/825", viz: () => "", legend: [] },
  ];
  const CHAIN_AT = STATES.findIndex((s) => s && s.chain);
  let chainFlags = []; // morph: one big dot per published check, true when flagged
  // The chain chapter waits for the chain: one dot per published check, flagged double claims marked.
  onchain.then((list) => {
    chainFlags = list.map((c) => c.doubleClaim);
    const flagged = list.filter((c) => c.doubleClaim).length;
    Object.assign(STATES[CHAIN_AT], { big: `${list.length} checks`, cap: `on a public blockchain; ${flagged} flagged as double claims`,
      viz: () => dots(list.map((c) => (c.doubleClaim ? "ge" : "r"))), legend: [["r", "a published check"], ["ge", "flagged: serials claimed twice"]] });
    if (current === CHAIN_AT) { current = -1; show(CHAIN_AT); }
  }).catch(() => Object.assign(STATES[CHAIN_AT], { big: "Offline", cap: "the test network did not answer; the records stay public on the block explorer" }));

  // G = GSAP when it loaded and the device allows full motion; otherwise the CSS transitions alone
  const G = window.gsap && !reduced() ? gsap : null;
  const chapters = [...document.querySelectorAll(".chapter")];
  // PROTOTYPE: two ways to tell the story, compared side by side. ?story=film pins the story like a film (captions change
  // in place while the figure plays); anything else is "calm": the notes scroll by and the figure crossfades slowly.
  // The one not chosen is deleted afterwards.
  const mode = new URLSearchParams(location.search).get("story");
  const morph = !!G && !!window.ScrollTrigger && mode === "morph";
  const film = morph || (!!G && !!window.ScrollTrigger && mode === "film"); // morph plays on the film's pinned stage
  document.documentElement.dataset.story = morph ? "morph" : film ? "film" : "calm";

  // PROTOTYPE "morph": the same 100 dots stay on screen the whole story and move from one picture to the next as you scroll.
  // layout(s) says where each dot sits in chapter s; paint(p) blends two chapters' layouts for a scroll position p.
  let paint = null;
  if (morph) {
    viz.innerHTML = `<div class="m-dots">${"<i></i>".repeat(100)}</div><div class="m-labels">${shares.map(([y, v]) => `<span><b>${pct(v)}</b>${y}</span>`).join("")}</div><div class="m-svg"></div>`;
    viz.classList.add("morph");
    const dotsEl = [...viz.querySelectorAll(".m-dots i")], labels = [...viz.querySelectorAll(".m-labels span")], svg = viz.querySelector(".m-svg");
    const hidSet = hid === null ? new Set() : spread(n100(hid));
    // years: 100 dots shared out over the 7 columns in proportion to each year's likely-real share (2021 is the tallest)
    const sum = shares.reduce((s, [, v]) => s + v, 0), heights = shares.map(([, v]) => Math.round(v / sum * 100));
    heights[heights.length - 1] += 100 - heights.reduce((a, b) => a + b, 0);
    const colOf = [], rowOf = [];
    heights.forEach((h, c) => { for (let r = 0; r < h; r++) { colOf.push(c); rowOf.push(r); } });
    const layout = (s) => {
      const W = viz.clientWidth, H = viz.clientHeight, d = Math.min(W / 22, 17), out = [];
      viz.style.setProperty("--md", `${(d * 0.78).toFixed(1)}px`); // dot size follows the spacing, so dots never touch on a phone
      const at = (j, cols, cx, cy, rows, k = d) => ({ x: cx + (j % cols - (cols - 1) / 2) * k, y: cy + (Math.floor(j / cols) - (rows - 1) / 2) * k });
      const colX = (c) => W * (0.08 + c * (0.84 / (shares.length - 1)));
      for (let i = 0; i < 100; i++) {
        let p = { ...at(i, 20, W / 2, H / 2, 5), c: "r", o: 1, s: 1 };
        if (s === 1 || s === 2) {
          p = i < known ? { ...at(i, 7, W * 0.27, H / 2, Math.ceil(known / 7)), c: s === 1 || i < real ? "r" : "", o: 1, s: 1 }
            : { ...at(i - known, 9, W * 0.7, H / 2, Math.ceil((100 - known) / 9)), c: "x", o: s === 1 ? 1 : 0.22, s: 1 };
        }
        if (s === 3) p = { x: colX(colOf[i]) + (rowOf[i] % 2 - 0.5) * d, y: H * 0.74 - Math.floor(rowOf[i] / 2) * d, c: "r", o: 1, s: 1 };
        if (s === 4) p.c = hidSet.has(i) ? "x" : "r";
        if (s === 5) p = i < graded.length ? { ...at(i, 13, W / 2, H / 2, Math.ceil(graded.length / 13)), c: `g${graded[i].toLowerCase()}`, o: 1, s: 1 } : { ...p, c: "", o: 0, s: 0 };
        if (s === 6 || s === 8) p = { ...p, o: 0, s: 0.3 };
        if (s === 7) p = i < chainFlags.length ? { ...at(i, chainFlags.length, W / 2, H / 2, 1, d * 2.4), c: chainFlags[i] ? "ge" : "r", o: 1, s: 2 } : { ...p, o: 0, s: 0 };
        out.push(p);
      }
      return { dots: out, colX };
    };
    const sm = (t) => t * t * (3 - 2 * t);
    paint = (p) => {
      const n = chapters.length, k = Math.max(0, Math.min(Math.floor(p), n - 1)), f = sm(Math.max(0, Math.min(1, (p - k - 0.55) / 0.45)));
      const sa = +chapters[k].dataset.s, sb = +(chapters[k + 1] || chapters[k]).dataset.s, A = layout(sa), B = layout(sb);
      dotsEl.forEach((el, i) => {
        const a = A.dots[i], b = B.dots[i];
        el.style.transform = `translate(${a.x + (b.x - a.x) * f}px, ${a.y + (b.y - a.y) * f}px) scale(${a.s + (b.s - a.s) * f})`;
        el.style.opacity = a.o + (b.o - a.o) * f;
        el.className = f < 0.5 ? a.c : b.c;
      });
      const w = (s) => (sa === s ? 1 - f : 0) + (sb === s ? f : 0); // how much of chapter s is on screen
      labels.forEach((l, c) => { l.style.left = `${A.colX(c)}px`; });
      viz.querySelector(".m-labels").style.opacity = w(3);
      if (w(6) > 0 && !svg.innerHTML) svg.innerHTML = gapBars();
      svg.style.opacity = w(6);
    };
    document.addEventListener("themechange", () => { svg.innerHTML = ""; });
  }

  let current = -1;
  const show = (s) => {
    const st = STATES[s];
    if (!st || s === current) return;
    current = s;
    const swaps = document.querySelectorAll(".figure .swap");
    swaps.forEach((el) => el.classList.add("out"));
    const draw = () => {
      $("#figBig").textContent = st.big; $("#figCap").textContent = st.cap; $("#figSrc").textContent = st.src;
      $("#figLegend").innerHTML = st.legend.map(([c, t]) => `<span class="${c}">${esc(t)}</span>`).join("");
      swaps.forEach((el) => el.classList.remove("out"));
      if (!G) return;
      if (film) G.fromTo(["#figBig", "#figCap", "#figSrc"], { y: 18, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.07, ease: "power3.out", overwrite: true });
      else G.fromTo(["#figBig", "#figCap", "#figSrc"], { opacity: 0 }, { opacity: 1, duration: 0.9, stagger: 0.08, ease: "power1.out", overwrite: true });
    };
    // dots recolour in place (a ripple from the centre); a different kind of figure is swapped and drawn in
    if (morph) { reduced() ? draw() : setTimeout(draw, 160); chapters.forEach((el) => el.classList.toggle("on", +el.dataset.s === s)); return; } // morph: paint() moves the dots
    const html = st.viz(), next = new DOMParser().parseFromString(html, "text/html").querySelectorAll(".dots i"), now = viz.querySelectorAll(".dots i");
    if (next.length && next.length === now.length) now.forEach((el, i) => (el.className = next[i].className));
    else {
      viz.innerHTML = html;
      if (G && film) {
        G.from(viz.querySelectorAll(".dots i"), { scale: 0, duration: 0.5, ease: "back.out(2)", stagger: { grid: "auto", from: "center", amount: 0.45 } });
        G.from(viz.querySelectorAll("rect"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.8, stagger: 0.07, ease: "power3.out" });
      } else if (G) G.fromTo(viz, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power1.out", overwrite: true }); // calm: the new figure simply fades in (fromTo: a quick second change must not freeze it half-faded)
    }
    reduced() ? draw() : setTimeout(draw, 160);
    chapters.forEach((el) => el.classList.toggle("on", +el.dataset.s === s));
  };
  show(0);
  const narrow = matchMedia("(max-width: 860px)").matches;
  if (film) {
    // the story is pinned; each caption fades in where the last one was, and the figure follows the caption on screen
    gsap.registerPlugin(ScrollTrigger);
    const n = chapters.length;
    G.set(chapters.slice(1), { autoAlpha: 0, y: 40 });
    const tl = G.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: ".story-grid", pin: true, start: "top top", end: `+=${n * 85}%`, scrub: 0.6,
      // morph: the number changes when the dots change colour (halfway through the move, 0.775 into a chapter), with the caption
      onUpdate: (t) => { show(+chapters[Math.min(n - 1, Math.floor(t.progress * n + (paint ? 0.225 : 0)))].dataset.s); if (paint) paint(t.progress * n); },
      onRefresh: (t) => paint && paint(t.progress * n) } });
    chapters.forEach((el, i) => {
      if (i) tl.to(el, { autoAlpha: 1, y: 0, duration: 0.25 }, i);
      if (i < n - 1) tl.to(el, { autoAlpha: 0, y: -40, duration: 0.25 }, i + 0.75);
    });
    tl.set({}, {}, n); // one unit of scroll per chapter
  } else if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    // the chapter nearest a reading line owns the figure (the middle of the screen; lower on phones, where the figure sits on top).
    // One rule for every scroll position, so there is never a gap or an overlap between chapters.
    const nearest = () => {
      const y = innerHeight * (narrow ? 0.72 : 0.5);
      let best = chapters[0], d = Infinity;
      for (const el of chapters) { const r = el.getBoundingClientRect(), dd = r.top > y ? r.top - y : r.bottom < y ? y - r.bottom : 0; if (dd < d) { d = dd; best = el; } }
      show(+best.dataset.s);
    };
    ScrollTrigger.create({ trigger: ".chapters-list", start: "top bottom", end: "bottom top", onUpdate: nearest, onRefresh: nearest });
    if (G) chapters.forEach((el) => {
      // calm: a note arrives paragraph by paragraph, slowly, as you reach it
      G.from(el.children, { y: 10, opacity: 0, duration: 1, stagger: 0.22, ease: "power1.out", scrollTrigger: { trigger: el, start: "top 80%", once: true } });
      // phones: a note fades as it rises over the pinned figure, so it never hides the number it explains
      if (narrow) G.to(el, { opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "bottom 62%", end: "bottom 38%", scrub: true } });
    });
  } else {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && show(+e.target.dataset.s)),
      { rootMargin: narrow ? "-62% 0px -30% 0px" : "-45% 0px -45% 0px" });
    chapters.forEach((el) => io.observe(el));
  }
  document.addEventListener("themechange", () => { const s = current; current = -1; show(s); });
  // contour lines behind the story, drawn wider than the box so they can drift sideways
  let t = "";
  for (let k = 0; k < 74; k++) {
    let p = "";
    for (let x = -120; x <= 1400; x += 40) p += `${x > -120 ? " L" : "M"}${x} ${(40 + k * 54 + Math.sin(x / 170 + k * 0.7) * 22 + Math.cos(x / 90 + k) * 9).toFixed(1)}`;
    t += `<path d="${p}"/>`;
  }
  $("#topo").innerHTML = t;
  if (G) G.timeline({ scrollTrigger: { trigger: ".field", start: "top bottom", end: "bottom top", scrub: 1.2 } })
    .to("#topo path:nth-child(odd)", { x: 70, ease: "none" }, 0).to("#topo path:nth-child(even)", { x: -70, ease: "none" }, 0);
  // the page grew while data loaded (and a reload may restore a deep scroll): measure the triggers again
  if (window.ScrollTrigger) { ScrollTrigger.refresh(); document.fonts.ready.then(() => ScrollTrigger.refresh()); }
}

/* ---------- boot ---------- */
// Page motion with GSAP (home hero, sections rising in). Without GSAP or with less motion the CSS entrances stay.
function motion() {
  if (!window.gsap || !window.ScrollTrigger || reduced()) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap");
  const hero = $(".hero");
  if (hero) {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".hero > img", { scale: 1.12 }, { scale: 1.02, duration: 2.8, ease: "power2.out" }, 0)
      .from(".hero .t > *", { y: 28, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.15);
    gsap.to(".hero > img", { yPercent: 10, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero .t", { y: -60, opacity: 0.25, ease: "none", scrollTrigger: { trigger: hero, start: "center center", end: "bottom top", scrub: true } });
  }
  // only what starts below the fold is hidden first, so nothing on screen blinks
  const rise = gsap.utils.toArray(".check-head, .check-grid, .block > h2, .block > .lede, .block > .panel, .onward > h2, .onward li, .chapters > section > h2, .chapters > section > .lede")
    .filter((el) => el.getBoundingClientRect().top > innerHeight);
  gsap.set(rise, { opacity: 0, y: 26 });
  ScrollTrigger.batch(rise, { start: "top 90%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity" }) });
  // clearProps: a leftover transform makes a stacking context, which trapped the search dropdown under the next section
}

(async function boot() {
  motion();
  try {
    [INDEX, FACTORS] = await Promise.all([getJSON("data/index.json"), getJSON("data/factors.json")]);
    CHAIN = await getJSON("data/deployment.json").catch(() => null);
  } catch (err) {
    $("main").insertAdjacentHTML("afterbegin", `<p class="bad">${esc(err.message)}.</p>`);
    return;
  }
  SHARD = INDEX.shard; rows = INDEX.rows;
  if ($("#ownerCount")) $("#ownerCount").textContent = fmt(rows.length);
  onchain = loadChecks();
  onchain.catch(() => {}); // pages without a chain view must not log an unhandled rejection
  if (ON_CHECK) setupSearch();
  story(INDEX.meta);
  market(INDEX.meta);
  hiddenSection();
  verifyPanel();
  liveFeed();
  registryFeed();
  // #buyer-N opens that buyer: on load, and from links on other pages (report, proof, data).
  const open = () => { const m = location.hash.match(/^#buyer-(\d+)$/); if (m && rows[+m[1]]) pick(+m[1]); };
  if (ON_CHECK) { addEventListener("hashchange", open); open(); }
  // Charts draw with the current theme's colours: redraw them when the theme changes.
  document.addEventListener("themechange", () => { market(INDEX.meta); hiddenSection(); if (CURRENT !== null) render(CURRENT, false); });
})();

/* ---------- live feed: new on-chain checks and double-claim flags appear without a reload ---------- */
function liveFeed() {
  const dot = $("#live");
  if (!dot || !CHAIN || !CHAIN.explorer) return; // proof page, public networks only
  let known = null, flags = null;
  const tick = async () => {
    try {
      const reg = await registry();
      const n = Number(await reg.count());
      // Reload every tick: a flag lands on an existing record, so the count alone never shows it.
      // ponytail: n + 1 RPC calls per tick; fine for tens of checks, read DoubleClaim events if it grows to hundreds
      const list = await loadChecks();
      const f = list.filter((c) => c.doubleClaim).length;
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

// What the claim says, held against the record. The full company result renders below it.
async function claimChecks(c, f) {
  const o = await owner(c.i);
  const year = f.year && f.year.value, stated = f.tonnes && f.tonnes.value;
  const inYear = year && o.ys[year] ? o.ys[year][0] : null;
  const words = `${f.claim_words?.value || ""} ${f.claim_words?.quote || ""}`;
  // TODO(human): which wording makes an offset-based neutrality claim (EU Directive 2024/825)?
  // server/registry-watch.js OFFSET_WORDS says "we offset X" alone is NOT one; this list still says it is.
  const EU_WORDS = /neutral|zero|positive|negative|compensat|offset|balanc/i;
  const eu = f.scope && ["product", "service", "event"].includes(f.scope.value) && EU_WORDS.test(words);
  return [
    year ? (inYear ? `In ${year}, ${esc(c.group)} retired <b>${mt(inYear)}</b> of credits${stated ? `; the claim says <b>${mt(stated)}</b>` : ""}.`
      : `No retirement by ${esc(c.group)} is recorded for ${year} on Verra or Gold Standard${stated ? `, yet the claim says <b>${mt(stated)}</b>` : ""}.`) : "",
    c.k ? `Roughly <b>${pct(c.e / c.k)}</b> of its researched credits are likely real.` : "None of its credits are in a project type with a research estimate.",
    c.rep ? `Offsets do not cut its own emissions: ${c.rep.scope1 != null ? `Scope 1 <b>${mt(c.rep.scope1)}</b>` : `<b>${mt(c.rep.total)}</b>`} in ${c.rep.year}.` : "",
    eu ? `<b>EU rule:</b> since 27 Sep 2026, Directive 2024/825 does not allow a product, service or event sold in the EU to be called climate neutral because of offsets. This claim reads as one.` : "",
  ].filter(Boolean).map((x) => `<li>${x}</li>`).join("");
}

function setupClaim() {
  const form = $("#claimForm"), out = $("#claimOut"), ta = $("#claimText");
  if (!form) return;
  const lede = $("#check .lede"), ledeCompany = lede.innerHTML;
  $("#claimExamples").addEventListener("click", (e) => { const b = e.target.closest("[data-ex]"); if (b) { ta.value = b.dataset.ex; form.requestSubmit(); } });
  const setMode = (claim) => {
    $("#modeCompany").setAttribute("aria-selected", String(!claim));
    $("#modeClaim").setAttribute("aria-selected", String(claim));
    $("#search").hidden = claim; $("#examples").hidden = claim;
    form.hidden = !claim; $("#claimExamples").hidden = !claim;
    lede.innerHTML = claim ? `Paste a green claim from an ad, a label or a report. AI reads who claims what, quoting your text; Netra holds it against the registry record. <a href="about.html#ai">How it works</a>` : ledeCompany;
    out.innerHTML = "";
    (claim ? ta : $("#q")).focus();
  };
  $("#modeCompany").addEventListener("click", () => setMode(false));
  $("#modeClaim").addEventListener("click", () => setMode(true));
  ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) form.requestSubmit(); });
  out.addEventListener("click", (e) => {
    const b = e.target.closest("[data-search]");
    if (b) { setMode(false); $("#q").value = b.dataset.search; $("#q").dispatchEvent(new Event("input")); }
  });
  const note = (msg, name = "") => `<div class="strip"><p>${msg}</p><button type="button" class="btn ghost" data-search="${esc(name)}">${name ? `Search “${esc(name)}” instead` : "Search by company name"}</button></div>`;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await companiesReady;
    const text = ta.value.trim();
    $("#result").hidden = true;
    if (text.length < 30) { out.innerHTML = `<div class="strip"><p>Paste at least one full sentence (30 characters or more).</p></div>`; return; }
    out.innerHTML = `<div class="strip"><p class="muted">Reading the claim…</p></div>`;
    let r;
    try {
      const res = await fetch("api/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
      r = await res.json().catch(() => ({ error: `The claim reader answered ${res.status}.` }));
      if (!res.ok) throw new Error(r.error || `HTTP ${res.status}`);
    } catch (err) {
      out.innerHTML = note(esc(err.message));
      return;
    }
    const f = r.fields, labels = { company: "Who", claim_words: "Says", scope: "Covers", year: "Year", tonnes: "Tonnes" };
    const found = f.company ? matchCompany(f.company.value) : null;
    if (!found) {
      out.innerHTML = note(f.company ? `The claim is by <b>${esc(f.company.value)}</b>, which is not one of the 94 company groups Netra has reviewed. Its registry record may still be listed.` : "No company could be read from this text with a supporting quote.", f.company?.value);
      return;
    }
    const read = Object.keys(labels).filter((k) => f[k]).map((k) => `<div><dt>${labels[k]}</dt><dd>${esc(k === "tonnes" ? mt(f[k].value) : f[k].value)}<span class="quote">“${esc(f[k].quote)}”</span></dd></div>`).join("");
    out.innerHTML = `<div class="strip claim-grid">
      <div><h3>The claim</h3><dl class="facts">${read}</dl></div>
      <div><h3>Against the record</h3><ul class="checks">${await claimChecks(found, f)}</ul></div>
      <p class="muted small full">Read by AI; each item is quoted from your text. Every figure comes from Netra's data. Full result for ${esc(found.group)} below.</p>
    </div>`;
    $("#q").value = rows[found.i][0];
    history.replaceState(null, "", `#buyer-${found.i}`);
    await render(found.i, false);
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
setupClaim();

/* ---------- live registry check: the newest Verra retirements, scored by server/registry-watch.js ---------- */
function registryFeed() {
  const dot = $("#regStatus");
  if (!dot) return;
  const ago = (d) => { const m = Math.max(0, Math.round((Date.now() - Date.parse(d + "Z")) / 60000)); return m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
  const CCP = { approved: "CCP-approved", not_approved: "Not approved", not_assessed: "Not assessed" };
  let newest = null;
  const tick = async () => {
    try {
      const s = await (await fetch("api/live", { cache: "no-store" })).json();
      if (!s.ok) throw new Error(s.error);
      const w = s.window;
      dot.className = "live on"; dot.textContent = "Live";
      $("#regWhen").textContent = `Checked ${ago(s.updated.replace("Z", "").slice(0, 19))} · ${w.n} newest retirements, ${ago(w.from)} to ${ago(w.to)}`;
      $("#regSum").innerHTML = `<b>${mt(w.t)}</b> retired in the ${w.n} newest retirements. Research covers <b>${mt(w.known)}</b> of it; about <b>${mt(w.eff)}</b> is likely real${w.known ? ` (${pct(w.eff / w.known)})` : ""}.${w.companies ? ` ${w.companies} name a company Netra has reviewed.` : ""}${w.eu ? ` <b>${w.eu}</b> of the newest notes call a product, service or event neutral because of offsets (not allowed for products sold in the EU since 27 Sep 2026).` : ""}${w.zombies ? ` <b>${w.zombies}</b> use credits 10 or more years old.` : ""}`;
      $("#regList").innerHTML = `<div class="tablewrap"><table><thead><tr><th>When</th><th>Tonnes</th><th>Project</th><th>Claimed for</th><th>Likely real</th><th>ICVCM</th></tr></thead><tbody>${s.items.slice(0, 12).map((x) => `<tr class="${newest && x.d > newest ? "fresh" : ""}">
        <td>${ago(x.d)}</td><td class="num" data-l="t">${fmt(x.q)}</td>
        <td>${esc(x.pn)}<br><span class="muted small">${esc(x.pid)} · ${esc(x.country || "")} · <a href="glossary.html#vintage" title="Vintage: the year the emission cut happened">vintage</a> ${esc(x.vintage || "?")}</span></td>
        <td>${x.co ? `<a href="${buyerHref(x.co.i)}">${esc(x.co.group)}</a>` : x.owner ? `<span data-raw>${esc(x.owner)}</span>` : `<span class="muted">Not named</span>`}${x.reason && x.reason.trim() !== (x.owner || "").trim() ? `<br><span class="muted small" data-raw>${esc(x.reason)}</span>` : ""}${x.radar?.eu ? `<br><span class="tag warn" title="Since 27 Sep 2026, a product, service or event sold in the EU may not be called neutral because of offsets (Directive 2024/825). Whether this one is sold in the EU is not checked.">Offset-based neutrality claim</span>` : ""}${x.zombie ? `<br><span class="tag" title="Vintage ${esc(x.vintage)}: the reduction happened 10 or more years before retirement">Zombie credit · ${esc(x.vintage)}</span>` : ""}</td>
        <td data-l="Likely real">${x.oar != null ? pct(x.oar) : `<span class="muted">${x.known ? "No estimate" : "New project"}</span>`}</td>
        <td data-l="ICVCM">${x.ccp ? CCP[x.ccp] : `<span class="muted">Not checked</span>`}</td></tr>`).join("")}</tbody></table></div>
        <p class="muted small">Source: ${esc(s.source)}. Likely real: Probst et al. 2024 by project type, as on every result; "New project" means the project is not in the Berkeley VROD snapshot yet. Offset-based neutrality claim: the retirement note, read by the AI claim reader with quotes, calls a product, service or event neutral (or zero, positive, compensated) because of offsets; since 27 Sep 2026 such claims are not allowed for products sold in the EU (Directive 2024/825), and Netra does not check where this one is sold. Zombie credit: vintage 10 or more years before retirement. Gold Standard is not included live.</p>`;
      if (newest && s.items[0].d !== newest) toast(`New retirement on Verra: ${fmt(s.items[0].q)} t, ${s.items[0].pn.slice(0, 48)}`);
      newest = s.items[0].d;
    } catch {
      dot.className = "live off"; dot.textContent = "Reconnecting";
    }
  };
  tick();
  setInterval(tick, 60000);
}

/* ---------- report: the chapter in view is marked in the table of contents ---------- */
(function toc() {
  const links = [...document.querySelectorAll(".toc a")];
  if (!links.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", String(a.hash === `#${e.target.id}`)));
  }), { rootMargin: "-35% 0px -60% 0px" });
  links.forEach((a) => { const t = document.querySelector(a.hash); if (t) io.observe(t); });
})();
