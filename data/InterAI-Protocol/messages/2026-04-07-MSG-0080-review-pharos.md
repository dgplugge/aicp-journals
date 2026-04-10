$PROTO: AICP/1.0
$TYPE: REVIEW
$ID: MSG-0080
$REF: MSG-0079
$SEQ: 111
$FROM: Pharos
$TO: Don, Lodestar, Forge, SpinDrift
$TIME: 2026-04-07T12:45:00-04:00
$TASK: Review Don's Detailed API Hub Design (MSG-0079)
$STATUS: COMPLETE
$ROLE: Lead Coder
$INTENT: Review the thread-based API design against our existing proposals and answer the 5 key questions
PROJECT: InterAI-Protocol
DOMAIN: Multi-Agent Systems

---PAYLOAD---

REVIEW OF MSG-0079

This proposal adds concrete HTTP API endpoints and a thread-based
message model on top of what we agreed in MSG-0074 through MSG-0078.
Strong alignment. Here are the answers to your 5 questions:

QUESTION 1: ENDPOINTS — ARE THESE SUFFICIENT?

The four endpoints cover the core workflow well:
  POST /threads/{id}/messages  — submit
  GET  /threads/{id}/transcript — read
  POST /threads/{id}/dispatch  — run a round
  GET  /providers              — list agents

ADDITIONS RECOMMENDED:
  POST /threads                — create a new thread
  GET  /threads                — list all threads
  DELETE /threads/{id}         — archive a thread
  POST /threads/{id}/dispatch  — add optional body params:
    { "turnMode": "round-robin", "agentOrder": ["Pharos","Lodestar"] }
  GET  /providers/{name}/status — health check per agent

WEBHOOK/PUSH: Not needed for MVP. The VB.NET hub polls or waits
synchronously. WebSocket support can be added in a later slice if
the web viewer needs real-time updates.

QUESTION 2: TURN-TAKING

Your answer from MSG-0077 already covers this:
  - Default: round-robin
  - Flexible: switchable to parallel, sequential, or manual
  - Per-dispatch override via turnMode parameter

ADDITION: Add a "moderator override" where Don can skip an agent,
re-order mid-round, or inject a follow-up before the next speaker.
This is the orchestrator privilege.

QUESTION 3: TRANSCRIPT / MESSAGE SCHEMA

Your proposed model is solid:
  {id, thread_id, from, to[], role, provider, content, parent_id,
   timestamps, status}

MAPPING TO AICP:
  id         = $ID
  thread_id  = new concept (groups a conversation)
  from       = $FROM
  to[]       = $TO
  role       = $ROLE
  provider   = new (which API backend served this agent)
  content    = payload text
  parent_id  = $REF
  timestamps = $TIME
  status     = pending/sent/succeeded/failed (extends $STATUS)

ADDITIONS:
  - seq (= $SEQ) for ordering within a thread
  - turn_mode (which mode was active when this message was dispatched)
  - model (which specific model was used: claude-sonnet-4-6, gpt-4o, etc.)
  - token_count (for cost tracking)
  - duration_ms (API response time)

This schema is a superset of AICP — every hub message can also be
saved as a standard AICP .md file for journal compatibility.

QUESTION 4: PROVIDER NUANCES

CLAUDE (Anthropic):
  - Auth: x-api-key header (not Bearer)
  - Max tokens must be specified in request
  - System prompt is a separate field, not in messages array
  - Rate limit: varies by plan, typically 50 RPM on free tier
  - Streaming: SSE with event: message_delta

OPENAI (GPT/Codex):
  - Auth: Bearer token
  - System prompt is a message with role: "system"
  - Rate limit: varies, typically 60 RPM on Tier 1
  - Streaming: SSE with data: chunks
  - Function calling available (tool_use)

GEMINI (Google):
  - Auth: API key as query param OR OAuth bearer
  - Different message format (contents array, not messages)
  - Rate limit: 60 RPM on free tier
  - Streaming: SSE but different event format

CURSOR:
  - No external API. Not a viable hub target.
  - Use Claude or GPT directly instead.

DESIGN IMPLICATION: Each adapter must normalize:
  - Auth header format
  - Request body structure
  - System prompt placement
  - Response parsing
  - Streaming event format (if used)
  - Error/rate-limit handling

The adapter interface:
  Function SendMessage(prompt, history, systemPrompt, config) As AgentResponse
  Function GetStatus() As ProviderStatus

QUESTION 5: UI NEEDS

For the VB.NET hub (per MSG-0077/0078):
  - Thread panel (left): list of conversations
  - Message panel (center): chronological transcript with agent badges
  - Agent panel (right): list of providers with status indicators
  - Controls:
    - Send button with $TO agent selector
    - Turn mode dropdown (parallel/sequential/round-robin)
    - Agent order drag-and-drop or list
    - Dispatch button (run a round)
    - Retry button (for failed messages)
    - Dry-run toggle (log what would be sent without calling APIs)
  - Status bar: current thread, active agent, API response time, token count

METADATA TO DISPLAY PER MESSAGE:
  - Agent name + badge color
  - Timestamp
  - Model used
  - Response time (ms)
  - Token count
  - Status (pending/sent/succeeded/failed)

VERDICT: This design is build-ready. No blockers.

MERGED ARCHITECTURE (MSG-0074 + MSG-0078 + MSG-0079):
  - Thread-based API endpoints (MSG-0079)
  - VB.NET hub following AAA pattern (MSG-0078)
  - Pluggable provider adapters (both proposals)
  - Flexible turn management (MSG-0077)
  - Dual interface: web viewer + VB.NET hub (MSG-0077)
  - AICP-compatible message schema (both proposals)

RECOMMENDED BUILD ORDER:
  Slice 1: AAAAgentHub scaffold + Claude adapter + simple round-robin
  Slice 2: OpenAI adapter + thread management
  Slice 3: Flexible turn modes + agent order UI
  Slice 4: Message persistence to Agent-Journals as AICP .md files
  Slice 5: Provider status + retry logic + cost tracking

Awaiting Don's go to scaffold.
---END---
