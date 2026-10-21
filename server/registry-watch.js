// Live registry check: reads the newest retirements from Verra's public registry (S&P Global Platts platform)
// and scores each one with Netra's own rules: the project's resolved category (web/data/projects.json, built by
// pipeline/build.py) gives the research share likely real; ICVCM status comes from the same file. A project that
// is not in the Berkeley VROD snapshot gets no estimate. Beneficiary names are matched only to the 94 reviewed
// company groups, by exact normalized name. Used by claim-api.js: GET /api/live.
"use strict";

const REGISTRY = "https://prod-us.api.platts.com/ci-raas-prod/raas-report-api/es/public/retirements/publicReportPageSearch";
// The same headers the public Verra registry site sends; appkey is the site's public client key.
const HEADERS = { "content-type": "application/json", accept: "application/json", language: "en", registry: "VERRA",
  standardId: "150000000000001", standardAcronym: "VCS", appkey: "wOKHFGuxKApQaujPSKgF", application: "Markit",
  "X-XSRF-TOKEN": "t20", cookie: "XSRF-TOKEN=t20", origin: "https://registry.verra.org" };
const BATCH = 200, SHOW = 40, EVERY_MS = 10 * 60 * 1000;

const norm = (s) => String(s || "").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/^\s*(retired\s+)?on behalf of\s+/, "").replace(/\(.*?\)/g, " ")
  .replace(/\b(inc|plc|ag|sa|spa|se|ltd|limited|llc|corp|corporation|co|group|holdings?|the|company|gmbh|nv|bv)\b/g, " ")
  .replace(/[^a-z0-9]+/g, " ").trim();

let ref = null; // { projects, factors, names }
let state = { ok: false, updated: null, error: "Not checked yet." };

async function loadRef(site) {
  const get = async (p) => (await fetch(`${site}/data/${p}`, { signal: AbortSignal.timeout(20000) })).json();
  const [projects, f, companies] = await Promise.all([get("projects.json"), get("factors.json"), get("companies.json")]);
  const names = new Map();
  for (const c of companies) for (const n of [c.group, ...c.names]) if (norm(n).length >= 3) names.set(norm(n), { group: c.group, i: c.i });
  return { projects, factors: f.factors, names };
}

// One registry row, scored. Exported for the self-check.
function score(r, R) {
  const pid = `VCS${r.projectId}`, p = R.projects[pid];
  const f = p ? R.factors[p[0]] : null;
  return { d: r.retiredDate, q: r.holdingQuantity, pid, pn: r.publicProjectName || r.projectName, country: r.countryName,
    meth: r.methodologies, vintage: r.vintage, owner: r.makeBeneficialOwnerPublic === false ? null : r.beneficialOwner || null,
    reason: r.makeRetirementReasonDetailsPublic === false ? null : (r.retirementReasonDetails || "").slice(0, 200) || null,
    known: !!p, label: f ? f.label : null, oar: f && f.oar != null ? f.oar : null, ccp: p ? p[1] : null,
    co: R.names.get(norm(r.beneficialOwner)) || null };
}

async function poll(site) {
  try {
    ref = ref || await loadRef(site);
    const res = await fetch(REGISTRY, { method: "POST", headers: HEADERS, signal: AbortSignal.timeout(30000),
      body: JSON.stringify({ searchFilter: { pagination: { start: 0, limit: BATCH, sortOptions: [{ sort: "retiredDate", dir: "DESC" }] }, filterModel: {} } }) });
    if (!res.ok) throw new Error(`registry ${res.status}`);
    const rows = ((await res.json()).entities || []).map((r) => score(r, ref));
    if (!rows.length) throw new Error("registry returned no rows");
    const sum = (xs, fn) => xs.reduce((a, x) => a + fn(x), 0);
    const researched = rows.filter((x) => x.oar != null);
    state = { ok: true, updated: new Date().toISOString(), source: "Verra Registry, public retirements (registry.verra.org)",
      window: { n: rows.length, from: rows[rows.length - 1].d, to: rows[0].d, t: sum(rows, (x) => x.q),
        known: sum(researched, (x) => x.q), eff: Math.round(sum(researched, (x) => x.q * x.oar)),
        companies: rows.filter((x) => x.co).length },
      items: rows.slice(0, SHOW) };
    console.log(JSON.stringify({ t: state.updated, event: "registry", rows: rows.length, newest: rows[0].d }));
  } catch (e) {
    state = { ...state, ok: false, error: String(e.message || e), failedAt: new Date().toISOString() };
    console.log(JSON.stringify({ t: new Date().toISOString(), event: "registry", error: state.error }));
  }
}

function start(site) { poll(site); setInterval(() => poll(site), EVERY_MS).unref(); }

module.exports = { start, latest: () => state, score, norm };

if (require.main === module) {
  // self-check: a REDD+ project in the snapshot gets its research share; an unknown project gets none; names match exactly
  const R = { projects: { VCS1650: ["redd", "not_approved"] }, factors: { redd: { label: "Avoided deforestation (REDD+)", oar: 0.247 } },
    names: new Map([[norm("Shell"), { group: "Shell plc", i: 2 }]]) };
  const a = score({ projectId: 1650, holdingQuantity: 100, beneficialOwner: "Retired on behalf of Shell" }, R);
  const b = score({ projectId: 9999, holdingQuantity: 5, beneficialOwner: "Shellfish Ltd" }, R);
  if (a.oar !== 0.247 || a.ccp !== "not_approved" || a.co?.group !== "Shell plc" || b.known || b.oar !== null || b.co) throw new Error("registry-watch self-check failed");
  console.log("ok");
}
