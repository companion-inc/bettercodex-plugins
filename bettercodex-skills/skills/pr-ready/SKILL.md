---
name: pr-ready
description: >
  Turn a messy working tree into clean, reviewable commits and a tight PR
  description. Use when the user says "open a PR", "commit this", "clean up my
  commits", "get this ready to push/review", or when a dirty tree mixes unrelated
  changes. Splits work into one logical change per commit, writes conventional
  messages, and drafts a PR body grounded in the actual diff.
---

# PR Ready

Reviewers approve changes they can follow. Shape the work into small, single-purpose commits and a description that explains the *why*, not just the *what*.

## Steps

1. **Survey the diff.** Run `git status` and `git diff` (and `git diff --staged`). Group the changes by intent: feature, bug fix, refactor, tests, docs, config. Note anything that doesn't belong (debug prints, stray files, secrets) and flag it.
2. **One change per commit.** Stage by hunk (`git add -p`) so each commit is a single logical change that builds and passes on its own. Don't bundle a refactor with a behavior change.
3. **Write conventional messages.** `type(scope): summary` in the imperative — `fix(auth): refresh token before expiry`. The body explains why, and references issues. No "wip", no "misc".
4. **Verify before pushing.** Run the project's build/lint/test. A red gate means it isn't ready — fix it, don't push past it.
5. **Draft the PR.** Title = the headline change. Body:
   - **What** — 1–2 sentences.
   - **Why** — the problem this solves.
   - **How** — notable implementation choices or tradeoffs.
   - **Testing** — what you ran and what you verified.
   - Risks / follow-ups, if any.

## Guardrails

- Never commit secrets, large generated artifacts, or unrelated reformatting.
- If the tree contains someone else's unfinished work, separate it — don't sweep it into your commits.
- Match the repo's existing commit and PR conventions if it has them.
