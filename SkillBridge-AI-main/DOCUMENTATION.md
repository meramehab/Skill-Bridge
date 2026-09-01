# SkillBridge AI Documentation

## 1. Project Purpose

SkillBridge helps students and entry-level job seekers understand how their current evidence aligns with a career role. It turns manual profile data or CV content into a consistent student profile, matches that profile against an evidence-based role catalog, and uses an adaptive assessment to distinguish claimed skills from demonstrated skills.

The core value is a safer path from "what is listed on my profile" to "what has actually been assessed," followed by clear skill gaps and learning priorities. SkillBridge is currently a Node.js application foundation and command-line demonstration project, not a deployed web product.

## 2. Core Product Journey

| Stage | Status | Current behavior |
| --- | --- | --- |
| Profile | Implemented | Manual, CV text, and text-based PDF inputs produce a shared profile shape. |
| Career Role | Implemented | Five entry-level roles are available in the production role catalog. |
| Profile Matching | Implemented | Deterministic evidence matching produces a weighted Profile Match Score. |
| Adaptive Assessment | Implemented | The backend routes discovery and technical questions skill by skill. |
| Skill Verification | Implemented | Successful technical evaluations produce normalized final levels, confidence, coverage, and verified contributions. |
| Skill Gap | Implemented | Every assessable required skill ends as verified, needs-improvement, missing, or unknown. |
| Qualification | Implemented | A deterministic ordered qualification path converts final gaps into learn, improve, or reassess actions. |
| Learning | Implemented foundation | Qualification items become local learning, improvement, or reassessment steps with progress states. |
| Reassessment | Implemented in memory | Mini assessments can update skill evidence and refresh qualification; persistence is planned. |
| Opportunities | Planned | Opportunity matching is not implemented. |

Product direction:

`Profile -> Career Role -> Profile Matching -> Adaptive Assessment -> Skill Verification -> Skill Gap -> Qualification -> Learning -> Reassessment -> Opportunities`

## 3. Core Architecture Principle

AI handles tasks where language interpretation is useful:

- structured CV extraction;
- profile and learning-context enrichment;
- natural discovery and technical question generation;
- open-ended discovery and technical answer evaluation.

Deterministic JavaScript handles authoritative product behavior:

- session state and routing;
- role weights and score calculation;
- assessment progression and difficulty changes;
- confidence and coverage calculation;
- learning progress, mini-assessment pass/fail, and qualification refresh;
- fallback selection and final business decisions.

This separation keeps scoring reproducible and testable. AI output can provide evidence, language, and evaluation signals, but an unavailable AI service must not invent a verified skill, a missing skill, or a final score.

## 4. Technology Stack

- Runtime used for the latest local verification: Node.js `22.17.0` and npm `10.9.2`.
- Module system: JavaScript ES Modules.
- Gemini SDK: `@google/genai` `2.12.0`.
- Environment loading: `dotenv` `17.4.2`.
- PDF parsing: `pdf-parse` `2.4.5`.
- Tests: the built-in `node:test` runner and `node:assert/strict`.

The dependency versions above are the installed versions recorded in `package-lock.json`. There is no framework, database, API server, UI library, or TypeScript toolchain.

## 5. Project Structure

- `src/`: application and domain logic.
- `tests/`: deterministic local automated tests; these must not call Gemini.
- `scripts/`: command-line demos, manual integration checks, and PDF extraction entry points.
- `data/`: research inputs and curated evidence sources. Raw role research is not used directly for runtime scoring.
- `docs/`: focused architecture notes that supplement this central document.
- `samples/`: fictional profiles, CVs, PDFs, answers, and safety scenarios used by scripts and tests.

Important `src/` areas:

