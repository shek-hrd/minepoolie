#!/usr/bin/env node
"use strict";

const { loadConfig, simulatedHashRate } = require("../src/miner.js");

const cfg = loadConfig();
console.log(`minepoolie miner — pool: ${cfg.pool}`);
console.log(`simulated hashrate: ${simulatedHashRate()} H/s`);
console.log(`donate: ${cfg.donate}%`);
