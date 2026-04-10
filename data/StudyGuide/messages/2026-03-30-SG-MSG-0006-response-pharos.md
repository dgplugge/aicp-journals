$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: SG-MSG-0006
$REF: SG-MSG-0005
$SEQ: 6
$FROM: Pharos
$TO: Don, Lodestar
$TIME: 2026-03-30T21:45:00-04:00
$TASK: Modular Study Guide framework design - guide registry, section model, add-section workflow
$STATUS: COMPLETE
$ROLE: Lead Coder
$INTENT: Propose a lightweight, extensible architecture for multi-guide, multi-section study system
PROJECT: StudyGuide
DOMAIN: AI-Assisted Learning / Study System Architecture

---PAYLOAD---

DESIGN PROPOSAL: Modular Study Guide Framework

OVERVIEW:
Two JSON files govern the entire system. One registers guides (like the Project Registry registers projects). The other stores the section manifest for each guide. The web app reads both at startup and renders dynamically.

============================================================
1. GUIDE REGISTRY (study-guide-app/data/guide-registry.json)
============================================================

Each guide is a standalone exam or topic. The registry is the top-level catalog.

SCHEMA:
{
  "guides": [
    {
      "guideId": "are-pm",
      "guideName": "ARE 5.0 - Project Management",
      "exam": "ARE 5.0",
      "division": "Project Management",
      "description": "Case studies, questions, and reference materials for the PM division",
      "icon": "building",
      "status": "active",
      "createdOn": "2026-03-30",
      "updatedOn": "2026-03-30",
      "tags": ["architecture", "ARE", "project-management"],
      "sectionsFile": "data/guides/are-pm/sections.json"
    },
    {
      "guideId": "are-ce",
      "guideName": "ARE 5.0 - Construction & Evaluation",
      "exam": "ARE 5.0",
      "division": "Construction & Evaluation",
      "description": "CA site visits, submittals, punchlist, closeout",
      "icon": "clipboard",
      "status": "incubating",
      "createdOn": "2026-04-15",
      "updatedOn": "2026-04-15",
      "tags": ["architecture", "ARE", "construction"],
      "sectionsFile": "data/guides/are-ce/sections.json"
    }
  ]
}

FIELDS:
- guideId: Machine-readable key (lowercase, hyphenated)
- guideName: Human-readable display name
- exam / division: Categorization (supports non-ARE exams too)
- sectionsFile: Path to this guide's section manifest
- status: active | incubating | archived

============================================================
2. SECTION MANIFEST (data/guides/{guideId}/sections.json)
============================================================

Each guide has its own sections.json listing all content sections in display order.

SCHEMA:
{
  "guideId": "are-pm",
  "sections": [
    {
      "sectionId": "overview",
      "type": "reference",
      "title": "Division Overview",
      "description": "ARE 5.0 PM content areas, weightings, and key AIA documents",
      "dataFile": "overview.json",
      "order": 1,
      "status": "active",
      "addedOn": "2026-03-30"
    },
    {
      "sectionId": "cs-riverfront",
      "type": "case-study",
      "title": "Case Study 1: Riverfront Mixed-Use Development",
      "description": "Schedule management, change orders, consultant coordination",
      "dataFile": "cs-riverfront.json",
      "order": 2,
      "status": "active",
      "addedOn": "2026-03-30",
      "questionCount": 10,
      "difficulty": "M-H"
    },
    {
      "sectionId": "cs-courthouse",
      "type": "case-study",
      "title": "Case Study 2: Historic Courthouse Adaptive Reuse",
      "description": "Risk management, unforeseen conditions, owner communication",
      "dataFile": "cs-courthouse.json",
      "order": 3,
      "status": "active",
      "addedOn": "2026-03-30",
      "questionCount": 10,
      "difficulty": "M-H"
    },
    {
      "sectionId": "cs-library",
      "type": "case-study",
      "title": "Case Study 3: Municipal Library Branch",
      "description": "Public procurement, budget constraints, quality control",
      "dataFile": "cs-library.json",
      "order": 4,
      "status": "active",
      "addedOn": "2026-03-30",
      "questionCount": 10,
      "difficulty": "E-M"
    },
    {
      "sectionId": "glossary-pm",
      "type": "glossary",
      "title": "PM Glossary",
      "description": "Key terms and AIA document references",
      "dataFile": "glossary.json",
      "order": 10,
      "status": "incubating",
      "addedOn": "2026-04-02"
    },
    {
      "sectionId": "flashcards-contracts",
      "type": "flashcards",
      "title": "Contract Terms Flashcards",
      "description": "B101, A201, G701 key provisions",
      "dataFile": "flashcards-contracts.json",
      "order": 11,
      "status": "incubating",
      "addedOn": "2026-04-02"
    }
  ]
}

