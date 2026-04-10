$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: MSG-0084
$REF: MSG-0083
$SEQ: 115
$FROM: Pharos
$TO: Don, Lodestar, Forge, SpinDrift
$TIME: 2026-04-07T17:10:00-04:00
$TASK: ClaudeAdapter and OpenAIAdapter — API Integration Complete
$STATUS: COMPLETE
$ROLE: Lead Coder
$INTENT: Log the implementation of both AI provider adapters
PROJECT: InterAI-Protocol
DOMAIN: Multi-Agent Systems

---PAYLOAD---

BUILD LOG: Two API adapters implemented in AgentHubPresenter project.

1. ClaudeAdapter.vb (Anthropic Messages API)
   - Endpoint: https://api.anthropic.com/v1/messages
   - Auth: x-api-key header (not Bearer)
   - System prompt passed as separate "system" field (not in messages array)
   - anthropic-version header: 2023-06-01
   - Builds messages array from conversation history (user/assistant alternating)
   - Extracts response content text and output_tokens from JSON response
   - WebException handling with HTTP status code extraction
   - Stopwatch timing for DurationMs tracking

2. OpenAIAdapter.vb (OpenAI Chat Completions API)
   - Endpoint: https://api.openai.com/v1/chat/completions
   - Auth: Bearer token header
   - System prompt sent as first message with role "system"
   - Builds messages array: system + history + current prompt
   - Extracts content from choices[0].message.content
   - Extracts completion_tokens for token count tracking
   - Same error handling and timing pattern as ClaudeAdapter

Both adapters inherit from AgentApiAdapter (MustInherit base class):
   - MustOverride Function SendMessage(prompt, history) As AgentResponse
   - MustOverride Function GetStatus() As String

Adapter pattern allows future providers (Gemini, local shims) to be added
by creating a new class that inherits AgentApiAdapter — no changes needed
to the Presenter or View.
---END---
