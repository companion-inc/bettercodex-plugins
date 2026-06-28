# Contributing a mod

Adding a plugin, theme, or skill to the BetterCodex marketplace is a pull request to this repo. This page is the full walkthrough; the per‑type guides in [`docs/`](docs) cover how to actually write each kind.

## 1. Pick an id and a folder

Every mod lives in its own folder named with a lowercase, kebab‑case id:

```
addons/themes/<id>/                 # a theme
addons/plugins/<id>/                # a plugin
bettercodex-skills/skills/<id>/     # a skill (inside the Codex plugin package)
```

The id is what users and the catalog reference, so make it specific: `midnight`, `compact-sidebar`, `repo-warmup`.

## 2. Add a manifest

Every folder needs a `manifest.json`. Schema: [`schema/manifest.schema.json`](schema/manifest.schema.json).

**Theme or plugin** — the addon file sits next to the manifest:

```jsonc
{
  "type": "theme",
  "name": "Midnight",
  "description": "A deeper, higher-contrast dark theme for Codex.",
  "author": "yourhandle",
  "version": "1.0.0",
  "tags": ["dark", "contrast"],
  "file": "midnight.theme.css",
  "source": "https://github.com/yourhandle/midnight"
}
```

```
addons/themes/midnight/
  manifest.json
  midnight.theme.css
```

**Skill** — the folder is a Codex skill (a `SKILL.md` plus any scripts/assets):

```jsonc
{
  "type": "skill",
  "name": "Repo Warmup",
  "description": "Reads AGENTS.md, scripts, and tests, then prints a first-run checklist.",
  "author": "yourhandle",
  "version": "1.0.0",
  "tags": ["onboarding", "workflow"]
}
```

```
bettercodex-skills/skills/repo-warmup/
  manifest.json
  SKILL.md
```

## 3. Regenerate the catalog

```bash
npm install   # no dependencies, just sets up the scripts
npm run build # writes catalog.json from every manifest
```

Commit the updated `catalog.json` along with your folder.

## 4. Open the pull request

Push your fork and open a PR. CI runs [`npm run check`](.github/workflows/validate.yml):

- `validate` — every manifest has the required fields, the id is well‑formed, the file exists and is named correctly (`*.theme.css` / `*.plugin.js`), and a skill has a `SKILL.md`.
- `build --check` — `catalog.json` matches the registry (so you didn't forget step 3).

If CI is green and a maintainer approves, the merge publishes your mod to the marketplace within a few minutes.

## Review bar

- It does roughly what the description says, and the code is readable.
- No obfuscation, no exfiltration of tokens/files, no network calls the description doesn't mention.
- Themes use Codex's design tokens where possible (see the [theme guide](docs/authoring-themes.md)).

## Updating or removing a mod

Open a PR that bumps `version` and edits the file, or deletes the folder. Same checks apply.
