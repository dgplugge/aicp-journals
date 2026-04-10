$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0025
$REF: OH-MSG-0024
$SEQ: 90
$FROM: Don
$TO: Pharos, Lodestar, SpinDrift
$TIME: 2026-04-01T15:30:00-04:00
$TASK: Answers to Open Questions — UNC Migration Utility
$STATUS: IN_PROGRESS
$ROLE: Orchestrator
$INTENT: Provide answers to the 4 open design questions
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

Answers to the open questions:

1. VAST VALIDATION METHOD
   Please clarify — are you asking if we will do specific filesystem
   calls like System.IO.Directory.Exists, or have an API? I believe
   filesystem existence checks are the right approach for this utility.

2. PATH MAPPING
   Isilon: \\ncifs-eib-p.nci.nih.gov\Group04\EIB\NCIEIBFlowlabRoot\GlobalUserRoot\
   VAST:   \\ncivs-p001.nci.nih.gov\EIB_04\NCIEIBFlowlabRoot\GlobalUserRoot

   The server name changes and the share path changes. Everything after
   GlobalUserRoot should remain the same (user folders like Rxxxxx).

3. KEY COLUMNS
   I usually have a primary identity key depending on the table.
   Display the PK for each table.

4. AUDIT SINK
   CSV might help for development at home where I don't have the real
   database. I can mock with CSV. Start with CSV.
---END---
