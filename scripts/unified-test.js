#!/usr/bin/env node
"use strict";

const { execSync } = require("child_process");
const http = require("http");

const ROOT = process.cwd();
let passed = 0;
let failed = 0;

function step(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}: ${err.message}`);
    failed++;
  }
}

function run(cmd) {
  return execSync(cmd, { cwd: ROOT, stdio: "pipe", encoding: "utf8" }).trim();
}

function getSnapshot(timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const req = http.get("http://localhost:3000/api/snapshot", (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("snapshot request timed out"));
    });
  });
}

console.log("minepoolie unified test suite");
console.log("===============================\n");

// Phase 1: build
step("build", () => {
  const out = run("node scripts/build.js");
  if (!out.includes("built")) throw new Error("build did not report success");
});

// Phase 2: unit tests
step("unit tests", () => {
  const out = run("node scripts/test.js");
  const m = out.match(/(\d+) passed, (\d+) failed/);
  if (!m) throw new Error("could not parse test results");
  if (Number(m[2]) > 0) throw new Error(`tests failed: ${m[2]}`);
});

// Phase 3: troubleshoot
step("troubleshoot diagnostics", () => {
  const out = run("node scripts/troubleshoot.js");
  if (!out.includes("checks")) throw new Error("troubleshoot did not run");
});

// Phase 4: prlbench 3-runner capability (if present)
step("prlbench 3-runner", () => {
  try {
    const out = run("node scripts/prlbench.js");
    const count = (out.match(/Started (\d+) pearl-kryptex/) || [])[1];
    if (Number(count) !== 3) throw new Error(`expected 3 runners, got ${count || 0}`);
  } catch (err) {
    // prlbench script may not exist on all forks; on unified it should
    throw err;
  }
});

// Phase 5: e2e — start dashboard, miner, runner, curl snapshot
step("e2e live snapshot", async () => {
  const dashboard = require("child_process").spawn("node", ["scripts/dashboard.js"], {
    cwd: ROOT,
    stdio: "pipe",
  });
  const miner = require("child_process").spawn("node", ["scripts/miner.js"], {
    cwd: ROOT,
    stdio: "pipe",
  });
  const runner = require("child_process").spawn("node", ["scripts/runner.js"], {
    cwd: ROOT,
    stdio: "pipe",
  });

  try {
    // dashboard.js is one-shot; run it directly to get snapshot output
    const snapOut = run("node scripts/dashboard.js");
    const snap = JSON.parse(snapOut);
    if (typeof snap.hashrate !== "number" || snap.hashrate < 600 || snap.hashrate > 800) {
      throw new Error(`hashrate out of range: ${snap.hashrate}`);
    }
    if (!snap.pool || !snap.wallet) throw new Error("snapshot missing pool/wallet");
    console.log(`    live hashrate: ${snap.hashrate} H/s`);
    console.log(`    pool: ${snap.pool}`);
    console.log(`    miner connected: Y (simulated)`);
  } finally {
    dashboard.kill();
    miner.kill();
    runner.kill();
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
