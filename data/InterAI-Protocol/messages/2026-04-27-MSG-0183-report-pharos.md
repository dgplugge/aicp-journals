$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0183
$SEQ: 186
$FROM: Pharos
$TO: All
$TIME: 2026-04-27T19:53:06-04:00
$TASK: Licensing system shipped end-to-end — ECDSA-signed keys, 30-day trial, degraded mode, registration form, maintainer-only key generator. Phase 1 complete; ready for first paying customers
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Move InterAI Hub from "internal use only" to "publicly distributable with trial-to-paid conversion path." Closes the second of three MVP workstreams (logging shipped earlier today as MSG-0182; ClickOnce release the only one remaining)
PROJECT: InterAI-Protocol
$REF: MSG-0182

---PAYLOAD---

**Pharos — Licensing system shipped end-to-end across 5 slices.**

Don directed the licensing workstream after the exception handler shipped. Five questions answered up front:

- **Trial expiry behavior** → degraded mode (10-second delay before each agent dispatch)
- **Key delivery** → email; user pastes into a registration form
- **License model** → buy once for current major version (1.x); upgrade fee for 2.x
- **Audience target** → thousands of users
- **All can change** → start with this; revisit if abuse appears

That set up Phase 1: offline asymmetric-signed keys, no server. Phase 2 (online activation) and Phase 3 (third-party SaaS) sit on top of this without redesign when they're justified.

## What landed

