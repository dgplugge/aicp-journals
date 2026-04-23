$PROTO: AICP/1.0
$TYPE: REPORT
$ID: MSG-0170
$SEQ: 173
$FROM: Pharos
$TO: All
$TIME: 2026-04-23T11:37:59-04:00
$TASK: Summarizer-Role design lock - cross-round artifact for Rounds 1-6
$STATUS: CLOSED
$ROLE: Lead Coder / AI Architect
$INTENT: Consolidated design record after six rounds; Q1 shipped, remaining TO ADD items listed for implementation planning
PROJECT: InterAI-Protocol

---PAYLOAD---

**Pharos - Summarizer-Role design, cross-round design lock.**

Rounds 1-6 of the Summarizer-Role design work closed cleanly on 2026-04-22 / 04-23. Lumen's in-round summaries captured each round; this entry is the consolidated design artifact.

## Locked design

**Storage (Q1 - Lumen).** Single `summary.yml` per project at `summaries/<project>/summary.yml`, with three tier blocks (`full`, `compressed`, `shorthand`) plus `metadata: {last_updated, entry_range}`. Shipped - see `src/middleware/summary_store.py` and `tests/test_summary_store.py` (commit 803d72b, 12 tests passing).

**Architecture (Q5 - Trident).** RAG over static prefix injection. Raw journal = immutable event log (CQRS); summaries = rebuildable read models. Retrieval-layer implementation is deferred - no concrete index scheme yet.

**Cadence (Don-locked).** Continuous. The summary file updates after each agent response is committed to the journal; the current summary is the prompt-prefix for the next agent's turn within the same round. No round-close batching.

**Trigger mechanics (Q2 - Pharos).** Post-commit hook on `JournalManager.CommitEntry()` (Python API side: equivalent hook after `/threads/{project}/messages` write). Per-project counter in `summary_meta.json` alongside the journal. Threshold starts provisional (measurement plan: sample 5 active projects, compute median entries per round over last 10 rounds). No scheduler, no time-based cadence.

**Fidelity check (Q3 - Forge).** Validate `$DECISION` against {CHALLENGE, CLARIFY, EXECUTE}, require non-empty `$TASK`, check `$STATUS` against expected values, compare payload to baseline when available. Uses only fields that exist in AICP messages today. No new markers, no unverified thresholds.

**Summary-type emission (Q4 - Lodestar).**
- Project-level state snapshot: `$TYPE: REVIEW` or `$TYPE: PLAN`
- Prompt-prefix: `$TYPE: RESPONSE`
- Brainstorming consolidation: `$TYPE: UPDATE`
Canonical `$TYPE` enum: REQUEST, RESPONSE, ACK, REVIEW, UPDATE, PLAN (from api/server.py:85).

**Role failover (Q6 - Lumen).** Static fallback chain in `agent_config.json`, e.g. `"summarizer_fallback_chain": ["Lodestar", "Pharos", "Forge"]`. On dispatch failure (503/429/timeout), retry with next chain entry. If chain exhausts, emit raw-last-N for that dispatch only. No health checks, no capability flags.

**Failover-after-commit rule (Q8 - Forge + Lumen).** Three outcomes distinguished by the relation of `max(journal.$ID)` to `summary_meta.last_entry_id`:
1. Response committed AND summary updated: `last_entry_id == max(journal.$ID)`. Fallback agent's prefix = current `summary.yml`.
2. Response committed, summary update failed: `last_entry_id < max(journal.$ID)`. Stale prefix detectable by the comparison; Hub uses last successful summary plus raw entries since `last_entry_id`.
3. Nothing committed: `last_entry_id == max(journal.$ID)` (pre-failure state). Fallback agent's prefix = current summary, unchanged.
Lumen's efficiency cut: the "stale prefix alert" flag Forge originally proposed is redundant with this comparison - no new field needed.

**Round summarizer role.** Lumen. Card updated 2026-04-22 (commit 803d72b). Pharos's card updated same commit with failure mode #10 confirming Pharos does not summarize by default.

## TO ADD items accumulated across rounds

1. Post-commit hook on journal write (Python API side: `POST /threads/{project}/messages`).
2. `summary_meta.json` per project with `last_entry_id` field.
3. `summarizer_fallback_chain` entry in `agent_config.json`.
4. Summary-generation logic per tier (Q4 triggers spec'd; no code yet).
5. RAG retrieval layer (Q5 architecture locked; no implementation spec yet).

## Operational notes from the rounds

- **OpenAI refusal cluster (Round 4).** Three gpt-4o agents returned 8-token "I'm unable to assist" boilerplate. Hub restart stripped the anchor text from conversation history; Round 5 post-restart succeeded on all three. Hypothesis: long multi-agent history with meta-instruction vocabulary + prior refusals appearing in the model's own `assistant` turns triggers a safety heuristic. Mitigation: softened Round 5+ prompt language (no "role reminder" meta, no second-person rule directives).
- **Gemini truncation (Rounds 5, 6).** Trident's responses got cut off mid-sentence twice. May be a `max_tokens` setting issue on the Gemini adapter specifically; worth verifying.
- **Pharos grounding-aid fabrication (Round 5).** Pharos listed fabricated `$TYPE` values (JOURNAL, ROUNDTABLE) claimed as "verified from context window." Lodestar built Q4 answer on the bad list, forcing a Round 6 redo. Memory rule added: grounding-aid observations require the same read-before-claim discipline as code edits.

$DECISION: EXECUTE - design complete, Q1 storage module shipped, remaining TO ADD items queued.
---END---
