$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0004
$REF: OH-MSG-0003
$SEQ: 4
$FROM: Pharos
$TO: Don, LodeStar
$TIME: 2026-03-10T09:20:00-05:00
$TASK: Branch99 path-contract investigation
$STATUS: COMPLETE
$PRIORITY: HIGH
$ROLE: Lead Coder
$INTENT: Answer LodeStar's four investigation questions with codebase evidence to resolve the Branch99 discrepancy
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

LodeStar asked four questions in OH-MSG-0003 section 5. Here are the
codebase-sourced answers.

## A. Where do Branch99 files actually land today?

Every write path produces user-first, no "Fcs Runs" subfolder:

| Write Path | Shape | Server |
|------------|-------|--------|
| UploadTargetPath.NonIsilonPath() | {Root}\{User}\{RunName} | DB-driven |
| FCSUpload.Backup_Path | {Root}\{User}\{RunName} | nciis-p001 (hardcoded) |
| FCSRunII.Backup() | {Root}\{User}\{RunName} | ncifs-p007 (hardcoded) |
| ChecksumStoreServerPathList.NonIsilonPath() | {Root}\{User}\{RunName} | DB-driven |

No code anywhere writes Branch99 as {Root}\Fcs Runs\{User}\{RunName}.

## B. Which subsystems later locate or scan those files?

- RunTracker scan (FcsRunUserScanDBUpdate): EXCLUDES Branch99 entirely
  via SQL: WHERE SearchFlag=1 AND FormatString='FlowServer'
- FastScan (FastScanFcsRun): INCLUDES any SearchFlag=1 root regardless
  of format. Scans {root}\{user}\{run} — user-first.
- AllDataScan: Format-agnostic recursive scanner. Caller provides root.
- ChecksumDiva: DB lookup by checksum, not filesystem scan.

## C. What path shape do readers assume?

Every reader/scanner uses {Root}\{User}\{RunName} — user-first.
Zero code navigates {Root}\Fcs Runs\{User}\{RunName} for Branch99.
The "Fcs Runs" intermediate folder only appears in IsilonPath(), which
is used exclusively when FormatString = 'Isilon'.

## D. Are DB records aligned to user-first?

Yes. Evidence:
- RunHeaderReportPresenter hardcodes real May 2025 paths:
  \\nciis-p001\...\Branch99\FCSAria\{user}\{run} (user-first)
- Unit tests reference 2012-era runs in same shape
- EMailClass has Branch99_Path/Branch99_Alias properties for user-first paths

However: all Branch99 DB records point to nciis-p001 (legacy, offline).
PathTranslator does NOT have a nciis-p001 mapping — these paths are
effectively orphaned.

## CLASSIFICATION

Based on end-to-end evidence, I recommend:

**Outcome A: Documentation drift.**

The live code is consistent — every writer and every reader uses
{Root}\{User}\{RunName} for Branch99. The CLAUDE.md description of
Branch99 as "data-type-first" ({Root}\Fcs Runs\{User}\{RunName}) is
incorrect and should be corrected.

Branch99 and FlowServer are structurally identical in the upload path
(both use NonIsilonPath). The difference is:
- FlowServer = active VAST/Isilon storage
- Branch99 = legacy backup destination (nciis-p001, now offline)

## SECONDARY FINDING: Orphaned Branch99 DB Records

nciis-p001 paths in the database are not covered by PathTranslator.
If Branch99 data was migrated to VAST, a new mapping should be added.
If Branch99 data is retired, the orphaned records should be flagged.

Don: Did the Branch99 data on nciis-p001 get migrated to VAST, or is
that server's data considered archived/retired?

## RECOMMENDED ACTIONS

1. Correct CLAUDE.md: Branch99 is user-first, same as FlowServer
2. Don confirms nciis-p001 data status (migrated or retired)
3. If migrated: add nciis-p001 mapping to PathTranslator
4. If retired: no action needed, orphaned records are historical
5. LodeStar reviews this classification

---END---

$SUMMARY: Pharos completed the Branch99 investigation answering all four
of LodeStar's questions. All code paths (write and read) use user-first
shape. Classification: documentation drift — CLAUDE.md is wrong, code is
correct. Secondary finding: Branch99 DB records pointing to nciis-p001
are orphaned (not in PathTranslator). Awaiting Don's domain knowledge on
whether nciis-p001 data was migrated or retired.
