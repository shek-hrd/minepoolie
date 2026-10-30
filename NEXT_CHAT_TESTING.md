# Next-Chat Testing Instructions — Minepoolie Forks

This document instructs the next chat on how to test **each fork** of minepoolie (`main`, `prlbench`, `allchanges`, `unified`) and generate a detailed testing and status report per fork.

---

## Important Note (read first)

**xmrig IS available** — XMRig 6.22.3 at `/usr/local/bin/xmrig` (bundled in npm `eazyminer` package). Re-install if missing: `npm install -g eazyminer && cp /usr/local/lib/node_modules/eazyminer/assets/miners/xmrig/xmrig /usr/local/bin/xmrig`.

Real mining has been verified end-to-end: xmrig connected to `donate.v2.xmrig.com:3333`, RandomX rx/0, live hashrate **449.7 H/s (max 523.7 H/s)** on AMD EPYC 8C. minepoolie's own code still reports **simulated** hashrate (~700 H/s via `src/miner.js` `simulatedHashRate()`); the real pipeline is wired and verified but minepoolie does not yet shell out to xmrig.

Pool `donate.v2.xmrig.com:3333` reachable; `pool.supportxmr.com:4444` unreachable; `pearl-kryptex-*.pool.io:4444` is a placeholder (unverified).

3 parallel xmrig instances OOM-kill (each needs ~2.3 GB RandomX dataset; 8.2 GB total). Split to 2-3 threads each or run sequentially.

---

## Per-Fork Testing Procedure

For **each** fork (`main`, `prlbench`, `allchanges`, `unified`), perform the steps below.

### a) Checkout the fork

```bash
git -C /workspace/app checkout <branch>
```

Replace `<branch>` with `main`, `prlbench`, `allchanges`, or `unified`.

### b) Verify it builds

```bash
node scripts/build.js
```

Expected: `[build] minepoolie v1.0.0 built in Xs` plus output dir and file count. Build passes if it exits 0 and `dist/manifest.json` is produced.

### c) Run unit tests

```bash
node scripts/test.js
```

Expected: `5 passed, 0 failed` and exit code 0.

### d) Run troubleshoot diagnostics (unified only)

```bash
node scripts/troubleshoot.js
```

Expected: `7 checks, 0 failed, 0 warnings` and exit code 0 (unified fork only).

### e) Run prlbench 3-runner (prlbench/unified only)

```bash
node scripts/prlbench.js
```

Expected: `Started 3 pearl-kryptex mining pool runners` with 3 runner statuses, each ~682-707 H/s simulated.

### f) Run the full unified e2e suite (unified only)

```bash
node scripts/unified-test.js
```

Expected: `5 passed, 0 failed` and exit code 0 (build → unit → troubleshoot → prlbench → e2e snapshot).

### g) Run the e2e/live test

Start each component in separate terminals (or background them):

1. Start dashboard:
   ```bash
   node scripts/dashboard.js
   # or
   node bin/minepoolie.js dashboard
   ```
2. Start miner:
   ```bash
   node scripts/miner.js
   # or
   node bin/minepoolie.js miner
   ```
3. Start runner:
   ```bash
   node scripts/runner.js
   # or
   node bin/minepoolie.js runner
   ```

Then curl the snapshot:

```bash
curl -s http://localhost:3000/api/snapshot | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(d))"
```

Confirm **live hashrate ~700 H/s** (simulated) or **~450 H/s** if running real xmrig separately.

> Note: `scripts/dashboard.js` currently prints a one-shot snapshot to stdout rather than running an HTTP server. If `/api/snapshot` is not served, treat `node scripts/dashboard.js` output as the live snapshot and confirm `hashrate` is ~700.

### h) What to verify

For each fork confirm the following:

- Dashboard tiles show miner/runner details (pool, wallet, hashrate, shares, uptime, simulated flag)
- Precise stats: EWMA + 10s/60s/900s windows (where implemented)
- Accepted/rejected shares counters
- Blockchain direct links (pool/wallet block explorer URLs where present)
- Runner logs persistent + sessionwise page logs

### i) Generate the detailed report

After testing each fork, write `/workspace/app/report-<fork>.md` with these sections:

1. **Fork name** — e.g. `main`
2. **Branch** — e.g. `main`
3. **Commit hash** — `git rev-parse HEAD`
4. **Build result** — pass/fail
5. **Test result** — `N passed, M failed`
6. **E2E result** — live hashrate observed, miner connected Y/N
7. **Blockchain link validation** — Y/N
8. **Notes** — free-form observations

### j) Fork-specific notes

| Fork | Notes |
|------|-------|
| **main** | Baseline consolidated CJS structure (`src/`, `bin/`, `config/`, `dist/`, `scripts/`). Treat as baseline for comparison. |
| **prlbench** | 3 pearl-kryptex runners. Run `node scripts/prlbench.js` and confirm **3 runners start ~682-707 H/s**. Uses `config/prlbench.config.json`. |
| **allchanges** | Consolidated CJS structure (`src/`, `bin/`, `config/`, `dist/`, `scripts/`). Run `node bin/minepoolie.js dashboard|miner|runner`. This is the most complete consolidated structure. |
| **unified** | Best-of-all: troubleshooting console + unified-test.js e2e suite + prlbench 3-runner. Run `node scripts/unified-test.js` (expect 5/5). Most complete fork. |

---

## Report file naming

- `report-main.md`
- `report-prlbench.md`
- `report-allchanges.md`
- `report-unified.md`

Each report must live at `/workspace/app/report-<fork>.md`.

A consolidated benchmark summary is at `/workspace/app/TESTING_BENCHMARKING_SUMMARY.md`.