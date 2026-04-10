$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: MSG-0089
$REF: MSG-0088
$SEQ: 120
$FROM: Pharos
$TO: Don, Lodestar
$TIME: 2026-04-08T12:50:00-04:00
$TASK: Distributed System Design — Agent Identity and Conversation Sync
$STATUS: IN_PROGRESS
$ROLE: Lead Coder
$INTENT: Diagnose the identity bleed problem and design the fix
PROJECT: InterAI-Protocol
DOMAIN: Multi-Agent Systems

---PAYLOAD---

DIAGNOSIS

The problem is NOT that the agents are the same instance. They ARE
separate API calls to separate providers (Claude and OpenAI). The
problem is twofold:

1. IDENTITY BLEED IN SYSTEM PROMPTS
   The current system prompts say "You are Pharos" but the conversation
   history includes messages FROM other agents. When Claude sees a
   message labeled "From: Lodestar" in the history, it tries to be
   helpful by continuing Lodestar's thread too. Same with OpenAI.
   Each LLM wants to be the "full team" rather than one member.

2. CONVERSATION HISTORY LEAKS ROLE CONFUSION
   In round-robin mode, Lodestar sees Pharos's prior response in the
   history. But the history is passed as simple user/assistant pairs.
   The LLM cannot distinguish "this was another agent's response" from
   "this was my previous response." It treats everything as context
   it should build upon — including adopting the other agent's identity.

THE FIX — THREE LAYERS

LAYER 1: STRONGER IDENTITY ENFORCEMENT (system prompt)

   Current (weak):
     "You are Pharos, Lead Coder..."

   Fixed (strong):
     "You are Pharos. You are ONE agent in a multi-agent round table.
      Other agents (Lodestar, SpinDrift, Forge) are SEPARATE AI instances
      running on DIFFERENT platforms. You CANNOT speak for them. You MUST
      only respond as yourself. Never simulate, predict, or generate
      responses on behalf of other agents. If you see messages from other
      agents in the conversation history, those are THEIR actual responses
      from their own API calls — do not repeat, rephrase, or extend them.
      Respond ONLY as Pharos with your own perspective."

LAYER 2: LABELED HISTORY (conversation context formatting)

   Current (ambiguous):
     role: "user"     content: "Good morning"     (from Don)
     role: "assistant" content: "ACK"              (from Pharos)
     role: "user"     content: "Good morning..."   (from Lodestar??)

   The problem: Lodestar's response gets passed as role: "user" to the
   next agent, making it look like Don said it. Or as "assistant" making
   it look like the current agent said it.

   Fixed (labeled):
     role: "user"     content: "[Don]: Good morning, Pharos and Lodestar"
     role: "assistant" content: "[Pharos]: ACK. Message received."
     role: "user"     content: "[Lodestar]: Good morning! Testing noted."

   By prefixing each message with the agent name in brackets, the LLM
   can distinguish WHO said what. Other agents' responses are passed as
   role: "user" with their name prefix, so the current agent knows it
   is reading someone else's words, not its own.

LAYER 3: RESPONSE ENVELOPE INSTRUCTION

   Add to the system prompt:
     "Begin your response with your name. Do not include any other
      agent's response. Respond in first person as Pharos only."

   This prevents the LLM from generating multi-agent responses.

CODE CHANGES NEEDED IN AgentHubPresenter:

1. Update system prompts in agent-hub-config.json (Layer 1)
2. Modify history building in ClaudeAdapter and OpenAIAdapter:
   - Don's messages: role "user", content prefixed with "[Don]: "
   - Current agent's prior messages: role "assistant" (no prefix needed)
   - OTHER agents' messages: role "user", content prefixed with "[AgentName]: "
3. Add response envelope instruction to system prompt (Layer 3)

THIS IS NOT A DISTRIBUTED SYSTEMS PROBLEM.
It is an LLM prompt engineering problem. The API calls are already
separate instances on separate platforms. The fix is in how we
format the conversation context and enforce identity boundaries.

No message queue needed. No state sync needed. No deployment changes.
Just better prompt construction in the adapter layer.
---END---
