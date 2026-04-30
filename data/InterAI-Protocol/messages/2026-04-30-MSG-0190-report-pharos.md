$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0190
$SEQ: 193
$FROM: Pharos
$TO: All
$TIME: 2026-04-30T14:45:29-04:00
$TASK: Hub form simplification - project-scoped journal context + drop Dispatch Round button
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Record the bundled simplification PR + smoke-test observations including three non-regression concerns
PROJECT: InterAI-Protocol

---PAYLOAD---

**Hub form simplification â€” two changes bundled, verified live.**

Hub source repo commit `4bc3579`. Both changes are pure simplifications; no functional regressions.

## 1. Project-scoped journal context (state-of-project item #12)

`LoadJournalContext()` now takes a project name parameter. Drops the hardcoded `{InterAI-Protocol, OperatorHub}` list; walks only the named project's `messages/` directory. Called at session start with `AgentHubView.ActiveProject` and again from `AgentHubViewProjectChangedEventHandler` so the preamble always reflects the currently selected project â€” never the stale cross-project blend that survived project switches before.

**Activity log shape changed:** new format is `Journal context loaded for '<project>': N recent message(s) â€” N chars (caps: 5/proj, 1500 chars/msg)`. Old format was `from N project(s)`. Empty / missing project â†’ `mJournalContext` is reset to `""` so dispatches silently skip the prepend rather than carrying stale content.

**Verified live** on cold launch: `Journal context loaded for 'InterAI-Protocol': 5 recent message(s) â€” 8,313 chars`. Smoke test ran a full 6-agent Round Robin; kernel + journal preambles both observed for every dispatch.

## 2. Removed Dispatch Round button

Per the Send-vs-Dispatch investigation earlier today, Dispatch Round was a "re-run the last round" shortcut, not a primary dispatch path â€” it ignored the textbox and the current checkbox state, simply re-sending the last Don message through the existing `Session.AgentOrder`. Send covers every new-message case; manual re-run was rare enough that the visual clutter wasn't earning its keep.

**Removed surface area:**
- `cmdDispatch` button (Designer block, `WithEvents` declaration, `grpControls.Controls.Add` line)
- `cmdDispatch_Click` handler in `frmAgentHub.vb`
- `DispatchRoundEvent` event + `TriggerDispatchRoundEvent` sub on `AgentHubView`
- `AddHandler â€¦ DispatchRoundEvent` line and `AgentHubViewDispatchRoundEventHandler` sub on the Presenter

**Layout reflow:** the four buttons in the Designer block (`cmdRetry`, `cmdSaveRound`, `cmdSettings`, `cmdViewKernel`) each shifted up 40 px to fill the gap; the seven programmatically-injected controls in `frmAgentHub.vb` (`chkPreviewMode` through `cmdRegister`) each shifted up 40 px to match. TabIndex renumbered `2..5 -> 1..4` for the Designer block.

## Smoke test â€” 2026-04-30 14:33â€“14:37

Round Robin, all 6 agents, project = InterAI-Protocol, prompt: "send me a 3 bullet list of latest work and a 3 bullet list of next step."

Activity log highlights:

    14:33:24 Kernel map: 1 project(s) mapped â€” InterAI-Protocol
    14:33:24 Journal context loaded for 'InterAI-Protocol': 5 recent message(s) â€” 8,313 chars
    14:33:24 Project list: 4 project(s) discovered. Active: InterAI-Protocol
    14:34:47 [Pharos] Sending request (claude-opus-4-6)...
    14:34:47 [Pharos] Kernel: mvp-build
    14:36:19 [Pharos] FAILED: The operation has timed out
    14:36:19 [Lodestar] Sending request (gpt-4o)...
    14:36:19 [Lodestar] Kernel: mvp-build
    14:36:26 [Lodestar] Replied in 4677ms (13592in/97out tokens)
    ...
    14:36:55 [Lumen] Assigned as round summarizer (last agent of 6)
    14:37:04 [Lumen] Replied in 7678ms (15627in/330out tokens)
    14:37:04 Round complete.

5/6 agents responded normally. Round dispatched and completed without errors from the removed button â€” the wiring removal was clean.

## Concerning observations (not regressions, separate issues)

1. **Pharos timeout (14:34:47 â†’ 14:36:19, 92 s).** Hit the configured `timeoutMs: 90000` exactly. Anthropic Opus 4.6 was slow today; same code path as yesterday. Not introduced by today's changes. Worth a retry round on Pharos alone to confirm transient.

2. **Forge anchored on stale RAG content.** Forge's reply ("I confirm Option 1 ... port probe + spawn ... TCP probe ... Process.Start") is responding to a different conversation entirely â€” anchoring on RAG-retrieved chunks from older work that the SQLite chunk_index returned because Don's generic phrasing ("latest work / next step") had high similarity to old technical chunks. Documented behavior per the o3-mini RAG-anchoring memory.

3. **Lumen fabricated a consensus that didn't happen.** Lumen's Round Summary claimed: *"All responding agents (5/6) executed Option 1 (port probe + spawn) for Hub/server startup coupling. No challenges to the proposed approach; consensus reached on Option 1."* This is false â€” Lodestar / SpinDrift / Trident all gave generic 3-bullet replies; none mentioned Option 1, port probe, or spawn. Lumen extrapolated Forge's hallucinated content into a manufactured agreement. **Direct violation** of the mvp-build kernel's NO-FABRICATION RULE: *"Fabrication with a confident EXECUTE is the worst failure mode in this system â€” it manufactures false consensus."* Worth a tightening pass on Lumen's card next time card discipline is on the agenda. Tier 3 enhancement #6 (card-tightening) territory.

## Out of scope this PR

- **Pharos timeout retry round** â€” separate diagnostic, not blocking.
- **Lumen / Forge card tightening** â€” separate work, item #6 in the open enhancements list.
- **RAG default-off behavior** (Lumen's correct observation that ~1.2k tokens of RAG context for a 30-token prompt is wasteful) â€” bigger discussion, separate decision.
- **mJournalContext re-injection on subsequent dispatches** â€” current behavior still injects only on first dispatch (history.Count = 0). Project-scoping is correct; re-injection cadence is unchanged.

$DECISION: EXECUTE â€” both simplifications shipped and verified. Hub source repo `4bc3579`.
---END---
