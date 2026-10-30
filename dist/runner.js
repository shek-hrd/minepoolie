"use strict";

const { simulatedHashRate, share } = require("./miner.js");

function createRunner({ id, server }) {
  let running = false;
  let interval = null;
  let hashrate = 0;
  let shares = 0;
  const logs = [];
  const startedAt = Date.now();

  function log(msg) {
    const entry = `[${new Date().toISOString()}] ${msg}`;
    logs.push(entry);
    if (logs.length > 1000) logs.shift();
    return entry;
  }

  function benchmark() {
    hashrate = simulatedHashRate();
    return { id, server, hashrate, shares, uptime: Date.now() - startedAt };
  }

  function start() {
    if (running) return log(`runner ${id} already running on ${server}`);
    running = true;
    log(`runner ${id} started on ${server}`);
    interval = setInterval(() => {
      hashrate = simulatedHashRate();
      if (share()) {
        shares += 1;
        log(`share accepted (total ${shares})`);
      }
    }, 1000);
  }

  function stop() {
    if (!running) return log(`runner ${id} not running`);
    running = false;
    clearInterval(interval);
    log(`runner ${id} stopped`);
  }

  function status() {
    return {
      id,
      server,
      running,
      hashrate,
      shares,
      uptime: Date.now() - startedAt,
      logs: [...logs],
    };
  }

  return { id, server, start, stop, benchmark, status, log };
}

module.exports = { createRunner };
