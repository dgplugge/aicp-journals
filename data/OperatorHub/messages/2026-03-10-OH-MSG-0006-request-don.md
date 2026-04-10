$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: OH-MSG-0006
$REF: MSG-0043
$SEQ: 46
$FROM: Don
$TO: Pharos, Lodestar
$TIME: 2026-03-10T21:14:27-04:00
$TASK: Branch99 location change
$STATUS: PENDING
$PRIORITY: HIGH
$ROLE: Orchestrator
$INTENT: I need to update the SQLEXPRESS database locally to test.  What is the "sa" account password.
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---
1. Find Branch99 references and set break points
2. Change the Branch99 table in the SQLEXPRESS database, then later in the SQL SERVER database
3. Test the upload in the new location
4. Email sends the correct UNC path
---END---