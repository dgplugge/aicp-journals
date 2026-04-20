$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: MSG-0162
$REF: MSG-0161
$SEQ: 165
$FROM: Pharos
$TO: Don, Lodestar, Forge, SpinDrift, Trident, Lumen
$TIME: 2026-04-20T14:45:07-04:00
$TASK: Hub card injection — live verification, payload logging, preview mode, SystemPrompt conflict fix
$STATUS: DONE
$ROLE: Lead Coder
$INTENT: Record today's work: canary verification of card injection, Hub-side logging & preview features, fix for legacy SystemPrompt overriding cards
PROJECT: InterAI-Protocol

---PAYLOAD---

Today 2026-04-20: agent profile card system moved from LATENT to verified-live-end-to-end, plus Hub-side observability.

1. Forge profile card added (agents/forge.md)
   - Role: Reliability Engineer / Production Readiness.
   - 7 hard prohibitions including 'do not propose monitoring for features not yet live' and 'do not post the same proposal twice in one round' (explicit MSG-0164 evidence cited in the card).

2. Canary verification mechanism added to all five carded agents
   - agents/{lodestar,spindrift,trident,lumen,forge}.md — each now has a '## Canary' section with a unique string.
   - End-to-end test (13:46 dispatch): 4/5 carded agents returned canary verbatim (Lodestar, Forge, Trident, Lumen). Pharos correctly returned 'No canary in my card' (uncarded, 404 fallback). SpinDrift initially failed — root-caused in step 4.

3. Hub-side additions (interai-hub repo):
   a. Payload logging — AgentHubPresenter/AgentApiAdapter.vb: new LogOutgoingPayload(body) writes every outgoing provider request body to %APPDATA%\\AgentHub\\payloads\\ with timestamp, agent, provider, model, endpoint, and raw JSON. Called from all three HTTP adapters (Claude/OpenAI/Gemini) right after body assembly. Wrapped in try/catch — logging failure cannot break dispatch. This is ground truth for all future card-injection and prompt-layering debugging.
   b. Preview mode — new chkPreviewMode checkbox in grpControls (added programmatically to avoid WinForms Designer regeneration). When checked, AgentApiAdapter.IsPreviewMode = True and adapters short-circuit before HTTP POST, returning the assembled body as the response content labeled '=== PREVIEW — NOT SENT TO PROVIDER ==='. Zero provider tokens burned. Wired via AgentHubView.PreviewModeEnabled property + TogglePreviewModeEvent + AgentHubPresenter handler.

4. Fix: BuildSystemPrompt() now returns the card alone when a card exists.
   - Previous behavior concatenated card + Config.SystemPrompt (card first, SystemPrompt last).
   - Config.SystemPrompt is a legacy per-agent field from before cards existed, configured in the Settings dialog.
   - Payload log captured SpinDrift's system message from the 14:12 canary round: card (including canary section) followed by legacy Config.SystemPrompt text 'Consolidate proposals from other agents... produce actionable merged plans.' This is a direct 180-degree inversion of the card's 'You are NOT the synthesizer — consensus builds itself from good individual positions.' Recency favored the trailing legacy text, so SpinDrift ignored the canary instruction and fell back to reviewer/consolidator mode.
   - Fix: card alone when present; Config.SystemPrompt is fallback only for uncarded agents. One-line change at AgentApiAdapter.vb:BuildSystemPrompt. The Config.SystemPrompt field stays in the Settings dialog for uncarded agents but is ignored for carded ones.

5. Findings flagged for future decisions (not actioned this session):
   a. SUMMARIZER ROLE injection — AgentHubPresenter.vb:389-401 unconditionally appends a 'emit a ROUND SUMMARY section' block to the current-prompt for whichever agent is last in turn order. Direct conflict with Lumen's card rule against unsolicited summaries. Preliminary evidence from the 14:12 round: Lumen's very specific canary instruction overrode the SUMMARIZER injection this time (Lumen returned canary only, no summary table). So specificity can beat generality even within a user message. Decision deferred: possibly strip the SUMMARIZER injection entirely and move summarizer ownership to Pharos's card (once Pharos is carded) — would also remove ~15 lines of VB.NET and reduce token overhead per round.
   b. Don's prompt duplicated in messages array — included once via Session.Messages history AND appended again as the 'current prompt' at adapter call time. Visible in every payload log. Minor token waste per dispatch.
   c. Pharos responses earlier today operated on stale journal context — Hub injects a journal snapshot at session start, today's work had not been journaled, so Pharos responded as if cards were still LATENT and canaries did not exist. This journal entry is the remediation; next Hub session will pick it up.

Files changed this session:
  interai-protocol/agents/forge.md (new)
  interai-protocol/agents/lodestar.md (canary)
  interai-protocol/agents/spindrift.md (canary)
  interai-protocol/agents/trident.md (canary)
  interai-protocol/agents/lumen.md (canary)
  interai-hub/AgentHubPresenter/AgentApiAdapter.vb (log + preview + BuildSystemPrompt fix)
  interai-hub/AgentHubPresenter/ClaudeAdapter.vb (log + preview hook)
  interai-hub/AgentHubPresenter/OpenAIAdapter.vb (log + preview hook)
  interai-hub/AgentHubPresenter/GeminiAdapter.vb (log + preview hook)
  interai-hub/AgentHubView/frmAgentHub.vb (chkPreviewMode)
  interai-hub/AgentHubView/AgentHubView.vb (PreviewModeEnabled + event)
  interai-hub/AgentHubPresenter/AgentHubPresenter.vb (toggle handler)

Commits forthcoming: two separate atomic commits, one per repo.
---END---
