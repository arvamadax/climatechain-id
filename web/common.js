"use strict";
// Shared by every page: formatting, grades, data loading.

const GRADES = [[0.6, "A", "--a"], [0.4, "B", "--b"], [0.2, "C", "--c"], [0.1, "D", "--d"], [0, "E", "--e"]];

const $ = (s) => document.querySelector(s);
const fmt = (n) => Math.round(n).toLocaleString("en-US");
const mt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + " Mt" : n >= 1e3 ? (n / 1e3).toFixed(1) + " kt" : fmt(n) + " t");
const pct = (x) => (x * 100).toFixed(x < 0.1 && x > 0 ? 1 : 0) + "%";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

// Grade from likely-real tonnes e, research-covered tonnes k, total t. None when research covers under 25%.
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

// Company logo tile and brand-to-grade gradient. LOGOS = data/logos.json {group: {src, color}}.
let LOGOS = {};
const logosReady = getJSON("data/logos.json").then((x) => (LOGOS = x)).catch(() => {});
function logo(group, size = 40) {
  const l = LOGOS[group];
  const initials = group.replace(/\(.*?\)/g, "").split(/[\s&+-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return l ? `<span class="logo" style="--s:${size}px"><img src="${esc(l.src)}" alt="" loading="lazy" width="${size}" height="${size}"></span>`
    : `<span class="logo initials" style="--s:${size}px" aria-hidden="true">${esc(initials)}</span>`;
}
// Inline style for a card tinted from the company's brand colour into its grade colour.
function tint(group, g) {
  const brand = LOGOS[group]?.color || "var(--ink)";
  const gc = g ? `var(${g[2]})` : "var(--na)";
  return `--brand:${brand};--gradec:${gc}`;
}

// Theme switch (light by default; the choice is remembered on this device only).
function setupTheme() {
  const btn = document.querySelector(".theme");
  if (!btn) return;
  const sync = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };
  btn.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    if (dark) document.documentElement.dataset.theme = "dark"; else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("netra-theme", dark ? "dark" : "light"); } catch {}
    sync();
    document.dispatchEvent(new Event("themechange"));
  });
  sync();
}

// Motion: numbers are always written at their final value (no count-up). Story graphics (.story: the report
// funnel and trend) get .in once when they scroll into view and play their one animation; nothing else fades in.
const storyIO = "IntersectionObserver" in window
  ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); storyIO.unobserve(e.target); } }), { rootMargin: "0px 0px -15% 0px" })
  : null;
function watchStories() {
  document.querySelectorAll(".story:not(.in)").forEach((el) => (storyIO ? storyIO.observe(el) : el.classList.add("in")));
}
// Details opened by a link to something inside them (about page sections).
function openTarget() {
  const t = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  const d = t && (t.closest("details") || t.querySelector(":scope > details"));
  if (d) { d.open = true; t.scrollIntoView(); }
}
// T8: dictionary card on [data-term] words. The glossary is parsed once; if it cannot load, the words stay plain.
const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
let glossDoc, gCard, gWord, gHover, gLeave, gShown;
function gHide() {
  clearTimeout(gHover); clearTimeout(gLeave);
  if (!gCard || !gWord) return;
  gCard.hidden = true; gCard.classList.remove("in");
  gWord.removeAttribute("aria-describedby"); gWord = null;
}
function gPlace(el) {
  const r = el.getBoundingClientRect(), w = gCard.offsetWidth, h = gCard.offsetHeight;
  const x = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), innerWidth - w - 12);
  const below = r.bottom + 6, y = below + h > innerHeight - 12 ? r.top - h - 6 : below;
  gCard.style.left = `${x}px`; gCard.style.top = `${Math.max(12, y)}px`;
}
function gShow(el) {
  gWord = el;
  (glossDoc = glossDoc || fetch("glossary.html").then((r) => r.text()).then((t) => new DOMParser().parseFromString(t, "text/html")).catch(() => null)).then((doc) => {
    const id = CSS.escape(el.dataset.term), term = doc && doc.querySelector(`#${id} > dt`);
    if (!term || gWord !== el) return gHide();
    gCard.querySelector("b").textContent = term.textContent.trim();
    gCard.querySelector("p").textContent = (doc.querySelector(`#${id} dd > p`) || {}).textContent?.trim() || "";
    gCard.querySelector("a").href = `glossary.html#${el.dataset.term}`;
    gCard.hidden = false; el.setAttribute("aria-describedby", gCard.id);
    gShown = performance.now(); gPlace(el); requestAnimationFrame(() => gCard.classList.add("in"));
  });
}
function glossTips() {
  document.querySelectorAll("[data-term]").forEach((el) => {
    if (el.classList.contains("gl")) return;
    el.classList.add("gl");
    if (!el.matches("a[href], button, input, select, textarea, summary, [tabindex]")) el.tabIndex = 0;
    el.addEventListener("pointerenter", () => { if (canHover) gHover = setTimeout(() => gShow(el), 450); });
    el.addEventListener("pointerleave", () => { clearTimeout(gHover); if (canHover && gWord === el) gLeave = setTimeout(gHide, 150); });
    el.addEventListener("focus", () => gShow(el));
    el.addEventListener("blur", () => gHide());
    el.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") gShow(el); });
  });
  if (gCard) return;
  gCard = document.createElement("div");
  gCard.id = "glossCard"; gCard.className = "gloss-card"; gCard.hidden = true;
  gCard.setAttribute("role", "tooltip");
  gCard.innerHTML = "<b></b><p></p><a>In the glossary →</a>";
  document.body.append(gCard);
  gCard.addEventListener("pointerenter", () => clearTimeout(gLeave));
  gCard.addEventListener("pointerleave", () => { if (gWord) gLeave = setTimeout(gHide, 150); });
  addEventListener("scroll", () => { if (performance.now() - gShown > 200) gHide(); }, { passive: true, capture: true });
  addEventListener("keydown", (e) => { if (e.key === "Escape") gHide(); });
  addEventListener("pointerdown", (e) => { if (gWord && !e.target.closest("[data-term]") && !gCard.contains(e.target)) gHide(); });
}
function pageBoot() { setupTheme(); watchStories(); openTarget(); glossTips(); addEventListener("hashchange", openTarget); }
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pageBoot); else pageBoot();

// Claimed-vs-real bar: outline = claimed (k), hatched = research range, filled = best estimate.
function claimBar(e, el, eh, k) {
  return `<div class="claimbar" role="img" aria-label="Best estimate ${pct(e / k)} likely real, research range ${pct(el / k)} to ${pct(eh / k)}">
    <span class="range" style="width:${(eh / k * 100).toFixed(1)}%"></span><span class="real" style="width:${(e / k * 100).toFixed(1)}%"></span></div>`;
}