- `src/ai/`: Gemini-backed extraction, enrichment, generation, and evaluation adapters.
- `src/assessment/`: deterministic adaptive session creation, skill state transitions, difficulty, and next-action decisions.
- `src/config/`: environment validation.
- `src/data/`: the production role catalog and deterministic fallback question bank.
- `src/documents/`: local document text extraction.
- `src/interview/`: the original basic interview selection/session helpers, retained as a compatibility and demo layer.
- `src/learning/`: learning-plan creation, progress transitions, mini-assessment sessions, and result application.
- `src/manual/`: deterministic manual profile normalization.
- `src/prompts/`: prompt builders that separate instructions from untrusted profile or answer data.
- `src/qualification/`: final skill-state normalization, level comparison, and deterministic qualification paths.
- `src/roles/`: production role lookup by id, name, or alias.
- `src/schemas/`: JSON schemas for CV and profile data.
- `src/services/`: application orchestration for profiles, readiness, basic interviews, and adaptive assessment.
- `src/skills/`: evidence extraction, skill normalization, matching, priorities, and readiness labels.
- `src/utils/`: small shared Gemini error and JSON response helpers.

No circular dependency was found in the current application flow. Default AI dependencies are dynamically loaded by services where this keeps deterministic tests independent from environment configuration.

## 6. Environment Setup

Required environment variable, by name only:

- `GEMINI_API_KEY`

Setup and local verification:

```powershell
npm install
npm test
```

Gemini-backed or manual integration commands:

```powershell
npm start
npm run test:cv
npm run test:cv:pdf -- "path-to-file.pdf"
npm run test:cv:safety
npm run test:manual
npm run test:profile -- <manual|cv-text|cv-pdf> "input-path"
npm run test:readiness
npm run test:interview:demo
npm run test:adaptive-demo
```

Other useful commands:

```powershell
npm run extract:pdf -- "path-to-file.pdf"
npm run interview
```

The Gemini-backed commands require a configured key and can be affected by quota or service availability. Never print, commit, or copy the real key into documentation or examples.

## 7. Student Profile Pipeline

The unified entry point is `createStudentProfile` in `src/services/create-student-profile.js`. It accepts a source and data, validates the source, and routes to one of three flows:

- `manual`: normalize deterministic input, then ask Gemini only for `suggestedRoles` and `summary`.
- `cv-text`: send non-empty CV text through structured Gemini analysis.
- `cv-pdf`: extract text locally, then use the same CV text analyzer.

The shared Student Profile shape contains `personalInfo`, `skills`, `education`, `experience`, `projects`, `suggestedRoles`, `summary`, and `profileSource`. Manual normalization trims strings, converts missing optional personal values to `null`, removes empty and case-insensitive duplicate skills, creates missing arrays, and returns new objects without mutating the input.

## 8. CV and PDF Processing

PDF extraction is local and occurs before Gemini analysis. `pdf-parse` reads the file, extracted whitespace is normalized, and an empty or unreadable result produces a clear error.

Only text-based PDFs are supported. Scanned or image-only PDFs need OCR, which is not implemented. After extraction, Gemini analyzes the text with `responseMimeType: "application/json"` and the CV JSON schema. The prompt requires supported facts only, nulls and empty arrays for missing information, no markdown, and treats CV content as untrusted data rather than instructions.

## 9. Production Role Dataset

The evidence path is:

`O*NET + ESCO + market job-posting research -> data/role-research/ -> curated src/data/role-catalog.js`

The five current production roles are:

- Data Analyst;
- Frontend Developer;
- Backend Developer;
- Software Engineer;
- AI/ML Engineer.

Each role keeps `sourceMetadata`, including the research file, canonical occupation, research date, posting count, and evidence source names. Each production skill keeps compact evidence such as market frequency, posting count, authoritative support, original research skill names, and a curation rationale.

Assessable technical skills are exposed through the compatibility `requiredSkills` list and have weights totaling exactly `100` per role. Optional and soft skills remain visible in the catalog but have `assessmentWeight: 0` and `assessable: false`, so they do not distort technical readiness.

Backend Developer and Software Engineer include `one-of` language groups. A grouped capability such as Server-side Programming can be supported by one appropriate stack instead of requiring every listed language. Raw files under `data/role-research/` preserve the broader research and must not be modified during normal catalog refactors.

## 10. Profile Match Score

The Profile Match Score is a deterministic weighted evidence score from `0` to `100`. For each required role skill, the matcher looks for canonical names or safe aliases in:

