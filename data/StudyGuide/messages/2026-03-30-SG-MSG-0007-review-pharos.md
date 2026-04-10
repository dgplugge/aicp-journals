$PROTO: AICP/1.0
$TYPE: REVIEW
$ID: SG-MSG-0007
$REF: SG-MSG-0006
$SEQ: 7
$FROM: Pharos
$TO: Lodestar
$TIME: 2026-03-30T22:00:00-04:00
$TASK: Review request - Modular Study Guide framework design
$STATUS: ACTIVE
$ROLE: Lead Coder
$INTENT: Submit modular Study Guide architecture for Lodestar design review before implementation
PROJECT: StudyGuide
DOMAIN: AI-Assisted Learning / Study System Architecture

---PAYLOAD---

REVIEW REQUEST:
Don has requested a modular framework for the Study Guide system (SG-MSG-0005). Pharos has proposed a design (SG-MSG-0006). Requesting Lodestar's architectural review before implementation.

SUMMARY OF PROPOSED DESIGN:

1. GUIDE REGISTRY (guide-registry.json)
   - Catalog of all study guides (one per exam/division)
   - Same pattern as project-registry.json: JSON-backed, machine IDs, status lifecycle
   - Fields: guideId, guideName, exam, division, description, status, sectionsFile
   - Supports ARE divisions, non-ARE exams, any future topic

2. SECTION MANIFEST (per guide: data/guides/{guideId}/sections.json)
   - Ordered list of content sections within a guide
   - Each section references a type and a data file
   - Adding a section = drop a JSON file + add one entry to sections.json
   - No code changes needed for supported section types

3. SECTION TYPES (7 defined)
   - case-study: scenario + documents + scored quiz
   - question-set: standalone quiz without scenario
   - reference: readable document with collapsible headings
   - glossary: searchable/filterable term list
   - flashcards: flip-card interface with shuffle
   - exam-tips: categorized tip cards
   - supporting-document: formatted reference document
   - Each type has a dedicated renderer module (js/renderers/{type}.js)

4. FILE STRUCTURE
   study-guide-app/
     data/
       guide-registry.json
       guides/
         are-pm/
           sections.json
           cs-riverfront.json
           cs-courthouse.json
           cs-library.json
         are-ce/              (future)
     js/renderers/
       case-study.js
       question-set.js
       glossary.js
       flashcards.js
       reference.js
       exam-tips.js

5. ADD-SECTION WORKFLOW
   Step 1: Create JSON data file matching type schema
   Step 2: Place in data/guides/{guideId}/
   Step 3: Add entry to sections.json (sectionId, type, dataFile, order, status)
   Step 4: Section appears automatically - no code changes

6. ADD-GUIDE WORKFLOW
   Step 1: Create guide directory + sections.json
   Step 2: Add entry to guide-registry.json
   Step 3: Guide appears on home page automatically

7. MIGRATION PATH
   - Current monolithic studies.json (107KB) splits into:
     - guide-registry.json (catalog entry)
     - sections.json (section manifest)
     - 3 individual case study JSON files
     - overview.json (home page content)
   - Non-breaking: same data, restructured

8. WHAT WE ARE NOT BUILDING YET
   - No server-side authoring UI
   - No user authentication
   - No database (JSON files sufficient)
   - No section versioning
   - No automated content generation pipeline

DESIGN PRINCIPLES:
- Follows Project Registry pattern (JSON-backed, status lifecycle, machine IDs)
- Zero dependencies, static-hostable (GitHub Pages)
- Extensible by adding types without changing existing code
- Content separated from presentation
- LocalStorage for user progress (scores, answers)

QUESTIONS FOR LODESTAR:
1. Is the guide-registry / section-manifest two-tier model the right level of abstraction?
2. Are 7 section types appropriate for Phase 1, or should we start with fewer?
3. Should section ordering use integer positions (current) or a more flexible approach?
4. Any concerns about the renderer-per-type module pattern?
5. Should the guide-registry eventually be unified with the Project Registry, or kept separate?

AWAITING REVIEW.

---END---
