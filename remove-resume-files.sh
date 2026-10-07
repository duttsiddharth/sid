#!/bin/bash
# Run from the repo root. Removes files GitHub Pages still serves publicly that contain the old
# personal-portfolio / resume content: the two resume PDFs and every legacy backup page.
# git rm is reversible from history. The PDFs stay in git history unless you purge it (git filter-repo).
set -e
git rm -f "Resume_ Siddharth_Dutt.pdf" "Siddharth_Dutt_Resume.pdf"
git ls-files -z | grep -z -E '\.bak|,bak' | xargs -0 -r git rm -f
git commit -m "Remove resume PDFs and legacy backup pages"
git push