- the profile skill list;
- project technologies and project text;
- experience role/description text;
- education field text.

A matched required skill contributes its full catalog weight. Duplicate evidence does not multiply the score. Optional and non-assessable skills do not increase or reduce the required score.

**Profile Match Score is NOT verified competence.** It measures whether the submitted profile claims or supports role-relevant evidence; it does not prove depth, accuracy, or practical ability.

## 11. Adaptive Assessment Chat Engine

The adaptive engine is the primary assessment architecture going forward. Session creation resolves the production role, calculates the Profile Match Score, and builds one state for every required assessable role skill.

- Claimed/matched skills begin as `pending-verification` at beginner difficulty.
- Unclaimed skills begin as `pending-discovery` at awareness difficulty.
- Skills are ordered by priority and then role weight.
- Only one current question is active at a time.
- Discovery questions determine exposure before technical verification.
- Technical questions adapt across beginner, intermediate, and advanced difficulty.
- `decideNextAssessmentAction` chooses whether to follow up, raise or lower difficulty, verify, or move on.

Gemini supplies question/evaluation content. The backend owns current state, question limits, transitions, score contribution, completion, and finalization.

## 12. Skill Discovery

`Not listed != missing` is a core rule. A student may have studied or practiced a skill without putting it in the profile, so an unclaimed required skill receives a discovery question before it can be marked missing.

Discovery exposure values are:

- `none`;
- `heard-of`;
- `studied`;
- `practiced`.

`studied` and `practiced` can promote the skill to technical verification. `none` and `heard-of` currently mark it missing. If discovery evaluation is unavailable, exposure remains unknown/pending and the skill is not falsely marked missing; it contributes no verified score and remains represented as unverified in the final result.

## 13. Technical Skill Verification

Gemini generates concise practical questions using the target role, skill, prior questions, and profile evidence. For supported skills, the local fallback question bank supplies a deterministic question when generation receives a temporary `429` or `503` error.

Gemini evaluates open-ended answers with a structured schema. Scores are rounded and clamped to `0-100`. Evaluation levels are `not-demonstrated`, `basic`, `intermediate`, and `strong`. The final qualification projection normalizes these values before comparing them with production target levels.

Successful evaluations update the score history and average. Current confidence is deterministic: `0.55` after one successful evaluation, `0.75` after two, and `0.9` after three or more. An unavailable evaluation has a null score, does not increase confidence, and cannot verify a skill.

## 14. Profile Match vs Verified Readiness

Profile Match uses submitted evidence and full matched-skill weights. Verified Readiness uses only successful technical evaluations.

For each successfully evaluated skill:

`verified contribution = role weight * average evaluation score / 100`

The final Verified Readiness Score is the rounded sum of those contributions across the full role weight scale. Verification coverage is the sum of role weights with at least one successful evaluation. Scores are not rescaled to the subset of selected or completed skills, so untested, unavailable, and missing skills contribute zero.

### Final Verified Skill Map

`buildVerifiedSkillMap` creates a new immutable projection containing every required assessable production role skill. Process states such as `pending-discovery` and `in-assessment` do not leak into this final map. Each skill ends in exactly one state:

- `verified`: at least one successful technical evaluation exists and the demonstrated level meets or exceeds the role target.
- `needs-improvement`: successful evidence shows a usable level below the target.
- `missing`: reliable discovery found no meaningful exposure, or successful technical evaluation demonstrated `none`.
- `unknown`: no successful technical evidence exists and the skill was not reliably shown to be missing.

The corresponding actions are `skip`, `improve`, `learn`, and `reassess`. Gap severity is `none` for verified, `high` for missing, and `unknown` for unknown. A needs-improvement skill is `medium` when exactly one normalized level below target and `high` when further below.

### Level Normalization

Comparable levels use this deterministic order:

`none < awareness < basic < beginner < intermediate < strong < advanced`

The existing evaluation value `not-demonstrated` maps to `none`. Existing `basic`, `intermediate`, and `strong` values keep their names. Production targets remain `awareness`, `beginner`, `intermediate`, or `advanced`. `isLevelAtLeast(currentLevel, targetLevel)` performs the comparison without Gemini or a schema migration.

