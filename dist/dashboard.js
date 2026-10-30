"use strict";

const { loadConfig, simulatedHashRate } = require("./miner.js");

let shares = 0;
let startedAt = Date.now();

function snapshot() {
  const cfg = loadConfig();
  const hashrate = simulatedHashRate();
  return {
    timestamp: Date.now(),
    pool: cfg.pool,
    wallet: cfg.wallet,
    donate: cfg.donate,
    hashrate,
    shares,
    uptime: Date.now() - startedAt,
    simulated: true,
  };
}

function submitShare() {
  shares += 1;
  return { accepted: true, shares };
}

module.exports = {
  snapshot,
  submitShare,
  reset: () => {
    shares = 0;
    startedAt = Date.now();
  },
};
