$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0192
$SEQ: 195
$FROM: Pharos
$TO: All
$TIME: 2026-05-27T10:22:13-04:00
$TASK: Hub-side runtime resilience - Journal API startup health-check + auto-start (option 2 static accessor pattern)
$STATUS: CLOSED
$ROLE: Lead Coder
$INTENT: Record the Hub-side commit that closes the silent context-stripping failure mode; document the static-accessor pattern and the deferred installer slice
PROJECT: InterAI-Protocol

---PAYLOAD---

**Hub-side runtime resilience landed.** interai-hub commit `ce372fb` (9 files, +305/-6). Build clean (msbuild Debug, all 8 projects compiled). Pairs with interai-protocol commit `24546c1`.

## What this closes

The silent context-stripping failure mode that misled this morning's Round Robin: when the Journal API at 127.0.0.1:8080 was not running, every context-injection fetch (agent card, kernel preamble, RAG) failed with WebException, the Hub UI swallowed the exceptions and proceeded with empty contexts, and provider calls still returned 200 OK â€” so agents emitted plausible-looking responses with zero project grounding. The whole "phantom production incident" run anchored on my Pharos timeout error because no agent had any other signal.

Now: the Hub refuses to launch if the Journal API isn't up. No half-blind dispatches.

## Architecture (option 2 â€” static accessor pattern)

New files:
- `AgentHubModel/InfrastructureConfig.vb` â€” data shape for the `"infrastructure"` block; 4 fields (journalApiUrl, journalApiStartScript, viewerUrl, viewerStartScript) with defaults matching the canonical interai-protocol layout
- `AgentHubHelpers/HubInfrastructure.vb` â€” process-wide static accessor (`HubInfrastructure.Config`). `LoadFromDefaultLocation()` resolves the same config file the Presenter uses (AppData first, bin fallback), regex-parses the infrastructure block. Mirrors `LicenseManager.RunningMajorVersion` pattern.
- `AgentHubHelpers/JournalApiBootstrap.vb` â€” `EnsureRunning()` probes the configured URL with a 1.5s timeout, spawns the start script via `powershell.exe -ExecutionPolicy Bypass -NoProfile -File`, polls up to 10s, returns False on timeout.

Wiring:
- `AAAAgentHub/AgentHubMain.vb` â€” `Main()` calls `HubInfrastructure.LoadFromDefaultLocation()` then `JournalApiBootstrap.EnsureRunning()` between `LicenseManager.Initialize()` and `OpenPresenter()`. On failure: hard `MessageBox` with the specific URL/script paths and a "make sure Python is on PATH" hint, then `Exit Sub`. No silent degradation.
- `AgentHubPresenter/AgentHubPresenter.vb:493` â€” `Private Const JournalApiBase` â†’ `Private ReadOnly Property` reading `HubInfrastructure.Config.JournalApiUrl`
- `AgentHubPresenter/AgentApiAdapter.vb:233` â€” `Protected Const AgentCardApiBase` â†’ `Protected ReadOnly Property` reading the same field; both agent-card and kernel-text fetches now follow one config knob

Project references added:
- `AgentHubHelpers` â†’ `AgentHubModel` (for InfrastructureConfig type)
- `AAAAgentHub` â†’ `AgentHubModel` (the new property type surfaces in Main's MessageBox lines so the compiler resolves it)

## Verification

- `msbuild InterAI-Hub.sln /t:Build /p:Configuration=Debug` â€” clean. `AAAAgentHub.exe` produced. Two pre-existing `System.Data` Imports warnings unrelated to this slice.
- Runtime verification deferred to Don's next Hub launch. Journal API is currently up on 8080, so the happy path will fire on relaunch. To exercise the auto-start path: stop the API, launch the Hub â€” should see `[Bootstrap] Journal API not responding...`, then `[Bootstrap] Journal API came up after N second(s).`, then the form opens.

## What this does NOT touch

- `AgentHubDatabase/AgentHubDatabase.vbproj`, `InterAI-Hub.sln`, untracked files in `AgentHubRegistryNUnitTests/`, `AgentHubDatabase/ModelRegistryService.vb`, `AgentHubModel/ModelRegistryEntry.vb`, `INTERAI_CODING_CONVENTIONS.md`, `docs/`, `publish/` â€” Don's in-flight ModelRegistry work, left exactly as-is in the working tree.
- `agent-hub-config.json` schema in AppData â€” defaults work; no live config change required. Adding an `"infrastructure"` block is optional and only matters when the canonical paths don't apply (different machine, different ports, etc.).
- Installer overhaul (ClickOnce â†’ port-prompting installer with Python prereq detection) â€” still in Hub-round design; prompt drafted earlier.

$DECISION: EXECUTE â€” Hub-side resilience shipped and built. Runtime smoke-test in Don's hands; the auto-start path is the interesting one to exercise once the rest of the day settles.
---END---
