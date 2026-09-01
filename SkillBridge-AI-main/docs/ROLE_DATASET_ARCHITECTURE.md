# Role Dataset Architecture

Research Data
-> Normalization
-> Production Role Catalog
-> Profile Matching
-> Adaptive Assessment
-> Verified Skill Map
-> Readiness / Qualification

## Research data

- The original research JSON files stay in `data/role-research/`.
- They preserve O*NET, ESCO, and job-posting evidence with broader raw skill coverage.
- SkillBridge does not use those raw files directly inside scoring or assessment logic.

## Normalization

- Similar names are normalized into one production skill, such as `JS` -> `JavaScript`, `React.js` -> `React`, `NodeJS` -> `Node.js`, `PowerBI` -> `Power BI`, and `Postgres` -> `PostgreSQL`.
- Aliases are preserved only when they are useful and low-risk for matching.
- Dangerous cross-matches are avoided. For example, `Java` is not treated as `JavaScript`.

## Production role catalog

- The production catalog lives in `src/data/role-catalog.js`.
- Each role keeps:
  - `id`, `name`, `aliases`, `description`, `experienceLevel`
  - `sourceMetadata`
  - `skills`
  - derived compatibility fields for current engines: `requiredSkills` and `optionalSkills`
- Each skill keeps:
  - `id`, `name`, `aliases`, `category`
  - `importance`: `core`, `important`, or `optional`
  - `assessmentWeight`
  - `targetLevel`
  - `assessable`
  - `evidence`

## Skill classification

- `core` skills represent stable entry-level capabilities that should matter strongly in technical matching and assessment.
- `important` skills still help readiness, but usually with less weight than core skills.
- `optional` skills stay in the dataset for guidance and future recommendations, but they do not reduce baseline technical readiness.
- Soft skills stay in the catalog for explanation and future guidance, but they are marked `assessable: false` so they do not distort technical scoring.

## Weight calculation

- Only assessable technical skills contribute to technical readiness and verified readiness.
- Each role's assessable skills total exactly `100`.
- The weighting rule is deterministic:
  - core skills get the largest weights
  - important skills get smaller weights
  - optional and soft skills get `0`
- This keeps scoring stable and local. Gemini is not used for final score calculation.

## Alternative technology stacks

- Alternative stacks are modeled as production-friendly shared capabilities instead of forcing every tool separately.
- Example:
  - `Backend Developer` verifies `Server-side Programming`
  - the role also keeps a `one-of` backend language group containing `Node.js`, `Python`, `Java`, `C#`, and `Go`
- This avoids unfairly penalizing a student for not knowing every backend language at once.

## Profile matching

- Profile matching uses the production catalog aliases and canonical skill names.
- The current readiness engine reads the derived `requiredSkills` list for technical scoring.
- Optional and soft skills can still be detected and reported as extra context.

## Adaptive assessment

- Adaptive assessment also uses the production `requiredSkills` list.
- Only assessable technical skills become weighted skill states.
- Gemini failures never verify a skill by themselves. Local deterministic logic controls score contribution.

## Verified skill map and readiness

- `Profile Match Score` answers: what the profile claims or suggests.
- `Verified Readiness Score` answers: what the assessment successfully verified.
- Because soft skills are non-assessable in the current architecture, they stay visible without consuming meaningful verified technical weight.

## Evidence preservation

- Every production role keeps `sourceMetadata` pointing back to the research dataset.
- Every production skill keeps compact evidence metadata such as:
  - market frequency
  - job posting count
  - authoritative support
  - original research skill names
  - a short production rationale
- This keeps the production catalog simple for engines while preserving explainable evidence for future user-facing explanations.
