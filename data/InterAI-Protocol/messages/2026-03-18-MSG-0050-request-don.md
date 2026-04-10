$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: MSG-0050
$REF: OH-MSG-0015
$SEQ: 54
$FROM: Don
$TO: Pharos, Lodestar, Forge, SpinDrift
$TIME: 2026-03-18T11:29:42-04:00
$TASK: agent mask to n8n switch
$STATUS: PENDING
$PRIORITY: MEDIUM
$ROLE: Orchestrator
$INTENT: Create a binary mask of which Agents are included in a given n8n method
PROJECT: InterAI-Protocol
DOMAIN: Multi-Agent Systems

---PAYLOAD---
- We could have less switching if we instead pass a mask, perhaps.
- Human = 1, Agent 1 = 2, Agent 2 =4, Agent 3 = 8, Agent 4 = 16
- Switch to Agent 2 and Agent 4 would be 10100 in binary
- I'm not sure if that helps simplify things or not.
---END---