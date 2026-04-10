$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0026
$REF: OH-MSG-0025
$SEQ: 91
$FROM: Pharos
$TO: Don, Lodestar, SpinDrift
$TIME: 2026-04-01T15:40:00-04:00
$TASK: Design Decisions Locked — UNC Migration Utility
$STATUS: IN_PROGRESS
$ROLE: Lead Coder
$INTENT: Confirm design decisions, document path mapping rules, and define build-ready spec
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

DECISIONS LOCKED — All questions answered.

1. VAST VALIDATION: System.IO.Directory.Exists()
   Yes — filesystem existence check is the right approach. The utility
   runs on a machine with network access to both Isilon and VAST shares.
   Directory.Exists() is simple, reliable, and needs no API credentials.
   We will run it async with a 5-second timeout and clear error messaging.

2. PATH MAPPING RULES (now concrete):

   ISILON PREFIX:
   \\ncifs-eib-p.nci.nih.gov\Group04\EIB\NCIEIBFlowlabRoot\GlobalUserRoot\

   VAST PREFIX:
   \\ncivs-p001.nci.nih.gov\EIB_04\NCIEIBFlowlabRoot\GlobalUserRoot\

   TRANSLATION RULE:
   Replace the Isilon prefix with the VAST prefix. Everything after
   GlobalUserRoot\ stays unchanged (user folders like Rxxxxx, subfolders,
   filenames).

   PathTranslator implementation:
   - IsilonPrefix = "\\\\ncifs-eib-p.nci.nih.gov\\Group04\\EIB\\NCIEIBFlowlabRoot\\GlobalUserRoot\\"
   - VastPrefix = "\\\\ncivs-p001.nci.nih.gov\\EIB_04\\NCIEIBFlowlabRoot\\GlobalUserRoot\\"
   - ToVastPath(path): if path.StartsWith(IsilonPrefix) then replace prefix
   - LooksLegacyUNC(path): path.StartsWith("\\\\ncifs-eib-p")
   - Both prefixes stored in app.config for easy adjustment

   UNC DETECTION HEURISTIC:
   Any field value starting with "\\ncifs-eib-p" is a candidate for
   migration. This is tight enough to avoid false positives.

3. KEY COLUMNS: Primary identity key per table.
   SchemaReader will query INFORMATION_SCHEMA.KEY_COLUMN_USAGE to
   identify the PK column for each table. Preview grid shows PK + the
   selected UNC field + translated VAST path.

4. AUDIT: CSV first.
   CsvLogSink implements ILogSink. Each row logs:
   Timestamp, TableName, PKValue, FieldName, OldPath, NewPath, Status, DryRun
   File goes to a configurable output path (app.config).
   This also enables home development with mock data — read from CSV
   to simulate database records without a live connection.

MOCK DATA STRATEGY FOR HOME DEV:
   Since Don works from home without the real database, we should build
   IDataService with two implementations from the start:
   - SqlDataService: real TableAdapter calls (NIH network)
   - CsvDataService: reads/writes mock CSV files (home dev)
   The Presenter doesn't care which one — it only sees IDataService.
   This also gives us a testing harness for free.

BUILD-READY SUMMARY:

   OperatorHub.UNCMigration.Data/
     SchemaAdapter.xsd         (INFORMATION_SCHEMA queries)
     PathUpdateAdapter.xsd     (parameterized UPDATE statements)
     SqlDataService.cs         (implements IDataService)
     CsvDataService.cs         (mock implementation for home dev)
     VastValidator.cs          (Directory.Exists with async + timeout)

   OperatorHub.UNCMigration.Model/
     DatabaseTableInfo.cs
     DatabaseFieldInfo.cs
     PathUpdateCandidate.cs
     PathUpdateRequest.cs
     PathUpdateResult.cs
     PathValidationResult.cs
     MigrationRecord.cs
     PathTranslator.cs         (prefix swap from app.config)
     PathDetector.cs            (LooksLegacyUNC heuristic)

   OperatorHub.UNCMigration.Presenter/
     IDataService.cs
     IPathValidationService.cs
     IMigrationView.cs
     ILogSink.cs
     MainPresenter.cs

   OperatorHub.UNCMigration.View/
     MainForm.cs
     MainForm.Designer.cs
     App.config                (Isilon/VAST prefixes, CSV path, timeout)

STATUS: All design questions resolved. Ready to scaffold the solution.

Lodestar, SpinDrift — any final objections before we build?
---END---
