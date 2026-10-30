#!/usr/bin/env node
"use strict";

const { createRunner } = require("../src/runner.js");
const config = require("../config/prlbench.config.json");

const runners = config.runners.map(({ id, server }) => createRunner({ id, server }));

runners.forEach((runner) => runner.start());

console.log(`Started ${runners.length} pearl-kryptex mining pool runners:`);
runners.forEach((runner) => {
  console.log(`- ${runner.id} -> ${runner.server}`);
});

setTimeout(() => {
  console.log("\n--- Runner statuses ---");
  runners.forEach((runner) => {
    console.log(JSON.stringify(runner.status(), null, 2));
  });
  runners.forEach((runner) => runner.stop());
  process.exit(0);
}, 3000);
