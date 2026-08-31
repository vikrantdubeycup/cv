/* ------------------------------------------------------------------
   Every word on this site lives here. Edit this file, not index.html.
   ------------------------------------------------------------------ */

const SITE = {
  name: "Vikrant Dubey",
  first: "Vikrant",
  last: "Dubey",
  role: "Research scholar",
  department: "Department of Library & Information Science",
  institution: "Babasaheb Bhimrao Ambedkar University",
  city: "Lucknow, India",
  email: "vikrantdubeycup@gmail.com",

  // The hero's two lines. The first gets struck through, the second replaces it.
  heroStrike: "Published. Shelved. Never opened again.",
  heroPromise: "Measure it. Prove it. Keep it.",

  // Runs across the top ticker.
  ticker: [
    "Emerging technologies",
    "Knowledge management",
    "Bibliometrics",
    "Information literacy",
    "Digital preservation",
    "Sentiment analysis",
  ],

  // The big scroll-lit statement.
  statement:
    "I study what happens to knowledge when the technology holding it changes faster than the rules that govern it. Blockchain ledgers. Generative AI. Makerspaces. Twelve papers so far, and one question underneath all of them: what survives, and who gets to reach it.",

  // 'key' means the number is filled in automatically each week from
  // stats.json. Drop the key to freeze a number at whatever n says.
  counts: [
    { n: 12, label: "publications", key: "publications" },
    { n: 10, label: "co-authors", key: "coauthors" },
    { n: 2, label: "citations", key: "citations" },
    { n: 1, label: "patent filed" },
  ],

  qualifications: ["PhD (pursuing)", "MLISc", "BLISc", "PGDADLM", "O' Level (NIELIT)", "BSc (Hons.) Chemistry"],

  links: {
    orcid: "https://orcid.org/0009-0006-6127-2044",
    scholar: "https://scholar.google.com/citations?user=9mkfU1AAAAAJ&hl=en",
    researchgate: "https://www.researchgate.net/profile/Vikrant-Dubey-4",
    linkedin: "https://www.linkedin.com/in/vikrant-dubey-reseach-scholar/",
  },

  // Expanding rows, like a subject index.
  domains: [
    {
      title: "Emerging technologies",
      terms: "Blockchain ledgers · NFTs · Automated sorting · Makerspaces · 3D content",
    },
    {
      title: "Information literacy",
      terms: "Literacy standards · Generative AI acceptance · Technology Acceptance Model · Academic integrity",
    },
    {
      title: "Bibliometrics & web analytics",
      terms: "Citation analysis · Lighthouse audits · Accessibility scoring · SEO · Website content analysis",
    },
    {
      title: "Knowledge management",
      terms: "Digital preservation · Sustainable services · Inclusive access · MOOCs · Environmental literacy",
    },
  ],

  // The three pinned panels. Keep to three — the section is built around it.
  features: [
    {
      eyebrow: "measure",
      title: "23 library websites, scored without mercy",
      body: "Every IIT library site run through Google Lighthouse — performance, accessibility, SEO, mobile readiness. The gaps between them turned out to be much wider than anyone assumed.",
      link: "https://www.researchgate.net/publication/390406937_Evaluating_The_Digital_Performance_and_Accessibility_of_IIT_Library_Websites_Using_Google_Lighthouse",
      linkLabel: "Read the audit",
    },
    {
      eyebrow: "verify",
      title: "A ledger nobody can quietly amend",
      body: "Blockchain and NFTs applied to library transactions and to the books themselves — certifying ownership and provenance for physical and digital stock alike. Written up across a conference paper and a preprint.",
      link: "https://www.researchgate.net/publication/386895064_Unlocking_the_Future_How_Blockchain_is_Transforming_Library_Transactions",
      linkLabel: "Read the paper",
    },
    {
      eyebrow: "preserve",
      title: "Digital content outgrows the systems meant to hold it",
      body: "Preservation is the part nobody funds until it is too late. This work sets out the scale of the problem and what a library can realistically do about it before the files stop opening.",
      link: "https://www.researchgate.net/publication/388849655_Digital_Preservation_Ensuring_Access_for_Future_Generations",
      linkLabel: "Read the paper",
    },
  ],

  /* type: article | chapter | conference | preprint | patent */
  publications: [
    {
      title: "Information Literacy and Acceptance of Generative AI among University Students and Research Scholars in India",
      type: "article",
      year: 2026,
      date: "August 2026",
      venue: "Trends in Scholarly Publishing",
      authors: "Vikrant Dubey, Shweta Verma, Purnima Kumari, Shilpi Verma",
      openAccess: true,
      abstract: "An extended Technology Acceptance Model applied to ChatGPT, Gemini and Copilot use among Indian students and scholars — and what information literacy has to do with whether they trust the output.",
      url: "https://www.researchgate.net/publication/412326701_Information_Literacy_and_Acceptance_of_Generative_AI_among_University_Students_and_Research_Scholars_in_India_An_Extended_TAM_Study",
    },
    {
      title: "Information Literacy Standards: A Comprehensive Review",
      type: "chapter",
      year: 2026,
      date: "January 2026",
      venue: "Book chapter",
      authors: "Vikrant Dubey, Shilpi Verma",
      openAccess: true,
      abstract: "How literacy standards moved from basic research skills to frameworks built around digital literacy, critical thinking and the ethical use of information.",
      url: "https://www.researchgate.net/publication/401242868_Information_Literacy_Standards_A_Comprehensive_Review",
    },
    {
      title: "The Role of MOOCs and E-Learning Platforms in Environmental Literacy: A Library Perspective",
      type: "article",
      year: 2025,
      date: "December 2025",
      venue: "Journal of Applied Bioanalysis",
      authors: "Shweta Verma, Purnima Kumari, Vikrant Dubey, Shilpi Verma",
      openAccess: true,
      abstract: "Open courses have widened access to environmental education. This looks at what is on offer and where libraries fit into supporting it.",
      url: "https://www.researchgate.net/publication/403824982_The_Role_of_MOOCs_and_E-Learning_Platforms_in_Environmental_Literacy_A_Library_Perspective",
    },
    {
      title: "A Comparative Content Analysis of the Engineering College Library Websites of Lucknow Affiliated to AKTU",
      type: "article",
      year: 2025,
      date: "December 2025",
      venue: "Journal of Applied Bioanalysis",
      authors: "Purnima Kumari, Shweta Verma, Vikrant Dubey, Shilpi Verma",
      openAccess: false,
      abstract: "A comparative content analysis of library websites at AKTU-affiliated engineering colleges in Lucknow, judged as portals rather than brochures.",
      url: "https://www.researchgate.net/publication/404432287_A_Comparative_Content_Analysis_Of_The_Engineering_College_Library_Websites_Of_Lucknow_Affiliated_To_AKTU",
    },
    {
      title: "Automated Device for Intelligent Book Sorting and Efficient Library Management System",
      type: "patent",
      year: 2025,
      date: "September 2025",
      venue: "Patent filing",
      authors: "Virendra Kumar, Pankaj Kumar Dedha, Rajana Yadav, Vikrant Dubey, Shilpi Verma",
      openAccess: true,
      abstract: "A device that sorts returned books automatically and routes them back into circulation.",
      url: "https://www.researchgate.net/publication/401137203_AUTOMATED_DEVICE_FOR_INTELLIGENT_BOOK_SORTING_AND_EFFICIENT_LIBRARY_MANAGEMENT_SYSTEM",
    },
    {
      title: "Evaluating the Digital Performance and Accessibility of IIT Library Websites Using Google Lighthouse",
      type: "article",
      year: 2025,
      date: "March 2025",
      venue: "Int. Journal of Computer Sciences and Engineering",
      authors: "Vikrant Dubey, Shilpi Verma",
      openAccess: true,
      abstract: "The library websites of 23 Indian Institutes of Technology, scored on performance, accessibility, SEO and mobile friendliness.",
      url: "https://www.researchgate.net/publication/390406937_Evaluating_The_Digital_Performance_and_Accessibility_of_IIT_Library_Websites_Using_Google_Lighthouse",
    },
    {
      title: "Makerspaces as Emerging Technology: Collaborative 3D Content Creation in Modern Libraries",
      type: "conference",
      year: 2025,
      date: "February 2025",
      venue: "Conference paper",
      authors: "Vikrant Dubey, Shweta Verma, Shilpi Verma",
      openAccess: true,
      abstract: "Libraries have moved from storing knowledge to hosting its making. What 3D makerspaces do for collaboration and for the community around them.",
      url: "https://www.researchgate.net/publication/398610168_Makerspaces_as_Emerging_Technology_Collaborative_3D_Content_Creation_in_Modern_Libraries",
    },
    {
      title: "Balancing Sustainability and Inclusivity in Digital Library Services",
      type: "conference",
      year: 2025,
      date: "February 2025",
      venue: "Conference paper",
      authors: "Shweta Verma, Vikrant Dubey",
      openAccess: true,
      abstract: "Digital services carry an environmental cost and an access gap at once. Strategies for reducing one without widening the other, with case studies.",
      url: "https://www.researchgate.net/publication/397132967_Balancing_Sustainability_and_Inclusivity_in_Digital_Library_Services_Strategies_Challenges_and_Case_Studies",
    },
    {
      title: "Evaluating the Digital Performance and Accessibility of IIT Library Websites (preprint)",
      type: "preprint",
      year: 2025,
      date: "March 2025",
      venue: "Preprint",
      authors: "Vikrant Dubey, Shilpi Verma",
      openAccess: true,
      abstract: "Preprint version of the Lighthouse audit of 23 IIT library websites.",
      url: "https://www.researchgate.net/publication/412946290_Evaluating_The_Digital_Performance_and_Accessibility_of_IIT_Library_Websites_Using_Google_Lighthouse",
    },
    {
      title: "Crypto Books: Revolutionizing Library Management with NFTs and Blockchain Technology",
      type: "preprint",
      year: 2024,
      date: "December 2024",
      venue: "Preprint",
      authors: "Vikrant Dubey, Shilpi Verma",
      openAccess: false,
      abstract: "Tokens as certificates of ownership and provenance for books, and what that would change about how a library manages its stock.",
      url: "https://www.researchgate.net/publication/386877847_Crypto_books_Revolutionizing_Library_Management_with_NFTs_and_Blockchain_Technology",
    },
    {
      title: "Unlocking the Future: How Blockchain is Transforming Library Transactions",
      type: "conference",
      year: 2024,
      date: "November 2024",
      venue: "Conference paper",
      authors: "Vikrant Dubey, Shilpi Verma, Rajiv Ranjan Mishra, Shweta Verma",
      openAccess: true,
      abstract: "An immutable ledger changes what a library can promise about its own records. How blockchain works and where it plausibly fits.",
      url: "https://www.researchgate.net/publication/386895064_Unlocking_the_Future_How_Blockchain_is_Transforming_Library_Transactions",
    },
    {
      title: "Digital Preservation: Ensuring Access for Future Generations",
      type: "conference",
      year: 2024,
      date: "August 2024",
      venue: "Conference paper",
      authors: "Vikrant Dubey, Shweta Verma, Shilpi Verma",
      openAccess: true,
      abstract: "Digital content is growing faster than the systems meant to keep it. Why preservation matters and what stands in its way.",
      url: "https://www.researchgate.net/publication/388849655_Digital_Preservation_Ensuring_Access_for_Future_Generations",
    },
  ],

  path: [
    { period: "2024 —", title: "Research scholar", place: "Dept. of Library & Information Science, BBAU, Lucknow" },
    { period: "2023 — 24", title: "Assistant Professor", place: "Mahanand Mission Harijan College, Ghaziabad" },
    { period: "2021 — 22", title: "MLISc", place: "University of Delhi" },
    { period: "2016 — 19", title: "BSc (Hons.) Chemistry", place: "Dyal Singh College, University of Delhi" },
  ],

  // The punchline block near the end.
  costLine: "and reading it costs",
  costAnswer: "nothing",
  costNote: "Ten of the twelve are open access. No paywall, no request form, no institutional login.",
};