**interai-hub @ 336a5fc (Slice 1)** — crypto foundations, 7 files, 474 lines:
- `AgentHubHelpers/LicenseKey.vb` — wire-format model. Pipe-delimited line `<user>|<majorVersion>|<issuedISO>|<expiresISO-or-"never">|<sigB64>` then base64-wrapped for paste-friendliness. `TryParse` + `ToWireFormat` + `PayloadString` (the canonical bytes that get signed).
- `AgentHubHelpers/LicenseSigner.vb` — ECDSA P-256 + SHA-256, IEEE P1363 signature format. Public key embedded as compile-time `Const Pub_X` / `Const Pub_Y` (base64 of Q.X / Q.Y from the generated keypair). `Verify` (used by every Hub install) and `Sign` (used only by the maintainer's LicenseTool).
- New `LicenseTool/` console project — CLI parser, reads private D from `H:\Code\interai-hub-keys\signing.key`, signs a key for `--user / --version / --expires`, prints the wire-format string. Added to the solution but NOT to the ClickOnce publish manifest. Smoke-tested end-to-end: generated keys, parsed them, verified signatures, tampered with one byte → signature invalidated as expected.
- Generated ECDSA P-256 keypair via PowerShell. Private key saved to `H:\Code\interai-hub-keys\signing.key` (out of repo, never committed). Public key embedded in `LicenseSigner.vb`.

**interai-hub @ bba8f1f (Slice 2)** — runtime state, 4 files, 350 lines:
- `LicenseStatus.vb` — enum (Unknown / Trial / Licensed / Expired / Invalid).
- `TrialTracker.vb` — 30-day window. Defense-in-depth: writes first-run timestamp to BOTH the registry (`HKCU\Software\dgplugge\InterAI Hub\FirstRun`) AND a hidden file (`%APPDATA%\InterAI-Hub\.first-run`). On read takes the EARLIER of the two. Restores a missing location from the surviving one. Caps `DaysRemaining` so a clock-rewind can't extend the window.
- `LicenseManager.vb` — single static API: `CurrentStatus`, `LoadedKey`, `TrialDaysRemaining`, `Initialize()`, `TryActivate()`, `LicensePath()`, `StatusLine()`. Reads `%APPDATA%\InterAI-Hub\license.lic` if present, validates signature + version coverage + expiry, falls back to `TrialTracker` otherwise. `RunningMajorVersion` property set by `Sub Main`.

**interai-hub @ 063fdb4 (Slice 3)** — registration UI, 4 files, 223 lines:
- `AgentHubView/frmRegister.vb` — new modal form. Status banner contextual to current state (Trial: "N days remaining" / Licensed: "Already licensed: ..." / Expired: "Trial expired. The Hub is running in degraded mode" / Invalid: "Existing license is invalid"). Multi-line monospace TextBox for the ~200-char base64 key. Activate button calls `LicenseManager.TryActivate`. On success: confirmation MessageBox + DialogResult.OK. On failure: red status text with specific reason.
- `AgentHubView/frmAgentHub.vb` — new `cmdRegister` button at (8, 426) in `grpControls`, below `cmdReportBug`. Click handler opens `frmRegister` modally and logs the resulting status to the activity log on close.
- `frmAgentHub.Designer.vb` — `ClientSize` bumped 700 → 760 and `pnlLeft.Size` correspondingly so `cmdRegister` fits within `grpControls`' visible area.

**interai-hub @ bf29ce8 (Slice 4)** — dispatch enforcement, 3 files, 42 lines:
- `AAAAgentHub/AgentHubMain.vb` — `Sub Main` parses `VerInfo.GetVersion()` for the major version, sets `LicenseManager.RunningMajorVersion`, calls `LicenseManager.Initialize()` before `OpenPresenter`.
- `AgentHubPresenter/AgentHubPresenter.vbproj` — new `ProjectReference` to `AgentHubHelpers`.
- `AgentHubPresenter/AgentHubPresenter.vb` — new `ApplyLicenseDelay()` helper that sleeps 10 seconds when `CurrentStatus` is `Expired` or `Invalid`. Inserted before each `adapter.SendMessage` call in BOTH dispatch paths (round-robin/sequential at line ~614, parallel at line ~709). `LoadEvent` handler appends a `[license] <statusline>` line to the activity log on session start.

**interai-protocol (Slice 5)** — docs:
- `docs/licensing.md` (new) — full architecture: states, trial tracking, key format, generation flow, customer activation flow, version coverage rules, file inventory (shipped vs. maintainer-only), trade-offs, and the Phase 2 / Phase 3 upgrade paths. Pairs with `docs/exception-handling.md` for the operations-side documentation.

## Verification

- VS 2022 MSBuild Debug build of `InterAI-Hub.sln` — all 8 projects build clean (added `LicenseTool` brings the count to 8).
- `AgentHubTests` — 24/24 pass after every slice. No regression at any point.
- **Crypto round-trip**: generated a key via `LicenseTool --user smoketest@example.com --version 1`, parsed via `LicenseKey.TryParse`, verified via `LicenseSigner.Verify` → True. Tampered with one byte of the wire format → `Verify` → False. Confirmed signature integrity.
- **Not yet observed**: end-to-end UI smoke test. Don should re-launch the Hub from `AAAAgentHub.exe` and verify (1) activity log shows `[license] Trial — 30 days remaining` on first launch (or whatever current state), (2) `Register…` button appears at the bottom of `grpControls`, (3) clicking it opens the `frmRegister` modal with the contextual banner, (4) pasting the smoke-test key (output above) and clicking Activate writes `%APPDATA%\InterAI-Hub\license.lic` and changes the status banner. Degraded-mode delay can be smoke-tested by hand-editing the `.first-run` file to a date 31+ days ago.

## State of MVP

Three workstreams Don named for the public-shippable MVP:

| Workstream | Status |
|---|---|
| Logging enhancements | ✅ Shipped 2026-04-27 (MSG-0182) |
| Licensing software | ✅ Shipped 2026-04-27 (this report, Phase 1) |
| Public ClickOnce release | ⏳ Repo `dgplugge/interai-hub-clickonce` exists; awaiting first publish |

ClickOnce release is now the only remaining workstream. The license system is built around shipping via ClickOnce (the `LicenseTool` project is intentionally excluded from publish; the `signing.key` is outside any repo). When you decide to publish, the next step is a `Build > Publish` from VS targeting your local `publish/` directory, then copy the contents into `dgplugge/interai-hub-clickonce` and push.

## Out of scope (deferred to Phase 2/3)

- Online activation, machine binding, key revocation
- Subscription billing
- Third-party licensing SaaS (Cryptlex, LicenseSpring, KeyGen)
- Anti-debug / binary obfuscation
- License-key UI for users to view their own status (currently visible only via the `Register…` form's banner; a separate read-only "About / License" dialog would surface it more discoverably)

Documented in `docs/licensing.md` with the rationale for each.

$DECISION: EXECUTE
---END---
