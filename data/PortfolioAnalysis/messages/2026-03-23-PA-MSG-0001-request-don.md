$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: PA-MSG-0001
$SEQ: 1
$FROM: Don
$TO: Pharos
$TIME: 2026-03-23T10:00:00-04:00
$TASK: Initialize Portfolio Analysis project — VB.NET WinForm MVP solution
$STATUS: IN_PROGRESS
$PRIORITY: HIGH
$ROLE: Orchestrator
$INTENT: Create a desktop tool for merging brokerage CSV exports with screener data
PROJECT: Portfolio Analysis
DOMAIN: Financial portfolio tooling
---PAYLOAD---

## Goal

Build a VB.NET WinForms desktop application that allows selecting two CSV files:

1. **Portfolio file** — Schwab positions export (symbols, quantities, prices, gains)
2. **Database file** — Screener export (symbols with additional columns like 50-Day High)

The tool merges selected columns from the database file into the portfolio file by matching on symbol/ticker. Optionally removes rows that have no match in the database.

## Requirements

- Follow the same MVP pattern used in Operator Hub (Main → Presenter → View → Form → Model)
- .NET 8.0 Windows Forms, VB.NET
- EPPlus for future Excel support
- Handle Schwab CSV quirks: account info header line, trailing commas, quoted fields
- User selects key columns and merge columns via UI
- Preview merged result in DataGridView before saving
- Save merged output as CSV

## Deliverables

- Solution at `H:\Code\Portfolio-Analysis\`
- AGENTS.md and CLAUDE.md following Operator Hub conventions
- Agent-Journals folder with AICP message tracking
- Added to viewer projects.json

---END---
$SUMMARY: Project kickoff for Portfolio Analysis — VB.NET WinForm tool for CSV portfolio merging
