$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: OH-MSG-0029
$REF: OH-MSG-0028
$SEQ: 94
$FROM: Pharos
$TO: Don, Lodestar, SpinDrift
$TIME: 2026-04-01T16:00:00-04:00
$TASK: UNC Migration Utility — Build Phase Kickoff
$STATUS: IN_PROGRESS
$ROLE: Lead Coder
$INTENT: Summarize agreed design, propose build order, and begin scaffolding
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

DESIGN REVIEW SUMMARY (OH-MSG-0016 through OH-MSG-0028)

Three agents (Pharos, Lodestar, SpinDrift) have converged on a fully
specified MVP for the Isilon-to-VAST UNC Path Migration Utility.
All design questions are answered. No blockers remain.

AGREED SPEC:

  Architecture: 4 projects (Data, Model, Presenter, View)
  Pattern: MVP with interface abstractions
  TableAdapters: confined to .Data project only
  Scope: single-table, single-row updates for MVP
  Validation: Directory.Exists async with 5s timeout
  ValidationStatus: Exists / Missing / TimedOut / Error
  Path mapping: prefix swap via app.config
    Isilon: \\ncifs-eib-p.nci.nih.gov\Group04\EIB\NCIEIBFlowlabRoot\GlobalUserRoot\
    VAST:   \\ncivs-p001.nci.nih.gov\EIB_04\NCIEIBFlowlabRoot\GlobalUserRoot\
  Preview: PK + business identifier when available
  Audit: CSV via ILogSink (CsvLogSink)
  Home dev: CsvDataService mock alongside SqlDataService
  Safety: dry-run mode, validation gate, before/after preview
  UI: WinForms — table dropdown, field list, preview grid, validate/update buttons, log panel

PROPOSED BUILD ORDER:

  Phase 1 — Scaffold (Pharos)
    Create solution with 4 projects under OperatorControlsMain/
    Set up project references (View -> Presenter -> Model, Data -> Model)
    Add App.config with Isilon/VAST prefixes and CSV path

  Phase 2 — Model (Pharos)
    All DTOs: DatabaseTableInfo, DatabaseFieldInfo, PathUpdateCandidate,
    PathUpdateRequest, PathUpdateResult, PathValidationResult, MigrationRecord
    Helpers: PathTranslator, PathDetector
    Enum: ValidationStatus

  Phase 3 — Interfaces (Pharos)
    IDataService, IPathValidationService, IMigrationView, ILogSink

  Phase 4 — Data Layer (Pharos)
    SchemaAdapter (INFORMATION_SCHEMA queries)
    SqlDataService (implements IDataService)
    CsvDataService (mock for home dev)
    VastValidator (implements IPathValidationService)
    CsvLogSink (implements ILogSink)

  Phase 5 — Presenter (Pharos)
    MainPresenter with full workflow orchestration

  Phase 6 — View (Pharos)
    MainForm implementing IMigrationView
    WinForms layout per agreed UI spec

  Phase 7 — Integration Test
    End-to-end test with CsvDataService mock data
    Verify: table selection, field filtering, path translation,
    validation display, dry-run mode, CSV audit output

REQUEST TO ALL AGENTS:
- Lodestar: confirm build order or suggest resequencing
- SpinDrift: flag any interface gaps before coding begins
- Don: approve build kickoff

Pharos will begin Phase 1 scaffolding upon Don's go.
---END---
