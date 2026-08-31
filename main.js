/* ==================================================================
   Vikrant Dubey — site behaviour
   Content comes from data.js. Nothing here needs editing to add a paper.
   ================================================================== */

(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const KIND = {
    article: "Journal article",
    chapter: "Book chapter",
    conference: "Conference paper",
    preprint: "Preprint",
    patent: "Patent",
  };

  const LINKS = [
    { key: "researchgate", label: "ResearchGate", handle: "Vikrant-Dubey-4" },
    { key: "scholar", label: "Google Scholar", handle: "Citation profile" },
    { key: "orcid", label: "ORCID", handle: "0009-0006-6127-2044" },
    { key: "linkedin", label: "LinkedIn", handle: "vikrant-dubey-reseach-scholar" },
  ];

  /* ================================================================
     Renderers that can re-run when live data arrives
     ================================================================ */
  const MON = { january:0, february:1, march:2, april:3, may:4, june:5,
                july:6, august:7, september:8, october:9, november:10, december:11 };
  const stamp = (p) => (p.year || 0) * 12 + (MON[String(p.date || "").split(/\s+/)[0].toLowerCase()] || 0);

  function renderCounts(stats) {
    const el = $("#counts");
    if (!el) return;
    el.innerHTML = SITE.counts
      .map((c) => {
        const n = stats && c.key && stats[c.key] != null ? stats[c.key] : c.n;
        return '<li><b data-to="' + n + '">0</b><span>' + esc(c.label) + "</span></li>";
      })
      .join("");
  }

  function renderPublications(list) {
    const track = $("#hsTrack");
    if (!track) return;
    const pubs = list.slice().sort((a, b) => stamp(b) - stamp(a));
    track.innerHTML = pubs
      .map(
        (p) =>
          '<article class="card">' +
          '<div class="card-top"><span class="card-kind">' + esc(KIND[p.type] || p.type) + "</span>" +
          "<span>" + esc(p.date || p.year || "") + "</span></div>" +
          "<h3>" + esc(p.title) + "</h3>" +
          '<p class="who">' + esc(p.authors || "") + "</p>" +
          '<p class="abs">' + esc(p.abstract || "") + "</p>" +
          '<div class="card-top"><span>' + esc(p.venue || "") + "</span>" +
          (p.openAccess ? '<span class="oa">Open access</span>' : "<span></span>") + "</div>" +
          '<a class="go" href="' + esc(p.url || "#") + '" target="_blank" rel="noopener">Read it</a>' +
          "</article>"
      )
      .join("");
    const note = $(".hs-note");
    if (note) note.textContent = pubs.length + " in total \u2014 articles, chapters, conference papers, preprints and a patent filing.";
    const h2 = $("#papers .h2");
    if (h2 && pubs.length !== 12) h2.textContent = "Publications";
  }

  /* Pulls the auto-synced list written by scripts/sync.mjs. If the files
     are not there yet (or we are on file://), the site just keeps using
     whatever is in data.js. */
  async function loadLive() {
    const grab = (f) =>
      fetch(f, { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const [pubs, stats] = await Promise.all([grab("publications.json"), grab("stats.json")]);

    if (Array.isArray(pubs) && pubs.length) {
      renderPublications(pubs);
      window.dispatchEvent(new Event("resize"));
    }
    if (stats) {
      renderCounts(stats);
      counters();
      if (stats.updated) {
        const el = $("#endUpdated");
        if (el) el.textContent = "Publication list synced automatically on " + stats.updated + ".";
      }
    }
  }

  /* ================================================================
     Render
     ================================================================ */
  function render() {
    if (typeof SITE === "undefined") return;

    // ---- ticker rails (duplicated so the loop is seamless)
    const run = SITE.ticker.map((t) => "<span>" + esc(t) + "</span><span>✦</span>").join("");
    $("#railRun").innerHTML = run + run;
    const endRail = $("#railEnd");
    if (endRail) endRail.innerHTML = run + run;

    // ---- hero
    $("#swapA").textContent = SITE.heroStrike;
    $("#swapB").textContent = SITE.heroPromise;
    $("#heroPlace").textContent = SITE.department + ", " + SITE.institution + ", " + SITE.city;

    // ---- statement, split into words for the scroll-lit effect
    $("#statement-text").innerHTML = SITE.statement
      .split(/\s+/)
      .map((w) => '<span class="word">' + esc(w) + " </span>")
      .join("");

    renderCounts(null);

    // ---- domain rows
    $("#rows").innerHTML = SITE.domains
      .map(
        (d, i) =>
          '<article class="row reveal" tabindex="0">' +
          '<span class="row-n">' + String(i + 1).padStart(2, "0") + "</span>" +
          "<div><h3>" + esc(d.title) + "</h3><p>" + esc(d.terms) + "</p></div>" +
          "</article>"
      )
      .join("");

    // ---- pinned panels
    $("#pinSteps").innerHTML = SITE.features
      .map((f, i) => '<button type="button" data-step="' + i + '" aria-current="' + (i === 0) + '">' + esc(f.eyebrow) + "</button>")
      .join("");

    $("#pinCards").innerHTML = SITE.features
      .map(
        (f, i) =>
          '<article class="pin-card' + (i === 0 ? " is-on" : "") + '">' +
          "<h3>" + esc(f.title) + "</h3><p>" + esc(f.body) + "</p>" +
          '<a href="' + esc(f.link) + '" target="_blank" rel="noopener">' + esc(f.linkLabel) + "</a>" +
          "</article>"
      )
      .join("");

    // bar geometry for the "measure" panel
    $$(".bars rect").forEach((r) => {
      const h = +r.dataset.h;
      r.setAttribute("height", h);
      r.setAttribute("y", 252 - h);
    });

    renderPublications(SITE.publications);

    // ---- cost block
    $("#costLine").textContent = SITE.costLine;
    $("#costAnswer").textContent = SITE.costAnswer;
    $("#costNote").textContent = SITE.costNote;

    // ---- path
    $("#pathList").innerHTML = SITE.path
      .map(
        (s) =>
          '<li class="reveal"><span class="per">' + esc(s.period) + "</span>" +
          "<div><h3>" + esc(s.title) + "</h3><p>" + esc(s.place) + "</p></div></li>"
      )
      .join("");

    $("#quals").innerHTML = SITE.qualifications.map((q) => "<li>" + esc(q) + "</li>").join("");

    // ---- end
    const mail = $("#endMail");
    mail.href = "mailto:" + SITE.email;
    mail.textContent = SITE.email;

    $("#endLinks").innerHTML = LINKS.map(
      (l) =>
        '<li><a href="' + esc(SITE.links[l.key]) + '" target="_blank" rel="noopener">' +
        "<span>" + esc(l.label) + '</span><span class="h">' + esc(l.handle) + "</span></a></li>"
    ).join("");

    $("#endName").textContent = "© " + new Date().getFullYear() + " " + SITE.name;
  }

  /* ================================================================
     Pinned focus section
     ================================================================ */
  function pinnedSection() {
    const sec = $("#focus");
    if (!sec) return;
    const n = $$(".pin-card").length;
    const steps = $$("#pinSteps button");
    const cards = $$(".pin-card");
    const arts = $$(".art");
    let current = -1;

    function height() {
      sec.style.height = 100 + n * 85 + "vh";
    }
    height();
    window.addEventListener("resize", height, { passive: true });

    function setActive(i) {
      if (i === current) return;
      current = i;
      sec.dataset.active = i;
      steps.forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
      cards.forEach((c, k) => c.classList.toggle("is-on", k === i));
      arts.forEach((a, k) => a.classList.toggle("is-on", k === i));
    }
    setActive(0);

    steps.forEach((b) => {
      b.addEventListener("click", () => {
        const i = +b.dataset.step;
        const top = sec.offsetTop + ((sec.offsetHeight - window.innerHeight) * (i + 0.35)) / n;
        window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
      });
    });

    return function onScroll() {
      const r = sec.getBoundingClientRect();
      const travel = sec.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const p = clamp(-r.top / travel, 0, 0.9999);
      setActive(Math.floor(p * n));
    };
  }

  /* ================================================================
     Papers — vertical scroll drives a horizontal track
     ================================================================ */
  function horizontalPapers() {
    const sec = $("#papers");
    const track = $("#hsTrack");
    const fill = $("#hsFill");
    if (!sec || !track) return;
    let distance = 0;

    function layout() {
      const narrow = window.innerWidth < 900 || reduced;
      distance = track.scrollWidth - window.innerWidth;
      if (narrow || distance <= 40) {
        sec.classList.add("no-pin");
        sec.style.height = "";
        track.style.transform = "";
        distance = 0;
        return;
      }
      sec.classList.remove("no-pin");
      sec.style.height = window.innerHeight + distance + 80 + "px";
    }

    layout();
    window.addEventListener("resize", layout, { passive: true });
    // fonts land late and change card widths
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    return function onScroll() {
      if (!distance) return;
      const r = sec.getBoundingClientRect();
      const p = clamp(-r.top / (sec.offsetHeight - window.innerHeight), 0, 1);
      track.style.transform = "translate3d(" + -(p * distance).toFixed(1) + "px,0,0)";
      if (fill) fill.style.width = (8 + p * 92).toFixed(2) + "%";
    };
  }

  /* ================================================================
     Statement — words light up as it passes through
     ================================================================ */
  function litStatement() {
    const el = $("#statement-text");
    if (!el || reduced) return;
    const words = $$(".word", el);

    return function onScroll() {
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.82;
      const end = window.innerHeight * 0.28;
      const p = clamp((start - r.top) / (start - end + r.height), 0, 1);
      const lit = Math.round(p * words.length * 1.12);
      for (let i = 0; i < words.length; i++) {
        words[i].classList.toggle("on", i < lit);
      }
    };
  }

  /* ================================================================
     Counters
     ================================================================ */
  function counters() {
    const nums = $$("#counts b");
    if (!nums.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          const to = +en.target.dataset.to;
          if (reduced) { en.target.textContent = to.toLocaleString(); return; }
          const t0 = performance.now();
          const dur = 1100;
          (function tick(t) {
            const k = clamp((t - t0) / dur, 0, 1);
            const eased = 1 - Math.pow(1 - k, 3);
            en.target.textContent = Math.round(to * eased).toLocaleString();
            if (k < 1) requestAnimationFrame(tick);
          })(t0);
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach((n) => {
      // already scrolled past (can happen when live data lands late)
      if (n.getBoundingClientRect().bottom < 0) n.textContent = (+n.dataset.to).toLocaleString();
      else io.observe(n);
    });
  }

  /* ================================================================
     Reveals + sticky bar
     ================================================================ */
  function reveals() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    $$(".reveal").forEach((el, i) => {
      el.style.transitionDelay = Math.min(i % 5, 4) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ================================================================
     Boot
     ================================================================ */
  function init() {
    render();

    const bar = $("#bar");
    const jobs = [pinnedSection(), horizontalPapers(), litStatement()].filter(Boolean);

    let ticking = false;
    function frame() {
      for (const j of jobs) j();
      bar.classList.toggle("is-stuck", window.scrollY > window.innerHeight * 0.7);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } },
      { passive: true }
    );
    window.addEventListener("resize", frame, { passive: true });
    frame();

    counters();
    reveals();

    $$(".hero .mask").forEach((el, i) => el.style.setProperty("--i", i));
    requestAnimationFrame(() => document.body.classList.add("is-ready"));

    loadLive();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
