# SkillBridge AI — Role Research Dataset: Methodology & Summary

**Research date:** 2026-07-18
**Prepared for:** SkillBridge AI student⇄client skills-assessment platform
**Scope:** Source-backed occupational + market research for 5 target roles.

---

## 1. Research Methodology

The dataset was built in three evidence layers, following the requested priority order:

1. **Tier-1 authoritative occupational sources (required backbone)**
   - **O*NET 27.2 Database** (U.S. Department of Labor) — downloaded the complete
     text database (`db_27_2_text.zip`) and parsed Skills (importance IM ratings),
     Knowledge, Task Statements, Technology Skills (Hot/In-Demand flags), Alternate
     Titles, Education, and Job Zones for every canonical O*NET-SOC code.
   - **ESCO v1.1.1** (European Commission) — occupation→skill relations obtained from
     the public CSV release; used for European-aligned essential/optional skill evidence.
   - **O*NET OnLine** detail pages used to recover the full 35-skill list for
     occupations whose granular skills are aggregated away in the downloadable DB
     (e.g. Software Developers 15-1252.00).

2. **Tier-2 current market evidence**
   - Public, no-authentication job-postings APIs (**Jobicy**, **Arbeitnow**) were
     queried for each role, returning 239 raw postings (192 de-duplicated, unique by
     company+title+URL). Skill keywords were extracted from each posting's title and
     description and normalized to a canonical taxonomy, producing a market-frequency
     percentage per skill per role.

3. **Skill normalization & classification**
   - Equivalent names merged (e.g. `JS`→JavaScript, `NodeJS`→Node.js, `PowerBI`→Power BI,
     `Postgres`→PostgreSQL). Aliases retained separately.
   - Each skill classified by `category` (technical/tool/framework/programming-language/
     database/cloud/soft-skill/knowledge), `requirementType` (required/preferred/contextual),
     `marketFrequency`, `authoritativeSupport`, `jobPostingCount`, `targetLevel`
     (awareness/beginner/intermediate/advanced — set to junior/entry expectations).

4. **Role requirement decision**
   - A skill is **required (core)** when it has strong multi-signal evidence:
     (O*NET technology skill OR ESCO essential) **AND** market frequency ≥ 20%, **OR**
     market frequency ≥ 40% (repeated demand across many independent postings), **OR**
     both O*NET and ESCO essential.
   - **Preferred (important)** = ESCO optional with some market signal, or market 20–39%,
     or O*NET-only soft skill with market ≥10%.
   - **Contextual (optional)** = low market frequency and no authoritative support
     (largely ESCO optional skills with no market corroboration).
   - O*NET essential/transferable *soft* skills are included as required (authoritative
     by definition) but kept in `coreSkills` so the technical core remains distinguishable.

---

## 2. Sources Used

| Source | Type | Status | Role coverage |
|---|---|---|---|
| O*NET 27.2 Database | government | accessed (HTTP 200) | all 5 (primary backbone) |
| O*NET OnLine detail report | government | accessed (HTTP 200) | Software Developers skill list |
| ESCO v1.1.1 (via tabiya GitHub mirror) | government | accessed (HTTP 200) | all 5 |
| Jobicy Remote Jobs API | job-posting | accessed (HTTP 200) | all 5 (market frequency) |
| Arbeitnow Job Board API | job-posting | accessed (HTTP 200) | all 5 (cross-validation) |
| **BLS Occupational Outlook Handbook** | government | **BLOCKED (HTTP 403)** | not retrieved (see §7) |

Full deduplicated list with URLs and notes: `source-index.json`.

---

## 3. Job Postings Analyzed per Role

| Role | Canonical O*NET/ESCO anchor | Postings analyzed |
|---|---|---|
| Data Analyst | Operations Research Analysts (15-2031.00) | 49 |
| Frontend Developer | Web Developers (15-1254.00) / Web & Digital Interface (15-1255.00) | 40 |
| Backend Developer | Software Developers (15-1252.00) | 32 |
| Software Engineer | Software Developers (15-1252.00) / ESCO ICT System Developer (2511.15) | 30 |
| AI/ML Engineer | Data Scientists (15-2051.00) / CIRS (15-1221.00) | 41 |

> Target was 10–30 postings per role. The retrieved sample exceeds this for most roles
> because the public APIs returned broader result sets; the full set is retained for
> frequency stability, with a note on geographic/job-level skew (§5).

---

## 4. Skill Counts per Role

| Role | Core (required) | Important (preferred) | Optional (contextual) | Market tools |
|---|---|---|---|---|
| Data Analyst | 41 | 14 | 70 | 3 |
| Frontend Developer | 49 | 16 | 28 | 7 |
| Backend Developer | 43 | 14 | 32 | 3 |
| Software Engineer | 42 | 23 | 132 | 3 |
| AI/ML Engineer | 41 | 20 | 150 | 4 |

