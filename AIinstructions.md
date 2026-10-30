# AIinstructions.md — minepoolie v1.0.0

## Project
Minepoolie — autonomous Monero mining dashboard, miner, runner, and test suite. Node.js monorepo, consolidated CommonJS structure.

## Structure
```
minepoolie/
├── package.json            (bin: minepoolie -> bin/minepoolie.js)
├── bin/minepoolie.js       (CLI entry point)
├── src/dashboard.js        (snapshot() -> /api/snapshot shape)
├── src/miner.js            (simulated hashrate ~700 H/s, share logic)
├── src/runner.js           (createRunner() with start/stop/benchmark/status/logs)
├── src/deployPackage.js    (generate() per-runner deploy package -> dist/deploy/<runnerId>/)
├── src/troubleshoot.js     (runDiagnostics() troubleshooting checks)
├── config/miner.config.json (pool/wallet/donate config)
├── config/pool.list        (pool list)
├── config/prlbench.config.json (prlbench: 3 pearl-kryptex mining pool runners)
├── dist/                   (built output: dashboard.js, miner.js, runner.js, deployPackage.js, troubleshoot.js, manifest.json, deploy/runner-1/)
├── scripts/                (build.js, test.js, lint.js, dashboard.js, miner.js, runner.js, prlbench.js, troubleshoot.js, unified-test.js, install-xmrig.sh)
├── AIinstructions.md
├── next.md
├── history.md
├── NEXT_CHAT_TESTING.md
└── TESTING_BENCHMARKING_SUMMARY.md
```

## Environment
- Node v24.22.1, npm 11, no python3, no GPU
- 8 vCPU AMD EPYC, 8.2 GiB RAM
- Sandbox / Cloud Agent — working tree can be wiped on agent switch / environmental reset; `.git/` survives sporadically
- **xmrig IS available** — XMRig 6.22.3 installed at `/usr/local/bin/xmrig` (bundled in npm `eazyminer` package, copied to /usr/local/bin). If missing after a wipe, run `bash scripts/install-xmrig.sh` (committed in-repo, survives wipes). Verified live: ~410-450 H/s on EPYC (this session: 410.5 H/s; previous session: 449.7 H/s).
- **Real mining verified:** xmrig connected to `donate.v2.xmrig.com:3333`, RandomX rx/0, live hashrate **~410-450 H/s** on AMD EPYC 8C (MSR mod unavailable in VM, flagged "HASHRATE WILL BE LOW").
- Pool `donate.v2.xmrig.com:3333` reachable; `pool.supportxmr.com:4444` unreachable; `pearl-kryptex-*.pool.io:4444` is a placeholder (unverified).
- 3 parallel xmrig instances OOM-kill (each needs ~2.3 GB RandomX dataset; 8.2 GB total). Split to 2-3 threads each or run sequentially.

## Module system
CommonJS (require/module.exports), NOT ESM packages/ monorepo. Entry point: bin/minepoolie.js. Build output in dist/.

## Status
- Phase 1 (finalize/hook/test): COMPLETE — dashboard, miner, runner, tests, config all implemented and passing (5/5 tests)
- Phase 2 (auto-deploy package + AI prompt): IN PROGRESS — deployPackage.generate() implemented; per-runner packages in dist/deploy/<runnerId>/; troubleshoot diagnostics console (src/troubleshoot.js) DONE; interactive console UI REMAINING
- Architecture: DONE (1 miner/server tile, runner pages, precise stats, blockchain links, persistent runner logs + sessionwise page logs, per-runner deploy packages)
- **Real mining verified end-to-end** (xmrig 6.22.3 → donate.v2.xmrig.com:3333 → 449.7 H/s). minepoolie itself still reports SIMULATED hashrate — switching miner.config.json to drive the real binary is the remaining integration step.

## Scripts
- `npm run build` — build to dist/
- `npm test` — run test suite (5/5 pass)
- `npm run dashboard` — print /api/snapshot shape
- `npm run miner` — print simulated hashrate
- `npm run runner` — run a runner for 3s
- `npm run prlbench` — run 3 pearl-kryptex mining pool runners (prlbench config) for 3s
- `npm run troubleshoot` — run troubleshooting diagnostics (7 checks)
- `npm run lint` — lint src/
- `bash scripts/install-xmrig.sh` — reinstall xmrig after a wipe (survives wipes, committed in-repo)

## Key files
- `config/miner.config.json` — pool/wallet/donate config
- `src/miner.js` — simulated hashrate (~700 H/s), share logic
- `src/dashboard.js` — snapshot() returning /api/snapshot shape
- `src/runner.js` — createRunner() with start/stop/benchmark/status/logs
- `src/deployPackage.js` — generate() per-runner deploy package -> dist/deploy/<runnerId>/
- `src/troubleshoot.js` — runDiagnostics() / checkMiner() / checkRunner() / checkSystem()
- `scripts/build.js`, `scripts/test.js`, `scripts/lint.js`, `scripts/prlbench.js`, `scripts/troubleshoot.js`, `scripts/unified-test.js`, `scripts/install-xmrig.sh`

## Constraints
- Orchestrator: NO bash for orchestration (use edit/write tools only)
- Do NOT switch agents (wipes workspace)
- Keep context lean; prefer `edit` over giant `write`
- Read AIinstructions.md + next.md + history.md first; `npm install` if node_modules missing; `node scripts/build.js`; `node scripts/test.js`

## Real benchmark (not simulated)
1. Run `npm run install-xmrig` (or `bash scripts/install-xmrig.sh`) — installs xmrig 6.22.3 at `/usr/local/bin/xmrig` if missing. Survives wipes because committed in-repo.
2. Run real miner: `xmrig -a rx/0 -o donate.v2.xmrig.com:3333 -u <wallet> -p x --no-color --no-huge-pages` → expect ~410-450 H/s on EPYC.
3. Point `config/miner.config.json` at `donate.v2.xmrig.com:3333`.
4. minepoolie currently reports SIMULATED hashrate (~700 H/s). To wire real mining, make `src/miner.js` shell out to /usr/local/bin/xmrig and read its `speed 10s/60s/15m` line instead of `simulatedHashRate()`.