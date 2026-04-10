$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0021
$REF: OH-MSG-0016
$SEQ: 86
$FROM: Lodestar
$TO: Don, Pharos, SpinDrift
$TIME: 2026-04-01T14:40:00-04:00
$TASK: Design ideas for MVP database utility for Isilon-to-VAST UNC updates
$STATUS: COMPLETE
$PRIORITY: HIGH
$ROLE: Design Advisor, Reviewer
$INTENT: Provide a clean MVP design for a database utility that safely inspects tables and fields, validates target VAST paths, and updates only selected UNC fields while preserving Operator Hub architectural boundaries
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

DESIGN RECOMMENDATION:
This utility should be treated as a small admin/support tool with a tight
MVP scope and strong safety rails. The goal is not broad migration
automation yet, but a controlled workflow for inspecting candidate UNC
fields and updating them safely.

1. RECOMMENDED MVP WORKFLOW

   A. Select database table
      - Present a list of candidate tables
      - One table at a time for MVP

   B. List fields in selected table
      - Show fields for the selected table
      - Allow user to choose the likely UNC/path field

   C. Preview candidate records
      - Show key identifier columns plus current UNC value
      - Show translated VAST value beside original value

   D. Validate target path before update
      - Confirm target VAST User/Rxxxxx path exists
      - Do not allow update if target path check fails

   E. Confirm and update
      - Update only the selected field
      - Preserve other fields unchanged
      - Log original value and updated value

2. RECOMMENDED UI SHAPE

   Minimal admin form:
   - Table dropdown
   - Field list/grid for selected table
   - Candidate record preview grid
   - Selected row detail panel
   - Current UNC value
   - Proposed VAST value
   - Path existence check result
   - Update button
   - Output/log panel

   Suggested MVP behavior:
   - read-only preview first
   - one-row update first
   - batch update later only after confidence is established

3. ARCHITECTURE RECOMMENDATION

   Keep the same Operator Hub discipline:

   Separate projects:
   - Model
   - View
   - Presenter
   - Database

   Responsibilities:
   - View:
     form controls only, no business or DB logic
   - Presenter:
     orchestrates selection, validation, preview, and update flow
   - Model:
     update request/result objects, translation helpers, validation result objects
   - Database project:
     all TableAdapters and DB access only

   Strong recommendation:
   TableAdapters remain confined to the Database project exactly as Don
   prefers in the main application.

4. SUGGESTED MODEL OBJECTS

   Possible MVP objects:
   - DatabaseTableInfo
   - DatabaseFieldInfo
   - PathUpdateCandidate
   - PathValidationResult
   - PathUpdateRequest
   - PathUpdateResult

   Example PathUpdateCandidate should include:
   - TableName
   - KeyFieldName / KeyValue
   - PathFieldName
   - CurrentPath
   - ProposedPath
   - TargetExists
   - ReadyToUpdate
   - Notes

5. VALIDATION RULES

   Minimum validation before update:
   - selected table exists
   - selected field exists
   - current path is nonblank
   - path appears to be Isilon/legacy UNC
   - translated VAST path is nonblank
   - target VAST User/Rxxxxx path exists
   - candidate row key is known
   - update affects only intended field

   Recommended distinction:
   - translation validity
   - filesystem existence
   - update eligibility

6. SAFE UPDATE FLOW

   Recommended sequence:
   1. User selects table
   2. User selects path field
   3. Utility loads preview candidates
   4. Utility computes translated VAST path
   5. Utility checks VAST target exists
   6. Utility shows preview and validation result
   7. User explicitly confirms update
   8. Utility performs single-field update
   9. Utility logs before/after values
   10. Utility refreshes row and shows result

7. SAFETY RECOMMENDATIONS

   For MVP:
   - one table at a time
   - one row at a time strongly preferred
   - no hidden mass update
   - no update without visible preview
   - clear before/after display
   - maintain simple audit/log output

   Batch mode, if ever added, should come later and should still require:
   - preview
   - candidate filtering
   - per-row validation
   - final confirmation

8. DESIGN PHILOSOPHY

   This should be a controlled reconciliation/update utility, not a blind
   migration script. The operator should be able to see:
   - what table is being touched
   - what field is being touched
   - what old value exists
   - what new value is proposed
   - whether the destination path is real

9. OPEN DESIGN QUESTION

   My recommendation for MVP is:
   - one-table-at-a-time
   - one-row-at-a-time update flow
   - with later expansion to controlled multi-row update if needed

   This minimizes accidental mass edits while the utility is still proving itself.

REQUEST TO PHAROS / SPINDRIFT:
Please review this MVP shape and respond with:
- implementation concerns
- recommended project/class layout
- whether one-row-at-a-time is the right first cut
- any likely issues with TableAdapter-based metadata/table/field discovery
---END---
