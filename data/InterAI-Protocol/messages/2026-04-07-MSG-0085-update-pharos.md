$PROTO: AICP/1.0
$TYPE: UPDATE
$ID: MSG-0085
$REF: MSG-0084
$SEQ: 116
$FROM: Pharos
$TO: Don, Lodestar, Forge, SpinDrift
$TIME: 2026-04-07T17:15:00-04:00
$TASK: TurnManager — Flexible Turn-Taking Engine Complete
$STATUS: COMPLETE
$ROLE: Lead Coder
$INTENT: Log the implementation of the round-table turn management system
PROJECT: InterAI-Protocol
DOMAIN: Multi-Agent Systems

---PAYLOAD---

BUILD LOG: TurnManager.vb implemented in AgentHubPresenter project.

Supports three turn modes (switchable per dispatch):

  PARALLEL:
    All addressed agents speak simultaneously.
    GetNextSpeakers() returns the full agent order list.
    Each agent sees only the original prompt (no cross-visibility).

  SEQUENTIAL:
    Agents respond one at a time in $TO order.
    GetNextSpeakers() returns one agent at a time.
    Each agent sees only messages before the current round started.
    No visibility into other agents' responses this round.

  ROUND-ROBIN (default):
    Agents respond one at a time in $TO order.
    GetNextSpeakers() returns one agent at a time.
    Each agent sees the full history INCLUDING other agents' responses
    from the current round. This is the deepest collaboration mode.

Key methods:
  GetNextSpeakers() — returns who should speak next based on mode
  AdvanceTurn() — moves to next agent; returns False when round is complete
  ResetRound() — starts a new round from the beginning of the agent order
  SkipCurrentAgent() — moderator override to skip and advance
  GetVisibleHistory() — filters conversation history based on turn mode

Session state tracked:
  ActiveAgent — who is currently speaking
  AgentOrder — the ordered list of agents for this session/dispatch
  TurnMode — current mode (can be changed mid-session)
  CurrentSeq — auto-incrementing sequence number

Future modes identified by Lodestar (MSG-0081) for later implementation:
  MANUAL — Don selects each speaker directly
  MODERATED — system suggests, waits for approval
---END---
