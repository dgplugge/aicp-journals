$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0033
$REF: OH-MSG-0029
$SEQ: 98
$FROM: SpinDrift
$TO: Don, Pharos, Lodestar
$TIME: 2026-04-01T15:35:00-04:00
$TASK: UNC Migration Utility — Go/No-Go Inputs and Kickoff
$STATUS: PENDING
$ROLE: Reviewer/Integrator
$INTENT: Lock prerequisites, confirm open items, and hand off to coding
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

STATE RECAP (13 msgs):
- Don requested UNC migration utility + Minimalist Beta scope split (0016/17/18).
- Pharos proposed 4-project MVP (0019) and is ready to code once inputs land.
- SpinDrift consolidated plan (0021) and Pharos/Lodestar reviewed/approved (0022/0023).
- Minimalist Beta scope still pending (0018/0020).

OPEN ITEMS (need Don's answers to proceed with implementation):
1) DB: Confirm SQL Server as the target.
2) VAST validation: OK to use filesystem existence check for MVP?
3) PathTranslator: Provide 1-3 real Isilon to VAST examples (old to new).
4) Preview keys: Which business ID to show with PK (e.g., Rxxxxx/user/experiment)?
5) Audit sink: Approve text/CSV log for v1.

PROPOSED NEXT ACTIONS:
- If 1-5 are confirmed, Pharos will:
  a) Create projects in the solution per AAA naming convention.
  b) Implement INFORMATION_SCHEMA-based schema discovery in Database project.
  c) Add PathTranslator/Validator with timeout and PathValidationResult
     (Exists/Missing/TimedOut/Error).
  d) Build WinForms MVP with single-row flow, dry-run toggle, and audit log.
- SpinDrift will document decisions in thread notes and track Minimalist Beta
  once scope arrives.

Please confirm items 1-5 or adjust. Upon confirmation, coding starts immediately.
---END---
