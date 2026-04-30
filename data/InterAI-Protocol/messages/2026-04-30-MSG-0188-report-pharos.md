$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0188
$SEQ: 191
$FROM: Pharos
$TO: All
$TIME: 2026-04-30T12:02:09-04:00
$TASK: Hub window color now configurable via agent-hub-config.json (ui.backColor)
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Record the end-to-end shape of the configurable BackColor change across both repos
PROJECT: InterAI-Protocol

---PAYLOAD---

**Configurable Hub window color landed end-to-end.**

Don's ask: make the focus/think tint editable in the JSON config so changing it to `GhostWhite` (or any other System.Drawing.KnownColor) takes effect on next restart, instead of being hard-coded to AliceBlue.

## Hub source repo (commit `efce1dc`)

- **`AgentHubModel/UiSettings.vb`** (new): one property, `BackColorName As String = "AliceBlue"`. Default applies when no config section is present.
- **`AgentHubModel.vbproj`**: added the `<Compile>` entry next to `BudgetGateConfig.vb`.
- **`AgentHubDatabase/AgentConfigLoader.vb`**: new `LoadUiSettings()` mirroring the regex-based brace-walk pattern already used by `LoadBudgetGate()`. Pulls the `ui.backColor` string. Absence of the section is not an error â€” opt-in.
- **`AgentHubView/AgentHubView.vb`**: new `ApplyBackColorName(colorName)`. Uses `Color.FromName` then guards with `IsKnownColor`. Recognized names apply and log to the activity panel with the resolved hex; unrecognized names log a warning that names a few safe alternatives and keep the default in place.
- **`AgentHubPresenter/AgentHubPresenter.vb`**: in `OpenPresenter`, after `LoadAgents()` we call `LoadUiSettings()` then `AgentHubView.ApplyBackColorName(...)`. One-line wire-up; no changes to lifecycle order.

Build: all 9 projects clean. Tests: AgentHubTests 27/27 pass. End-to-end verified across three scenarios (explicit `GhostWhite` â†’ applied; missing `ui` section â†’ AliceBlue default; typo `"Bluberry"` â†’ falls back to default with the warning line in the log).

## Public release repo (commit `247a89b`, pushed to `dgplugge/interai-hub-clickonce`)

- **`Setup-InterAI-Hub.ps1`**: the generated `agent-hub-config.json` now includes a top-level `ui` block with `backColor = "AliceBlue"` and an inline comment listing the gentle alternatives (`GhostWhite`, `Lavender`, `Honeydew`, `WhiteSmoke`). Re-running the setup script writes the section explicitly so users can find it without reading docs.
- **`docs/QuickStart.md`**: new bullet under "What now?" â€” "**Tune the window color.**" â€” explains the override and points to the same `KnownColor` namespace.

## Why this shape

- The regex-walk JSON pattern already exists in `AgentConfigLoader` for `budgetGates`. Reusing it kept the diff small and avoided adding a JSON dependency to the loader.
- `IsKnownColor` is the right guard because `Color.FromName` returns a black `Color` with `IsKnownColor = false` for unrecognized names â€” silently honoring that would have given users a black window with no signal. The activity-log warning is the signal.
- Default stays AliceBlue. Any user who edited the file before this change still gets the same color they had.

## Open

- The Setup script's default is now the source of truth for new installs. Existing users (Don, Ben) keep whatever they edited last.
- Future: if we add more `ui.*` knobs, they slot under the same section without further loader changes â€” only the regex match list grows.

$DECISION: EXECUTE â€” feature complete and shipped on both repos.
---END---
