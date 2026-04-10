$PROTO: AICP/1.0
$TYPE: REVIEW
$ID: OH-MSG-0022
$REF: OH-MSG-0021
$SEQ: 87
$FROM: Pharos
$TO: Don, Lodestar, SpinDrift
$TIME: 2026-04-01T15:00:00-04:00
$TASK: Review Lodestar's UNC Migration Utility MVP Design
$STATUS: COMPLETE
$ROLE: Lead Coder
$INTENT: Review implementation feasibility, align on architecture, respond to Lodestar's open questions
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

REVIEW OF OH-MSG-0021 (Lodestar's MVP Design)

VERDICT: Strong alignment. Lodestar's design is clean, safety-first,
and respects the established OperatorHub architecture. My earlier
proposal (OH-MSG-0019) and Lodestar's converge on the same shape.
Merging the best of both below.

AGREED POINTS:
- 4-project MVP structure (Model, View, Presenter, Database)
- TableAdapters strictly confined to the Database project
- One-table-at-a-time for MVP — correct call
- Validation gate before any write
- Preview with before/after display
- Audit logging of every change

ONE-ROW VS MULTI-ROW (Lodestar's Open Question):
Agree with one-row-at-a-time as the first cut. However, I recommend
building the Presenter with a List<PathUpdateCandidate> internally
from day one. The View shows one row at a time with Next/Previous
navigation, but the Presenter already holds the full candidate set.
This way expanding to batch-with-confirmation later is a View change,
not an architecture change.

IMPLEMENTATION CONCERNS:

1. TableAdapter Schema Discovery
   SQL Server's INFORMATION_SCHEMA views are the cleanest path for
   GetAllTables() and GetFieldsByTable(). However, TableAdapters are
   typically typed to specific tables. For schema discovery, I recommend
   a single untyped TableAdapter in the Database project that executes:
   - SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'
   - SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @TableName
   This avoids generating typed adapters for every table in the database.

2. UNC Field Detection
   Lodestar's validation rule "path appears to be Isilon/legacy UNC"
   needs a concrete heuristic. Recommend checking:
   - Value starts with \\\\isilon or known legacy server prefix
   - Field data type is nvarchar/varchar
   - Field name contains hints: Path, UNC, Directory, Folder, Location
   This should live in the Model as a static helper: PathDetector.IsLikelyUNCField()

3. VAST Path Translation
   The translation from Isilon to VAST needs a clear rule. Likely:
   - \\\\isilon\\share\\User\\Rxxxxx\\... becomes \\\\vast\\share\\User\\Rxxxxx\\...
   Recommend a PathTranslator class in Model with a configurable
   mapping (old prefix -> new prefix) stored in app.config. This keeps
   the translation rule out of code and adjustable without recompiling.

4. VAST Existence Check
   Directory.Exists() on a UNC path will work if the machine has
   network access to VAST. This is a synchronous I/O call that could
   be slow on large shares. Recommend:
   - Run on a background thread (async/await in Presenter)
   - Show a spinner in View during validation
   - Timeout after 5 seconds with a clear error message

RECOMMENDED PROJECT/CLASS LAYOUT:

OperatorHub.UNCMigration.Database/
  SchemaAdapter.xsd          (untyped — INFORMATION_SCHEMA queries)
  PathUpdateAdapter.xsd      (typed — UPDATE specific tables)
  DatabaseFacade.cs          (public API: GetTables, GetFields, UpdatePath)

OperatorHub.UNCMigration.Model/
  DatabaseTableInfo.cs       (TableName, FieldCount, HasUNCPaths)
  DatabaseFieldInfo.cs       (FieldName, DataType, CurrentValue, IsUNCPath)
  PathUpdateCandidate.cs     (per Lodestar's spec — excellent shape)
  PathValidationResult.cs    (VASTUserExists, IsValid, ErrorMessage)
  PathUpdateResult.cs        (Success, RowsAffected, Timestamp)
  PathTranslator.cs          (IsilonPrefix -> VASTPrefix mapping)
  PathDetector.cs            (IsLikelyUNCField, IsLikelyIsilonPath)

OperatorHub.UNCMigration.Presenter/
  MainPresenter.cs           (orchestrates full workflow)
  IMainView.cs               (interface for View — enables testing)

OperatorHub.UNCMigration.View/
  MainForm.cs                (implements IMainView)
  MainForm.Designer.cs       (WinForms layout)

NEXT STEPS:
1. Don — confirm SQL Server and answer the 4 questions from OH-MSG-0019
2. Don — provide a sample Isilon path and the corresponding VAST path
   so we can build PathTranslator with a real example
3. Once confirmed, Pharos will scaffold the solution structure
---END---
