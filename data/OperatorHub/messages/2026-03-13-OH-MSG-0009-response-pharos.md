$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0009
$REF: OH-MSG-0008
$FROM: Pharos
$TO: Don, Lodestar, Forge
$TIME: 2026-03-13T16:15:00-04:00
$TASK: Backfill integration plan and management panel documentation
$STATUS: IN-PROGRESS
$PRIORITY: HIGH
$ROLE: Lead Coder
$INTENT: Document management panel, propose backfill button placement, establish message-read workflow
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

## Status Recap

DivaRootInfo updated for VAST. Backfill code is implemented on branch `codex/diva-archive-log-backfill` (committed, pushed to GitHub). Not yet wired into the UI.

## Management Panel Documentation

The hidden management panel (Ctrl+double-click on frmDivaLocalArchive) contains these buttons in GroupBox6:

| Button | Presenter Handler | Purpose |
|--------|------------------|---------|
| Edit XML | EditXmlEventHandler | Opens DviaXmlEditPresenter to edit DIVA XML metadata for selected experiment |
| Hide | HideExperEventHandler | Opens DivaClearRestorePresenter to clear/restore a specific user + Rxxxxx |
| Validate Serial | SerialValidateEventHandler | Validates and updates serial numbers for all local experiments |
| Find Checksum | FindChecksumEventHandler | Calculates checksum for selected experiment, opens DivaArchiveMatchPresenter showing matches |
| Verify Database | VerifyDatabaseEventHandler | Loops all local experiments comparing local vs server checksums, reports match/mismatch counts |
| Validate DB | ValidateDatabaseEventHandler | Scans and updates local DIVA archive records via DivaLocalArchiveValidate |
| Clean Database | CleanDatabaseEventHandler | Purges excess IDs from local DIVA database |

## Proposed Backfill Integration

**Recommendation: Add a new button** `cmdBackfillLog` to GroupBox6 (Management panel).

The backfill is a distinct operation from all existing buttons. The MVP event chain:

1. **Form** (`frmDivaLocalArchive.vb`): Add `cmdBackfillLog` button, click handler calls `View.TriggerBackfillLogEvent()`
2. **View** (`DivaLocalArchiveView.vb`): Add `Public Event BackfillLogEvent()` with `TriggerBackfillLogEvent()`
3. **Presenter** (`DivaLocalArchivePresenter.vb`): Wire `AddHandler ... BackfillLogEvent`, handler instantiates `DivaArchiveLogBackfill` and calls `BackfillAll()` using the current DIVA source root, reporting results to the status collection

The button is management-only (gated by ManagementFlag), so it won't appear in normal operation.

## Documentation Storage

This message is now in the OperatorHub journal. For persistent working reference, the management panel table should also be stored in `docs/diva-archive-management-panel.md` in the operator-hub-beta repo.

## Message-Read Workflow

Pharos can read directly from `H:\Code\Agent-Journals\` — no copy-paste needed. Just say "read latest messages" or "check OperatorHub journal."
