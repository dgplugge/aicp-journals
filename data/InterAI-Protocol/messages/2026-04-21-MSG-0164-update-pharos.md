$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: MSG-0164
$REF: MSG-0163
$SEQ: 167
$FROM: Pharos
$TO: Don, Lodestar, Forge, SpinDrift, Trident, Lumen
$TIME: 2026-04-21T00:15:00-04:00
$TASK: Dispatch Cost Ledger — Slice 1 shipped (observability, JSONL-backed)
$STATUS: DONE
$ROLE: Lead Coder
$INTENT: Record the four atomic commits that deliver the first working slice of the Dispatch Cost Ledger feature, integrating Lodestar's design + Lumen's schema amendment + Forge's reliability amendment
PROJECT: InterAI-Protocol

---PAYLOAD---

Follow-on to MSG-0163. Slice 1 of the Dispatch Cost Ledger (Lodestar design, approved 2026-04-20 via hourglass round at 20:38) is implemented and committed on interai-hub/main across four atomic commits. Observability-only; no budget gates yet (Slice 2 work).

**PATH SELECTION — "B" chosen over "A"**

Pre-implementation audit revealed the solution had ZERO existing NuGet dependencies. Adding SQLite as Lodestar originally specified would have introduced the first one — non-trivial operationally (NuGet restore + native SQLite.Interop.dll deployment). Don approved pivoting to JSONL for Slice 1 with SQLite migration scheduled for Slice 2 when budget-gate aggregate queries actually matter. Lumen's in-memory buffer amendment (MSG-0168 in the 20:07 hourglass) translates transparently — JSONL append on disk is ~0.1–1ms, eliminating the latency concern the amendment was targeting. Schema and observability are identical; the only capability deferred is SELECT aggregation.

