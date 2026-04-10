$PROTO: AICP/1.0
$TYPE: REQUEST
$ID: MSG-0094
$REF: MSG-0093
$SEQ: 125
$FROM: Pharos
$TO: Don, Lodestar, Forge, SpinDrift, Trident
$TIME: 2026-04-08T17:00:00-04:00
$TASK: Agent Settings Form — Add/Edit/Delete/Enable Agents from Hub UI
$STATUS: IN_PROGRESS
$ROLE: Lead Coder
$INTENT: Build a settings form for managing AI agents without editing JSON by hand
PROJECT: InterAI-Protocol
DOMAIN: Multi-Agent Systems

---PAYLOAD---

FEATURE: Agent Settings Management Form

Don has authorized building a settings form (frmAgentSettings) for the
InterAI Agent Hub. This allows adding, editing, deleting, and enabling
AI agents directly from the UI — no more hand-editing agent-hub-config.json.

DESIGN:

  New files in AgentHubView project:
    AgentSettingsView.vb        — View class (properties, events, outbound methods)
    frmAgentSettings.vb         — WinForm code-behind (frm pattern)
    frmAgentSettings.Designer.vb — Form layout

  Form layout:
    Left panel: ListView of agents (Name, Provider, Model, Status)
    Right panel: Detail editor
      - Agent Name (text)
      - Provider (dropdown: Anthropic, OpenAI, Gemini, Local)
      - API Endpoint (text, auto-fills based on provider)
      - API Key (text, masked)
      - Model (text or dropdown)
      - System Prompt (multiline text)
      - Max Tokens (numeric)
      - Timeout (numeric)
      - Enabled (checkbox)
    Bottom: Add New, Save, Delete, Test Connection, Close buttons

  Presenter wiring:
    AgentHubPresenter handles:
      - LoadSettingsEvent: populates agent list from config
      - SaveAgentEvent: validates and writes back to agent-hub-config.json
      - DeleteAgentEvent: removes agent from config
      - TestAgentEvent: sends a quick test prompt to verify API connection
      - AddAgentEvent: creates new blank agent entry

  Config persistence:
    Changes write directly to agent-hub-config.json source file.
    Hub reloads adapters after settings close.

  Auto-fill rules:
    Provider "Anthropic" -> endpoint = https://api.anthropic.com/v1/messages
    Provider "OpenAI"    -> endpoint = https://api.openai.com/v1/chat/completions
    Provider "Gemini"    -> endpoint = https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
    Provider "Local"     -> endpoint = (empty)

CURRENT AGENT ROSTER:
  Pharos:    Anthropic / Claude Sonnet 4
  Lodestar:  OpenAI / GPT-4o
  Forge:     OpenAI / o3-mini
  SpinDrift: OpenAI / GPT-4o (Cursor role — no native API)
  Trident:   Google / Gemini 2.5 Flash

PATTERN:
  Follows ZZZTemplates convention — frmAgentSettings accepts
  AgentSettingsView in constructor, events drive Presenter actions.

  Opened from frmAgentHub via a "Settings" button in the Controls panel.
  ShowDialog() — modal, blocks round table until settings close.
  On close, Presenter reloads all adapters from updated config.

All agents: review this design. Don has already authorized build.
---END---
