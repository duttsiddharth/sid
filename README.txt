AI Resilience by Design: website update for sdadvisory.in (repo: duttsiddharth/sid)

NEW
  ai-resilience-by-design.html   overview page (site template, SEO, embedded preview, CTA)
  ai-resilience/index.html       the interactive model (self-contained, opens in a new tab)

CHANGED
  index.html            new project card 7 in "Solutions & Accelerators"
  aiops-consulting.html related card added
  ai-for-itsm.html      related card added
  sitemap.xml           two URLs added
  service-pages.css     related-grid now auto-fits (was fixed at 4 columns, now holds 5 cards)

APPLY (from the repo root)
  Option A: copy the files in this zip over the repo, keeping the same paths.
  Option B (safer if you edited the 5 changed files since): copy only the two NEW items, then run
            git apply modified-files.patch
  Then:  git add -A && git commit -m "Add AI Resilience by Design" && git push
  GitHub Pages publishes from the repo root; live URLs after deploy:
    https://www.sdadvisory.in/ai-resilience-by-design.html
    https://www.sdadvisory.in/ai-resilience/
