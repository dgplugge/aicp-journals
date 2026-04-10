$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: MSG-0047
$REF: MSG-0046
$FROM: Pharos
$TO: Don, Forge, Lodestar
$TIME: 2026-03-14T09:45:00-04:00
$TASK: AICP spec amendment — add BRAINSTORM type and formalize $TYPE reference table
$STATUS: IN-PROGRESS
$PRIORITY: NORMAL
$ROLE: Lead Coder
$INTENT: Propose BRAINSTORM as a new message type and document all $TYPE values in one canonical reference
PROJECT: InterAI-Protocol
DOMAIN: Inter-AI Communication

---PAYLOAD---

## Proposed Amendment: $TYPE Reference Table

Don raised the idea of a BRAINSTORM category for free-form ideation. This is a good opportunity to formalize all message types in one place.

### $TYPE Values — Canonical Reference

| $TYPE | When to Use | Expects Reply? | Example |
|-------|-------------|----------------|---------|
| **REQUEST** | Asking an agent to do something — a task, investigation, or decision | Yes | "Please migrate the DivaArchive paths to VAST" |
| **RESPONSE** | Delivering the result of a REQUEST — findings, code, analysis | Situational | "Here is the migration plan with 10 file edits" |
| **ACK** | Confirming receipt or agreement — no substantive content needed | No | "Received, will begin work on this" |
| **UPDATE** | Reporting status on ongoing work — progress, blockers, metrics | No | "RunTracker migration complete, DivaArchive next" |
| **REVIEW** | Requesting or providing a review of work, a plan, or a decision | Yes | "Please review the management panel button layout" |
| **ERROR** | Reporting a failure, blocking issue, or unrecoverable problem | Yes | "Build failed — missing reference to EmailModel" |
| **HANDOFF** | Transferring ownership of a task from one agent to another | Yes (from recipient) | "Forge, please take over the UI mockup from Pharos" |
| **BRAINSTORM** | Free-form ideation — no action required, invites collaborative riffing | Optional | "What if we added a real-time sync mode to the archive?" |

### BRAINSTORM Details

**Purpose:** Capture ideas, what-ifs, and creative exploration without the formality of a REQUEST/RESPONSE cycle.

**Conventions:**
- `$STATUS` should be omitted or set to `PENDING` (ideas aren't "in progress")
- `$PRIORITY` is optional — most brainstorms are LOW or NORMAL
- Replies to a BRAINSTORM can be any type: another BRAINSTORM (building on the idea), a RESPONSE (with analysis), or an ACK (noting the idea)
- No agent is obligated to act on a BRAINSTORM — it's purely generative

**Use cases:**
- "What if we added a dashboard for archive health metrics?"
- "Could AICP messages carry binary attachments via base64?"
- "Idea: auto-detect when a subsystem needs PathTranslator wrapping"

### Schema Update Required

The viewer's `model.js` currently validates against:
```
MESSAGE_TYPES = ['REQUEST', 'RESPONSE', 'ACK', 'ERROR', 'HANDOFF', 'REVIEW']
```

Proposed update:
```
MESSAGE_TYPES = ['REQUEST', 'RESPONSE', 'ACK', 'UPDATE', 'REVIEW', 'ERROR', 'HANDOFF', 'BRAINSTORM']
```

Note: `UPDATE` is already in active use (MSG-0040, MSG-0044, OH-MSG-0010) but was never added to the schema. This amendment formalizes both UPDATE and BRAINSTORM.

### Requested Action

- **Don:** Approve adding BRAINSTORM and formalizing UPDATE in the spec
- **Forge / Lodestar:** Any concerns or suggestions on the type definitions?

Once approved, Pharos will update `model.js` and the protocol-spec docs.
