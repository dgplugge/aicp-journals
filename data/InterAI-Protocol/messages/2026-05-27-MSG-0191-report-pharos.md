$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0191
$SEQ: 194
$FROM: Pharos
$TO: All
$TIME: 2026-05-27T10:07:06-04:00
$TASK: Runtime resilience slice (interai-protocol half) - viewer to 8081, Start-Viewer.ps1, infrastructure config doc
$STATUS: CLOSED
$ROLE: Lead Coder
$INTENT: Record the port-collision fix, new viewer launcher, and documented infrastructure config schema; flag the Hub-side health-check work as gated on the interai-hub repo
PROJECT: InterAI-Protocol

---PAYLOAD---

**Runtime resilience slice â€” interai-protocol half landed.** Commit `24546c1`.

## What triggered this

Hub debug output (today, ~14:58â€“15:00) showed the failure mode: API keys loaded fine, six agents reported ready, but every context-injection fetch silently failed because `api/server.py` on 127.0.0.1:8080 was not running. The Hub UI caught the WebExceptions, proceeded with empty agent cards / empty kernel preambles / no RAG context, and provider calls still returned 200 OK. The full last-round confusion (a phantom production incident built from a single Anthropic timeout) traces directly to this â€” no agent had any project anchor.

## Changes in this slice

- **viewer/server.py** `PORT = 8081` (was 8080). Resolves the long-standing collision with `api/server.py`.
- **viewer/agent-registry.json** â€” 5 agent webhook URLs moved to 8081.
- **aicp-ingress-workflow.json** â€” 8 n8n delivery URLs moved to 8081 (registry entries + inline JS in `Deliver Multi` node).
- **README.md**, **.claude/launch.json**, **.claude/loop.md**, **.claude/hooks/check-inbox.sh** â€” viewer port refs updated.
- **Start-Viewer.ps1** (new) â€” mirrors `Start-JournalAPI.ps1`. Spawns detached console, probes `/api/projects` after 2s.
- **docs/claude-project-brief.md** â€” added Viewer/Relay Server section; documented planned `infrastructure` config block (`journalApiUrl`, `journalApiStartScript`, `viewerUrl`, `viewerStartScript`).

## Verification

- `Start-JournalAPI.ps1` â†’ 8080 âœ“ (`Version 2.3.0`)
- `Start-Viewer.ps1` â†’ 8081 âœ“ (`Projects loaded: 4`)
- Both running side by side without conflict.
- Remaining 8080 refs in repo: all legitimate API-server references (Hub API, journal POST scripts).

## What is NOT in this slice (deliberately)

1. **Hub-side health check + auto-start** â€” lives in `H:\Code\interai-hub\AAAAgentHub\` (separate repo). Design is settled: probe `journalApiUrl` on Form_Load, spawn `journalApiStartScript` via PowerShell if down, 10-second poll, hard-fail dialog if still down. Blocked on Don pointing me at the VB.NET startup entry point.
2. **Installer overhaul (ClickOnce â†’ port-prompting installer)** â€” Hub round drafted for this; will run as Round Robin to surface installer choice (MSI/WiX, Inno, MSIX, portable zip) before any code.
3. **Viewer port becoming config-driven** â€” currently still baked in viewer/server.py. Will move with the installer slice when ports are prompted at install time.

## Concerning observations

- The Hub silently proceeds with stripped context when the API is down. Canaries catch this *if* Don asks for them in the prompt; passive detection is missing. The Hub-side auto-start fixes the runtime path; for the broader detection question, the production-phase Hub round will weigh in.
- The Hub source lives in a separate repo. Cross-repo coordination is part of what "production phase" needs to think through â€” should the two repos consolidate, or stay split with a versioned API contract between them?

$DECISION: EXECUTE â€” interai-protocol half shipped and verified. Hub half ready to land once VB.NET source location is provided.
---END---
