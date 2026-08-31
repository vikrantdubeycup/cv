/* ==================================================================
   sync.mjs — pulls the publication list from ORCID and OpenAlex and
   writes publications.json + stats.json.

   Run by .github/workflows/sync.yml every Monday. Also runnable by
   hand:  node scripts/sync.mjs

   Zero dependencies. Node 18+ (fetch is built in).

   Rules it follows:
   - Anything already in data.js is kept, always. The sync only ever
     ADDS to your list or improves the metadata on it. Nothing you
     wrote by hand can be deleted by a robot at 6am.
   - Your hand-written abstracts win over machine-generated ones.
   - If both APIs are down, it exits without writing, so a bad network
     day can never blank your site.
   ================================================================== */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const ORCID = process.env.ORCID_ID || "0009-0006-6127-2044";
const MAILTO = process.env.CONTACT_EMAIL || "vikrantdubeycup@gmail.com";
const UA = `vikrant-dubey-site/1.0 (mailto:${MAILTO})`;

const log = (...a) => console.log("·", ...a);

/* ---------- small helpers ---------- */

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const titleish = (s) => norm(s).split(" ").slice(0, 12).join(" ");

function typeOf(raw) {
  const t = norm(raw);
  if (t.includes("preprint") || t.includes("posted content")) return "preprint";
  if (t.includes("patent")) return "patent";
  if (t.includes("chapter")) return "chapter";
  if (t.includes("book")) return "chapter";
  if (t.includes("conference") || t.includes("proceedings")) return "conference";
  if (t.includes("dissertation") || t.includes("thesis")) return "chapter";
  return "article";
}

function tidyTitle(s) {
  const t = String(s || "").trim().replace(/\s+/g, " ");
  // ALL CAPS titles are common in patent filings; make them readable
  if (t.length > 12 && t === t.toUpperCase()) {
    return t
      .toLowerCase()
      .replace(/(^|[\s(])([a-z])/g, (m, a, b) => a + b.toUpperCase());
  }
  return t;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Shared CI machines get rate limited by OpenAlex fairly often, so this
   waits properly rather than giving up after a few seconds. */
async function getJSON(url, tries = 5) {
  const backoff = [2000, 5000, 12000, 25000, 40000];
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA } });
      if (r.status === 404) return null;

      if (r.status === 429 || r.status >= 500) {
        const retryAfter = +(r.headers.get("retry-after") || 0) * 1000;
        const wait = Math.max(retryAfter, backoff[i]);
        if (i === tries - 1) {
          console.warn(`  ! ${r.status} from ${url} after ${tries} tries, moving on`);
          return null;
        }
        console.warn(`  · ${r.status}, waiting ${Math.round(wait / 1000)}s then retrying`);
        await sleep(wait);
        continue;
      }

      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } catch (err) {
      if (i === tries - 1) {
        console.warn("  ! gave up on", url, "-", err.message);
        return null;
      }
      await sleep(backoff[i]);
    }
  }
}

/* ---------- read the hand-written baseline out of data.js ---------- */

/* Last week's results. Keeping these means one rate-limited run cannot
   wipe citation counts back to zero. */
function readPrevious() {
  const f = join(ROOT, "publications.json");
  if (!existsSync(f)) return [];
  try {
    const prev = JSON.parse(readFileSync(f, "utf8"));
    return Array.isArray(prev) ? prev : [];
  } catch {
    return [];
  }
}

function readBaseline() {
  try {
    const src = readFileSync(join(ROOT, "data.js"), "utf8") + "\nreturn SITE;";
    const site = new Function(src)();
    return Array.isArray(site.publications) ? site.publications : [];
  } catch (err) {
    console.warn("! could not read data.js:", err.message);
    return [];
  }
}

/* ---------- ORCID ---------- */

async function fromOrcid() {
  const list = await getJSON(`https://pub.orcid.org/v3.0/${ORCID}/works`);
  if (!list || !Array.isArray(list.group)) return [];

  const codes = list.group
    .map((g) => g["work-summary"]?.[0]?.["put-code"])
    .filter(Boolean);
  if (!codes.length) return [];
  log(`ORCID: ${codes.length} works`);

  const out = [];
  for (let i = 0; i < codes.length; i += 50) {
    const chunk = codes.slice(i, i + 50).join(",");
    const bulk = await getJSON(`https://pub.orcid.org/v3.0/${ORCID}/works/${chunk}`);
    const items = bulk?.bulk || [];
    for (const it of items) {
      const w = it.work;
      if (!w) continue;
      const title = w.title?.title?.value;
      if (!title) continue;

      const ids = (w["external-ids"]?.["external-id"] || []).reduce((a, x) => {
        a[String(x["external-id-type"]).toLowerCase()] = x["external-id-value"];
        return a;
      }, {});

      const d = w["publication-date"] || {};
      const year = +(d.year?.value || 0) || null;
      const mIdx = +(d.month?.value || 0);

      const people = (w.contributors?.contributor || [])
        .map((c) => c["credit-name"]?.value)
        .filter(Boolean);

      out.push({
        source: "orcid",
        title: tidyTitle(title),
        type: typeOf(w.type),
        year,
        date: year ? (mIdx ? MONTHS[mIdx - 1] + " " : "") + year : "",
        venue: w["journal-title"]?.value || "",
        authors: people.join(", "),
        abstract: (w["short-description"] || "").trim(),
        doi: ids.doi ? String(ids.doi).toLowerCase() : "",
        url: w.url?.value || (ids.doi ? "https://doi.org/" + ids.doi : ""),
        openAccess: false,
        citations: 0,
      });
    }
  }
  return out;
}

