$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: MSG-0180
$SEQ: 183
$FROM: Pharos
$TO: All
$TIME: 2026-04-27T12:16:06-04:00
$TASK: Mismatch v3 design state captured — paused for project-scoped RAG work; resume later
$STATUS: OPEN
$ROLE: Lead Coder / AI Architect
$INTENT: Persist the v3 design context so a future session can resume the parlor-game arc cleanly without re-deriving the questions
PROJECT: InterAI-Protocol
$REF: MSG-0179

---PAYLOAD---

**Pharos — Mismatch v3 design pause; capturing context.**

The team shipped Mismatch v2 (notes/games/mismatch.md, commit 30c81f3) earlier today. After it landed, Don identified two structural design issues that v2 does not address. We worked through the redesign and Don deferred decisions — he wants to pivot to project-scoped RAG work first. Capturing the v3 context here so we can resume.

## v2 status

Shipped: notes/games/mismatch.md, repo commit 30c81f3. Cards dealt face-up in a grid, players name two cards per turn, score +1 non-match / −5 match, both cards removed regardless. End-of-grid forced-match patch applied.

## Two structural issues Don identified post-ship

1. **Cards face-up eliminates the Memory inversion.** Trident's Round 1 framing was "transforms a recognition and recall task into one of calculated risk and pattern disruption" — but with all cards visible from turn 1, there is no recall under uncertainty. The skill claimed in Round 2 rubric scoring ("track which ranks remain") is trivial when every card is visible. The team missed this across all five rounds.

2. **All cards removed regardless of outcome destroys the slow reveal.** In real Memory, non-matching cards flip back face-down so the next player has to remember what they were. In v2 every flipped pair is removed, so there is no progressive memory load — even if cards were face-down, the game would devolve to "flip 2 random cards each turn."

## Don's proposed v3 mechanic

Solves both issues simultaneously by introducing a difference-threshold take/return rule:

- Cards dealt **face-down**.
- On your turn, **name two positions** (e.g., row 2 col 3 and row 1 col 4). Flip both, all players see what was revealed.
- **If matching pair** (difference 0): −5 penalty, cards removed (or possibly returned — see Q2).
- **If difference < threshold** (e.g., 5): cards **returned face-down to original positions**. No score change. Memory load builds.
- **If difference ≥ threshold**: cards taken; player scores **the absolute rank difference** (Ace=1, 2–10=face value, J=11, Q=12, K=13).

Example with threshold 5: 7+10 (diff 3) returns; 4+Queen (diff 8) taken for 8 points; 9+9 (matching) −5.

## Design questions and Pharos recommendations

| # | Question | Recommendation |
|---|---|---|
| 1 | Threshold value | **5** — about 30–40% of pairs qualify (more for extreme ranks) |
| 2 | Matched pair fate (remove vs. return) | **Remove with −5** — keeps grid draining |
| 3 | Sub-threshold pair fate | **Return face-down to original positions** — preserves Memory mechanic |
| 4 | Naming syntax | **Positions, not cards** — face-down cards can't be named by rank |
| 5 | Scoring formula | **Absolute rank difference**, A=1, J/Q/K=11/12/13. Range 5–12 per take |
| 6 | End condition / deadlock | **Game ends when no qualifying pair (diff ≥ 5) exists in the grid.** Active player must verify before declaring end |
| 7 | Game length | Probably **10–15 minutes**, not 5–10. Returns slow the drain |
| 8 | Weighted Mismatch variant | **Drop** — absorbed by new core mechanic |
| 9 | Game name | **Keep "Mismatch"** — central tension intact |

Don has not yet confirmed or overridden these. Decisions stand pending his return.

## Resume-here checklist

When picking this back up:

1. Don confirms or revises the 9 recommendations above (especially #6 deadlock handling and #7 game length tradeoff).
2. Once confirmed, draft Round 6 dispatch to Pharos for v3 rules card.
3. Pharos produces Mismatch v3 (notes/games/mismatch.md updated, or notes/games/mismatch-v3.md if v2 is preserved for posterity).
4. Optional: small playtest dispatch (Round 7) before declaring v3 shipped.

## Why this matters for the demo narrative

The v2 → v3 arc is actually a stronger demo than v2 alone. The team designed and shipped a game; Don caught a structural bug the team missed; the team will fix it. That's a more honest selling point than "the team got it right first try" — and it demonstrates the value of having a human orchestrator in the loop.

$DECISION: EXECUTE
---END---
