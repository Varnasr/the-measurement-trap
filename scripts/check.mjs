#!/usr/bin/env node
/**
 * Checks for The Measurement Trap. No dependencies beyond what the build needs.
 *
 * A site whose subject is measurement should not itself be unmeasured, and this
 * repository had no CI at all: not even a check that `eleventy` still builds.
 *
 * Everything here passes today. What it guards is the set of things that break
 * without erroring: an essay missing frontmatter renders with an empty kicker
 * and no byline, an inline chart losing its accessible name becomes invisible to
 * a screen reader while looking fine, and a renamed essay leaves the links to it
 * pointing nowhere.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(ROOT, f), "utf8");

let failures = 0;
const check = (n, fn) => {
  try { const note = fn(); console.log(`  ok    ${n}${note ? ` (${note})` : ""}`); }
  catch (e) { failures++; console.log(`  FAIL  ${n}\n        ${e.message}`); }
};
const assert = (c, m) => { if (!c) throw new Error(m); };

const essays = readdirSync(join(ROOT, "essays")).filter((f) => f.endsWith(".md"));
const src = Object.fromEntries(essays.map((f) => [f, read(join("essays", f))]));

const REQUIRED = ["title", "dek", "kicker", "author", "date", "readtime"];

check("every essay carries the full frontmatter the layout expects", () => {
  for (const f of essays) {
    const m = src[f].match(/^---\n([\s\S]*?)\n---/);
    assert(m, `${f} has no frontmatter block`);
    const keys = [...m[1].matchAll(/^(\w+):/gm)].map((x) => x[1]);
    const missing = REQUIRED.filter((k) => !keys.includes(k));
    assert(missing.length === 0, `${f} is missing ${missing.join(", ")}`);
  }
  return `${essays.length} essays, ${REQUIRED.length} keys each`;
});

check("every inline chart has an accessible name", () => {
  // article.njk renders the markdown as-is, so an <svg> with no name is a chart
  // a screen reader announces as nothing at all while it looks correct on screen.
  for (const f of essays) {
    const svgs = [...src[f].matchAll(/<svg\b[^>]*>/g)].map((m) => m[0]);
    const bare = svgs.filter((s) => !/aria-label|aria-labelledby|role="img"/.test(s));
    assert(bare.length === 0, `${f} has ${bare.length} svg without an accessible name`);
  }
  const total = essays.reduce((n, f) => n + (src[f].match(/<svg\b/g) || []).length, 0);
  return `${total} charts`;
});

check("no essay links to an essay that does not exist", () => {
  const slugs = new Set(essays.map((f) => f.replace(/\.md$/, "")));
  const broken = [];
  for (const f of essays) {
    for (const m of src[f].matchAll(/\]\(\/essays\/([a-z0-9-]+)\/?\)/g)) {
      if (!slugs.has(m[1])) broken.push(`${f} -> /essays/${m[1]}/`);
    }
  }
  assert(broken.length === 0, broken.join("; "));
  return `${slugs.size} slugs`;
});

check("chronology.csv parses and every row is placed in a part", () => {
  const lines = read("chronology.csv").split(/\r?\n/).filter((l) => l.trim());
  assert(lines.length > 1, "chronology.csv has no rows");
  const header = lines[0].split(",");
  assert(header[0] === "Part" && header[1] === "Date" && header[2] === "Event",
    `unexpected header: ${lines[0]}`);
  // Quoted fields contain commas, so count rows rather than split naively.
  const rows = lines.slice(1);
  const unplaced = rows.filter((r) => !/^Part [IVX]+\./.test(r));
  assert(unplaced.length === 0,
    `${unplaced.length} rows do not begin with a part: ${unplaced[0]?.slice(0, 60)}`);
  return `${rows.length} events`;
});

check("the dyslexia-friendly font is actually shipped", () => {
  // The licence file alone is not the font. If the woff2 files go missing the
  // reading-font toggle silently falls back to the default face.
  const licence = existsSync(join(ROOT, "fonts/OpenDyslexic-OFL.txt"));
  if (!licence) return "not used by this site";
  const faces = readdirSync(join(ROOT, "fonts")).filter((f) => f.endsWith(".woff2"));
  assert(faces.length > 0, "OpenDyslexic licence is present but no .woff2 face is");
  return `${faces.length} font files`;
});

check("the built site exists and every essay reached it", () => {
  const site = join(ROOT, "_site");
  assert(existsSync(site), "_site is missing; run `npx eleventy` first");
  const missing = essays
    .map((f) => f.replace(/\.md$/, ""))
    .filter((s) => !existsSync(join(site, "essays", s, "index.html")));
  assert(missing.length === 0, `not built: ${missing.join(", ")}`);
  return `${essays.length} essay pages in _site`;
});

console.log(failures === 0 ? "\nPASS - all checks passed" : `\nFAIL - ${failures} check(s) failed`);
process.exit(failures ? 1 : 0);