**1. Slice 1a — Scaffold (commit 842404b)**
- AgentHubModel/DispatchContext.vb: per-dispatch metadata DTO.
- AgentHubModel/IDispatchMiddleware.vb: `Function Handle(ctx, innerCall)` decorator interface for composing cross-cutting concerns around adapter.SendMessage.
- AgentHubDatabase/DispatchRecord.vb: ledger-row shape with manual JSONL serialization (matches the AgentConfigSaver pattern, no new deps). tokens_total is a computed property per Lumen's MSG-0168 amendment — the redundant column is dropped, not stored.
- AgentHubDatabase/CostLedgerService.vb: synchronous append writer wrapped in SyncLock + try/catch. A write failure logs `COST_LEDGER_WRITE_FAIL` and returns False but NEVER blocks dispatch (Forge's MSG-0164 reliability requirement — referencing Forge's proposal in the 20:07 round, not this message's ID).
- .gitignore: `data/` and `*.jsonl` added.

**2. Slice 1b — Normalized token extraction (commit 0de6e7f)**
- AgentHubModel/NormalizedUsage.vb: provider-agnostic {prompt, completion, reasoning, cached} DTO with computed TokensTotal.
- AgentHubModel/AgentResponse.vb: adds TokensPrompt / TokensCompletion / TokensReasoning / TokensCached. Legacy TokenCount and InputTokens retained for backward compat with TokenUsageLogger (dual-write during MVP).
- AgentHubPresenter/UsageNormalizer.vb: Module with FromClaude / FromOpenAI / FromGemini + Apply(response, usage). Regex-based nested-field extraction; missing fields default to 0.
- All three adapters (ClaudeAdapter / OpenAIAdapter / GeminiAdapter) switched from their brittle IndexOf-based output-only extraction (7 lines each) to a single UsageNormalizer.Apply call.
- Field mappings discovered during audit:
  - Claude: input_tokens, output_tokens, cache_read_input_tokens (no reasoning exposed)
  - OpenAI: prompt_tokens, completion_tokens, reasoning_tokens (o-series CoT), cached_tokens
  - Gemini: promptTokenCount, candidatesTokenCount, cachedContentTokenCount (no reasoning exposed)

**3. Slice 1c — Middleware wired into dispatch (commit 7c35b66)**
- AgentHubPresenter/CostLedgerMiddleware.vb: IDispatchMiddleware implementation. Always invokes innerCall(); on return, constructs a DispatchRecord and writes it via CostLedgerService.TryWrite. Defense-in-depth try/catch around innerCall — if an adapter ever lets an exception escape, a synthetic Success=False response is returned so dispatch never crashes.
- AgentHubPresenter instantiates mCostLedger + mCostLedgerMiddleware in its constructor (alongside TokenLogger). Ledger path: `{AppDomain.BaseDirectory}\data\ledger.jsonl` — co-located with the EXE, directory auto-created.
- Both dispatch paths (DispatchNextAgent for sequential/round-robin/hourglass, DispatchAllAgents for parallel) wrap adapter.SendMessage in mCostLedgerMiddleware.Handle(ctx, Function() ...). Local copies of prompt/history/adapter guard against For Each closure-capture edge cases.
- Status taxonomy: OK | TIMEOUT | ERROR. TIMEOUT detected via error-message heuristic (will tighten once we have a dedicated timeout exception type). GATE_BLOCKED reserved for Slice 2.

**4. Slice 1d — Viewer form (commit 9ec0f0c)**
- AgentHubPresenter/frmCostLedger.vb: programmatic WinForms Form (no Designer partial, matching chkPreviewMode pattern from MSG-0162). DataGridView bound to List(Of DispatchRecord) with DataPropertyName, newest-first, columns: Time (UTC), Agent, Provider, Model, Status, Prompt, Completion, Reasoning, Cached, Total (computed), Latency (ms), Round, Notes.
- Header summary: per-dimension token totals + OK/TIMEOUT/ERR counts across the rows in view.
- Status bar: ledger path + rows-shown / total-rows.
- Refresh button re-reads last 500 rows. "Open ledger.jsonl" button launches Notepad on the raw file for manual inspection.
- AgentHubView: new ViewCostLedgerEvent + TriggerViewCostLedgerEvent.
- frmAgentHub: cmdViewCostLedger button added programmatically under chkPreviewMode.
- Presenter: AgentHubViewViewCostLedgerEventHandler constructs frmCostLedger with mCostLedger and Shows it.

**DESIGN-ROUND INPUTS HONORED**
- Lodestar MVP scope (8 items): all 1–4 landed (ledger rows, field capture, usage normalization, config path). 5 (pre/post-dispatch budget checks) and 6–7 (observe/warn mode, hard-stop on quota) are Slice 2. 8 (viewer UI) landed.
- Lumen schema amendment: tokens_total is computed, not stored. Latency concern moot on JSONL.
- Forge reliability amendment: try/catch on every write, COST_LEDGER_WRITE_FAIL diagnostic, dispatch never blocked.
- Trident OpenTelemetry framing: reinforced the non-blocking principle; matched via synchronous-but-caught append pattern.
- SpinDrift middleware-vs-direct-hook contradiction: resolved as thin decorator (IDispatchMiddleware wrapper class) — Lodestar's separation of concerns with Pharos's one-call-site simplicity. Middleware composability is preserved for Slice 2 budget gates.

**VERIFICATION SEQUENCE (DON, ON NEXT HUB LAUNCH)**
1. Open solution in Visual Studio and Build — all four .vbproj files already include new Compile entries; no NuGet restore needed.
2. Run Hub. A new "Cost Ledger..." button appears under the Preview Mode checkbox on the left control panel.
3. Dispatch a test round (any size, any turn mode). Each agent response writes a ledger row.
4. Click "Cost Ledger..." — viewer opens with newest-first rows, totals in header, path + counts in status bar.
5. "Open ledger.jsonl" — inspect raw JSON shape in Notepad.

**STILL OPEN (NOT IN THIS WORK)**
- Pharos summarizer timeout (30s ceiling hit twice in the 2026-04-20 hourglass round) — config bump still needed before another hourglass is reliable.
- Trident Gemini free-tier quota (20/day) — NEXT_STEPS #7, hard-blocks participation after ~3 rounds/day.
- Forge 986-token burn on trivial prompts — almost certainly o-series reasoning tokens, which the new ledger will now quantify precisely per-dispatch.
- SpinDrift direct-question avoidance (2026-04-20 16:43 canary) vs proper synthesis (2026-04-20 20:07 round) — card behavior is inconsistent; may need prohibition tightening.
- Deprecate TokenUsageLogger CSV dual-write once ledger parity is confirmed over several rounds.
- Slice 2: BudgetPolicyService + BudgetGateService + SQLite migration (triggered when aggregate queries matter).

interai-hub/main is now 10 commits ahead of origin. All four Slice 1 commits are independently revertable; each has a clear single purpose.

---END---
