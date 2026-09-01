# AGENTS

- Use JavaScript ES Modules.
- Keep code simple and beginner-friendly.
- Never expose or print API keys.
- Never edit or delete the `.env` file.
- Do not install packages unless the task requires them.
- Reuse shared modules instead of duplicating Gemini initialization.
- Add clear error messages.
- Do not delete existing files unless explicitly requested.
- After every completed task, append a new entry to `AI_WORKLOG.md`.
- Each `AI_WORKLOG` entry must contain no more than 7 lines.
- Never rewrite, delete, or modify previous `AI_WORKLOG` entries.
- Update `TASKS.md` after completing a task.
- Explain the changes briefly after execution.

## Documentation Workflow

Before implementation:

- Read `DOCUMENTATION.md` when it exists.
- Read `TASKS.md`.
- Read `AI_WORKLOG.md`.

After meaningful implementation:

- Update `DOCUMENTATION.md` so it reflects the current architecture and behavior.
- Update `TASKS.md`.
- Append one concise entry to `AI_WORKLOG.md` without changing previous entries.

Document responsibilities:

- `DOCUMENTATION.md` is the current system truth, not a chronological log.
- `AI_WORKLOG.md` is append-only implementation history.
- `TASKS.md` records current, completed, pending, and next work.
- Do not duplicate large documentation sections in `AI_WORKLOG.md`.
