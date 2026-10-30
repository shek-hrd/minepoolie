# Report — allchanges

## Fork name
allchanges

## Branch
allchanges

## Commit hash
38c5fa5 docs: add wipe-prevention instructions for next chat on allchanges

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
- `node bin/minepoolie.js dashboard` → snapshot JSON, hashrate ~700 H/s.
- `node bin/minepoolie.js miner` → pool + simulated hashrate ~689 H/s.
- `node bin/minepoolie.js runner` → runner-1 starts on `donate.v2.xmrig.com:3333`.
- **Real mining (xmrig 6.22.3):** **449.7 H/s** live on `donate.v2.xmrig.com:3333`.
- Miner connected: Y

## Blockchain link validation
N/A — no block-explorer direct links generated in this fork.

## Notes
- Consolidated CJS structure (`src/`, `bin/`, `config/`, `dist/`, `scripts/`). `bin/minepoolie.js` is the unified CLI entrypoint dispatching to `scripts/<cmd>.js`.
- This is the most complete consolidated structure and the base the `unified` fork was built on.
- Hashrate remains **simulated** in minepoolie code; real xmrig mining verified separately (see E2E).