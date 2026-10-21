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

// Claimed-vs-real bar: outline = claimed (k), hatched = research range, filled = best estimate.
function claimBar(e, el, eh, k) {
  return `<div class="claimbar" role="img" aria-label="Best estimate ${pct(e / k)} likely real, research range ${pct(el / k)} to ${pct(eh / k)}">
    <span class="range" style="width:${(eh / k * 100).toFixed(1)}%"></span><span class="real" style="width:${(e / k * 100).toFixed(1)}%"></span></div>`;
}
