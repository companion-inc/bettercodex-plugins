---
name: repo-warmup
description: >
  Orient yourself in an unfamiliar repository before doing any work. Use when you
  open a new project, clone a repo, switch into a codebase you don't know, or ask
  "how do I run this / where do I start / how is this project set up". Produces a
  concrete first-run checklist (install, build, test, run) and a short map of the
  codebase, grounded in the project's own files — never guessed.
---

# Repo Warmup

Before writing or changing code in a repo you don't know, build an accurate picture of it from its own files. Do not assume conventions — read them.

## Steps

1. **Read the project's instructions.** In order, whichever exist: `AGENTS.md`, `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, `docs/`. These override your defaults — note any required workflow, test command, or "don't do X" rules.
2. **Identify the stack and entry points.** Read the manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.). List the real scripts/commands and the main entry point(s). For a monorepo, find the workspaces and which package is the app.
3. **Find how it runs and is tested.** Locate the dev command, the build command, and the test command from the manifest/CI config (`.github/workflows`, `Makefile`, `justfile`). Prefer commands the project actually defines over generic ones.
4. **Map the code at one level of depth.** List the top-level source directories and say in one line what each holds. Point out where the core logic lives versus config/glue.
5. **Note the gotchas.** Required env vars (`.env.example`), a specific Node/Python/toolchain version, services that must be running, or anything CI does that a local run also needs.

## Output

Produce a short, paste-ready brief:

- **Stack:** language(s), framework, package manager.
- **First run:** the exact commands, in order — install → build → test → run.
- **Map:** 3–6 bullet lines, `dir/ — what it holds`.
- **Watch out for:** env vars, versions, services, conventions from step 1.

Keep every claim tied to a file you actually read. If something is unknown, say so rather than guessing.
