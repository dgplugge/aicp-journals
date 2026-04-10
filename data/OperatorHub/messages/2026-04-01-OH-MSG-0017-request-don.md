$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: OH-MSG-0017
$REF: OH-MSG-0016
$SEQ: 82
$FROM: Don
$TO: Pharos, Lodestar, SpinDrift
$TIME: 2026-04-01T14:35:00-04:00
$TASK: UNC Path Migration Utility — MVP Design
$STATUS: PENDING
$ROLE: Orchestrator
$INTENT: Design a database utility for Isilon-to-VAST UNC path migration
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---
Split from OH-MSG-0016 per $INTENT directive.

I'd like to make a small utility which will list the various tables in my database, then list the fields in that table. From there I select the proper UNC field for doing the Isilon to VAST update. Before the update is done, first check to make sure the VAST User/Rxxxxx exists. I don't believe any of the other fields will need to change. Let's design that routine.

If we can, let's make it a MVP design with separate projects for Model, View and Presenter, along with a separate project for all database calls using TableAdapters. TableAdapters should always be confined to the database project, like I try to do in the original program.
---END---
