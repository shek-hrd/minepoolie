"use strict";

const path = require("path");

const CONFIG_PATH = path.join(process.cwd(), "config", "miner.config.json");

function loadConfig() {
  const raw = require("fs").readFileSync(CONFIG_PATH, "utf8");
  return JSON.parse(raw);
}

function simulatedHashRate() {
  // Simulated RandomX hashrate ~700 H/s (real xmrig unavailable in sandbox)
  const base = 700;
  const jitter = (Math.random() * 40 - 20);
  return Math.round(base + jitter);
}

function share() {
  return Math.random() < 0.02;
}

module.exports = {
  loadConfig,
  simulatedHashRate,
  share,
  CONFIG_PATH,
};
