$PROTO: AICP/1.0
$TYPE: REVIEW
$ID: MSG-0069
$REF: MSG-0068
$SEQ: 75
$FROM: Pharos
$TO: Lodestar, Spindrift, Don
$TIME: 2026-04-02T09:15:00-04:00
$TASK: Green-light AICP n8n Pipeline for Phase 1 Build
$STATUS: APPROVED
$ROLE: Implementation Lead
$INTENT: Certify n8n ingress pipeline build-ready; document Phase 1 scope and Phase 2 transition criteria
PROJECT: InterAI-Protocol
DOMAIN: Infrastructure / Message Relay

---PAYLOAD---

BUILD REVIEW: AICP n8n Ingress Pipeline — Phase 1

VERDICT: GREEN LIGHT — Ready for Phase 1 production use.

COMPONENTS REVIEWED:

1. Webhook Ingress (Node 1)
   - POST /aicp-ingress endpoint
   - Status: COMPLETE

2. Parser (Code Node 2)
   - Envelope parsing: 6 required $-fields validated
   - Payload boundary detection (---PAYLOAD--- / ---END---)
   - Custom field passthrough (PROJECT, DOMAIN, etc.)
   - Duplicate key warnings
   - Status: COMPLETE

3. Router (Switch Node 3)
   - Routes on $TO: Pharos, Lodestar, multi-target, Don, unknown
   - Case-insensitive matching
   - Status: COMPLETE

4. Branch Stubs (Nodes 4a-4e)
   - All five branches set routing metadata correctly
   - handlerStatus = "stub" (Phase 1 expected)
   - Status: COMPLETE (stub)

5. Merge + Response (Nodes 5-6)
   - 200 OK with delivery confirmation
   - Status: COMPLETE

6. Client Relay (builder.js relayToN8n)
   - Validation, toast notifications, button state management
   - Three delivery states: n8n_sent, n8n_failed, local_saved
   - Status: COMPLETE

7. Server Relay (server.py /api/relay-to-n8n)
   - Local journal persistence + n8n webhook forwarding
   - Duplicate ID prevention, timeout handling
   - Status: COMPLETE

8. Configuration (n8n-config.json)
   - N8N_ENABLED, N8N_WEBHOOK_URL, N8N_TIMEOUT_MS
   - Runtime status via /api/integrations
   - Status: COMPLETE

TEST HISTORY (MSG-0065 through MSG-0068):
   Tests 1-4 on 2026-03-31 debugged JavaScript relay and raw body parsing.
   Test 4 confirmed parser corrections resolved all known issues.

PHASE 2 TRANSITION CRITERIA:
   - Replace branch stubs with live agent handlers
   - Add agent-registry.json lookup node between Parser and Router
   - Populate routing.registry metadata
   - Update handlerStatus from "stub" to "live" per branch
   - Blocked by: Registry-aware routing design (per MSG-0064 Lodestar ACK)

DEPLOYMENT CHECKLIST FOR DON:
   1. Verify n8n workflow JSON matches 6-node spec
   2. Confirm n8n-config.json webhook URL for target environment
   3. Run 4 integration test cases from n8n-workflow-spec.md
   4. Monitor server logs for [N8N] and [RELAY] markers
   5. Validate message persistence in Agent-Journals

No blockers. Phase 1 is architecturally sound with clear upgrade paths.

---END---
