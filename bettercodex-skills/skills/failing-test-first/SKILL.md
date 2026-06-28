---
name: failing-test-first
description: >
  Reproduce a bug with a failing test before fixing it, so the fix is proven and
  can't silently regress. Use when the user reports a bug, says "this is broken",
  "X returns the wrong value", "fix this crash", or hands over a stack trace or a
  failing case. Write the smallest test that fails for the stated reason, then fix
  until it passes — and only it changes from red to green.
---

# Failing Test First

A fix you can't see fail first is a guess. Capture the bug as a test, watch it fail for the right reason, then make it pass.

## Steps

1. **Pin the defect.** From the report, state the exact broken behavior: given this input/action, the code does X but should do Y. If you can't state it precisely, gather the missing detail (input, repro steps, error) before writing anything.
2. **Find the test seam.** Locate the existing test suite and how it's run (from the manifest/CI). Match its framework, file layout, and naming — don't introduce a new test setup.
3. **Write the smallest failing test.** One assertion that encodes the correct behavior (Y). Run it and confirm it fails — and fails for the *stated* reason, not a setup error. A test that errors on import isn't a repro.
4. **Fix the cause, not the symptom.** Change the code until the new test passes. Don't special-case the test's input; fix the underlying logic so sibling cases are covered too.
5. **Prove it.** Run the new test (green) and the **full** suite (still green — no regressions). Report what the test asserts so the user can see exactly what was broken.

## Guardrails

- The fix should flip the new test red→green and break nothing else. If other tests change, explain why.
- Don't weaken or delete an assertion to make it pass.
- If the bug can't be reproduced in a test, say so and explain what's missing instead of patching blind.
