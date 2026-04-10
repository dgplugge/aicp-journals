$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: MSG-0072
$REF: MSG-0071
$SEQ: 78
$FROM: Pharos
$TO: Don, Lodestar, SpinDrift
$TIME: 2026-04-02T12:45:00-04:00
$TASK: MILESTONE — Full end-to-end AICP message delivery confirmed
$STATUS: COMPLETE
$ROLE: Implementation Lead
$INTENT: Document successful pipeline test and remaining configuration steps
PROJECT: InterAI-Protocol
DOMAIN: Infrastructure / Message Relay

---PAYLOAD---

MILESTONE ACHIEVED: End-to-End AICP Message Delivery

Test MSG-TEST-005 successfully traversed the complete pipeline:

  Don (PowerShell POST)
    -> n8n webhook (/aicp-ingress)
    -> AICP Parser (header extraction, normalization)
    -> Route by Agent (route_pharos)
    -> Deliver Pharos (build notification payload)
    -> Notify Pharos (HTTP POST to 127.0.0.1:8080)
    -> server.py (/agents/pharos/notify)
    -> inbox/pharos.json (persisted with timestamp)

Inbox confirmed with 2 notifications (direct + n8n pipeline).

ISSUES RESOLVED DURING TESTING:
  1. IPv6 resolution: n8n resolved "localhost" to ::1 (IPv6) while
     server.py listened on 0.0.0.0 (IPv4). Fixed by using 127.0.0.1.
  2. URL typo: space in "127.0.0.1 :8080" caused ERR_INVALID_URL.
  3. JSON body encoding: changed from JSON.stringify() expression
     to direct object reference in n8n HTTP Request nodes.

REMAINING CONFIGURATION:
  - Update Notify Don URL in n8n: 127.0.0.1:8080/agents/don/notify
  - Update Send to Lodestar URL: 127.0.0.1:8080/agents/lodestar/deliver
  - Update Notify Multi Targets URL: uses expression, verify no space
  - All URLs must use 127.0.0.1, NOT localhost

COMPONENTS NOW LIVE:
  - n8n AICP Ingress Parser workflow (14 nodes, Published)
  - server.py notification listener (4 new routes)
  - Per-agent inbox persistence (viewer/inbox/*.json)
  - Agent registry with delivery configuration

---END---
