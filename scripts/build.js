#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
}

function readFile(file) {
  return fs.readFileSync(file, "utf8");
}

function main() {
  const start = Date.now();

  // Build output directory
  ensureDir(DIST);

  // Copy/minify source into dist
  if (fs.existsSync(SRC)) {
    for (const entry of fs.readdirSync(SRC, { withFileTypes: true })) {
      const srcPath = path.join(SRC, entry.name);
      const distPath = path.join(DIST, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, distPath);
      } else {
        writeFile(distPath, readFile(srcPath));
      }
    }
  }

  // Write a build manifest
  const manifest = {
    name: require(path.join(ROOT, "package.json")).name,
    version: require(path.join(ROOT, "package.json")).version,
    builtAt: new Date().toISOString(),
    node: process.version,
    files: listFiles(DIST),
  };
  writeFile(path.join(DIST, "manifest.json"), JSON.stringify(manifest, null, 2));

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`[build] minepoolie v${manifest.version} built in ${elapsed}s`);
  console.log(`[build] output: ${DIST}`);
  console.log(`[build] files: ${manifest.files.length}`);
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      writeFile(d, readFile(s));
    }
  }
}

function listFiles(dir, prefix = "") {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files = files.concat(listFiles(p, rel));
    } else {
      files.push(rel);
    }
  }
  return files;
}

main();
