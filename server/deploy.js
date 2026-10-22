// Pull-based deploy. Runs ON the VPS under runit (/etc/service/netra-deploy): no inbound access, no secrets.
// Every minute: ask GitHub for the newest commit of main (ETag, so an unchanged repo costs no rate limit),
// download it, self-check, copy the files into the live dirs, restart only the services whose files changed,
// roll back if a service does not stay up. Node 18+, no dependencies.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REPO = "rofiperlungoding/climatechain-id", APPS = "/root/apps", STATE = `${APPS}/netra-deploy/sha`;
const HEAD = { "user-agent": "netra-deploy", accept: "application/vnd.github.sha" };
// repo path (file or dir) -> live dir; sv = runit service to restart when a file changed
const TARGETS = [
  { src: "web", dir: `${APPS}/netra/web` },
  { src: ["server/claim-api.js", "server/registry-watch.js"], dir: `${APPS}/netra-api`, sv: "netra-api" },
  { src: ["contracts/scripts/live-watcher.js", "contracts/scripts/merkle.js"], dir: `${APPS}/netra-watcher`, sv: "netra-watcher" },
  { src: "server/deploy.js", dir: `${APPS}/netra-deploy`, sv: "netra-deploy" }, // last: restarts this process
];
const run = (cmd, ...args) => execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const log = (o) => console.log(JSON.stringify({ t: new Date().toISOString(), ...o }));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const same = (a, b) => fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b));
const up = (sv) => /^run: .*\) (\d+)s/.exec(run("sv", "status", sv))?.[1] >= 3; // up and not crash-looping

async function deploy(sha) {
  const tmp = fs.mkdtempSync("/tmp/netra-deploy-");
  try {
    const tgz = `${tmp}.tgz`;
    const r = await fetch(`https://codeload.github.com/${REPO}/tar.gz/${sha}`, { headers: { "user-agent": "netra-deploy" } });
    if (!r.ok) throw new Error(`download ${r.status}`);
    fs.writeFileSync(tgz, Buffer.from(await r.arrayBuffer()));
    run("tar", "-xzf", tgz, "-C", tmp, "--strip-components=1");
    fs.rmSync(tgz);

    // self-check before anything live is touched
    for (const f of TARGETS.flatMap((t) => [].concat(t.src)).filter((f) => f.endsWith(".js"))) run("node", "--check", `${tmp}/${f}`);
    run("node", `${tmp}/server/claim-api.js`, "--check");

    for (const t of TARGETS) {
      const files = [].concat(t.src);
      if (!t.sv) { run("cp", "-a", `${tmp}/${t.src}/.`, `${t.dir}/`); log({ event: "copied", src: t.src }); continue; }
      const changed = files.filter((f) => !same(`${tmp}/${f}`, `${t.dir}/${path.basename(f)}`));
      if (!changed.length) continue;
      for (const f of changed) {
        const live = `${t.dir}/${path.basename(f)}`;
        if (fs.existsSync(live)) fs.copyFileSync(live, `${live}.prev`);
        fs.copyFileSync(`${tmp}/${f}`, live);
      }
      if (t.sv === "netra-deploy") { fs.writeFileSync(STATE, sha); run("sv", "restart", t.sv); return; }
      run("sv", "restart", t.sv);
      await sleep(4000);
      if (!up(t.sv)) {
        for (const f of changed) { const live = `${t.dir}/${path.basename(f)}`; if (fs.existsSync(`${live}.prev`)) fs.copyFileSync(`${live}.prev`, live); }
        run("sv", "restart", t.sv);
        throw new Error(`${t.sv} did not stay up, rolled back`);
      }
      log({ event: "restarted", sv: t.sv, files: changed });
    }
    fs.writeFileSync(STATE, sha);
    log({ event: "deployed", sha });
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

async function main() {
  let etag = "", failed = "";
  for (;;) {
    try {
      const r = await fetch(`https://api.github.com/repos/${REPO}/commits/main`, { headers: { ...HEAD, ...(etag && { "if-none-match": etag }) } });
      if (r.status === 200) {
        etag = r.headers.get("etag");
        const sha = (await r.text()).trim();
        const done = fs.existsSync(STATE) && fs.readFileSync(STATE, "utf8").trim();
        if (sha !== done && sha !== failed) { try { await deploy(sha); } catch (e) { failed = sha; log({ event: "failed", sha, error: String(e.message || e).slice(0, 300) }); } }
      } else if (r.status !== 304) log({ event: "github", status: r.status });
    } catch (e) { log({ event: "poll_error", error: String(e.message || e) }); }
    await sleep(60000);
  }
}
main();
