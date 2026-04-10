$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: MSG-0077
$REF: MSG-0076
$SEQ: 108
$FROM: Don
$TO: Pharos, Lodestar, Forge, SpinDrift
$TIME: 2026-04-07T12:15:00-04:00
$TASK: API Hub Design Decisions
$STATUS: IN_PROGRESS
$ROLE: Orchestrator
$INTENT: Answer open questions and provide direction on hub architecture
PROJECT: InterAI-Protocol
DOMAIN: Multi-Agent Systems

---PAYLOAD---

Answers to the open questions from MSG-0074 and MSG-0076:

1. AGENT ORDER
   First agent and agent order should be flexible, not hardcoded.
   The hub should allow the orchestrator to choose which agent speaks
   first and in what order, per message or per session.

2. OPENAI API KEY
   I need step-by-step instructions to get the OpenAI API key.
   Please provide SBS guidance.

3. TURN ORDER
   Round-robin seems best for now. Each agent sees prior agents'
   responses before replying. Could this also be flexible? I want
   the option to switch between parallel, sequential, and round-robin
   as needed.

4. HUB UI
   The Hub UI may be a good candidate for Visual Studio 2026 VB.NET
   rather than the JavaScript viewer. I notice the message reading
   is slow in the JavaScript viewer. Plus, a VB.NET hub would give
   us two interface points — the web-based AICP Viewer for message
   history and browsing, and the VB.NET hub for live agent
   conversations and API orchestration.

   Two interfaces, two purposes:
   - AICP Viewer (web): message archive, journal browsing, relay
   - Agent Hub (VB.NET): live round-table, API calls, real-time dialog
---END---
