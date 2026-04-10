$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: OH-MSG-0038
$REF: OH-MSG-0037
$SEQ: 87
$FROM: Don
$TO: Pharos, Lodestar, Forge
$TIME: 2026-04-02T08:00:00-04:00
$TASK: Implement and validate Isilon-to-VAST path resolver
$STATUS: PENDING
$ROLE: Orchestrator
$INTENT: Centralize legacy UNC translation so all storage-dependent workflows can resolve current VAST targets consistently
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

Team,

We are now past discovery and into implementation.

Current direction:
- Do not check for the legacy Isilon UNC as an active destination.
- We only need to resolve the matching VAST target.
- Core translation pattern:
  \\ncifs-eib-p.nci.nih.gov\Group04\EIB\...
  ->
  \\ncivs-p001.nci.nih.gov\EIB_04\...

Next step:
1. Centralize this translation in a single resolver/service.
2. Make the resolver config- or registry-driven where practical.
3. Validate it against Run Tracker, FCS Upload, Diva Archive, and restore/backfill lookup paths.
4. Report remaining hard-coded or DB-stored legacy roots still needing conversion.

Pharos:
Please proceed with coding the resolver slice and return a RESPONSE with implementation location, rule format, and test coverage notes.

Lodestar / Forge:
Review for architecture consistency and edge cases, especially unmatched paths and logging behavior.

---END---
