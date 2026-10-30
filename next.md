# next.md — minepoolie v1.0.0 (next steps)

## NEXT CHAT — WIPE-PREVENTION INSTRUCTIONS

**Root cause:** Kilo control-plane session restore from snapshot (`kilo-restore-session.js`) re-clones the repo and overwrites the working tree at every session start. **Uncommitted work is lost.** `.git/` survives sporadically on agent switch, but uncommitted changes in `/workspace/app` do not.

**Prevention checklist (do these in order, first thing on new chat):**
1. FIRST thing: read `AIinstructions.md` + `next.md` + `history.md` (resume anchors).
2. `npm install` if `node_modules` is missing.
3. `node scripts/build.js` to verify typecheck/build.
4. `node scripts/test.js` to verify tests pass.
5. Real benchmark: install `xmrig` at `/usr/local/bin/xmrig`, point `config/miner.json` pool to `donate.v2.xmrig.com:3333`, run dashboard + miner, confirm live ~700 H/s on `/api/snapshot`.
6. Phase2 remaining: `src/troubleshoot` console UI not yet built; separate package per runner via `deployPackage.generate()` already works.
7. DO NOT switch agents (wipes `/workspace/app` working tree).
8. Keep context lean; prefer edit over giant write.
9. Commit AND push after EVERY file edit/creation (never let uncommitted work accumulate).
10. If wiped: regenerate missing files from `AIinstructions.md` + `next.md`, `npm install`, resume at next.md step list.

**Real xmrig NOT installable in sandbox** — hashrate is simulated ~700 H/s; pipeline fully wired for live benchmarks once xmrig installed.

---

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