============================================================
3. SECTION TYPES
============================================================

Each type has a defined JSON shape. The app renders each type with its own UI component.

TYPE: case-study
- scenario (HTML string)
- documents[] (title, subtitle, content)
- questions[] (stem, options, correctAnswer, explanation, whyNot, crossRef)
- Rendered as: tabbed scenario/docs/quiz with scoring

TYPE: question-set
- questions[] (same shape as case study questions, but standalone)
- Rendered as: quiz-only view with scoring

TYPE: reference
- content (HTML string or structured sections)
- Rendered as: readable document with optional collapsible headings

TYPE: glossary
- terms[] (term, definition, references[], relatedTerms[])
- Rendered as: searchable/filterable alphabetical list

TYPE: flashcards
- cards[] (front, back, tags[], difficulty)
- Rendered as: flip-card interface with shuffle, filter by tag

TYPE: exam-tips
- tips[] (title, content, tags[])
- Rendered as: categorized tip cards

TYPE: supporting-document
- title, subtitle, content (HTML)
- Rendered as: formatted document view (for standalone reference docs)

============================================================
4. FILE STRUCTURE
============================================================

study-guide-app/
  index.html
  css/style.css
  js/app.js
  js/renderers/          <-- NEW: per-type rendering modules
    case-study.js
    question-set.js
    glossary.js
    flashcards.js
    reference.js
    exam-tips.js
  data/
    guide-registry.json  <-- NEW: replaces hardcoded studies.json
    guides/
      are-pm/
        sections.json
        cs-riverfront.json
        cs-courthouse.json
        cs-library.json
        overview.json
        glossary.json          (future)
        flashcards-contracts.json (future)
      are-ce/                  (future guide)
        sections.json
        ...

============================================================
5. ADD-SECTION WORKFLOW
============================================================

To add a new section to an existing guide:

STEP 1: Create the data file
- Write a JSON file matching the section type schema
- Place it in data/guides/{guideId}/

STEP 2: Register the section
- Add an entry to sections.json with:
  - sectionId (unique within guide)
  - type (must match a known renderer)
  - dataFile (relative path to the new JSON)
  - order (controls display sequence)
  - status: "active" to show immediately

STEP 3: Refresh the app
- The app reads sections.json on load
- New section appears automatically in the guide navigation
- No code changes required for supported section types

To add a new section TYPE:
- Create a renderer in js/renderers/{type}.js
- Register it in the renderer map in app.js
- All guides can then use that section type

============================================================
6. ADD-GUIDE WORKFLOW
============================================================

STEP 1: Create the guide directory: data/guides/{guideId}/
STEP 2: Create sections.json with at least one section
STEP 3: Create the section data files
STEP 4: Add entry to guide-registry.json
STEP 5: The app home page automatically shows the new guide

============================================================
7. INTEGRATION WITH AICP / PROJECT REGISTRY
============================================================

- StudyGuide remains a registered project in project-registry.json
- Each new guide or major section addition gets an AICP message in the StudyGuide journal
- The guide-registry.json follows the same pattern as project-registry.json:
  - JSON-backed, file-persisted
  - Machine-readable IDs + human-readable names
  - Status lifecycle (incubating -> active -> archived)
- Future: server endpoints (GET/POST) for guide-registry and sections, matching the project-registry API pattern
- Future: Builder integration to create guides/sections via AICP messages

============================================================
8. MIGRATION FROM CURRENT APP
============================================================

The current monolithic studies.json (107KB, all 3 case studies in one file) would be refactored into:

STEP 1: Create guide-registry.json with are-pm entry
STEP 2: Create data/guides/are-pm/sections.json
STEP 3: Split studies.json into 3 individual case study files:
  - cs-riverfront.json (scenario + docs + questions for CS1)
  - cs-courthouse.json (CS2)
  - cs-library.json (CS3)
STEP 4: Create overview.json from the meta/home content
STEP 5: Update app.js to read guide-registry -> sections -> data files
STEP 6: Add renderer modules for each section type

This is a non-breaking migration - the data is the same, just restructured.

============================================================
9. WHAT NOT TO BUILD YET
============================================================

Per Don's guidance ("do not overbuild"):
- No server-side authoring UI
- No user authentication
- No database (JSON files are sufficient)
- No section versioning/history
- No multi-user collaboration features
- No automated content generation pipeline

These can be added later as the system matures.

RECOMMENDATION:
Approve this design, then I can execute the migration from the current monolithic app to the modular structure. The existing content stays intact - it's a restructure, not a rewrite.

READY FOR REVIEW.

---END---
