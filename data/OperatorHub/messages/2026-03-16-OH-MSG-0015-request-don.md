$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: OH-MSG-0015
$REF: OH-MSG-0015
$SEQ: 53
$FROM: Don
$TO: Pharos, Lodestar, Forge
$TIME: 2026-03-16T14:24:43-04:00
$TASK: Config validation routine and reconf
$STATUS: PENDING
$ROLE: Orchestrator
$INTENT: Check the config..json work flow and validate the proper keywords and values
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---
- Being that we are working on a home PC and a lab PC, the config files may differ.
- I want to make sure the files pushed up to GitHub have the correct config.json files.
- Recall it is a two step config where the first config.json points to the remote config.json
- Then verify that the remote UNC figured in the remote config.json points to the new VAST storage system
- and the local config.json points to the configuration UNC on the VAST system where the remote file exists.
- This would be a figuration interface to assure the system is setup properly
---END---