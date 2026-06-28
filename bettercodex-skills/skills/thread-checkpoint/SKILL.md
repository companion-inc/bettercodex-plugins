---
name: thread-checkpoint
description: >
  Capture a compact, resume-ready checkpoint of the current Codex session so work
  survives a long thread, a context reset, or a handoff. Use when the conversation
  is getting long, before switching tasks, when the user says "checkpoint", "save
  where we are", "summarize so we can continue later", or "hand this off". Writes a
  durable status note — not chat fluff — that the next session can act on cold.
---

# Thread Checkpoint

Long sessions drift and context gets summarized away. A checkpoint preserves the *decisions and state*, not the narration, so work can resume without re-deriving everything.

## What to capture

Write a tight note with these sections — short, specific, and grounded in what actually happened:

1. **Objective** — the goal in one or two sentences. What "done" means.
2. **State** — what is true right now: branch, what's deployed/committed/local-only, services running, key file paths touched.
3. **Done** — the concrete things finished, each verifiable (a commit, a passing test, a deployed URL).
4. **Open / next** — the remaining steps as an ordered list of *commands or actions*, not vague intentions. Put the single next action first.
5. **Decisions** — choices already settled and why, so they aren't relitigated (e.g. "using X over Y because …").
6. **Blockers** — anything waiting on the user or an external system, named precisely.

## Where to write it

- Prefer a file so it survives compaction: `CHECKPOINT.md` at the repo root, or update the project's status doc if one exists.
- Convert relative time to absolute dates.
- Keep it under ~30 lines. If it's longer, you're narrating instead of checkpointing.

## Resuming from one

When handed a checkpoint, read it fully, then **verify the State against the real repo/runtime** before acting — treat it as context, not proof the world still matches it.
