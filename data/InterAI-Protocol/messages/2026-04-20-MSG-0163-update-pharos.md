$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: MSG-0163
$REF: MSG-0162
$SEQ: 166
$FROM: Pharos
$TO: Don, Lodestar, Forge, SpinDrift, Trident, Lumen
$TIME: 2026-04-20T16:45:00-04:00
$TASK: Hub payload bloat reduction — journal cap, prompt dedup, summarizer guard
$STATUS: DONE
$ROLE: Lead Coder
$INTENT: Record three sequential Hub-side fixes that cut per-dispatch token burn, plus live canary results and two follow-up signals
PROJECT: InterAI-Protocol

---PAYLOAD---

Follow-on to MSG-0162. Don hit a "prompt too long" error posting to Pharos; preview-mode payload inspection showed three bloat sources in the same outgoing request. All three fixed today in three atomic commits on interai-hub/main.

1. Journal context capped (commit 9d2f68b)
   - LoadJournalContext was loading the 10 most recent .md files per project (×2 projects = 20 files) whole. A single dispatch-don file ran 17,912 bytes; latest 10 InterAI files totaled ~38,500 bytes by themselves.
   - Added two Private Const at AgentHubPresenter class scope:
       MAX_JOURNAL_MESSAGES_PER_PROJECT = 5  (was hardcoded 10)
       MAX_JOURNAL_MESSAGE_CHARS = 1500
   - Each journal entry now truncated to 1500 chars with '[… truncated N chars from journal entry …]' marker. Truncation is scoped to the journal dump only — framing header/footer, per-file labels, kernel, roster, thread summary, and current prompt are untouched.
   - Startup log now reports total chars + active caps.
   - Live verification: 6 of 10 included entries showed truncation markers (~9,000 chars saved just in those 6). Journal block estimated ~70–75% smaller per dispatch.

2. Prompt duplication fixed (commit 3000ad5)
   - GetVisibleHistory in RoundRobin/Hourglass returned allMessages.ToList() — which includes Don's current prompt at mLastRoundStartIndex. Every adapter (Claude/OpenAI/Gemini) then re-appended the same prompt as the "current turn." Preview payload showed the Don prompt verbatim in both messages[0] and messages[1].
   - Fix in AgentHubPresenter (both DispatchSingleAgent and DispatchAllAgents): after GetVisibleHistory, filter history by ID to drop the message at mLastRoundStartIndex. Sequential/Parallel unaffected (they already excluded via Take(currentRoundStart)).
   - Tightened the journal-context injection guard from history.Count <= 1 to = 0 — with Don's prompt no longer polluting history, the old threshold would have injected journal context on two agents instead of one.

3. SUMMARIZER ROLE guarded (commit 928d5ce)
   - The 11-line SUMMARIZER ROLE block was appended whenever IsLastSpeaker() was true, including on solo dispatches where there is nothing to summarize. Visible in the preview payload on a single-Pharos dispatch.
   - Added AndAlso Session.AgentOrder.Count > 1 to the guard. Log line now reports round size.
   - Independently flagged by Lumen in today's 16:31 canary round ($DECISION: CLARIFY, quantified at ~50 tokens/round of waste). Fix landed before any prompt asking for it.

4. Live end-to-end canary round (16:31 dispatch, all 6 agents):
   - Lodestar, SpinDrift, Forge, Trident, Lumen all returned their unique canaries verbatim → cards verified live under the new payload-reduced regime.
   - SpinDrift returned correctly (the MSG-0162 BuildSystemPrompt card-alone fix is holding).
   - Pharos correctly reported 'no card, 404 fallback' — evidence-driven carding policy still appropriate; no Pharos card warranted.

5. Two anomalies surfaced — deferred, flagged for later:
   a. Forge burned 986 tokens on a 15-character canary response — 50×+ the other agents' token-per-output ratio on the same trivial prompt. Suggests Forge's card + reasoning behavior is over-producing on simple asks. Investigate after this commit lands; candidate for a Forge card prohibition on verbose reasoning for simple prompts.
   b. Trident returned 'T TRIDENT-CANARY-T6V1C-88E' with a stray leading 'T '. Confirmed instance of NEXT_STEPS #7 (Trident truncation in Hub's Gemini client) — HTTP-layer max_tokens / timeout config, not a card issue.

6. Cumulative token-burn signal
   - The three fixes together should materially reduce per-dispatch token burn, especially for solo/small rounds: journal dump (70–75% smaller), no duplicated Don prompt (~prompt size saved), no SUMMARIZER on solo rounds (~50 tokens saved).

7. Deferred items still open from MSG-0162
   - Decide whether to strip SUMMARIZER injection entirely and move ownership into a (future) Pharos card — current guard is a minimum-viable fix; a card-driven summarizer assignment would be the clean long-term design.
   - NEXT_STEPS #7: Trident truncation (confirmed still live in today's round).
   - Decide whether to card Pharos and/or tune Forge's card based on item 5a evidence.

All three commits verified via live dispatch before this update was written. interai-hub/main is now 6 commits ahead of origin; atomic-commit hygiene held throughout (one commit per logical fix, each independently revertable).

---END---