### Partial Evaluation Handling

A later unavailable evaluation does not erase earlier successful evidence. The final map uses the successful average and derives confidence from successful evaluation count when the session has not finalized confidence: `0.55` for one, `0.75` for two, and `0.9` for three or more. Explicit no-exposure discovery has confidence `1`; unknown with no usable evidence has confidence `0`.

### Qualification Path Engine

`buildQualificationPath` excludes `skip` skills and orders active items by action urgency (`learn`, `improve`, `reassess`), role priority (`high`, `medium`, `low`), role weight descending, then skill name for a stable tie-break. Its deterministic summary counts required, verified, improvement, missing, unknown, and active items.

Qualification readiness states mean:

- `qualified`: no active qualification items remain.
- `nearly-qualified`: only improvement or reassessment items remain and no missing skill exists.
- `needs-qualification`: at least one missing required skill or another non-near-ready condition exists.

`buildStudentQualification` resolves the production role, builds both outputs, and preserves existing Profile Match Score, Verified Readiness Score, and verification coverage without recalculating them.

### Qualification to Learning Flow

The in-memory learning loop is:

`Qualification Path -> Learning Steps -> Progress -> Mini Assessment -> Skill Update -> Qualification Refresh`

`createStudentLearningJourney` combines the role, final skill map, qualification path, learning plan, assessment history, and update timestamp in one plain object. There is no database persistence yet.

### Learning Resource Catalog

The local MVP catalog contains generic project and practice metadata for every assessable core production skill, plus supporting assessable skills. Resource records use the canonical skill name, target level, type, estimated hours, and free flag. Generic resources have `provider: null` and `url: null`; the project does not fabricate course links or scrape external catalogs.

### Learning Plan

`buildLearningPlan` converts active qualification items into ordered steps. `learn` receives foundation resources up to the target level, `improve` receives resources between the current and target levels, and `reassess` receives no automatic full course path. Verified or `skip` skills produce no learning step. Every new step starts as `not-started` with zero progress and requires assessment.

### Progress Tracking

Learning progress transitions are deterministic and immutable:

- `start_step`: `not-started -> in-progress`.
- `update_progress`: records an integer from `0` to `100` without changing competence.
- `complete_learning`: sets progress to `100` and status to `awaiting-assessment`; it never verifies a skill.
- `reset_step`: returns the step to `not-started` and zero progress.

Invalid transitions throw an error instead of being silently accepted.

### Mini Assessments

A mini assessment can only start from an `awaiting-assessment` step and uses two questions by default. It reuses technical question generation and answer evaluation, with dependency injection for local tests. Temporary `429/503` question failures use the existing question fallback or a generic local fallback, with no automatic retry. Unavailable answer evaluations never count as successful evidence.

Pass/fail is deterministic. Passing requires at least one successful AI evaluation, an average score of at least `60`, and a demonstrated level that meets the production target. Coverage is the successful evaluation count divided by the configured question count. One successful evaluation and one unavailable evaluation can pass when the successful evidence meets all rules, but coverage and confidence remain lower.

### Re-verification and Qualification Refresh

A passed mini assessment marks the learning step completed and updates the skill only when the demonstrated level meets the target. A failed result sets `needs-review` and keeps the skill missing or needing improvement as supported by the evidence. An unavailable result sets `assessment-unavailable` and leaves competence unchanged. `refreshStudentQualification` then rebuilds the existing deterministic qualification path; passed skills can disappear from active items while failed or unknown skills remain.

## 15. AI Failure and Fallback Strategy

Temporary Gemini errors are centrally recognized for statuses `429` and `503`. The project does not automatically retry API calls.

- Question generation: use a deterministic fallback question where available; discovery has a generic local fallback.
- Answer evaluation: return `unavailable`; never verify the skill from an absent evaluation.
- Discovery evaluation: keep exposure unknown/pending; never infer that the skill is missing.
- Learning enrichment: return deterministic recommendations sorted from the missing skill data.
- Mini-assessment question generation: use a deterministic fallback on temporary failure; unavailable evaluation cannot create a pass.
- Other non-temporary errors: surface the error instead of hiding a programming or malformed-response problem.

