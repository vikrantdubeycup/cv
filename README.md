# vikrantdubey.github.io

Personal site for **Vikrant Dubey** — research scholar, Department of Library & Information Science, Babasaheb Bhimrao Ambedkar University, Lucknow.

Dark, scroll-driven, in the vein of the Framer sites you liked — but hand-written HTML, CSS and JavaScript. No build step, no dependencies, no framework, nothing to compile. Push it to GitHub and it works.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Page structure and the three SVG motion graphics. |
| `data.js` | **All content** — bio, papers, features, education, links. Edit here. |
| `styles.css` | Colours, type, layout, animation. Tokens at the top. |
| `main.js` | The scroll engine: pinning, horizontal track, word lighting, counters. |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is. |
| `scripts/sync.mjs` | The weekly updater. Talks to ORCID and OpenAlex. |
| `.github/workflows/sync.yml` | The schedule that runs it. |
| `publications.json` | Written by the bot. Don't edit; your edits get overwritten. |
| `stats.json` | Written by the bot. Publication, citation and co-author counts. |

## Publishing it

1. Create a **public** repo named exactly `yourusername.github.io` — e.g. `vikrantdubey.github.io`.
2. **Add file → Upload files**, drag in everything from this folder, commit.
3. **Settings → Pages** → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`. Save.
4. Wait a minute, open `https://yourusername.github.io`.

Command line, if you prefer:

```bash
git init
git add .
git commit -m "Add site"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/YOURUSERNAME.github.io.git
git push -u origin main
```

## What moves, and why

| Section | Motion |
| --- | --- |
| Top rail | Marigold ticker of research keywords, looping. |
| Hero | Name rises line by line from a mask. The grey line gets struck through, lifts away, and the real line slides up under it. |
| Statement | Words light from grey to white as the paragraph passes the middle of the screen. |
| Counters | Count up once, when they first come into view. |
| Work | The section pins to the screen; scrolling swaps between three panels, each with its own SVG animation — bars growing, a chain signing itself block by block, strata stacking up. |
| Papers | The section pins and vertical scroll drives the cards sideways. Falls back to a normal stacked list under 900px. |
| "nothing" | Rises from a mask when it enters view. |

Everything checks `prefers-reduced-motion` and switches off if the visitor has it on.

## Weekly auto-update

The site refreshes its own publication list every Monday. You do not touch it.

**How it works.** `.github/workflows/sync.yml` runs `scripts/sync.mjs` on a schedule. That script asks two public APIs what you have published, merges the answers with whatever is already in `data.js`, and writes `publications.json` and `stats.json`. If anything changed, the bot commits, and GitHub Pages rebuilds within a minute.

**The two sources:**

- **ORCID** (`pub.orcid.org`) — your own record, so it is the authority on what counts as yours.
- **OpenAlex** (`api.openalex.org`) — adds abstracts, citation counts, open-access status, and picks up anything with a DOI that you have not yet added to ORCID.

Both are free, public, and want to be used this way. No API key, no account, no cost.

**Why not ResearchGate, Google Scholar or LinkedIn.** Google Scholar has no API and blocks automated requests; a scheduled job hits a CAPTCHA within days. ResearchGate sits behind Cloudflare and its terms prohibit scraping. LinkedIn is stricter still and suspends accounts over it. Anything that claims to automate these either breaks quickly or risks your account.

**What this means for you.** Keep your **ORCID** record current and the site follows. ORCID's *Search & link* wizard pulls from Crossref and DataCite, so most papers are two clicks. Anything without a DOI — a conference paper, a departmental chapter — you add to ORCID manually once, and it appears on the site the following Monday.

### Rules the sync follows

- It only ever **adds**. Every entry in `data.js` stays on the site forever, even if it appears in neither API. A robot cannot delete your work at 6am.
- Your hand-written abstracts **win** over machine-generated ones. It fills in blanks, it does not overwrite.
- If both APIs are unreachable it **writes nothing** and exits quietly, so a bad network day cannot blank your site.
- Duplicates are merged by DOI first, then by title, so the same paper listed as both a preprint and an article collapses into one card.

### Setting it up

1. Make sure your ORCID works are **public**. On orcid.org, each item has a visibility control — set it to *Everyone*. If they are private, the API returns nothing and the sync does nothing.
2. In your repo, go to **Settings → Actions → General**, scroll to *Workflow permissions*, and choose **Read and write permissions**. Save. Without this the bot cannot commit.
3. Go to the **Actions** tab, pick *Sync publications*, click **Run workflow**. It finishes in under a minute. Check the log, then look at your site.

If the ORCID in `.github/workflows/sync.yml` is ever wrong, that is the one place to change it.

### The numbers in the hero

Any count in `data.js` with a `key` is filled in automatically each week:

```js
{ n: 12, label: "publications", key: "publications" },  // auto
{ n: 1,  label: "patent filed" },                       // frozen, no key
```

Delete the `key` to freeze a number at whatever `n` says. Citations come from OpenAlex, which counts only DOI-indexed citations — it will read lower than ResearchGate's figure. ResearchGate reads and its citation count cannot be fetched at all, which is why they are not on the site.

### A caveat about scheduled jobs

GitHub pauses `schedule:` workflows in repositories with no activity for 60 days, and emails you when it does. Since the bot commits whenever something changes, an active publishing record keeps it alive on its own. If you go quiet for two months, one click on **Run workflow** turns it back on.

## Adding a paper (by hand)

Open `data.js`, copy any block inside `publications: [ ... ]`, and change the fields:

```js
{
  title: "Your new paper",
  type: "article",          // article | chapter | conference | preprint | patent
  year: 2026,
  date: "September 2026",   // month spelled out, then year
  venue: "Journal or conference name",
  authors: "Vikrant Dubey, Co-author",
  openAccess: true,
  abstract: "Two or three sentences in plain language.",
  url: "https://link-to-the-paper",
},
```

The list sorts itself by date and the horizontal track resizes. Nothing else to change. Entries added here are permanent — the weekly sync will never remove them.

## Changing the three pinned panels

`features` in `data.js` holds them. Keep it at **three** — the SVG artwork in `index.html` is built for three (`.art-0`, `.art-1`, `.art-2`). If you want a fourth you need a fourth `.art` block and a matching CSS rule.

To change the bar heights in the first panel, edit the `data-h` values on the `<rect>` elements in `index.html` (0–234).

## Changing the colours

Top of `styles.css`:

```css
--bg:     #08090A;   /* page */
--fg:     #F3F2EE;   /* text */
--accent: #FFB03A;   /* marigold — the whole accent shifts if you change this */
```

## Adding a photo or CV

Drop `portrait.jpg` or `cv.pdf` into `assets/`, then link them. For a CV button, add this next to the hero button in `index.html`:

```html
<a class="pill" href="assets/cv.pdf" download style="background:transparent;color:inherit;border:1px solid var(--hair)">Download CV</a>
```

## Custom domain

Add a file named `CNAME` containing only your domain, point an A record at GitHub's Pages IPs, and set the domain under **Settings → Pages**.
