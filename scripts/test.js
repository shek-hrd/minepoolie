#!/usr/bin/env node
"use strict";

const path = require("path");

const ROOT = process.cwd();
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}: ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "assertion failed");
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || "expected"}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
  }
}

console.log("minepoolie test suite");
console.log("=====================\n");

// Phase 1: config tests
test("config loads miner.config.json", () => {
  const cfgPath = path.join(ROOT, "config", "miner.config.json");
  const cfg = require(cfgPath);
  assert(cfg.pool, "pool missing");
  assert(cfg.wallet, "wallet missing");
  assert(typeof cfg.donate === "number", "donate must be a number");
});

// Phase 1: miner tests
test("miner.simulatedHashRate returns ~700 H/s", () => {
  const { simulatedHashRate } = require(path.join(ROOT, "src", "miner.js"));
  const h = simulatedHashRate();
  assert(typeof h === "number", "hashrate must be a number");
  assert(h >= 600 && h <= 800, `hashrate out of range: ${h}`);
});

// Phase 1: dashboard tests
test("dashboard.snapshot shape", () => {
  const { snapshot } = require(path.join(ROOT, "src", "dashboard.js"));
  const s = snapshot();
  assert(typeof s.timestamp === "number", "timestamp missing");
  assert(typeof s.hashrate === "number", "hashrate missing");
  assert(typeof s.shares === "number", "shares missing");
});

// Phase 1: runner tests
test("runner.createRunner returns runner object", () => {
  const { createRunner } = require(path.join(ROOT, "src", "runner.js"));
  const r = createRunner({ id: "runner-1", server: "donate.v2.xmrig.com:3333" });
  assert(r.id === "runner-1", "runner id mismatch");
  assert(typeof r.benchmark === "function", "benchmark missing");
  assert(typeof r.stop === "function", "stop missing");
});

// Phase 2: package tests
test("deployPackage.generate returns object", () => {
  const { generate } = require(path.join(ROOT, "src", "deployPackage.js"));
  const pkg = generate({ runnerId: "runner-1" });
  assert(typeof pkg === "object", "package must be object");
  assert(pkg.runnerId === "runner-1", "runnerId mismatch");
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
