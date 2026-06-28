// Generates catalog.json from every addon manifest under addons/<type>/<id>/manifest.json.
// The BetterCodex marketplace site and desktop client read the generated catalog.json.
// Run `npm run build` after adding or editing an addon. CI runs `--check` to make sure
// catalog.json is in sync with the registry.

import {readFileSync, readdirSync, writeFileSync, existsSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = "companion-inc/bettercodex-store";
const TYPES = ["plugin", "theme", "skill"];

function readManifest(type, id) {
  const dir = join(root, "addons", type + "s", id);
  const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
  const entry = {
    id,
    type,
    name: manifest.name,
    description: manifest.description,
    author: manifest.author,
    version: manifest.version || "0.1.0",
    tags: Array.isArray(manifest.tags) ? manifest.tags : [],
    sourceUrl: manifest.source || `https://github.com/${REPO}/tree/main/addons/${type}s/${id}`,
    homepageUrl: manifest.homepage || null,
    updatedAt: manifest.updatedAt || new Date().toISOString().slice(0, 10),
  };
  if (type === "skill") {
    // Skills install through Codex's native marketplace, not a file download.
    entry.install = `codex plugin marketplace add ${REPO}`;
    entry.skillPath = `addons/skills/${id}`;
  } else {
    entry.fileName = manifest.file;
    entry.downloadUrl = `https://raw.githubusercontent.com/${REPO}/main/addons/${type}s/${id}/${manifest.file}`;
  }
  return entry;
}

function collect() {
  const addons = [];
  for (const type of TYPES) {
    const base = join(root, "addons", type + "s");
    if (!existsSync(base)) continue;
    for (const id of readdirSync(base)) {
      if (id.startsWith(".")) continue;
      const dir = join(base, id);
      if (!existsSync(join(dir, "manifest.json"))) continue;
      addons.push(readManifest(type, id));
    }
  }
  addons.sort((a, b) => a.name.localeCompare(b.name));
  return addons;
}

const catalog = {
  schemaVersion: 1,
  generatedAt: process.env.CATALOG_TIMESTAMP || "generated",
  addons: collect(),
};

const out = JSON.stringify(catalog, null, 2) + "\n";
const outPath = join(root, "catalog.json");

if (process.argv.includes("--check")) {
  const current = existsSync(outPath) ? readFileSync(outPath, "utf8") : "";
  // Compare ignoring the generatedAt line so timestamps don't cause false failures.
  const strip = (s) => s.replace(/"generatedAt":\s*"[^"]*"/, '"generatedAt":""');
  if (strip(current) !== strip(out)) {
    console.error("catalog.json is out of date. Run `npm run build` and commit the result.");
    process.exit(1);
  }
  console.log(`catalog.json is in sync (${catalog.addons.length} addons).`);
} else {
  writeFileSync(outPath, out);
  console.log(`Wrote catalog.json with ${catalog.addons.length} addons.`);
}