The large "Optional" buckets are dominated by ESCO *optional* skills that have **no
market corroboration** in the sampled postings. They are retained for completeness but
should be weighted near-zero in production matching.

---

## 5. Geographic Bias & Limitations

- **Geographic bias:** The market sample is heavily **remote / international** (Jobicy
  and Arbeitnow are remote-jobs aggregators). "地理" is therefore skewed toward
  English-speaking remote roles and EU postings; it is **not globally representative**
  and under-represents local/on-site markets in MENA, Asia, and Latin America.
- **Job-level bias:** The sample skews **junior / intern** (many "intern" labels). This
  is acceptable for an entry-level-targeted dataset but means senior-required skills may
  be under-counted.
- **Source recency:** O*NET 27.2 is the current public release; ESCO v1.1.1 (v1.2/v1.3
  also exist). Market postings are a point-in-time snapshot (2026-07-18).
- **Technology-trend lag:** O*NET's technology list updates slower than the live market;
  very new tools may appear only in postings. The dataset separates "authoritative
  occupational requirements" (O*NET/ESCO) from "current market technology trends"
  (job postings) so the two can be weighted independently.

---

## 6. Conflicts Between Occupational Datasets and Market Listings

- **O*NET broad vs. granular:** "Data Analyst" and "AI/ML Engineer" have **no standalone
  O*NET-SOC code**; they were anchored to the closest authoritative occupations
  (Operations Research Analysts; Data Scientists + Computer & Information Research
  Scientists). Market listings treat them as distinct, in-demand roles — a definitional
  gap between the occupational taxonomy and the live job market.
- **O*NET "soft" skills noise:** O*NET lists mechanical/physical skills for some
  tech occupations (e.g. *Equipment Maintenance, Installation* for Web Developers) that
  are artifacts of the occupation definition and irrelevant to modern web work. These
  are kept (honest to source) but flagged.
- **ESCO optional breadth:** ESCO marks many skills "optional" that the market treats as
  core (or vice-versa). The decision logic therefore requires **market corroboration**
  for a skill to reach "required", preventing ESCO's broad optional list from dominating.
- **Framework preferences:** Market postings show strong framework-specific demand
  (React, Spring Boot, Django) that O*NET/ESCO list only generically ("web programming",
  "software frameworks"). The normalization layer maps these to canonical skills.

---

## 7. Restricted / Unavailable Sources

- **BLS Occupational Outlook Handbook** — all automated access (curl + browser) returned
  HTTP 403 "Access Denied" under BLS bot-usage policy. **No OOH content was scraped.**
  Wage/outlook narrative is therefore sourced only from O*NET and BLS web-search snippets,
  and is marked accordingly. A human can access it manually at https://www.bls.gov/ooh/.
- **O*NET Web Services API (v2.0)** — requires a free registered API key (email
  verification); not used. The downloadable 27.2 DB was used instead and is equivalent
  for this purpose.
- **Company career pages / LinkedIn / Indeed** — bot-protected; not used to avoid
  Terms-of-Service violations. Public no-auth APIs (Jobicy, Arbeitnow) were preferred.

---

## 8. Recommendations for Converting Research → Production SkillBridge Catalog

1. **Two-tier weighting:** Keep `authoritativeSupport` (O*NET/ESCO) and `marketFrequency`
   as separate, independently-weightable signals. Do not collapse them into one score yet.
2. **Core = matchable required:** For the student-assessment engine, use `coreSkills`
   (required) as the primary matching set; `importantSkills` as strong-plus; `optionalSkills`
   as informational only (most have no market signal).
3. **Normalize on ingest:** Re-use the `aliases`/`NORM` map so student self-reported skills
   (e.g. "JS", "Postgres") resolve to the same canonical skill the catalog uses.
4. **Junior calibration:** `targetLevel` is set to entry-level expectations; the production
   matcher should require only `beginner`/`intermediate` mastery for junior roles and never
   expect senior-level mastery from the default profile.
5. **Refresh cadence:** Re-pull job-postings APIs quarterly and O*NET on each new DB release
   to track technology-trend drift; keep the authoritative O*NET/ESCO requirements stable.
6. **Geographic scoping:** Before claiming market representation, supplement with
   region-specific postings (e.g. MENA/local boards) — current data is remote/EU-skewed.
7. **Resolve the Data-Analyst / AI-ML definitional gap** by giving those roles their own
   catalog entries (as done here) rather than inheriting a parent O*NET code.

---

*All deliverable files are in `data/role-research/`: five role JSON files, this summary,
and `source-index.json`. Every cited URL was verified reachable (HTTP 200) except BLS OOH,
which is documented as blocked.*