/* ---------- OpenAlex ---------- */

function unInvert(idx) {
  if (!idx) return "";
  const words = [];
  for (const [word, spots] of Object.entries(idx)) {
    for (const s of spots) words[s] = word;
  }
  return words.join(" ").replace(/\s+/g, " ").trim();
}

async function fromOpenAlex() {
  const url =
    `https://api.openalex.org/works?filter=author.orcid:${ORCID}` +
    `&per-page=200&mailto=${encodeURIComponent(MAILTO)}`;
  const data = await getJSON(url);
  const results = data?.results || [];
  log(`OpenAlex: ${results.length} works`);

  return results.map((w) => {
    const d = String(w.publication_date || "");
    const year = w.publication_year || (d ? +d.slice(0, 4) : null);
    const mIdx = d.length >= 7 ? +d.slice(5, 7) : 0;
    let abs = unInvert(w.abstract_inverted_index);
    if (abs.length > 420) abs = abs.slice(0, 400).replace(/\s+\S*$/, "") + "…";

    return {
      source: "openalex",
      title: tidyTitle(w.display_name || w.title),
      type: typeOf(w.type_crossref || w.type),
      year,
      date: year ? (mIdx ? MONTHS[mIdx - 1] + " " : "") + year : "",
      venue: w.primary_location?.source?.display_name || "",
      authors: (w.authorships || []).map((a) => a.author?.display_name).filter(Boolean).join(", "),
      abstract: abs,
      doi: w.doi ? w.doi.replace(/^https?:\/\/doi\.org\//i, "").toLowerCase() : "",
      url: w.doi || w.primary_location?.landing_page_url || "",
      openAccess: !!w.open_access?.is_oa,
      citations: w.cited_by_count || 0,
    };
  });
}

/* ---------- merge ---------- */

function merge(baseline, fetched) {
  const byDoi = new Map();
  const byTitle = new Map();
  const out = [];

  const add = (rec) => {
    const doi = (rec.doi || "").toLowerCase();
    const key = titleish(rec.title);
    const hit = (doi && byDoi.get(doi)) || byTitle.get(key);

    if (!hit) {
      out.push(rec);
      if (doi) byDoi.set(doi, rec);
      byTitle.set(key, rec);
      return;
    }

    // fold the new record into the one we already have, preferring
    // whichever value is actually present. Hand-written wins.
    for (const f of ["venue", "authors", "date", "url"]) {
      if (!hit[f] && rec[f]) hit[f] = rec[f];
    }
    if (!hit.year && rec.year) hit.year = rec.year;
    if (!hit.manualAbstract && rec.abstract && rec.abstract.length > (hit.abstract || "").length) {
      hit.abstract = rec.abstract;
    }
    hit.openAccess = hit.openAccess || rec.openAccess;
    hit.citations = Math.max(hit.citations || 0, rec.citations || 0);
    if (!hit.doi && rec.doi) { hit.doi = rec.doi; byDoi.set(rec.doi, hit); }
  };

  // your own entries go in first, so they set the tone
  for (const p of baseline) {
    add({
      source: "manual",
      title: p.title,
      type: p.type || "article",
      year: p.year || null,
      date: p.date || "",
      venue: p.venue || "",
      authors: p.authors || "",
      abstract: p.abstract || "",
      manualAbstract: !!p.abstract,
      doi: (p.doi || "").toLowerCase(),
      url: p.url || "",
      openAccess: !!p.openAccess,
      citations: 0,
    });
  }
  for (const p of fetched) add(p);

  const mIndex = (s) => {
    const m = MONTHS.indexOf(String(s).split(/\s+/)[0]);
    return m < 0 ? 0 : m;
  };
  out.sort((a, b) => (b.year || 0) * 12 + mIndex(b.date) - ((a.year || 0) * 12 + mIndex(a.date)));

  return out.map(({ source, manualAbstract, ...rest }) => rest);
}

/* ---------- go ---------- */

const baseline = readBaseline();
log(`data.js baseline: ${baseline.length} publications`);

const previous = readPrevious();
if (previous.length) log(`carrying over ${previous.length} from last run`);

// one at a time, so we are not hitting both APIs in the same instant
const orcid = await fromOrcid();
await sleep(1500);
const openalex = await fromOpenAlex();

if (!orcid.length && !openalex.length && !previous.length) {
  console.error("Nothing came back and there is nothing to fall back on. Leaving files alone.");
  process.exit(0);
}

const pubs = merge(baseline, [...previous, ...orcid, ...openalex]);

const coauthors = new Set();
for (const p of pubs) {
  for (const a of String(p.authors).split(/,\s*/)) {
    const n = norm(a);
    if (n && !n.includes("vikrant")) coauthors.add(n);
  }
}

const stats = {
  publications: pubs.length,
  citations: pubs.reduce((s, p) => s + (p.citations || 0), 0),
  coauthors: coauthors.size,
  updated: new Date().toISOString().slice(0, 10),
};

writeFileSync(join(ROOT, "publications.json"), JSON.stringify(pubs, null, 2) + "\n");
writeFileSync(join(ROOT, "stats.json"), JSON.stringify(stats, null, 2) + "\n");

log(`wrote ${pubs.length} publications, ${stats.citations} citations, ${stats.coauthors} co-authors`);
