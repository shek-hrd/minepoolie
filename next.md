# next.md — minepoolie v1.0.0 (next steps)

## Phase 1 — COMPLETE
- finalize missing/mocked features: dashboard, miner, runner, tests, config
- hook up completely: build/test/lint scripts wired
- publish: pushed to github.com/shek-hrd/minepoolie.git (main)
- test thoroughly: 6/6 tests pass; ~700 H/s simulated; build ok

## Phase 2 — IN PROGRESS
- one-file autonomous deployment package: src/deployPackage.js + dist/deploy/ DONE
- per-runner separate package generation: deployPackage.generate() -> dist/deploy/<runnerId>/ DONE
- troubleshooting console UI: src/troubleshoot NOT yet built — REMAINING
- prompt for another AI (handoff instructions)
- multiple autoconnecting mining servers (1 miner per server), each on a tile
- multiple page instances managing/benchmarking live runners
- precise statistics + validate each transfer generating blockchain direct link
- runner logs persistent + page sessionwise logs

## Remaining work
1. Build troubleshooting console UI (src/troubleshoot not yet built)
2. Real xmrig benchmark (~700 H/s live, not simulated — real xmrig not installable in sandbox)
3. Blockchain transfer validation + direct links
4. Multiple autoconnecting mining servers (1 miner per server), each on a tile

## Environment notes
- Sandbox/Cloud Agent; Node v24.22.1, npm 11; no python3; 8 vCPU; 8.2 GiB; no GPU
- xmrig v6.26.0 not installed; RandomX ~700 H/s simulated
- donate.v2.xmrig.com:3333 reachable; pool.supportxmr.com:4444 unreachable
- Workspace wipe risk on agent switch — `.git/` survives sporadically

## Do NOT
- Switch agents (wipes /workspace/app working tree)
- Commit secrets/keys
- Push to any branch other than main unless asked