The governing rule is: **AI failure reduces certainty. It must never create false certainty.**

## 16. Security and Reliability

Current protections include:

- the Gemini key is read from an environment variable and is not logged;
- a missing key produces a clear startup error;
- CV, profile, and answer content is placed in prompts as data with instructions to ignore embedded commands;
- structured JSON response schemas constrain Gemini-backed outputs;
- final matching, weights, routing, progression, confidence, and scoring are deterministic;
- public service inputs and major nested structures are validated;
- normalization and session updates create new objects or clone sessions where applicable;
- local tests do not require or call Gemini.

These are useful safeguards, not a claim of production-grade security. There is no authentication, authorization, encrypted persistence, API boundary, upload isolation, malware scanning, rate limiting, or production monitoring yet.

## 17. Testing Strategy

The authoritative local command is:

```powershell
npm test
```

It runs only deterministic tests with Node's built-in test runner and makes zero Gemini API calls. The latest successful learning-engine run passed **138 tests with 0 failures**.

Major test areas include manual profile edge cases and immutability, PDF validation and extraction failures, unified profile routing, skill matching and readiness boundaries, production role evidence/weight consistency, basic interview verification, adaptive discovery/state/scoring behavior, final skill-state normalization, qualification ordering/readiness, learning plans and progress, mini-assessment pass/fail and fallback behavior, temporary AI error detection, shared JSON parsing, readiness labels, and priority ordering.

Gemini-backed demos and safety checks are separate npm commands. Their results depend on credentials, quota, network, and service availability and must not be reported as local test failures unless the deterministic implementation itself fails.

## 18. Current Implementation Status

### Completed

- Reusable Gemini configuration and client.
- Manual, CV text, and text-based PDF profile flows.
- Unified Student Profile service.
- Deterministic Skill Intelligence and Profile Match scoring.
- Evidence-based production catalog for five roles.
- Basic interview compatibility flow with fallback questions.
- Adaptive assessment, skill discovery, state progression, and verified readiness foundation.
- Final Verified Skill Map and deterministic Qualification Path Engine.
- In-memory Learning Resource, Progress, Mini Assessment, and Qualification Refresh Engine.
- Architecture-preserving shared error/response/readiness/priority cleanup.
- Central living technical documentation.

### In Progress

- CV safety runtime validation remains pending until Gemini quota/service availability permits a meaningful run.

### Planned

- API and Persistence Layer.
- Authentication, frontend delivery, and opportunity matching after the API foundation.

## 19. Known Design Concerns

- Production role weights may need region-specific recalibration as broader market evidence becomes available.
- The Data Analyst catalog currently gives Git a technical weight for portfolio readiness; this may be revisited.
- Gemini quota and service availability can block manual integration validation.
- PDF processing has no OCR for scanned documents.
- There is no database persistence or reassessment history.
- Learning resources are curated generic metadata with null URLs until verified resources are added.
- There is no API layer, authentication boundary, or UI.
- The basic interview service overlaps with adaptive assessment but remains used as a compatibility/demo layer.

## 20. Next Architecture Stage

The planned next stage is:

`Domain Services -> API Boundary -> Persistent Student and Assessment State`

This stage should expose the deterministic domain services through a validated API and persist profiles, qualifications, learning progress, mini assessments, and reassessment history. Authentication and frontend work remain separate future stages.

## 21. Documentation Maintenance Rules

`DOCUMENTATION.md` represents the **CURRENT SYSTEM STATE**.

After every meaningful feature or architecture change:

1. Read `DOCUMENTATION.md` before coding.
2. Update affected sections after implementation.
3. Do not append diary-style logs to `DOCUMENTATION.md`.
4. Replace outdated statements with current truth.
5. Keep historical implementation entries in `AI_WORKLOG.md`.
6. Keep current and future tasks in `TASKS.md`.
7. Never claim a test passed unless it actually ran.
8. Update the recorded local test count after a successful `npm test` run.
9. Document important new npm commands.
10. Document architecture decisions that affect future development.
