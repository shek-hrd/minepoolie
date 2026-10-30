"use strict";

const path = require("path");
const fs = require("fs");

function generate({ runnerId, server = "donate.v2.xmrig.com:3333" }) {
  const pkg = {
    runnerId,
    server,
    generatedAt: new Date().toISOString(),
    version: "1.0.0",
    files: [
      "bin/runner.js",
      "config/miner.config.json",
      "README.md",
    ],
    entry: "bin/runner.js",
  };

  const dir = path.join(process.cwd(), "dist", "deploy", runnerId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(
    path.join(dir, "bin", "runner.js"),
    `#!/usr/bin/env node\n"use strict";\nconsole.log("runner ${runnerId} deploying to ${server}");\n`,
    { recursive: true }
  );

  return pkg;
}

module.exports = { generate };
