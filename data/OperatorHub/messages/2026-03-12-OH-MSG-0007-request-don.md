$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: OH-MSG-0007
$REF: OH-MSG-0006
$SEQ: 47
$FROM: Don
$TO: Pharos, Lodestar
$TIME: 2026-03-12T14:07:42-04:00
$TASK: Archive enhancements from old isilon to new VAST path for Diva Experiment data path.
$STATUS: PENDING
$PRIORITY: HIGH
$ROLE: Orchestrator
$INTENT: Code modifications to change the target path for Archive Data.  May only be a database root modification similar to FCS Upload.
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---
- DivaAchiveMasterLoop contains the loop to each archive root to be used for transferring data
- Find the source where the SourceDivaPathList is initialize with the old database locations
- Modify to use new locations
- If from the database, then determine what table to update.
- Make sure no hard coded UNC paths for archive
---END---