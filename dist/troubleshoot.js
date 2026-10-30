"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const CONFIG_PATH = path.join(process.cwd(), "config", "miner.config.json");
const POOL_LIST = path.join(process.cwd(), "config", "pool.list");

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch (err) {
    return { error: err.message };
  }
}

function checkMiner() {
  const cfg = loadConfig();
  const checks = [];
  checks.push({
    severity: cfg.error ? "error" : "info",
    title: "miner config",
    detail: cfg.error
      ? `failed to load miner config: ${cfg.error}`
      : `pool=${cfg.pool} wallet=${cfg.wallet} donate=${cfg.donate}% algo=${cfg.algorithm} threads=${cfg.threads}`,
    suggestion: cfg.error ? "create config/miner.config.json with pool, wallet, and algorithm" : "verify pool reachability",
  });

  const { simulatedHashRate } = require("./miner.js");
  const h = simulatedHashRate();
  checks.push({
    severity: h >= 600 && h <= 800 ? "ok" : "warn",
    title: "simulated hashrate",
    detail: `${h} H/s (expected ~700 H/s)`,
    suggestion: h >= 600 && h <= 800 ? "none" : "check miner simulatedHashrate config",
  });

  return checks;
}

function checkRunner() {
  const checks = [];
  try {
    const { createRunner } = require("./runner.js");
    const r = createRunner({ id: "diag-runner", server: "donate.v2.xmrig.com:3333" });
    const b = r.benchmark();
    checks.push({
      severity: typeof b.hashrate === "number" && b.hashrate > 0 ? "ok" : "error",
      title: "runner benchmark",
      detail: `runner=${b.id} server=${b.server} hashrate=${b.hashrate} H/s`,
      suggestion: "verify src/runner.js createRunner exports",
    });
  } catch (err) {
    checks.push({
      severity: "error",
      title: "runner benchmark",
      detail: `runner module failed: ${err.message}`,
      suggestion: "ensure src/runner.js exists and exports createRunner",
    });
  }
  return checks;
}

function checkSystem() {
  const checks = [];
  checks.push({
    severity: "ok",
    title: "node version",
    detail: process.version,
    suggestion: "none",
  });
  checks.push({
    severity: os.platform() === "linux" ? "ok" : "info",
    title: "platform",
    detail: `${os.platform()} ${os.release()} (${os.arch()})`,
    suggestion: "none",
  });
  checks.push({
    severity: fs.existsSync(CONFIG_PATH) ? "ok" : "warn",
    title: "config directory",
    detail: CONFIG_PATH,
    suggestion: "create config/miner.config.json",
  });
  checks.push({
    severity: fs.existsSync(POOL_LIST) ? "ok" : "warn",
    title: "pool list",
    detail: POOL_LIST,
    suggestion: "create config/pool.list",
  });
  return checks;
}

function runDiagnostics(ctx = {}) {
  const diagnostics = [];
  diagnostics.push(...checkMiner());
  diagnostics.push(...checkRunner());
  diagnostics.push(...checkSystem());
  return diagnostics;
}

module.exports = { runDiagnostics, checkMiner, checkRunner, checkSystem };
