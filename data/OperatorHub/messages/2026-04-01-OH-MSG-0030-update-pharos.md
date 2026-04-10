$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: OH-MSG-0030
$REF: OH-MSG-0029
$SEQ: 95
$FROM: Pharos
$TO: Don, Lodestar, SpinDrift
$TIME: 2026-04-01T16:30:00-04:00
$TASK: UNC Migration Utility — Project Names and File Layout per AAA/ZZZTemplates Pattern
$STATUS: IN_PROGRESS
$ROLE: Lead Coder
$INTENT: Map the agreed MVP design to Don's established AAA naming convention and MVP pattern
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

NAMING CONVENTION APPLIED (per ZZZTemplates + Backfill reference)

Utility short name: UNCMigration
AAA prefix: AAAUNCMigration

PROJECT LAYOUT (5 projects):

1. AAAUNCMigration/ (executable — startup project)
   UNCMigrationMain.vb        Module with Main() entry point
   App.config                 Isilon/VAST prefixes, CSV path, timeout

2. UNCMigrationPresenter/ (class library)
   UNCMigrationPresenter.vb   Presenter class
     - Lazy creates UNCMigrationView
     - AddHandler for LoadEvent, SelectTableEvent, SelectFieldEvent,
       ValidateEvent, UpdateEvent, DryRunToggleEvent
     - Orchestrates full workflow through IDataService

3. UNCMigrationView/ (class library)
   UNCMigrationView.vb        View class (properties + events)
     - Property Form As frmUNCMigration
     - Properties: SelectedTable, SelectedField, SelectedRow,
       DryRunEnabled, ValidationStatus, etc.
     - Events: LoadEvent, SelectTableEvent, SelectFieldEvent,
       ValidateEvent, UpdateEvent, DryRunToggleEvent
     - Sub New() creates frmUNCMigration(Me)
   frmUNCMigration.vb         WinForm code-behind
     - Constructor accepts UNCMigrationView
     - Button handlers call View.TriggerXxxEvent()
   frmUNCMigration.Designer.vb  (auto-generated)
   frmUNCMigration.resx         (form resources)

4. UNCMigrationModel/ (class library)
   DatabaseTableInfo.vb
   DatabaseFieldInfo.vb
   PathUpdateCandidate.vb
   PathUpdateRequest.vb
   PathUpdateResult.vb
   PathValidationResult.vb
   ValidationStatus.vb         (Enum: Exists/Missing/TimedOut/Error)
   MigrationRecord.vb
   PathTranslator.vb
   PathDetector.vb

5. UNCMigrationDatabase/ (class library)
   SchemaDataSet.xsd           (INFORMATION_SCHEMA queries)
   SchemaDataSet.Designer.vb   (auto-generated)
   SchemaRetrieve.vb           (wraps TableAdapter for table/field listing)
   PathUpdateRecord.vb         (executes single-field UPDATE)
   VastValidator.vb            (Directory.Exists with async + timeout)
   CsvDataService.vb           (mock implementation for home dev)
   CsvLogSink.vb               (audit log writer)

FILE NAMING RULES FOLLOWED:
- WinForm: frm{Name}.vb (frmUNCMigration.vb)
- View class: {Name}View.vb (UNCMigrationView.vb)
- Presenter class: {Name}Presenter.vb (in separate project)
- Main module: {Name}Main.vb (in AAA project)
- Database: {Entity}Retrieve.vb, {Entity}Record.vb pattern (per Backfill)
- Lazy initialization with Nothing check on all properties

EVENT FLOW (matching ZZZTemplates pattern):
  Main() -> UNCMigrationPresenter.OpenPresenter()
    -> AddHandler View events
    -> UNCMigrationView.OpenForm()
      -> frmUNCMigration.ShowDialog()
        -> Form_Load -> View.TriggerLoadEvent()
          -> Presenter.LoadEventHandler() -> loads tables
        -> User clicks -> View.TriggerSelectTableEvent()
          -> Presenter loads fields
        -> User clicks Validate -> View.TriggerValidateEvent()
          -> Presenter calls VastValidator
        -> User clicks Update -> View.TriggerUpdateEvent()
          -> Presenter calls PathUpdateRecord

PROJECT REFERENCES:
  AAAUNCMigration -> UNCMigrationPresenter
  UNCMigrationPresenter -> UNCMigrationView, UNCMigrationModel, UNCMigrationDatabase
  UNCMigrationView -> UNCMigrationModel
  UNCMigrationDatabase -> UNCMigrationModel

Don — please review the naming and confirm before I scaffold. You mentioned
you will check the frm*.vb and *View.vb files against your model. I will
generate those first for your review before building out the full solution.
---END---
