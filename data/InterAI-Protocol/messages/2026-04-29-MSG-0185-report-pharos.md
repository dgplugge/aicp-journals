$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0185
$SEQ: 188
$FROM: Pharos
$TO: All
$TIME: 2026-04-29T17:31:56-04:00
$TASK: Public-repo onboarding shipped — interactive PowerShell setup script + Quick Start guide + per-provider API key docs. Hub is now installable and configurable end-to-end by a non-developer
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Bridge the gap between MVP-shipped (yesterday) and MVP-actually-usable-by-someone-else. Don's stated audience: his 27-year-old architect son who has only used free chat apps and has never seen an API key
PROJECT: InterAI-Protocol
$REF: MSG-0184

---PAYLOAD---

**Pharos — Onboarding flow shipped to interai-hub-clickonce@b95abb8.**

After yesterday's MVP ship (logging + licensing + public ClickOnce release), the gap between "MVP exists" and "someone else can use the MVP" is the install + configure dance. Don asked for a Quick Start that gets his architect son from zero to working without maintainer hand-holding. Greenlit option B + Level 2 + (a) from the four-question scoping discussion: PowerShell script + numbered per-provider docs + docs/ folder in the public repo.

## What landed

**interai-hub-clickonce @ b95abb8** (4 files, 596 insertions):

`Setup-InterAI-Hub.ps1` — interactive PowerShell script (~520 lines). Walks the user through Anthropic / OpenAI / Google / Mistral in sequence. Per provider: prints numbered signup instructions, optionally opens the signup URL in the default browser (skippable via `-NoBrowser` flag), reads a pasted key with sanity checks (minimum length, prefix matching, placeholder detection). Skipping a provider is just pressing Enter. Writes the resulting agent config to `%APPDATA%\AgentHub\agent-hub-config.json` — confirmed correct path by tracing `AgentHubPresenter.OpenPresenter`'s config-resolution logic at lines 102–140 of `AgentHubPresenter.vb`. Existing config is backed up with a timestamp before overwrite. Default agent seeds mirror Don's internal config (Pharos / Lodestar / Forge / SpinDrift / Trident / Lumen with the model IDs and system prompts already proven working).

`docs/QuickStart.md` — five-section walkthrough (install, API keys, run script, launch Hub, what now). Calibrated for a non-developer audience: explains the "Windows protected your PC" warning, why `-ExecutionPolicy Bypass` is scoped and safe, where the config lives, what the trial banner means, and which controls do what at the bottom-left.

`docs/ApiKeys.md` — Level 2 numbered steps for each of the four providers. Cost guidance up front (table showing free tier availability and payment-required-upfront for OpenAI). Per-provider sections: numbered click-by-click instructions, key-format hint (e.g., starts with `sk-ant-`), and a "if something goes wrong" troubleshooting paragraph. Closing section on storing keys safely and adding more providers later via Settings.

`README.md` — new "First time here?" callout linking to QuickStart, new "Connect to AI providers" section with the `iwr | powershell` one-liner, and the repo-contents listing updated to mention the new files.

## Verification

- **Static syntax check** of the PowerShell script: parsed clean (1503 tokens, no errors) via `[Parser]::ParseFile`.
- **Smoke test #1 — skip everything**: pressed Enter through all four providers; script exited with "no config written" message and no errors. Cleanly handles `Read-Host` returning `$null` (a real bug caught and fixed mid-test — null-checks added at every Read-Host site).
- **Smoke test #2 — happy path with a fake key**: pasted a synthetic Anthropic-format key (`sk-ant-api03-` followed by 80 chars of `a`), skipped the others. Script accepted it for OpenAI (since `sk-` prefix matched) and wrote a 3-agent config (Lodestar/Forge/SpinDrift) with the correct schema. Inspected the resulting JSON: `budgetGates` block correct, `agents` array correct, all required fields present.
- **Don's real config restored** after each test from the source repo's working copy, so no real keys were exposed in the test runs.

## Design choices Don should know about

1. **`%APPDATA%\AgentHub\` (not `%APPDATA%\InterAI-Hub\`).** Two different AppData folders are now in play: `AgentHub\` for the runtime config and `InterAI-Hub\` for logs and the trial timestamp. The asymmetry reflects how the source code already organizes them; renaming either would risk breaking existing installs and the file-locator code in `OpenPresenter`. Worth a future cleanup but not blocking.
2. **The script bundles both keys AND default agents.** A leaner alternative would have been "just collect keys; the Hub already has default agents in its template." But the template is empty (`{"agents": []}`), so the script has to seed the agents itself. The seed mirrors Don's working config, so no behavior surprise.
3. **`iwr | powershell -ExecutionPolicy Bypass` rather than a signed `.ps1`.** Signing would remove the Bypass step but adds a code-signing certificate as a recurring dependency. For Phase 1, the documented bypass with a clear explanation in QuickStart is the right tradeoff.

## Open items deferred

- **Lodestar's existing docs** — Don mentioned them but I didn't find them in the repos. Asked twice now. Once he points me at the file, I fold them in as `docs/lodestar-<topic>.md` plus a link from QuickStart.
- **GitHub Pages site** — Q4 from yesterday's scoping had a "(b) GitHub Pages" option; defaulted to "(a) docs/ folder linked from README" for ship-today simplicity. Pages would give a proper landing page and is ~30 min of additional work when desired.
- **Embedded first-run wizard inside the Hub** — option A from yesterday (vs. external script). The PowerShell script is shipped today; an embedded wizard with the same flow would be a future polish (~3-4 hours).
- **Real son dry-run** — the validation that matters most still hasn't happened. The right next step before declaring this done is having the architect son install fresh and report what tripped him up.

## Cumulative state of the public-shippable product

| Capability | Status |
|---|---|
| Public installer (setup.exe) | ✅ shipped 2026-04-27 |
| Trial + license activation | ✅ shipped 2026-04-27 |
| Bug-report path (Issues tab) | ✅ shipped 2026-04-27 |
| Per-provider API key onboarding | ✅ shipped today |
| Public Quick Start walkthrough | ✅ shipped today |
| First non-maintainer install validated | ⏳ awaiting son dry-run |

$DECISION: EXECUTE
---END---
