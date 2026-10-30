#!/usr/bin/env node
"use strict";

const { createRunner } = require("../src/runner.js");

const runner = createRunner({
  id: process.argv[2] || "runner-1",
  server: process.argv[3] || "donate.v2.xmrig.com:3333",
});

runner.start();
setTimeout(() => {
  console.log(JSON.stringify(runner.status(), null, 2));
  runner.stop();
  process.exit(0);
}, 3000);
