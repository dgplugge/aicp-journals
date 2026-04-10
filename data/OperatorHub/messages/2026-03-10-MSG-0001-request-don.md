$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: OH-MSG-0001
$FROM: Don
$TO: Pharos, LodeStar
$TIME: 2026-03-10T09:00:00-05:00
$TASK: Establish Operator Hub inter-agent collaboration
$STATUS: PENDING
$PRIORITY: HIGH
$INTENT: Bring LodeStar into Operator Hub codebase work as design advisor and reviewer
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---

This is the first AICP exchange for the Operator Hub project — a separate
journal from the InterAI-Protocol work, using the same protocol format.

## Project Summary

Operator Hub (v11.2) is a comprehensive flow cytometry laboratory operations
management suite for the NCI (National Cancer Institute) EIB Flow Lab.
It manages FCS data runs, instrument scheduling, data archival, protocol
management, and reporting.

- Platform: .NET Framework 4.8, VB.NET, Windows Forms
- Architecture: MVP (Model-View-Presenter), strictly enforced
- Scale: 100+ projects in the main solution
- Storage: Migrating from EMC Isilon to VAST Data (in progress)

## Current Work Items

1. **Isilon to VAST Storage Migration** (in progress)
   - Created PathTranslator class for legacy UNC path translation
   - RunTracker subsystem wrapped — ~90+ files in other subsystems remain
   - Database records contain old Isilon paths that need read-time translation
   - Hybrid write-back pattern: translate at read, optionally update DB over time

2. **Branch99 Path Discrepancy** (just discovered)
   - Documentation says Branch99 format is data-type-first:
     {Root}\Fcs Runs\{User}\{RunName}
   - Actual upload code (UploadTargetPath.vb) builds user-first without "Fcs Runs":
     {Root}\{User}\{RunName}
   - Needs investigation: is this intentional per-subsystem difference or a bug?

3. **General Codebase Health**
   - Hard-coded UNC paths scattered across subsystems
   - Legacy backup paths pointing to decommissioned servers
   - Some commented-out code sections marked "dgp xyzzy" (TODO markers)

## Role Assignments

- **Don** — Orchestrator, product owner
- **Pharos** — Lead Coder (codebase access, builds, commits)
- **LodeStar** — Design Advisor, Reviewer (architecture guidance, code review)

## Instructions

1. Pharos: Acknowledge and confirm current state
2. LodeStar: Review this project summary and confirm your role
3. Both: Propose priority ordering for the work items above
4. LodeStar: Flag any architectural concerns based on the project description

---END---

$SUMMARY: Don initiated the Operator Hub AICP journal, introduced the project
to LodeStar, outlined three active work items (VAST migration, Branch99
discrepancy, codebase health), and assigned roles for collaboration.
