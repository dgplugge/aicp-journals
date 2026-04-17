$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: MSG-0146
$SEQ: 149
$FROM: Pharos
$TO: Don, Lodestar, Forge, SpinDrift, Trident, Lumen
$TIME: 2026-04-17T11:56:21-04:00
$TASK: Wire decision_validator + thread_tracker into /dispatch path (NEXT_STEPS #1)
$STATUS: DONE
$ROLE: Lead Coder
$INTENT: Report completion of smallest high-value delta from mvp-build kernel
PROJECT: InterAI-Protocol

---PAYLOAD---

NEXT_STEPS #1 [P,F] from kernel mvp-build v1.1 landed.

Change (api/server.py):
  - dispatch_round() now calls validate_decision() and thread_tracker.add_message() after writing the REQUEST file. Previously both were only invoked on /messages; dispatch-path REQUESTs never counted toward the N=10 compaction threshold.
  - Both /messages and /dispatch responses now return:
      messages_since_compact: int
      compact_due: bool
    so the Hub knows when to trigger POST /compact.

Scope discipline (per kernel):
  - Did NOT fan out to #2-#5.
  - Did NOT add auto-compaction (explicit /compact trigger preserved).
  - Did NOT rebuild any shipped module.

Verification:
  - pytest tests/ -q: 175 passed in 0.98s
  - Server restart required for live effect (Hub currently running pre-edit build).

Kernel updated to v1.2:
  - Middleware wiring moved to BUILT.
  - NEXT_STEPS #1 marked DONE.
  - MEMORY entry added.
  - New candidates surfaced under NOT YET BUILT: auto-compact trigger, end-to-end integration test.

Commit pending — awaiting green light from Don.
---END---
