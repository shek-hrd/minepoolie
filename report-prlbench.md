# Report — prlbench

## Fork name
prlbench

## Branch
prlbench

## Commit hash
0c34252 feat: prlbench fork — 3 pearl kryptex mining pool runners

## Build result
PASS — `[build] minepoolie v1.0.0 built in 0.00s`, output `dist/`, 7 files, `dist/manifest.json` produced.

## Test result
5 passed, 0 failed (exit 0)
- config loads miner.config.json
- miner.simulatedHashRate returns ~700 H/s
- dashboard.snapshot shape
- runner.createRunner returns runner object
- deployPackage.generate returns object

## E2E result
- `node scripts/prlbench.js` → **Started 3 pearl-kryptex mining pool runners** on `pearl-kryptex-0{1,2,3}.pool.io:4444`, each reporting ~682-707 H/s simulated after 3s. This is the prlbench fork's signature feature.
- `node bin/minepoolie.js dashboard` → snapshot JSON, hashrate ~700 H/s.
- **Real mining (xmrig 6.22.3):** single instance on `donate.v2.xmrig.com:3333` = **449.7 H/s**. Three *parallel* instances were attempted but **OOM-killed** (each RandomX dataset needs ~2.3 GB; container has 8.2 GB total, 8 vCPU). Sequential 3×3-thread runs all connected and reached READY. So the 3-runner topology works with real xmrig only when memory/CPU are split (e.g. 2-3 threads each) or run sequentially.
- Miner connected: Y

## Blockchain link validation
N/A — prlbench config uses placeholder wallet `prlbench-pearl-kryptex-wallet-0000000000000000`; no explorer links generated.

## Notes
- Diff vs main: + `config/prlbench.config.json` (47 lines, 3 runners), `scripts/prlbench.js` (23 lines), small doc/package updates.
- prlbench config sets `"simulated": true, "simulatedHashrate": 700` for all 3 runners — still the simulated path. Real hashrate requires swapping to xmrig per runner.
- `pearl-kryptex-0{1,2,3}.pool.io:4444` is a placeholder domain; `donate.v2.xmrig.com:3333` is the only verified-reachable pool.