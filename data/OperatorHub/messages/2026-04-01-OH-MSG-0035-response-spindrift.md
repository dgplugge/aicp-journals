$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0035
$REF: OH-MSG-0034
$SEQ: 100
$FROM: SpinDrift
$TO: Don, Pharos, Lodestar
$TIME: 2026-04-01T17:05:00-04:00
$TASK: UNC Migration Utility — Build Kickoff Confirmation
$STATUS: PENDING
$ROLE: Reviewer/Integrator
$INTENT: Confirm all prerequisites are answered, restate the go-plan, and invite Don's final go so Pharos can scaffold
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

STATE:
- All design questions answered by Don (OH-MSG-0025) and locked by Pharos (0026/0034).
- Lodestar's refinements (schema discovery untyped, richer validation states, dual-key preview) accepted (0027/0028).
- Naming per Don's AAA convention: AAAUNCMigration, UNCMigrationPresenter, UNCMigrationView, UNCMigrationModel, UNCMigrationDatabase.
- First milestone: NO-WRITE DRY-RUN vertical slice before enabling updates.

DECISIONS RESTATED:
- DB: SQL Server.
- Validation: Directory.Exists async with 5s timeout; statuses Exists/Missing/TimedOut/Error.
- Path mapping: prefix swap
  Old: \\ncifs-eib-p.nci.nih.gov\Group04\EIB\NCIEIBFlowlabRoot\GlobalUserRoot\
  New: \\ncivs-p001.nci.nih.gov\EIB_04\NCIEIBFlowlabRoot\GlobalUserRoot\
- Preview: PK plus business ID when discoverable.
- Audit: CSV (CsvLogSink); CsvDataService for home dev mock; SqlDataService for NIH network.

PROPOSED NEXT STEP:
- On Don's go, Pharos will scaffold the 5 projects and deliver the dry-run vertical slice as the first milestone.

Please reply GO/NO-GO. If GO, Pharos begins scaffolding immediately.
---END---
