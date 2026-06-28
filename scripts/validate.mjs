// Validates every addon in the registry. CI runs this on each pull request, so a bad
// submission fails before it can be merged. Run `npm run validate` locally first.

import {readFileSync, readdirSync, existsSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TYPES = ["plugin", "theme", "skill"];
const ID_RE = /^[a-z0-9][a-z0-9-]{1,48}$/;
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

const seen = new Set();

for (const type of TYPES) {
  const base = join(root, "addons", type + "s");
  if (!existsSync(base)) continue;
  for (const id of readdirSync(base)) {
    if (id.startsWith(".")) continue;
    const dir = join(base, id);
    const manifestPath = join(dir, "manifest.json");
    const where = `addons/${type}s/${id}`;

    if (!existsSync(manifestPath)) {
      errors.push(`${where}: missing manifest.json`);
      continue;
    }

    let manifest;
    try {
      manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch (error) {
      errors.push(`${where}/manifest.json: invalid JSON (${error.message})`);
      continue;
    }

    check(ID_RE.test(id), `${where}: folder name must be lowercase kebab-case (a-z, 0-9, -)`);
    check(!seen.has(id), `${where}: duplicate addon id "${id}"`);
    seen.add(id);
    check(manifest.type === type, `${where}: manifest.type must be "${type}"`);
    check(typeof manifest.name === "string" && manifest.name.trim(), `${where}: name is required`);
    check(typeof manifest.description === "string" && manifest.description.trim().length >= 10, `${where}: description is required (>= 10 chars)`);
    check(typeof manifest.author === "string" && manifest.author.trim(), `${where}: author is required`);
    check(Array.isArray(manifest.tags) && manifest.tags.length >= 1, `${where}: at least one tag is required`);

    if (type === "skill") {
      check(existsSync(join(dir, "SKILL.md")), `${where}: a skill must contain SKILL.md`);
    } else {
      const suffix = type === "theme" ? ".theme.css" : ".plugin.js";
      check(typeof manifest.file === "string", `${where}: manifest.file is required`);
      if (typeof manifest.file === "string") {
        check(manifest.file.endsWith(suffix), `${where}: ${type} file must end with ${suffix}`);
        check(existsSync(join(dir, manifest.file)), `${where}: file "${manifest.file}" not found in folder`);
      }
    }
  }
}

if (errors.length) {
  console.error("Submission validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
  console.error("\nSee CONTRIBUTING.md for the addon format.");
  process.exit(1);
}

console.log(`All addons valid (${seen.size} total).`);
