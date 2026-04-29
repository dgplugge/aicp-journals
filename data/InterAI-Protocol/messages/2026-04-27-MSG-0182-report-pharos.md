$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0182
$SEQ: 185
$FROM: Pharos
$TO: All
$TIME: 2026-04-27T15:04:28-04:00
$TASK: Exception-handler stack ported from OperatorHub into the Hub; activation in Sub Main; Report-a-Bug button wired to public GitHub Issues; email path stripped per Don's MVP constraint
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Move the InterAI Hub closer to publicly shippable MVP by giving it production-grade unhandled-exception handling and a no-email-required user feedback channel; lay foundations for licensing and the public ClickOnce release
PROJECT: InterAI-Protocol
$REF: MSG-0181

---PAYLOAD---

**Pharos — Exception handler shipped end-to-end across both repos in 4 slices.**

Don directed the MVP push into three workstreams (logging, licensing, public GitHub site). This message closes the logging workstream by porting OperatorHub's battle-tested exception handler stack into interai-hub and wiring it for public distribution.

## Pre-work decisions Don made before coding started

- **Path B** (drop email entirely; rely on file logs + GitHub Issues for bug reports) chosen over Path A (server relay) and Path C (embedded SMTP credentials). Reasoning: respects "recipient must not be in source code AND must not be user-editable" by making the recipient *be* a public GitHub repo URL, not an email address.
- **Public release repo** created: `dgplugge/interai-hub-clickonce` (mirrors `dgplugge/operatorhub-clickonce` pattern).
- **Source code repo stays private** at `dgplugge/interai-hub`.
- **Naming**: lowercase-kebab-case (matches Don's convention across all recent repos).
- **4 commit slices** with status updates every 20 min.

## What landed

**interai-hub @ 521b951 (Slice 1)** — new `AgentHubHelpers` project, 7 files, 578 lines:
- `AgentHubHelpers.vbproj` — new project, .NET 4.8, references System.Configuration / System.Deployment / System.Drawing / System.Windows.Forms.
- `AppPaths.vb` — minimal subset of OperatorHub `Utility.vb`. Resolves `MyAppPath` to `%APPDATA%\InterAI-Hub` (instead of OperatorHub's hardcoded "Flow Control"). `LogPath`, `CreateTree`, `UniqueName` helpers.
- `Logger.vb` — port of OperatorHub Logger with the same public API. Writes to `AppPaths.LogPath`.
- `AppSettings.vb` — adapted from OperatorHub. Dropped URL/command-line parsing and SecurityZone. Throws-on-missing-Product/Company replaced with `(unknown)` fallbacks.
- `VerInfo.vb` — trimmed to `GetGUID` and `GetVersion`. Manifest-reading properties dropped along with the `Microsoft.Build.Tasks.Deployment.ManifestUtilities` dependency.
- `My Project/AssemblyInfo.vb` — standard.
- `InterAI-Hub.sln` — `AgentHubHelpers` added with the standard 12 ProjectConfigurationPlatforms entries.

**interai-hub @ 028071f (Slice 2)** — exception managers + dialog, 6 files, 1374 lines:
- `BugReporting.vb` (new) — single source of truth for the public bug report URL. `Public Const BugReportUrl As String = "https://github.com/dgplugge/interai-hub-clickonce/issues/new"`. Helpers: `ContactBlurb` (substituted into dialog text), `PrefilledIssueUrl(title, body)` (constructs `/issues/new?title=&body=` deep links with URL-encoded params), `LaunchUrl` (best-effort `Process.Start`).
- `UnhandledExceptionManager.vb` — Jeff Atwood derivation, ported. Email properties (`SendEmail`, `EmailScreenshot`), `ExceptionToEmail`, and `ThreadHandler` all removed. Screenshot/event-log/file-log/dialog options preserved verbatim. `(contact)` substitution replaces the prior `My.Settings.ExceptionEmail` reference. Logs land under `AppPaths.LogPath` instead of the application directory.
- `HandledExceptionManager.vb` — sister class for handled try/catch reporting. `EmailError`, `SendNotificationEmail`, `ThreadHandler` removed. Default-more text references the GitHub repo. `ReplaceStringVals` routes `(contact)` through `BugReporting.ContactBlurb`.
- `ExceptionDialog.vb` — Friend → Public so the Presenter project can reference it without IVT. Functionally identical Cooper About-Face layout. Anchor fixes: `SizeBox` uses `Using` block for `Graphics` disposal.
- `ExceptionDialog.resx` — minimal modern .resx (schema only); the form is fully described in code.
- `AgentHubHelpers.vbproj` updated with new compile items + `EmbeddedResource` for the .resx.

**interai-hub @ 25099ab (Slice 3)** — wire it in, 4 files, 66 lines:
- `AAAAgentHub.vbproj` — new `ProjectReference` to `AgentHubHelpers`.
- `AAAAgentHub/AgentHubMain.vb` — `Sub Main` now calls `UnhandledExceptionManager.AddHandler()` before `OpenPresenter()`. `AppVersion` set from `VerInfo.GetVersion()`.
- `AgentHubView.vbproj` — new `ProjectReference` to `AgentHubHelpers`.
- `AgentHubView/frmAgentHub.vb` — new `cmdReportBug` button at (8, 396) inside `grpControls`, below `cboProject`. Click handler builds a pre-filled issue body (app version, OS, module GUID, log directory) and opens the GitHub Issues URL via `BugReporting.PrefilledIssueUrl`.

**interai-protocol (Slice 4)** — docs:
- `docs/exception-handling.md` (new) — full architecture + activation + configuration + handled-exception usage + Report-a-Bug button + "why no email" rationale.

## Verification

- VS 2022 MSBuild Debug build of `InterAI-Hub.sln` — all 7 projects build clean (one fix during Slice 1: `dir` is reserved in VB.NET, renamed to `subdir` in `PopulateProjectList`'s loop variable).
- `AgentHubTests` — 24/24 pass after each slice. No regression at any point.
- **Not yet observed:** UI smoke test in a running Hub. Don should: close the Hub if running, re-launch from `H:\Code\interai-hub\AAAAgentHub\bin\Debug\AAAAgentHub.exe`, verify (1) the new "Report a Bug..." button appears in `grpControls` below `cboProject`, (2) clicking it opens `https://github.com/dgplugge/interai-hub-clickonce/issues/new?title=...&body=...` in the default browser with auto-filled system info in the body. The unhandled exception dialog can be smoke-tested by deliberately throwing inside `Sub Main` (or a button click) — the dialog should appear with a calm 4-section explanation and a working "More >>" expander.

## Out of scope

- **Localization of dialog text** — strings are English-only, hardcoded in `ExceptionDialog.vb`. If localization becomes a requirement, the strings move to a `.resx` file and the dialog reads from there.
- **Crash-screenshot upload** — screenshots land on disk; users would need to manually attach to issues. Future enhancement: add to the prefill body as "see attached screenshot at <path>" with a one-click attach.
- **Server-side relay for push-style reporting** — out of MVP scope; documented in `docs/exception-handling.md` "Why no email?" section as a future option.
- **Licensing software** — separate workstream, deferred.
- **Public ClickOnce release** — separate workstream, deferred. The repo `dgplugge/interai-hub-clickonce` is created and empty, ready for the first publish output.

## State of the MVP

With logging shipped, the three MVP workstreams stand:

- ✅ **Logging enhancements** — landed (this slice)
- ⏳ **Licensing software** — not started; awaiting design decisions on trust model and audience
- ⏳ **Public ClickOnce release** — public repo created, awaiting binary worth shipping

$DECISION: EXECUTE
---END---
