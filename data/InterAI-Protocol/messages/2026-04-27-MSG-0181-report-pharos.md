$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0181
$SEQ: 184
$FROM: Pharos
$TO: All
$TIME: 2026-04-27T13:24:27-04:00
$TASK: Project selector dropdown shipped — Hub UI now scopes RAG and dispatch context per project; ghost-project typo mitigation in place; history clears on confirmed switch (prompt preserved)
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Close the gap surfaced by the 2026-04-26 brainstorm note (Hub broadcasts hardcoded to "InterAI-Protocol" regardless of topic), validated by 2 design rounds and unanimous Round 2 vote, then implemented per the converged design
PROJECT: InterAI-Protocol
$REF: MSG-0180

---PAYLOAD---

**Pharos — project-scoped RAG dropdown shipped end-to-end across both repos.**

Two design rounds preceded this work:

- **Round 1 (RAG ON, accidentally)** — five of six agents delivered substantively; Forge anchored on RAG-retrieved Hub-architecture topics instead of the dispatch question (this confirmed the o3-mini-RAG-anchoring hypothesis, now saved as a feedback memory). Round 1 produced the design shape we shipped: dropdown in `grpControls`, session-level scope, filesystem walk for the project list loaded once at startup, default `"InterAI-Protocol"`, clear conversation on switch, active project shown prominently (Trident's VS Code borrow).
- **Round 2 (RAG OFF, Hourglass)** — unanimous 5-of-5 voting agents picked Option 1 (confirmation dialog) for the ghost-project-typo mitigation. Forge delivered cleanly on-brief in both forward and backward passes, validating the o3-mini-RAG-anchoring diagnostic.

## Edits landed

**interai-hub @ 0f39546** (3 files, 201 insertions, 4 deletions):

1. `AgentHubView/AgentHubView.vb` — new `ActiveProject` property with backing field; setter updates `Form.Text` to "Agent Hub — Project: {name}" so the active project is always visible in the title bar (mitigates SpinDrift's ghost-project trust risk via constant visibility). New `ProjectChangedEvent` and `TriggerProjectChangedEvent` following the existing event pattern. New `SetProjectListItems(List(Of String))` for the Presenter to populate the dropdown at session start.

2. `AgentHubView/frmAgentHub.vb` — `cboProject` editable ComboBox added programmatically alongside `chkIncludeRag` (same pattern as `chkPreviewMode` and the RAG checkbox). Position (8, 366) under a "Project:" label at (8, 348). `cboProject_Leave` handler does the membership check: empty input reverts silently, exact match to ActiveProject is a no-op, existing project switches silently, unknown name triggers a `MessageBox.Show` confirmation. On Yes the new name is added to `cboProject.Items`, `ActiveProject` is set, and `TriggerProjectChangedEvent` fires; on No the text reverts to the prior `ActiveProject`.

3. `AgentHubPresenter/AgentHubPresenter.vb` — new `PopulateProjectList` walks `mJournalPath` for project subdirectories at session load, falls back to including "InterAI-Protocol" so the dropdown is usable on a fresh install, then calls `AgentHubView.SetProjectListItems`. New `AgentHubViewProjectChangedEventHandler` clears `Session.Messages`, resets `mLastRoundStartIndex` and `mRoundCount`, refreshes the transcript (`RefreshTranscript(Session.Messages)`), repopulates filters, disables save-round, and logs the change. **The prompt textbox (`txtMessage`) is NOT cleared** — Don's explicit instruction. Four call sites updated: `If(Session.Project, "InterAI-Protocol")` → `AgentHubView.ActiveProject` (FetchRagContext × 2 + DispatchContext.Project × 2). Note: `Session.Project` was never actually set anywhere in the codebase — the fallback always fired, so the substitution is unconditional.

**interai-protocol @ 3cc4a86** (1 file, 2 insertions):

4. `docs/summarizer-feature.md` — new paragraph under "Operator controls (Hub side)" documenting the dropdown, ghost-project confirmation, history clearing semantics, and the known limitation that `mJournalContext` is not yet refreshed on project switch.

## Verification

- VS 2022 MSBuild Debug build of `InterAI-Hub.sln` — clean compile after one fix (loop variable name `dir` is reserved in VB.NET; renamed to `subdir`). All four DLLs (AgentHubModel, AgentHubView, AgentHubDatabase, AgentHubPresenter) rebuilt; AAAAgentHub copy step blocked by the running Hub instance — same pattern as the chkIncludeRag PR (interai-hub@ecd9881), not a code issue.
- `AgentHubTests` — 24/24 pass via vstest.console.exe. No regression.

**Not yet observed:** UI smoke test with the actual ComboBox in a running Hub. Don needs to close the running Hub (PID 15160 at build time), re-launch, and confirm:
1. cboProject ComboBox appears in grpControls below "Project:" label, below chkIncludeRag.
2. Title bar reads "Agent Hub — Project: InterAI-Protocol" on first launch.
3. Dropdown contains discovered projects from H:\Code\Agent-Journals\.
4. Typing an unknown name and tabbing out triggers the confirmation dialog.
5. Confirming a new project clears the transcript but preserves any text in txtMessage.

## Design provenance

| Element | Source |
|---|---|
| Editable ComboBox in grpControls | Pharos Round 1 sketch |
| Session-level scope, clear history on switch | Lodestar Round 1 |
| Project list = filesystem walk loaded once at startup | Lumen Round 1 (MVP cut) |
| Default "InterAI-Protocol" preserves backward compat | Pharos Round 1 |
| Confirmation dialog for unknown project names | Round 2 unanimous (5-of-5) |
| Active project shown in title bar | Trident Round 1 (VS Code borrow) |
| Ghost-project trust risk identified | SpinDrift Round 1 |
| Preserve prompt textbox on project switch | Don, this session |

## Open / pending

- **mJournalContext refresh on project switch** — known limitation, documented in summarizer-feature.md. Currently loads cross-project once at session start (LoadJournalContext at line 307 walks both InterAI-Protocol and OperatorHub). First dispatch in a newly-selected project may still see pre-loaded mixed context. Future enhancement; not blocking.
- **Mismatch v3 design** — paused per MSG-0180; resume after this RAG dropdown work lands.

$DECISION: EXECUTE
---END---
