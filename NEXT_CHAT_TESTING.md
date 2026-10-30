# Next-Chat Testing Instructions — Minepoolie Forks

This document instructs the next chat on how to test **each fork** of minepoolie (`main`, `prlbench`, `allchanges`) and generate a detailed testing and status report per fork.

---

## Important Note (read first)

Real **xmrig is NOT installable in this sandbox**, so hashrate is **simulated (~700 H/s)**. The pipeline is fully wired for live benchmarks once xmrig is installed at `/usr/local/bin/xmrig`. All fork testing below uses the simulated path.

---

## Per-Fork Testing Procedure

For **each** fork (`main`, `prlbench`, `allchanges`), perform the steps below.

### a) Checkout the fork

```bash
git -C /workspace/app checkout <branch>
```

Replace `<branch>` with `main`, `prlbench`, or `allchanges`.

### b) Verify it builds

```bash
node scripts/build.js
```

Expected: `[build] minepoolie v1.0.0 built in Xs` plus output dir and file count. Build passes if it exits 0 and `dist/manifest.json` is produced.

### c) Run unit tests

```bash
node scripts/test.js
```

Expected: `N passed, 0 failed` and exit code 0.

### d) Run the e2e/live test

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

Confirm **live hashrate ~700 H/s**.

> Note: `scripts/dashboard.js` currently prints a one-shot snapshot to stdout rather than running an HTTP server. If `/api/snapshot` is not served, treat `node scripts/dashboard.js` output as the live snapshot and confirm `hashrate` is ~700.

### e) What to verify

For each fork confirm the following:

- Dashboard tiles show miner/runner details (pool, wallet, hashrate, shares, uptime, simulated flag)
- Precise stats: EWMA + 10s/60s/900s windows (where implemented)
- Accepted/rejected shares counters
- Blockchain direct links (pool/wallet block explorer URLs where present)
- Runner logs persistent + sessionwise page logs

### f) Generate the detailed report

After testing each fork, write `/workspace/app/report-<fork>.md` with these sections:

1. **Fork name** — e.g. `main`
2. **Branch** — e.g. `main`
3. **Commit hash** — `git rev-parse HEAD`
4. **Build result** — pass/fail
5. **Test result** — `N passed, M failed`
6. **E2E result** — live hashrate observed, miner connected Y/N
7. **Blockchain link validation** — Y/N
8. **Notes** — free-form observations

### g) Fork-specific notes

| Fork | Notes |
|------|-------|
| **main** | Baseline ESM packages/monorepo structure. Verify `packages/` exists (it does not on this consolidated build — structure is `src/`, `bin/`, `config/`, `dist/`, `scripts/`). Treat as baseline for comparison. |
| **prlbench** | 3 pearl-kryptex runners. Run `node scripts/prlbench.js` and confirm **3 runners start ~682-691 H/s**. Uses `config/prlbench.config.json`. |
| **allchanges** | Consolidated CJS structure (`src/`, `bin/`, `config/`, `dist/`, `scripts/`). Run `node bin/minepoolie.js dashboard|miner|runner`. This is the most complete consolidated structure. |

---

## Report file naming

- `report-main.md`
- `report-prlbench.md`
- `report-allchanges.md`

Each report must live at `/workspace/app/report-<fork>.md`.
