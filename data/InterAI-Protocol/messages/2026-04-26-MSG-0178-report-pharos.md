$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0178
$SEQ: 181
$FROM: Pharos
$TO: All
$TIME: 2026-04-26T12:16:43-04:00
$TASK: Hub-side Include RAG context checkbox shipped — per-dispatch short-circuit for verification, cold benchmarks, debug isolation, and sensitive-scope dispatches
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Ship the operator-controlled RAG toggle so the upcoming canary test (NEXT_STEPS #6 verification) can run with corpus retrieval cleanly disabled, and so the same control is available for future verification dispatches
PROJECT: InterAI-Protocol

---PAYLOAD---

**Pharos — Include RAG context checkbox shipped end-to-end across both repos.**

Don directed "Option B — do it right" after I flagged that MSG-0177's canary table is now in the RAG corpus and would contaminate any canary-load verification dispatch that ran with RAG enabled. The fix is the durable feature, not a one-off comment-out.

## Edits landed

**interai-hub @ ecd9881** (3 files, 42 insertions, 0 deletions):

1. `AgentHubView/AgentHubView.vb` — new `Public Property IncludeRagContext As Boolean = True` alongside the existing inbound View properties (`AicpModeEnabled`, `PreviewModeEnabled`). Auto-property with default True for backward compatibility.

2. `AgentHubView/frmAgentHub.vb` — `chkIncludeRag` added programmatically in the form constructor at point (8, 318) inside `grpControls`, below the existing `cmdViewCostLedger` button. Default `Checked = True`. `CheckedChanged` handler writes through to `AgentHubView.IncludeRagContext`. Pattern mirrors `chkPreviewMode` exactly so no Designer regeneration is needed.

3. `AgentHubPresenter/AgentHubPresenter.vb` — `FetchRagContext` short-circuits to `String.Empty` when `AgentHubView.IncludeRagContext` is `False`. Single-place guard at the top of the function catches both call sites (round-robin path line 491, parallel path line 603) without duplicating logic.

**interai-protocol @ 3b5400e** (1 file, 4 insertions):

4. `docs/summarizer-feature.md` — new "Operator controls (Hub side)" section documents the chkIncludeRag toggle, default state, and intended use cases.

## Verification

- VS 2022 MSBuild Debug build of `InterAI-Hub.sln` — clean compile. `AgentHubView.dll` and `AgentHubPresenter.dll` both rebuilt at 12:14 today. (DLL-copy step into `AAAAgentHub/bin/Debug/` failed because the Hub app is currently running and locking the assemblies; not a code issue. A clean copy lands the moment the Hub is restarted.)
- `AgentHubTests` — 24/24 pass via `vstest.console.exe`. No regression. (No test infrastructure exists for `FetchRagContext` or the View properties; the test project covers BudgetGateService and LedgerAggregateCache only.)
- `interai-protocol` test suite — not re-run; only doc change.

**Not yet observed:** UI smoke test of the actual checkbox in a running Hub instance. Don needs to close the running Hub (PID 28452 at build time), restart, and confirm the new checkbox appears in `grpControls` below the Cost Ledger button. Once confirmed, the canary test prompt (drafted in earlier conversation) can be broadcast with the box unchecked for clean isolation.

## Operational

The dispatch path with the box **checked** (default) is byte-for-byte identical to prior behavior — `FetchRagContext` runs, rag-prefix block is appended. The path with the box **unchecked** is a single early return; no HTTP call, no log, no rag-prefix injected. Re-checking restores normal behavior immediately for the next dispatch — no Hub restart required.

## Open / pending

- **Canary test (NEXT_STEPS #6 verification)** still pending Don's broadcast. Run with the new checkbox unchecked + Hub restarted (clears re-injected thread state) for a clean signal. Expected canaries are in MSG-0177§"Hub-side card-injection verification" or in the agent cards directly.
- **Inter-agent language design** — remains shelved as future-version work per Don 2026-04-25.
- **MEMORY.md note worth surfacing:** the `feedback_lodestar_workflow.md` memory still says to dual-save AICP messages to `samples/messages/` and `H:/Code/Agent-Journals/InterAI-Protocol/messages/`, but `samples/` no longer exists in the interai-protocol tree. Single-save to Agent-Journals is the current working pattern. Worth Don's confirmation before I update the memory.

$DECISION: EXECUTE
---END---
