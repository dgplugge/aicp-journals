$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0189
$SEQ: 192
$FROM: Pharos
$TO: All
$TIME: 2026-04-30T14:05:47-04:00
$TASK: Project-scoped kernel injection in Hub broadcast - landed and verified end-to-end
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Record the kernel injection feature, per-kernel canary additions, and dual-canary smoke test results
PROJECT: InterAI-Protocol

---PAYLOAD---

**Project-scoped kernel injection in the Hub broadcast â€” landed and verified end-to-end.**

This closes state-of-project enhancement #11 (Tier 4, 2026-04-29). The agent half of the prompt-assembly stack was correct; the kernel half was missing the Hub-broadcast wiring. Both halves now run through `BuildSystemPrompt` on every dispatch when the active project is mapped: order = `kernel preamble -> "---" -> agent card -> (existing journal/RAG/user)`.

## Hub source repo (commit `e353bbb`)

- **`AgentHubModel/KernelMap.vb`** (new): case-insensitive project -> kernel-short-name lookup.
- **`AgentHubModel/AgentHubModel.vbproj`**: compile entry for KernelMap.
- **`AgentHubDatabase/AgentConfigLoader.vb`**: `LoadKernelMap()` â€” regex-walk parser, mirrors `LoadBudgetGate` / `LoadUiSettings`. Absent section is not an error.
- **`AgentHubPresenter/AgentApiAdapter.vb`**: `ActiveKernel` property + `FetchKernel()` HTTP+TTL cache (5-min, mirrors `FetchAgentCard`). `BuildSystemPrompt` now: `If kernel + card -> kernel + "---" + card; else current card-only behavior preserved`.
- **`AgentHubPresenter/AgentHubPresenter.vb`**: loads `KernelMap` at startup, resolves and arms `adapter.ActiveKernel` per-agent in both `DispatchNextAgent` (sequential) and `DispatchAllAgents` (parallel). Logs `[<agent>] Kernel: <name>` so the operator sees injection per-dispatch.
- **`AgentHubTests/KernelMapTests.vb`**: 9 tests covering `Resolve` happy/missing/case-insensitive/empty + `LoadKernelMap` present/absent/file-missing/empty-block/sibling-section-isolation. **All 9 pass; full solution build clean (0 warnings, 0 errors).**

## Protocol repo (commit `b8382b2`)

- **`api/server.py`**: new `GET /kernels/{name}/text` endpoint. Returns `{name, label, version, text, token_estimate}` â€” symmetric with `/agents/{name}/card`.
- **`kernels/kernel-mvp-build.md`** (1.5 -> 1.6): `---CANARY---` section near the top with value `mvp-build/2026-04-30/cygnus-anchor` and the standard "echo only when current turn asks" rule (mirrors agent canary discipline).
- **`kernels/kernel-acal-dev.md`** (1.0 -> 1.1): same pattern, value `acal-dev/2026-04-30/orion-beacon`.

## Config shape

Optional top-level `kernels` block in `agent-hub-config.json`:

    "kernels": {
        "InterAI-Protocol": "mvp-build",
        "ACAL-Dev": "acal-dev"
    }

Projects without a mapping skip the kernel preamble entirely â€” existing card-only dispatch preserved. No-op for users who don't add the block.

## Smoke test results â€” 2026-04-30 14:02-14:03

Round Robin, all 6 agents, project = InterAI-Protocol, prompt: "Two-part smoke test... output your agent canary and the kernel canary." All 6 returned both values verbatim:

| Agent     | Agent canary               | Kernel canary                              |
|-----------|----------------------------|--------------------------------------------|
| Pharos    | PHAROS-CANARY-P7H2M-89N    | mvp-build/2026-04-30/cygnus-anchor         |
| Lodestar  | LODESTAR-CANARY-L3J7K-42X  | mvp-build/2026-04-30/cygnus-anchor         |
| SpinDrift | SPINDRIFT-CANARY-S9W4H-17R | mvp-build/2026-04-30/cygnus-anchor         |
| Forge     | FORGE-CANARY-F5M3P-73Q     | mvp-build/2026-04-30/cygnus-anchor         |
| Trident   | TRIDENT-CANARY-T6V1C-88E   | mvp-build/2026-04-30/cygnus-anchor         |
| Lumen     | LUMEN-CANARY-U2Y8G-55T     | mvp-build/2026-04-30/cygnus-anchor         |

This proves both injection paths land cleanly and the new code did not regress the existing card path. All four providers (Anthropic, OpenAI, Gemini, Mistral) tolerate the longer system prompt without truncation or timeout. Lumen took the summarizer role as last speaker.

## Side observations (non-blocking)

- **Forge**: 9.9 s / 810 tokens for a 2-line response â€” documented o3-mini reasoning overhead. Worked here, but reaffirms the Tier 3 enhancement #7 (o3-mini investigation) for cost optimization.
- **SpinDrift**: prepended an AICP envelope to a "just the values" prompt â€” a minor card discipline tic, not a kernel injection issue. Tier 3 enhancement #6 territory.

## Token cost going forward

Kernel preamble adds ~3.2k input tokens per agent per dispatch. Round Robin x 6 = ~19k extra/round; Hourglass x 6 = ~38k extra/round. Anthropic prompt cache absorbs most repeat injection within a 5-minute window. First dispatch of the day pays full freight.

## Out of scope this PR

- Item #12 (mJournalContext refresh on project switch): separate change, separate sign-off.
- Tier 5 #18 (kernel update protocol â€” Hub writes back into kernel STATE/MEMORY): unchanged. Kernels are still read-only.
- ClickOnce setup-script update to include the `kernels` block by default: existing users opt-in via manual edit; new installs see card-only behavior until they add the block. Worth a small follow-on commit when convenient.

$DECISION: EXECUTE â€” feature complete, deployed to Hub source `e353bbb` and protocol `b8382b2`, verified end-to-end via dual-canary smoke test.
---END---
