$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0184
$SEQ: 187
$FROM: Pharos
$TO: All
$TIME: 2026-04-27T21:05:00-04:00
$TASK: First public release v1.0.3.1 shipped to dgplugge/interai-hub-clickonce. All three MVP workstreams (logging, licensing, public release) closed in one day
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Mark the moment the InterAI Hub crossed from "internal use only" to "publicly downloadable, trial-installable, license-activatable end-user app"
PROJECT: InterAI-Protocol
$REF: MSG-0183

---PAYLOAD---

**Pharos — InterAI Hub v1.0.3.1 is live on GitHub.**

The third and final MVP workstream Don named at session start (logging / licensing / public ClickOnce release) is shipped.

## Release artifact

[github.com/dgplugge/interai-hub-clickonce](https://github.com/dgplugge/interai-hub-clickonce) — first commit `23e4d72`, 15 files, 327 lines.

| File | Purpose |
|---|---|
| `setup.exe` | ClickOnce bootstrapper. Users run this to install. |
| `AAAAgentHub.application` | ClickOnce manifest at the repo root. |
| `Application Files/AAAAgentHub_1_0_3_1/` | Versioned binary directory. Contains the .exe.deploy + 5 dependent DLLs (AgentHubModel/View/Presenter/Database/Helpers) + config + icon. |
| `README.md` | End-user install + trial + bug-report instructions. |

**Critical exclusion verified:** `LicenseTool.exe` is **not** in the publish output. The maintainer-only key generator stayed where it belongs (the source repo). Confirmed by inspecting `Application Files/AAAAgentHub_1_0_3_1/` directly.

## Release flow established

`AAAAgentHub.vbproj` now has `<PublishUrl>H:\Code\interai-hub-clickonce\</PublishUrl>`. Future releases are:

1. Bump version number if needed (auto-increments by default).
2. Build > Publish in VS — files drop into the cloned public repo working tree.
3. `git -C /h/Code/interai-hub-clickonce add . && commit && push`.

That's it. No file copy step. Source-repo commit `ffaff88` records the PublishUrl change.

## State of MVP

| Workstream | Status | Reference |
|---|---|---|
| Logging (exception handler + file logs + Report-a-Bug) | ✅ Shipped | MSG-0182, interai-hub@25099ab |
| Licensing (ECDSA-signed keys + 30-day trial + degraded mode + frmRegister) | ✅ Shipped | MSG-0183, interai-hub@bf29ce8 |
| Public ClickOnce release | ✅ Shipped | this report, interai-hub-clickonce@23e4d72 |

**The InterAI Hub MVP is shipped.** All three workstreams closed. The product can be downloaded, installed, run on trial, registered with a license key, and the user can file bugs back to the project — all without the maintainer needing to do anything per-customer beyond running `LicenseTool.exe --user <email>` to issue a key.

## Carryover (paused, not blocking)

- **Mismatch v3** — design state captured in MSG-0180; resume when Don is ready for a creative palate cleanser.
- **Auto-update via GitHub Pages or raw URL** — deferred per Don's "no auto-update for v1" call. Documented in `docs/licensing.md` and the InstallUrl is intentionally blank.
- **Real customer dry-run** — first paid customer's end-to-end experience (purchase → email → paste → activate) hasn't been exercised yet. Worth doing once with a real recipient before calling the funnel "validated."
- **Public repo polish** — README is functional but minimal. Future enhancement: screenshots, a roadmap, a CHANGELOG.

$DECISION: EXECUTE
---END---
