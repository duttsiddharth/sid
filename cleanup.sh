#!/bin/bash
# SD Advisory final cleanup — run from repo root
set -e
# 1) ALL backup files (27 including browser-download duplicates)
git rm -f *.bak *.bak[0-9] "index (12).html.bak" 2>/dev/null || true
git rm -f $(git ls-files | grep "\.bak") 2>/dev/null || true
# 2) Rename page with space in filename
git mv "Legal Rights.html" nyay-sahayak.html 2>/dev/null || true
# 3) OPTIONAL: personal resumes on company domain — uncomment to remove
# git rm -f "Resume_ Siddharth_Dutt.pdf" "Siddharth_Dutt_Resume.pdf"
git add -A
git commit -m "Final cleanup: og-image rebrand, social preview tags, remove backups, rename Legal Rights"
git push
