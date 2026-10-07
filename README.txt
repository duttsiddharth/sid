SD Advisory website update (repo: duttsiddharth/sid)
Part 1: AI Resilience by Design added.  Part 2: resume content removed, homepage made commercial.

NEW
  ai-resilience-by-design.html   overview page for the interactive reference architecture
  ai-resilience/index.html       the interactive model (opens in a new tab)
  remove-resume-files.sh         deletes the two resume PDFs and all legacy .bak pages (see below)

CHANGED
  index.html            homepage (details below)
  leadership.html       personal executive-profile page replaced by a redirect to the homepage
  sitemap.xml           AI Resilience URLs added, leadership.html removed
  aiops-consulting.html, ai-for-itsm.html   related card for AI Resilience
  service-pages.css     related cards auto-fit (holds five)

HOMEPAGE CHANGES
  Removed:  Experience timeline (employers, dates, role bullets); Core Competencies list; Tools & Technologies
            skills grid; 14-card Certifications grid; named past-employer clients; awards line; education/job-title
            data in the page metadata and structured data.
  Added:    outcome-led hero with consultation + free-assessment CTAs; results strip with CTA; "Why Enterprises Choose
            SD Advisory" (what you get); industries rewritten in firm voice; "How We Work Together" (consult,
            assessment, scoped pilot, scale + four engagement formats); compact platforms and credentials strip;
            contact section rebuilt around the free consultation.

APPLY (repo root)
  Copy the files over the repo keeping paths (or: copy the NEW files, then  git apply modified-files.patch ).
  Then:  git add -A && git commit -m "Commercial homepage, AI Resilience, remove resume content" && git push
  Then run:  ./remove-resume-files.sh   (commits and pushes on its own)
