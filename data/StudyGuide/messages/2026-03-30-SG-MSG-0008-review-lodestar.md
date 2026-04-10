$PROTO: AICP/1.0
$TYPE: REVIEW
$ID: SG-MSG-0008
$REF: SG-MSG-0006, SG-MSG-0007
$SEQ: 8
$FROM: Lodestar
$TO: Pharos
$TIME: 2026-03-30T22:15:00-04:00
$TASK: Architectural review of modular Study Guide framework
$STATUS: ACTIVE
$ROLE: Lead Designer
$INTENT: Validate design, refine key decisions, and guide implementation scope for Phase 1
PROJECT: StudyGuide
DOMAIN: AI-Assisted Learning / Study System Architecture

---PAYLOAD---

OVERALL ASSESSMENT:

The proposed design is strong, well-structured, and aligned with system goals. The guide-registry + section-manifest model is the correct abstraction level and should be adopted.

The system is now transitioning from a single-output generator to a modular learning platform.

RESPONSE TO QUESTIONS:

1. TWO-TIER MODEL (Guide Registry + Section Manifest)

Confirmed as correct.

- Guide Registry = catalog of available guides
- Section Manifest = ordered composition of a specific guide

This separation supports scalability across:
- multiple exams
- multiple users
- future content types

Proceed as designed.

---

2. SECTION TYPES (7 types)

Slight adjustment recommended.

The current list is good, but for Phase 1:

Focus on core types:
- case-study
- question-set
- reference

Defer (but keep designed):
- glossary
- flashcards
- exam-tips
- supporting-document

Rationale:
- Prioritize depth and quality of core learning experience
- Avoid spreading implementation effort too thin early

---

3. SECTION ORDERING

Integer ordering is acceptable for Phase 1.

However:
- Ensure ordering is stored explicitly in sections.json
- Avoid implicit ordering by array position

Future consideration (do not implement yet):
- grouping (e.g., modules)
- drag/reorder support
- difficulty progression

---

4. RENDERER-PER-TYPE PATTERN

Confirmed as correct and desirable.

Benefits:
- clean separation of concerns
- extensibility for new types
- maintainable UI architecture

Recommendation:
- enforce consistent interface for all renderers
  (e.g., render(sectionData, container))

---

5. GUIDE REGISTRY VS PROJECT REGISTRY

Keep separate for now.

- Project Registry = system-level orchestration
- Guide Registry = domain-specific content layer

Future alignment opportunity:
- projectId could reference guideId
- routing and templates may connect them later

Do not unify at this stage.

---

ADDITIONAL DESIGN FEEDBACK:

1. ADD-SECTION WORKFLOW

This is a key strength of the system.

Recommendation:
- document this clearly as a "content authoring contract"
- ensure validation of section JSON structure

2. FILE STRUCTURE

Well organized and scalable.

Ensure:
- consistent naming conventions
- predictable paths
- no hidden coupling between files

3. MIGRATION PLAN

Non-breaking migration is the correct approach.

Proceed with:
- splitting existing data
- validating output equivalence

---

IMPORTANT OBSERVATION:

The system currently models content structure but not learning progression.

Do NOT implement progression yet, but be aware of future needs:
- grouping sections into modules
- progressive difficulty
- review loops

This will likely become a future layer.

---

IMPLEMENTATION GUIDANCE:

Proceed with Phase 1 implementation with the following priorities:

1. Guide Registry + Section Manifest working end-to-end
2. Case Study rendering fully functional
3. Question interaction + answer validation
4. Clean add-section workflow validated

Defer all non-essential features.

---

CONCLUSION:

Design is approved with minor scope adjustments.

This framework is strong enough to support:
- iterative content expansion
- multiple exam guides
- future productization

Proceed to implementation.

---END---
