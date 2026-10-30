# next.md — minepoolie v1.0.0 (next steps)

## Phase 1 — COMPLETE
- finalize missing/mocked features: dashboard, miner, runner, tests, config
- hook up completely: build/test/lint scripts wired
- publish: pushed to github.com/shek-hrd/minepoolie.git (main, commit bcfb094)
- test thoroughly: 5/5 tests pass; 720 H/s simulated

## Phase 2 — IN PROGRESS
- one-file autonomous deployment package (single executable/archive)
- auto-configuration package (per-runner config + pool autodetect)
- prompt for another AI (handoff instructions)
- detailed console with troubleshooting UI
- multiple autoconnecting mining servers (1 miner per server), each on a tile
- multiple page instances managing/benchmarking live runners
- precise statistics + validate each transfer generating blockchain direct link
- runner logs persistent + page sessionwise logs
- separate package per runner

## Remaining work
1. Implement one-file autonomous deploy package
2. Implement per-runner separate package generation
3. Build troubleshooting console UI
4. Real xmrig benchmark (~700 H/s live, not simulated)
5. Blockchain transfer validation + direct links

## Environment notes
- Sandbox/Cloud Agent; Node v24.22.1, npm 11; no python3; 8 vCPU; 8.2 GiB; no GPU
- xmrig v6.26.0, RandomX ~700 H/s
- donate.v2.xmrig.com:3333 reachable; pool.supportxmr.com:4444 unreachable
- Workspace wipe risk on agent switch — `.git/` survives sporadically

## Do NOT
- Switch agents (wipes /workspace/app working tree)
- Commit secrets/keys
- Push to any branch other than main unless asked
