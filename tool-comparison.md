## Code review tools comparison (critical prod bugs, low false positives)

- Focus: catching real, production-breaking issues and high-severity security vulns with minimal noise.
- Code validated against this repo (backend, Angular, Python, Android, iOS).

### Pairwise comparisons (winner first)

- CodeRabbit vs SonarQube
  - Winner: CodeRabbit
  - Why: Found immediate runtime failure in routing (services don’t export `.routes`) and precise cross-stack critical issues. SonarQube caught real bugs too (e.g., async authz misuse) but added noise with many code-smell items.

- CodeRabbit vs Greptile
  - Winner: CodeRabbit
  - Why: Broader, deeper security coverage and concrete fix guidance. Greptile is a strong complement, especially for subtle async/await authz bugs and N+1/sync FS patterns.

- CodeRabbit vs CodeAnt
  - Winner: CodeRabbit
  - Why: Concrete, line-focused findings with low duplication; CodeAnt is mainly thematic with less actionable precision.

- CodeRabbit vs Qodo
  - Winner: CodeRabbit
  - Why: CodeRabbit provides per-line, fixable issues; Qodo offers accurate triage summaries but limited actionability.

- Greptile vs SonarQube
  - Winner: Greptile (for PR accuracy)
  - Why: Crisp, actionable flags on critical logic/security/perf; SonarQube useful for breadth in CI but noisier for PR triage.

- SonarQube vs CodeAnt
  - Winner: SonarQube
  - Why: More concrete, rule-backed issues; CodeAnt is higher-level.

- SonarQube vs Qodo
  - Winner: SonarQube
  - Why: Actionable issues vs high-level guidance.

- Greptile vs CodeAnt
  - Winner: Greptile
  - Why: Line-level, fix-ready issues vs thematic repetition.

- Greptile vs Qodo
  - Winner: Greptile
  - Why: Specific and actionable vs summary-only.

- CodeAnt vs Qodo
  - Winner: CodeAnt (slight)
  - Why: Security-focused themes; still less actionable than others.

### Verified examples (from this repo)

- Backend routing crash risk: `app.js` mounts `.routes` that modules don’t export.
- Angular criticals: XSS via `bypassSecurityTrustHtml`, client-side SQL, tokens in `localStorage`, passwords shown in UI (`src/frontend/angular/user-component.ts`).
- Python: `eval()` RCE, XSS via `render_template_string`, open redirect (`src/utils/data-processor.py`).
- Node util: connection leak, N+1 queries, synchronous FS in async flows (`src/utils/cache-manager.js`).
- Mobile: command injection, weak hashing, insecure storage and file perms (Android/iOS files).

### Recommendation for a startup with a critical SaaS

- Primary PR reviewer: CodeRabbit (best signal for high-severity, production-impacting issues; low false positives).
- CI quality/breadth: SonarQube (rules and coverage across languages; accept some noise).
- Optional complement: Greptile (reinforce async/await correctness and performance pitfalls).


