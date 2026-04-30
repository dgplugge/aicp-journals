$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0187
$SEQ: 190
$FROM: Pharos
$TO: All
$TIME: 2026-04-30T11:12:01-04:00
$TASK: State-of-project readout captured as durable artifact (Markdown + downloadable Word doc); project-scoped kernel correction recorded as enhancement #11; frmAgentHub BackColor changed to AliceBlue for a focus/think palette
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Bring the journal stream up to date with the synthesis Don asked for, capture the kernel-injection correction so it doesn't get lost between sessions, and ship a small visual tweak that reframes the Hub from "engineering tool gray" to "library reading room blue"
PROJECT: InterAI-Protocol
$REF: MSG-0185

---PAYLOAD---

**Pharos — three deliverables landed: state-of-project doc, kernel correction recorded, AliceBlue BackColor.**

Don asked for three things in conversation today: (1) a downloadable Word document of yesterday's state-of-project readout, added to the source-code documentation; (2) all the conversation content not yet in journals to be captured as AICP messages; (3) a small UI color change to evoke focus and thinking. This entry closes all three.

## 1. State-of-project readout — durable artifact

**interai-protocol @ 9bb8ed4** (3 files, 473 insertions):

- `notes/state-of-project-2026-04-29.md` — Markdown source. Five priority tiers covering 21 open enhancement items with sizings, the consolidated brainstorm catalog, and a project-scoping snapshot of the prompt-assembly stack.
- `docs/state-of-project-2026-04-29.docx` — Word document generated from the Markdown. Calibri 11pt, 1-inch margins, 109 paragraphs, 6 tables (the 5 priority tiers + the project-scoping table), proper H1/H2/H3 hierarchy.
- `scripts/md_to_docx.py` — minimal reusable converter (~250 lines). Handles ATX headings, bold/italic/inline code/links, bullet and numbered lists, pipe tables with header separator, block quotes, horizontal rules. Re-runnable for future status doc refreshes.

**Why both formats:** the Markdown is git-friendly and diff-able; the Word doc is what Don asked for — downloadable from the source repo as a deliverable. Future state-of-project readouts can edit the Markdown and rerun the converter to regenerate the .docx in seconds.

## 2. Kernel correction recorded

The state-of-project doc contains the correction Don raised yesterday: the Hub does NOT inject project-scoped kernels at dispatch time today, despite the kernel infrastructure existing. The Python API's `/dispatch?kernel=<name>` route can load kernels, but the Hub's broadcast goes directly to provider APIs and skips that route entirely. The "View Kernel..." button in the Hub UI just opens kernel files in Notepad — it's a viewer, not an injector.

A new enhancement item #11 is captured in the priority list:

> **Project-scoped kernel injection in the Hub.** Establish a project→kernel mapping (convention or config). On Hub dispatch, after picking the active project, load the corresponding kernel file and prepend its content as a system-prompt block. Order in assembled prompt: kernel preamble → agent card → journal context → RAG prefix → user message. Estimated 2–3 hours.

The "Currently project-scoped vs. not" table in the doc makes the gap explicit:

| Layer | Project-scoped? | Injected by Hub? |
|---|---|---|
| Kernel | Conceptually yes; not auto-linked | ❌ No — Hub broadcast skips the kernel-aware endpoint |
| Agent cards | No (correctly — agent-scoped) | ✅ Yes — fetched per agent, prepended to system prompt |
| RAG prefix | ✅ Yes (shipped 2026-04-27) | ✅ Yes when checkbox is on |
| Journal context | ❌ Cross-project | First dispatch only (when history empty) |

This pins ground truth so a future session won't rebuild a wrong mental model.

## 3. AliceBlue BackColor — focus/think palette

**interai-hub @ 6beaa75** (1 file, 5 insertions):

`AgentHubView/frmAgentHub.Designer.vb` — `Me.BackColor = System.Drawing.Color.AliceBlue` added to the form's `InitializeComponent`. `AliceBlue` (`#F0F8FF`) is a built-in WinForms named color: pale cool blue, the kind of tone you see in editor apps and library reading rooms. Subtle enough not to fight existing controls, recognizable enough to feel intentional.

What stays the same:
- `txtTranscript` and the message body retain `SystemColors.Control` gray (set explicitly in their own `InitializeComponent` blocks).
- Buttons keep `UseVisualStyleBackColor = True` so they render with the Windows visual style.
- GroupBoxes (`grpAgents`, `grpControls`) are transparent by default so the new BackColor shows through their content area while their borders/headers stay normal.

Build clean against VS 2022 MSBuild Debug. **AgentHubTests now 27/27** (was 24 — three tests added since the last full run).

## Verification & next steps

- ✅ Build clean across all 9 projects (the new `AgentHubRegistryNUnitTests` project Don added is also building cleanly alongside the existing projects).
- ✅ All AgentHubTests pass.
- ⏳ **Visual smoke test**: Don should re-launch the Hub from `H:\Code\interai-hub\AAAAgentHub\bin\Debug\AAAAgentHub.exe` to see the AliceBlue background. If the tone is wrong (too pale, too cool, fights with grpControls' fill), it's a one-line edit to a different `Color.*` value.

## Cumulative state

The InterAI Hub MVP is shipped (v1.0.3.1, public ClickOnce repo), onboarding-equipped (PowerShell setup script + Quick Start docs), and now has a durable status doc that future sessions can resume from. The 21-item priority list in `state-of-project-2026-04-29.md` is the canonical reference for "what's next." Most-likely next-step candidate per the doc's bottom line: **#1 (real son dry-run)** — costs nothing on the maintainer side and could shape priority of #4 (embedded first-run wizard) dramatically.

$DECISION: EXECUTE
---END---
