"use strict";
// Data page: company table (sort, filter, pick), comparison cards, project types, years.

const GRADE_ORDER = { A: 5, B: 4, C: 3, D: 2, E: 1 };
let ROWS = [], sortKey = "t", sortDir = -1, cmpOnScreen = false;
const picked = new Set();

const range = (lo, hi) => (lo === hi ? mt(lo) : `${mt(lo)}–${mt(hi)}`);

function prepare(c) {
  const g = grade(c.e, c.k, c.t);
  return { ...c, cover: c.k / c.t, real: c.k ? c.e / c.k : -1, g: g ? g[1] : "", gv: g ? GRADE_ORDER[g[1]] : 0, gc: g ? g[2] : "",
    ccpShare: c.ccp / c.t, s1: c.rep?.scope1 ?? -1, ctMid: c.ct ? (c.ct.low + c.ct.high) / 2 : -1 };
}

function gradeChip(r) {
  return r.g ? `<span class="chip-grade" data-g="${r.g}" style="background:var(${r.gc})">${r.g}</span>` : `<span class="muted">–</span>`;
}

function drawTable() {
  const q = $("#cq").value.trim().toLowerCase();
  const key = sortKey === "g" ? "gv" : sortKey;
  const list = ROWS.filter((r) => !q || r.group.toLowerCase().includes(q) || r.names.some((n) => n.toLowerCase().includes(q)))
    .sort((a, b) => (typeof a[key] === "string" ? a[key].localeCompare(b[key]) : a[key] - b[key]) * sortDir);
  $("#ccount").textContent = `${list.length} of ${ROWS.length}`;
  $("#ctable tbody").innerHTML = list.map((r) => `<tr>
    <td class="cmp-cell"><input type="checkbox" class="cmp-box" data-g="${esc(r.group)}" aria-label="Compare ${esc(r.group)}" title="Add to the comparison"${picked.has(r.group) ? " checked" : ""}></td>
    <td><div class="name-row">${logo(r.group, 32)}<div><a href="index.html#buyer-${r.i}"><b>${esc(r.group)}</b></a>${r.names.length > 1 || r.names[0] !== r.group ? `<div class="muted small aliases" data-raw title="${esc(r.names.join(" · "))}">${esc(r.names.join(" · "))}</div>` : ""}</div></div></td>
    <td class="num" data-l="Retired">${mt(r.t)}</td>
    <td class="num" data-l="Researched">${pct(r.cover)}</td>
    <td data-l="Likely real">${r.k ? `<div class="mini">${claimBar(r.e, r.el, r.eh, r.k)}</div><span class="num">${pct(r.real)}</span> <span class="muted small">(${pct(r.el / r.k)}–${pct(r.eh / r.k)})</span>` : `<span class="muted">no estimate</span>`}</td>
    <td>${gradeChip(r)}</td>
    <td class="num" data-l="Quality label">${pct(r.ccpShare)}</td>
    <td data-l="Own report, Scope 1">${r.rep?.scope1 != null ? `<a class="num" href="${esc(r.rep.url)}" target="_blank" rel="noopener">${mt(r.rep.scope1)}</a> <span class="muted small">${r.rep.year}</span>`
      : r.rep?.total ? `<a class="small" href="${esc(r.rep.url)}" target="_blank" rel="noopener">total ${mt(r.rep.total)}</a> <span class="muted small">${r.rep.year}</span>` : `<span class="gap-note" title="${esc(r.gap?.reason || "")}">not published</span>`}</td>
    <td data-l="Independent estimate">${r.ct ? `<span class="num">${range(r.ct.low, r.ct.high)}</span> <span class="muted small">${r.ct.year}</span>` : `<span class="muted">–</span>`}</td>
  </tr>`).join("");
  document.querySelectorAll("#ctable th button").forEach((b) => {
    b.closest("th").setAttribute("aria-sort", b.dataset.k === sortKey ? (sortDir < 0 ? "descending" : "ascending") : "none");
  });
}

function card(r) {
  return `<article class="ccard tinted" style="${tint(r.group, r.gc ? [0, r.g, r.gc] : null)}">
    <div class="ccard-head"><div class="name-row">${logo(r.group, 44)}<h3><a href="index.html#buyer-${r.i}">${esc(r.group)}</a></h3></div>${gradeChip(r)}</div>
    <p class="plain small-plain">${r.k
      ? `Retired <b>${mt(r.t)}</b>. Research covers ${mt(r.k)}; about <b>${mt(r.e)}</b> of that is likely real.`
      : `Retired <b>${mt(r.t)}</b>, none in a project type with a research estimate.`}</p>
    ${r.k ? claimBar(r.e, r.el, r.eh, r.k) : ""}
    <dl class="facts">
      <div><dt>Research range</dt><dd class="num">${r.k ? range(r.el, r.eh) : "–"}</dd></div>
      <div><dt>Quality label (CCP)</dt><dd class="num">${pct(r.ccpShare)}</dd></div>
      <div><dt>Own report, Scope 1</dt><dd>${r.rep?.scope1 != null ? `<span class="num">${mt(r.rep.scope1)}</span> (${r.rep.year})` : r.rep?.total ? `total ${mt(r.rep.total)} (${r.rep.year})` : "not published"}</dd></div>
      <div><dt>Independent estimate</dt><dd>${r.ct ? `<span class="num">${range(r.ct.low, r.ct.high)}</span> (${r.ct.year})` : "–"}</dd></div>
    </dl>
    ${r.rep ? `<p class="muted small">Source: <a href="${esc(r.rep.url)}" target="_blank" rel="noopener">${esc(r.rep.source)}</a></p>` : `<p class="muted small">No reported figure: ${esc(r.gap?.reason || "")}</p>`}
  </article>`;
}

