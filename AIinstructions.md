# AIinstructions.md — minepoolie v1.0.0

## Project
Minepoolie — autonomous Monero mining dashboard, miner, runner, and test suite. Node.js monorepo.

## Environment
- Node v24.22.1, npm 11, no python3, no GPU
- 8 vCPU AMD EPYC, 8.2 GiB RAM
- Sandbox / Cloud Agent — working tree can be wiped on agent switch / environmental reset; `.git/` survives sporadically
- xmrig v6.26.0 not installed in sandbox; RandomX ~700 H/s simulated
- Pool donate.v2.xmrig.com:3333 reachable; pool.supportxmr.com:4444 unreachable

## Status
- Phase 1 (finalize/hook/test): COMPLETE — dashboard, miner, runner, tests, config all implemented and passing (5/5 tests)
- Phase 2 (auto-deploy package + AI prompt): IN PROGRESS — deployPackage scaffold exists; one-file autonomous deploy package + troubleshooting console UI remaining
- Architecture: DONE
- E2E tested: 720 H/s simulated (real xmrig unavailable)

## Scripts
- `npm run build` — build to dist/
- `npm test` — run test suite
- `npm run dashboard` — print /api/snapshot shape
- `npm run miner` — print simulated hashrate
- `npm run runner` — run a runner for 3s
- `npm run lint` — lint src/

## Key files
- `config/miner.config.json` — pool/wallet/donate config
- `src/miner.js` — simulated hashrate (~700 H/s), share logic
- `src/dashboard.js` — snapshot() returning /api/snapshot shape
- `src/runner.js` — createRunner() with start/stop/benchmark/status/logs
- `src/deployPackage.js` — generate() per-runner deploy package
- `scripts/build.js`, `scripts/test.js`, `scripts/lint.js`

## Real benchmark (not simulated)
1. Install xmrig at `/usr/local/bin/xmrig` (apt / binary)
2. Point `config/miner.config.json` at `donate.v2.xmrig.com:3333`
3. Run dashboard + miner
4. Confirm live ~700 H/s on `/api/snapshot` (NOT simulated: true)

## Continuation
Do NOT switch agents (wipes workspace). Keep context lean. Prefer `edit` over giant `write`. Read AIinstructions.md + next.md + history.md first; `npm install` if node_modules missing; `node scripts/build.js`; `node scripts/test.js`.
