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

// Sections and cards rise in once as they scroll into view; numbers count up as they arrive.
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
function countUp(el) {
  const m = el.textContent.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/s);
  if (calm || !m || el.dataset.counted) return;
  el.dataset.counted = "1";
  const [, pre, num, post] = m, end = parseFloat(num.replace(/,/g, "")), dec = (num.split(".")[1] || "").length, comma = num.includes(",");
  const t0 = performance.now(), dur = 1100;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - k, 3));
    const s = v.toFixed(dec);
    el.textContent = pre + (comma ? Number(s).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : s) + post;
    if (k < 1) requestAnimationFrame(step); else el.textContent = pre + num + post;
  };
  requestAnimationFrame(step);
}
const revealer = "IntersectionObserver" in window
  ? new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll(".stat b, .stat.big b").forEach(countUp);
      if (e.target.matches(".stat")) e.target.querySelectorAll("b").forEach(countUp);
      revealer.unobserve(e.target);
    }), { rootMargin: "0px 0px -8% 0px" })
  : null;
function reveal(root = document) {
  if (!revealer || !root.querySelectorAll) return;
  root.querySelectorAll(".block, .stat, .box, .panel, .term, .ccard, .timeline li, .flow li, .strip, .kind, .catrow").forEach((el) => {
    if (el.classList.contains("reveal")) return;
    el.classList.add("reveal");
    revealer.observe(el);
  });
}
// Content rendered later (results, charts, live rows) gets the same entrance.
const revealLater = () => new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && reveal(n.parentElement || n))))
  .observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { setupTheme(); reveal(); revealLater(); });
else { setupTheme(); reveal(); revealLater(); }

// Claimed-vs-real bar: outline = claimed (k), hatched = research range, filled = best estimate.
function claimBar(e, el, eh, k) {
  return `<div class="claimbar" role="img" aria-label="Best estimate ${pct(e / k)} likely real, research range ${pct(el / k)} to ${pct(eh / k)}">
    <span class="range" style="width:${(eh / k * 100).toFixed(1)}%"></span><span class="real" style="width:${(e / k * 100).toFixed(1)}%"></span></div>`;
}
