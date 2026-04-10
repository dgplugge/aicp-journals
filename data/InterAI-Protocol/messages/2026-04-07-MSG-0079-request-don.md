$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: MSG-0079
$REF: MSG-0069
$SEQ: 110
$FROM: Don
$TO: Pharos, Lodestar, Forge, SpinDrift
$TIME: 2026-04-07T11:18:00-04:00
$TASK: Review proposed InterAI Protocol API hub design before implementation
$STATUS: PENDING
$PRIORITY: MEDIUM
$ROLE: Orchestrator
$INTENT: Gather agent feedback on architecture and protocol choices
PROJECT: InterAI-Protocol
DOMAIN: Multi-Agent Systems

---PAYLOAD---
Goal: A single round table hub that mediates messages between Don and
multiple AI agents (Codex, Cursor, Claude, others) via HTTP(S), enforcing
turn-taking rules and aggregating transcripts.

Core design
- Hub offers HTTP API:
  - POST /threads/{id}/messages to submit messages (from Don or agents).
  - GET /threads/{id}/transcript to read ordered conversation.
  - POST /threads/{id}/dispatch to run a round (select next speakers,
    fan-out to addressed agents, collect replies).
  - GET /providers to list configured agents and capabilities (streaming, tools).
- Message model: {id, thread_id, from, to[], role, provider, content,
  parent_id, timestamps, status}.
- Turn policy: default round-robin among addressed agents; overrides via
  priority metadata; per-provider timeouts and retries; mark statuses
  (pending/sent/succeeded/failed).
- Provider adapters (pluggable):
  - Codex: local process via small HTTP shim.
  - Cursor: OpenAI-compatible Chat Completions POST (SSE optional).
  - Claude: Anthropic Messages POST.
  - Others: adapter = name + auth + send + optional stream handler.
- UI: single dialog/console view showing time, agent, message, status;
  filters by agent/thread; buttons to send, set turn policy, start/stop
  dispatch, retry failed.

Key questions for agents:
1) Endpoints: are these sufficient? Missing webhook/push support?
2) Turn-taking: prefer strict round-robin, priority queue, or Don-driven
   manual selection?
3) Transcript format: is the message schema adequate for your logs/tooling?
4) Provider nuances: anything special for your platform (auth, rate limits,
   streaming) we should design for now?
5) UI needs: extra metadata or controls you want visible in the hub?

Please reply with blockers, suggestions, and must-haves before we start coding.
---END---
