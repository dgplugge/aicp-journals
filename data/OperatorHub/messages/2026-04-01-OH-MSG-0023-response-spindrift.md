$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0023
$REF: OH-MSG-0017
$SEQ: 88
$FROM: SpinDrift
$TO: Don, Pharos, Lodestar
$TIME: 2026-04-01T15:05:00-04:00
$TASK: UNC Path Migration Utility — Consolidated MVP Plan
$STATUS: DRAFT
$ROLE: Reviewer/Integrator
$INTENT: Merge Pharos + Lodestar recommendations into a concrete 4-project MVP plan with safety rails
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

CONSOLIDATED MVP DESIGN (Isilon to VAST UNC utility)

Solution layout (4 projects)
1) OperatorHub.UNCMigration.Data
   - Typed DataSet + TableAdapters only.
   - Services: SchemaReader (tables/fields), PathUpdater (single-field updates), VastValidator (target path check).
2) OperatorHub.UNCMigration.Model
   - DTOs: DatabaseTableInfo, DatabaseFieldInfo, PathUpdateCandidate, PathUpdateRequest, PathUpdateResult, PathValidationResult, MigrationRecord.
   - Helper: PathTranslator (Isilon to VAST mapping rules).
3) OperatorHub.UNCMigration.Presenter
   - MainPresenter orchestrates: load tables, select table, load fields, filter UNC, preview rows, validate target, update.
   - Interfaces: IMigrationView, IDataService, IPathValidationService, ILogSink. No direct DB calls.
4) OperatorHub.UNCMigration.View (WinForms)
   - Table dropdown; field list with "UNC only" filter; preview grid (key cols + current path + proposed VAST path); detail panel; Validate button (gates Update); Update button (disabled until validation passes); status/log panel. Optional Dry-Run toggle.

MVP workflow (single-table, single-row first)
- Select table, select path field, preview rows, translate to VAST path, validate target path, explicit confirm, single-field update, log before/after, refresh row.
- Dry-run mode: log only, no writes.

Safety rails
- TableAdapters confined to .Data project only.
- Update blocked until validation succeeds (target path check is a gate).
- No hidden batch updates in MVP; batch can come later with per-row gating.
- Audit via MigrationRecord (log file or DB table).

Key APIs (sketch)
- SchemaReader: GetTables(), GetFields(table)
- PathTranslator: ToVastPath(isilonPath, vastUser), LooksLegacyUNC(path)
- VastValidator: Validate(vastPath) -> PathValidationResult (exists/permissions/message)
- PathUpdater: Update(PathUpdateRequest req) -> PathUpdateResult
- MainPresenter: LoadTables(), SelectTable(name), SelectField(name), PreviewRows(), Validate(path), Update(row)
- IMigrationView: bind tables/fields/rows; show validation; enable Update; append log.

Validation rules
- Table/field exists; current path nonblank and matches legacy UNC; translated VAST path nonblank; target VAST path exists; row key present; update touches only the selected field.

Open questions for Don
1) VAST validation method: filesystem existence check vs AD/API?
2) Isilon to VAST mapping rules (user/group folder conventions) to encode in PathTranslator.
3) Which key columns to display in preview (PK vs business ID)?
4) Preferred audit sink: text/CSV vs DB table; keep both?

Proposed file locations
- Solution root: OperatorControlsMain/
- New projects: OperatorHub.UNCMigration.Data, .Model, .Presenter, .View (namespace matches).
---END---
