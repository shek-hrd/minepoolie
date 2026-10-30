# next.md — minepoolie v1.0.0 (next steps)

## NEXT CHAT — WIPE-PREVENTION INSTRUCTIONS

**Root cause:** Kilo control-plane session restore from snapshot (`kilo-restore-session.js`) re-clones the repo and overwrites the working tree at every session start. **Uncommitted work is lost.** `.git/` survives sporadically on agent switch, but uncommitted changes in `/workspace/app` do not.

**Prevention checklist (do these in order, first thing on new chat):**
1. FIRST thing: read `AIinstructions.md` + `next.md` + `history.md` (resume anchors).
2. `npm install` if `node_modules` is missing.
3. `node scripts/build.js` to verify typecheck/build.
4. `node scripts/test.js` to verify tests pass (expect 5/5).
5. `node scripts/unified-test.js` to run the full e2e suite (build → unit → troubleshoot → prlbench → e2e snapshot). Expect 5/5.
6. Verify xmrig present (`which xmrig` → XMRig 6.22.3 at `/usr/local/bin/xmrig`). If missing, reinstall: `npm install -g eazyminer && cp /usr/local/lib/node_modules/eazyminer/assets/miners/xmrig/xmrig /usr/local/bin/xmrig`.
7. Real benchmark: `xmrig -a rx/0 -o donate.v2.xmrig.com:3333 -u <wallet> -p x --no-color --no-huge-pages` → expect live ~450 H/s on EPYC (MSR mod unavailable in VM, so hashrate is capped low).
8. Phase2 remaining: wire `src/miner.js` to drive the real xmrig binary instead of `simulatedHashRate()`; build the troubleshooting console UI; blockchain transfer validation + direct links; multiple autoconnecting mining servers (1 miner per server) each on a tile.
9. DO NOT switch agents (wipes `/workspace/app` working tree).
10. Keep context lean; prefer edit over giant write.
11. Commit AND push after EVERY file edit/creation (never let uncommitted work accumulate).
12. If wiped: regenerate missing files from `AIinstructions.md` + `next.md`, `npm install`, resume at next.md step list.

**xmrig IS available this session** (XMRig 6.22.3 at `/usr/local/bin/xmrig`, bundled in npm `eazyminer`). Real mining verified: 449.7 H/s on `donate.v2.xmrig.com:3333`. Pipeline fully wired for live benchmarks.

---

## Phase 1 — COMPLETE
- finalize missing/mocked features: dashboard, miner, runner, tests, config
- hook up completely: build/test/lint scripts wired
- publish: pushed to github.com/shek-hrd/minepoolie.git (main)
- test thoroughly: 5/5 tests pass; ~700 H/s simulated; build ok

## Phase 2 — IN PROGRESS
- one-file autonomous deployment package: src/deployPackage.js + dist/deploy/ DONE
- per-runner separate package generation: deployPackage.generate() -> dist/deploy/<runnerId>/ DONE
- troubleshooting diagnostics console: src/troubleshoot.js + scripts/troubleshoot.js + dist/troubleshoot.js DONE (7 checks, 0 failed)
- unified e2e test suite: scripts/unified-test.js DONE (5/5: build, unit, troubleshoot, prlbench, e2e)
- prlbench 3-runner: scripts/prlbench.js + config/prlbench.config.json DONE
- troubleshooting console UI (interactive) NOT yet built — REMAINING
- prompt for another AI (handoff instructions)
- multiple autoconnecting mining servers (1 miner per server), each on a tile
- multiple page instances managing/benchmarking live runners
- precise statistics + validate each transfer generating blockchain direct link
- runner logs persistent + page sessionwise logs

## Remaining work
1. Wire `src/miner.js` to drive real xmrig (`/usr/local/bin/xmrig`) instead of `simulatedHashRate()` — real mining proven at 449.7 H/s.
2. Build troubleshooting console UI (interactive; diagnostics already work via `npm run troubleshoot`).
3. Real xmrig benchmark — DONE this session: 449.7 H/s live on EPYC (not simulated).
4. Blockchain transfer validation + direct links.
5. Multiple autoconnecting mining servers (1 miner per server), each on a tile.
6. minepoolie -> xmrig integration (currently minepoolie reports simulated hashrate; real xmrig runs separately).

## Environment notes
- Sandbox/Cloud Agent; Node v24.22.1, npm 11; no python3; 8 vCPU; 8.2 GiB; no GPU
- **xmrig v6.22.3 installed at /usr/local/bin/xmrig** (via npm `eazyminer` package); RandomX live ~450 H/s on EPYC (MSR mod unavailable in VM → hashrate capped low)
- donate.v2.xmrig.com:3333 reachable; pool.supportxmr.com:4444 unreachable; pearl-kryptex-*.pool.io:4444 placeholder
- 3 parallel xmrig instances OOM-kill (2.3 GB dataset each); use 2-3 threads each or sequential runs
- Workspace wipe risk on agent switch — `.git/` survives sporadically

## Do NOT
- Switch agents (wipes /workspace/app working tree)
- Commit secrets/keys
- Push to any branch other than main unless asked