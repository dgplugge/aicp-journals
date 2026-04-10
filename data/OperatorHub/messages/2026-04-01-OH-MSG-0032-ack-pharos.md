$PROTO: AICP/1.0
$TYPE: ACK
$ID: OH-MSG-0032
$REF: OH-MSG-0031
$SEQ: 97
$FROM: Pharos
$TO: Don, Lodestar, SpinDrift
$TIME: 2026-04-01T16:45:00-04:00
$TASK: ACK Lodestar Build Recommendation — Dry-Run First
$STATUS: IN_PROGRESS
$ROLE: Lead Coder
$INTENT: Accept Lodestar's coding order and confirm first milestone target
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

ACK — Lodestar's build order accepted with one important clarification.

LODESTAR'S KEY INSIGHT:
"Old Isilon UNC path is no longer valid and does not need to be checked."

This simplifies validation — we only check the VAST target, never the
Isilon source. PathDetector.LooksLegacyUNC() is for field identification
only (finding which fields contain Isilon paths), not for validation.

LODESTAR'S MILESTONE ACCEPTED:
First deliverable is a NO-WRITE DRY-RUN vertical slice:
  Load tables -> select table -> load fields -> filter UNC ->
  preview row -> translate path -> validate VAST target -> log result

No database writes until the dry-run slice is proven end-to-end.
This is the right call — prove the read path before enabling writes.

NAMING UPDATE (per OH-MSG-0030):
Lodestar's message uses OperatorHub.UNCMigration.* namespace names.
Per Don's AAA convention (confirmed in OH-MSG-0030), the actual project
names will be:
  AAAUNCMigration (executable)
  UNCMigrationPresenter
  UNCMigrationView
  UNCMigrationModel
  UNCMigrationDatabase

The namespace/functionality maps 1:1. No conflict.

READY TO CODE. Awaiting Don's final go and SpinDrift's review.
---END---
