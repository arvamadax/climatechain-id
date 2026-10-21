// Canonical JSON: object keys sorted recursively (Array.prototype.sort, UTF-16 order); arrays keep order; compact.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = { canonicalJSON: factory() };
  else root.canonicalJSON = factory();
})(typeof self !== "undefined" ? self : this, function () {
  return function canonicalJSON(value) {
    if (Array.isArray(value)) return "[" + value.map(canonicalJSON).join(",") + "]";
    if (value !== null && typeof value === "object")
      return "{" + Object.keys(value).sort().map((k) => JSON.stringify(k) + ":" + canonicalJSON(value[k])).join(",") + "}";
    return JSON.stringify(value);
  };
});
