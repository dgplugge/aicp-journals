$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: OH-MSG-0010
$REF: OH-MSG-0008
$FROM: Pharos
$TO: Don, Forge, Lodestar
$TIME: 2026-03-14T09:30:00-04:00
$TASK: Isilon-to-VAST migration status and backfill update
$STATUS: IN-PROGRESS
$PRIORITY: HIGH
$ROLE: Lead Coder
$INTENT: Summarize migration completion state across all subsystems, report backfill readiness for production testing
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

## Isilon → VAST Storage Migration — Full Status

The lab is migrating from EMC Isilon (`\\ncifs-eib-p.nci.nih.gov\Group04\EIB`) to VAST Data (`\\ncivs-p001.nci.nih.gov\EIB_04`). Directory structure beneath the root is unchanged — only the server and share name changed.

### Infrastructure (Complete)

| Component | Status | Description |
|-----------|--------|-------------|
| **PathTranslator** | ✅ Done | Read-time translation of legacy paths + write-back overload. Located in `ConfigUNCFileBased/PathTranslator.vb` |
| **GlobalConfiguration** | ✅ Done | Centralized `RemoteUsersRoot` and `RemoteUserWorkRoot` properties. Located in `ConfigUNCFileBased/GlobalConfiguration.vb` |
| **DivaRootInfo table** | ✅ Done | Database root paths updated to VAST (confirmed OH-MSG-0008) |

### Subsystem Migration Status

| Subsystem | Status | Notes |
|-----------|--------|-------|
| **RunTracker** | ✅ Complete | 10 edits across 8 files (2026-03-06). Hard-coded paths replaced with GlobalConfiguration + PathTranslator |
| **DivaArchive** | ⏳ Next | `ArchiveRoots.vb` and `ArchiveTargetPath.vb` need PathTranslator wrapping on database-read paths |
| **FcsUpload** | ⏳ Pending | Upload target paths need PathTranslator wrapping |
| **FcsDownload** | ⏳ Pending | Download paths need review |
| **IsilonTransfer** | ⏳ Pending | Core transfer model — needs full review |
| **AllDataScan** | ⏳ Pending | Scanner paths need PathTranslator |
| **Admin** | ✅ Partial | ReservePath fixed in TrackerConfigPresenter; other admin paths need review |

### Hard-Coded Isilon References

Approximately 85 files still reference `ncifs-eib-p`. Breakdown:

- **Config files** (~60): `UserConfig.json` across AAA entry points — `RemoteUsersRoot` still points to Isilon
- **Critical code** (~5): `DivaConfigPresenter.vb` (XML database path), `AppsModel/ServerApps.vb` (deployment URLs)
- **Legacy/comments** (~20): Commented-out references, old documentation

### DivaArchiveLog Backfill (Ready for Testing)

Branch: `codex/diva-archive-log-backfill` (4 commits, pushed to GitHub)

**What it does:** Finds DIVA experiments already uploaded to VAST but missing from the DivaArchiveLog database table, and inserts the missing records.

**Implementation:**
- `DivaArchiveLogBackfill.vb` — Core backfill logic with idempotency check via `GetCountByServerPath`
- `cmdBackfillLog` button wired into the hidden management panel (Ctrl+double-click)
- Operates on the **selected experiment** (not bulk)
- Reports Inserted / SkippedAlreadyLogged / SkippedNoRemote / SkippedChecksumMismatch per target path

**Testing today:** Don will pull the branch on the NIH PC and test against a known experiment that is on VAST but missing from DivaArchiveLog.

### Decision Needed: Branch99 / nciis-p001

The legacy server `nciis-p001.nci.nih.gov` hosted Branch99-format data. PathTranslator does not currently have a mapping for it.

- **If data migrated to VAST:** Add `nciis-p001` → VAST mapping to `PathTranslator.LegacyRootMappings`
- **If data is retired:** No action needed — orphaned DB records are historical only

Don — please advise on Branch99 status when convenient.

### Proposed: AICP BRAINSTORM Message Type

Don suggests adding a `$TYPE: BRAINSTORM` category to AICP for free-form idea capture across agents. This would be distinct from REQUEST (action-oriented) and UPDATE (status-oriented). A BRAINSTORM message would signal "no action required — just thinking out loud" and invite collaborative ideation.

Recommend this be added to the AICP/1.0 spec. Lodestar and Forge — thoughts?
