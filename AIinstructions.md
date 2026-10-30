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
├── config/miner.config.json (pool/wallet/donate config)
├── config/pool.list        (pool list)
├── config/prlbench.config.json (prlbench: 3 pearl-kryptex mining pool runners)
├── dist/                   (built output: dashboard.js, miner.js, runner.js, deployPackage.js, manifest.json, deploy/runner-1/)
├── scripts/                (build.js, test.js, lint.js, dashboard.js, miner.js, runner.js)
├── AIinstructions.md
├── next.md
└── history.md
```

## Environment
- Node v24.22.1, npm 11, no python3, no GPU
- 8 vCPU AMD EPYC, 8.2 GiB RAM
- Sandbox / Cloud Agent — working tree can be wiped on agent switch / environmental reset; `.git/` survives sporadically
- xmrig v6.26.0 not installed in sandbox; RandomX ~700 H/s simulated
- Pool donate.v2.xmrig.com:3333 reachable; pool.supportxmr.com:4444 unreachable

## Module system
CommonJS (require/module.exports), NOT ESM packages/ monorepo. Entry point: bin/minepoolie.js. Build output in dist/.

## Status
- Phase 1 (finalize/hook/test): COMPLETE — dashboard, miner, runner, tests, config all implemented and passing (6/6 tests)
- Phase 2 (auto-deploy package + AI prompt): IN PROGRESS — deployPackage.generate() implemented; per-runner packages in dist/deploy/<runnerId>/; troubleshooting console UI (src/troubleshoot) NOT yet built — remaining
- Architecture: DONE (1 miner/server tile, runner pages, precise stats, blockchain links, persistent runner logs + sessionwise page logs, per-runner deploy packages)
- E2E tested: build ok, 6 tests pass, dashboard:3000 + miner 720 H/s simulated, autoconnect WS, runner benchmarks, deployPackage per-runner packages in dist/deploy/

## Scripts
- `npm run build` — build to dist/
- `npm test` — run test suite (6/6 pass)
- `npm run dashboard` — print /api/snapshot shape
- `npm run miner` — print simulated hashrate
- `npm run runner` — run a runner for 3s
- `npm run prlbench` — run 3 pearl-kryptex mining pool runners (prlbench config) for 3s
- `npm run lint` — lint src/

## Key files
- `config/miner.config.json` — pool/wallet/donate config
- `src/miner.js` — simulated hashrate (~700 H/s), share logic
- `src/dashboard.js` — snapshot() returning /api/snapshot shape
- `src/runner.js` — createRunner() with start/stop/benchmark/status/logs
- `src/deployPackage.js` — generate() per-runner deploy package -> dist/deploy/<runnerId>/
- `scripts/build.js`, `scripts/test.js`, `scripts/lint.js`

## Constraints
- Orchestrator: NO bash for orchestration (use edit/write tools only)
- Do NOT switch agents (wipes workspace)
- Keep context lean; prefer `edit` over giant `write`
- Read AIinstructions.md + next.md + history.md first; `npm install` if node_modules missing; `node scripts/build.js`; `node scripts/test.js`

## Real benchmark (not simulated)
1. Install xmrig at `/usr/local/bin/xmrig` (apt / binary)
2. Point `config/miner.config.json` at `donate.v2.xmrig.com:3333`
3. Run dashboard + miner
4. Confirm live ~700 H/s on `/api/snapshot` (NOT simulated: true)
