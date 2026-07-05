#!/bin/bash
# SD Advisory repo cleanup — run from repo root, review each step
set -e

# 1) Remove publicly-served backup files (leak old site versions)
git rm -f blog.html.bak blog.html.bak1 blog.html.bak2 blog.html.bak3 blog.html.bak4 blog.html.bak5 blog.html.bak6 case-studies.html.bak 2>/dev/null || git rm -f *.bak *.bak[0-9] 

# 2) OPTIONAL — personal resumes on the company domain (currently unlinked but
#    publicly downloadable at guessable URLs). Recommended: remove from the
#    services site; keep copies locally / on leadership page host if needed.
# git rm -f "Resume_ Siddharth_Dutt.pdf" "Siddharth_Dutt_Resume.pdf"

# 3) Fix filename with a space (breaks clean URLs: /Legal%20Rights.html)
#    Nyay Sahayak project page — rename to a proper slug. Unlinked today, so safe.
git mv "Legal Rights.html" nyay-sahayak.html

git add .nojekyll 404.html sitemap.xml *.html
git commit -m "Site hygiene: 404 page, .nojekyll, sitemap fix, social meta sweep, remove .bak files, rename Legal Rights page"
git push
