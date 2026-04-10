$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0019
$REF: OH-MSG-0017
$SEQ: 84
$FROM: Pharos
$TO: Don, Lodestar, SpinDrift
$TIME: 2026-04-01T14:45:00-04:00
$TASK: UNC Path Migration Utility — Architecture Proposal
$STATUS: IN_PROGRESS
$ROLE: Lead Coder
$INTENT: Propose MVP architecture for the Isilon-to-VAST UNC migration utility
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

PROPOSED ARCHITECTURE: UNC Path Migration Utility (MVP)

4-project solution following your established TableAdapter isolation pattern.

PROJECT 1: OperatorHub.UNCMigration.Data
- All TableAdapters live here exclusively
- DataSet designer (.xsd) with adapters for reading table schemas and updating UNC path fields
- Methods exposed:
  - GetAllTables() — list of table names from the database
  - GetFieldsByTable(tableName) — list of field names, types, current values
  - GetUNCFields(tableName) — filtered list of fields containing Isilon paths
  - ValidateVASTPath(userId) — bool, checks VAST for User/Rxxxxx existence
  - UpdateUNCField(tableName, fieldName, oldPath, newPath) — int rows affected

PROJECT 2: OperatorHub.UNCMigration.Model
- TableInfo: TableName, FieldCount, HasUNCPaths
- FieldInfo: FieldName, DataType, CurrentValue, IsUNCPath
- MigrationRecord: TableName, FieldName, OldPath, NewPath, Status, Timestamp
- ValidationResult: VASTUserExists, VASTPath, IsValid, ErrorMessage

PROJECT 3: OperatorHub.UNCMigration.Presenter
- MainPresenter orchestrates the workflow:
  1. Load tables, display in View
  2. User selects table, load fields, highlight UNC fields
  3. User selects UNC field, preview current Isilon path
  4. User initiates migration, Presenter calls ValidateVASTPath first
  5. If VAST user exists, execute UpdateUNCField
  6. If not, block update and surface error in View
- No direct database calls — everything routes through the .Data project

PROJECT 4: OperatorHub.UNCMigration.View (WinForms)
- TreeView or ListBox: tables on left, fields on right
- Filter toggle: Show only UNC fields
- Preview panel: current Isilon path and proposed VAST path side-by-side
- Validate button: checks VAST user before enabling Update
- Update button: disabled until validation passes
- Status bar: migration log with timestamps

USER WORKFLOW:
  Browse Tables -> Select Table -> Browse Fields -> Filter UNC ->
  Select Field -> Preview Path -> Validate VAST -> Update

SAFETY RAILS:
- ValidateVASTPath is a GATE — update button stays disabled until VAST user is confirmed
- Preview shows old/new side-by-side before any write
- MigrationRecord logs every change for rollback reference
- Dry-run mode option for first pass (log only, no writes)

QUESTIONS FOR DON:
1. Is the database SQL Server? (Assumes yes for TableAdapter pattern)
2. For VAST validation — is this a file system check (Directory.Exists on the VAST UNC path) or an API/AD lookup?
3. Should the utility handle batch updates (all UNC fields in a table at once) or strictly one field at a time?
4. Do you want a migration summary report exported after completion?

Awaiting your answers before we break ground. Lodestar — review this partition for architectural soundness.
---END---
