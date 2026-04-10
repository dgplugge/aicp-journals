$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0031
$REF: OH-MSG-0029
$SEQ: 96
$FROM: Lodestar
$TO: Don, Pharos, SpinDrift
$TIME: 2026-04-01T15:40:00-04:00
$TASK: Recommend next implementation step for UNC Path Migration Utility MVP
$STATUS: COMPLETE
$PRIORITY: HIGH
$ROLE: Design Advisor, Reviewer
$INTENT: Synthesize the current Operator Hub thread, confirm team alignment, and hand Pharos a clear coding start point for the UNC migration utility MVP
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

CURRENT STATE SYNTHESIS:
The team appears aligned on the MVP direction for the UNC Path Migration Utility.

Confirmed points:
- SQL Server backend
- 4-project MVP structure:
  .Data, .Model, .Presenter, .View
- TableAdapters and DB access confined to the Data project
- One table at a time, one row at a time in the UI
- Presenter may hold an internal candidate list from day one
- Dry-run mode included in MVP
- Preview before write is required
- Audit/logging included from the first version
- Validation target is the translated VAST path only
- Old Isilon UNC path is no longer valid and does not need to be checked

CONFIRMED ROOT TRANSLATION:
Old:
\\ncifs-eib-p.nci.nih.gov\Group04\EIB\...

New:
\\ncivs-p001.nci.nih.gov\EIB_04\...

RECOMMENDED NEXT STEP:
Pharos should begin implementation of the MVP skeleton now.

Suggested coding order:

1. SOLUTION / PROJECT SCAFFOLD
   Create the four projects and wire references cleanly

2. DATA PROJECT — FIRST PASS
   Implement:
   - schema discovery for tables and fields
   - candidate row loading
   - single-field update seam
   Keep all DB logic here.

3. MODEL PROJECT — FIRST PASS
   Implement DTOs and result models

4. PRESENTER — FIRST VERTICAL SLICE
   Wire a dry-run flow:
   - load tables, load fields
   - identify/select UNC field
   - preview candidate row
   - translate to VAST path
   - validate translated VAST target
   - log result without writing

5. VIEW — MVP SHELL
   Minimal WinForms surface

6. VALIDATION SEMANTICS
   Path validation should distinguish at least:
   - Exists / Missing / TimedOut / Error
   A timeout should not be treated as a confirmed missing path.

7. FIRST MILESTONE
   Deliver a no-write dry-run vertical slice first.
   Once that is working end-to-end, add the guarded single-field update path.

WHY THIS IS THE RIGHT NEXT STEP:
This starts implementation without overcommitting to batch logic, avoids
accidental writes too early, and proves the architecture with a safe
vertical slice before enabling update behavior.

REQUEST TO PHAROS:
Please begin coding the MVP skeleton and report back with:
- project scaffold completed
- first dry-run vertical slice status
- any blockers in schema discovery or path validation
---END---
