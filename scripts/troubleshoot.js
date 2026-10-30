#!/usr/bin/env node
"use strict";

const { runDiagnostics } = require("../src/troubleshoot.js");

const diagnostics = runDiagnostics();

let failures = 0;
let warnings = 0;

console.log("minepoolie troubleshooting diagnostics");
console.log("======================================\n");

for (const d of diagnostics) {
  const mark = d.severity === "error" ? "✗" : d.severity === "warn" ? "⚠" : "✓";
  console.log(`${mark} [${d.severity.toUpperCase()}] ${d.title}`);
  console.log(`    detail: ${d.detail}`);
  console.log(`    suggestion: ${d.suggestion}\n`);
  if (d.severity === "error") failures += 1;
  if (d.severity === "warn") warnings += 1;
}

console.log(`summary: ${diagnostics.length} checks, ${failures} failed, ${warnings} warnings`);
process.exit(failures > 0 ? 1 : 0);