function drawCompare() {
  const list = [...picked].map((g) => ROWS.find((r) => r.group === g)).filter(Boolean);
  $("#cmp").innerHTML = list.map(card).join("") || `<p class="muted">Nothing picked yet.</p>`;
  $("#cmpHint").textContent = picked.size >= 3 ? "Three picked. Untick one to swap it." : "Tick a company in the table above (up to three).";

}

function syncBoxes() {
  document.querySelectorAll("#ctable input.cmp-box").forEach((b) => { b.checked = picked.has(b.dataset.g); });
}

function syncTray() {
  $("#cmpTray").hidden = !picked.size || cmpOnScreen;
}

function drawTray() {
  const list = [...picked].map((g) => ROWS.find((r) => r.group === g)).filter(Boolean);
  $("#cmpTray").innerHTML = list.map((r) => `<span class="cmp-item">${logo(r.group, 24)}<span class="cmp-name">${esc(r.group)}</span><button type="button" class="cmp-x" data-g="${esc(r.group)}" aria-label="Remove ${esc(r.group)}">×</button></span>`).join("")
    + `<button type="button" class="cmp-go">Compare →</button>`;
  syncTray();
}

function refreshPicked() {
  syncBoxes();
  drawCompare();
  drawTray();
}

function staticTables(index, factors) {
  const m = index.meta;
  $("#overviewStats").innerHTML = [
    [mt(m.tonnes), "credits retired on Verra and Gold Standard since 2020"],
    [fmt(index.rows.length), "buyer accounts in the registry"],
    [pct(m.known / m.tonnes), "of tonnes come from project types with a research estimate"],
    [pct(m.eff / m.known), `of researched tonnes are likely real (range ${pct(m.eff_lo / m.known)}–${pct(m.eff_hi / m.known)})`],
    [pct((m.ccp.approved || 0) / m.tonnes), "use a methodology with the ICVCM quality label"],
    [String(ROWS.length), `company groups reviewed; ${ROWS.filter((r) => r.rep).length} with emissions from their own reports`],
  ].map(([b, s]) => `<div><dt class="num">${b}</dt><dd>${s}</dd></div>`).join("");

  $("#ttable tbody").innerHTML = Object.entries(m.cats).sort((a, b) => b[1] - a[1]).map(([c, t]) => {
    const f = factors.factors[c];
    return `<tr><td>${esc(f.label)}</td><td class="num">${mt(t)}</td><td class="num">${pct(t / m.tonnes)}</td>
      <td class="num">${f.oar === null ? `<span class="muted">no estimate</span>` : pct(f.oar)}</td>
      <td class="num">${f.oar === null ? "–" : `${pct(f.lo)}–${pct(f.hi)}`}</td><td class="small">${esc(f.source || "")}</td></tr>`;
  }).join("");

  $("#ytable tbody").innerHTML = Object.keys(m.ys).sort().map((y) => {
    const [t, e, k] = m.ys[y];
    return `<tr><td>${y}${y === "2026" ? " (to August)" : ""}</td><td class="num">${mt(t)}</td><td class="num">${pct(k / t)}</td><td class="num">${pct(e / k)}</td></tr>`;
  }).join("");
}

(async function boot() {
  let companies, index, factors;
  try {
    await logosReady;
    [companies, index, factors] = await Promise.all([getJSON("data/companies.json"), getJSON("data/index.json"), getJSON("data/factors.json")]);
  } catch (err) {
    $("#companies").insertAdjacentHTML("beforeend", `<p class="bad">${esc(err.message)}.</p>`);
    return;
  }
  ROWS = companies.map(prepare);
  ["Shell plc", "Delta Air Lines Inc", "Netflix, Inc."].forEach((g) => ROWS.some((r) => r.group === g) && picked.add(g));
  staticTables(index, factors);
  getJSON("data/anomalies.json").then((an) => {
    const rows = Object.entries(an.flags).sort((x, y) => y[1].score - x[1].score);
    $("#atable tbody").innerHTML = rows.map(([i, f]) => `<tr><td><a href="index.html#buyer-${i}" class="${/^0x/.test(index.rows[i][0]) ? "mono" : ""}">${esc(index.rows[i][0])}</a></td>
      <td><ul class="reasons">${f.reasons.map((r) => `<li>${esc(r[0].toUpperCase() + r.slice(1))}</li>`).join("")}</ul></td><td class="num">${f.score.toFixed(2)}</td></tr>`).join("");
    $("#ameta").textContent = `${an.meta.method}. Population: ${an.meta.population}. Reasons: ${an.meta.reason_rule}.`;
  }).catch(() => {});
  drawTable();
  drawCompare();
  drawTray();
  new IntersectionObserver(([e]) => {
    cmpOnScreen = e.isIntersecting;
    syncTray();
  }).observe($("#compare"));
  $("#cq").addEventListener("input", drawTable);
  $("#ctable thead").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-k]");
    if (!b) return;
    sortDir = b.dataset.k === sortKey ? -sortDir : b.dataset.k === "group" ? 1 : -1;
    sortKey = b.dataset.k;
    drawTable();
  });
  $("#ctable tbody").addEventListener("change", (e) => {
    const b = e.target.closest("input.cmp-box");
    if (!b) return;
    const g = b.dataset.g;
    if (b.checked) {
      if (picked.size >= 3) { b.checked = false; $("#cmpHint").textContent = "Three picked. Remove one first."; return; }
      picked.add(g);
    } else picked.delete(g);
    refreshPicked();
  });
  $("#cmpTray").addEventListener("click", (e) => {
    const x = e.target.closest("button.cmp-x");
    if (x) {
      picked.delete(x.dataset.g);
      refreshPicked();
      return;
    }
    if (e.target.closest("button.cmp-go")) $("#compare").scrollIntoView();
  });
})();
