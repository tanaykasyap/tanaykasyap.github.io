#!/usr/bin/env bash
set -euo pipefail

# ----- settings -----
GITHUB_USER="tanaykasyap"
REPO="${GITHUB_USER}.github.io"
REMOTE="https://github.com/${GITHUB_USER}/${REPO}.git"
# --------------------

# sanity checks
if [ ! -f "_quarto.yml" ] && [ ! -f "_quarto.yaml" ]; then
  echo "❌ No _quarto.yml here. Run this from your Quarto project root."
  exit 1
fi
if ! command -v quarto >/dev/null 2>&1; then
  echo "❌ Quarto not found. Install from https://quarto.org and re-run."
  exit 1
fi

# a minimal .gitignore (only if missing)
if [ ! -f ".gitignore" ]; then
  cat > .gitignore <<'EOF'
.DS_Store
.quarto/
.Rproj.user/
.Rhistory
.RData
.Ruserdata
*/.ipynb_checkpoints/
EOF
  echo "✓ .gitignore created"
fi

# All Rights Reserved license (keeps code non-reproducible)
if [ ! -f "LICENSE" ]; then
  cat > LICENSE <<'EOF'
Copyright © 2025 Venkata Tanay Kasyap Kondiparthy.

All rights reserved.
You may not copy, modify, distribute, or use this code or content, in whole or in part,
without explicit written permission from the copyright holder.

This repository may include third-party libraries, themes, or assets whose licenses
may differ. Such components are governed by their respective licenses.
EOF
  echo "✓ LICENSE (All Rights Reserved) added"
fi

# small README (only if missing)
if [ ! -f "README.md" ]; then
  cat > README.md <<'EOF'
# Personal Website

Public site for Tanay Kasyap: https://tanaykasyap.github.io

© 2025 Venkata Tanay Kasyap Kondiparthy. All rights reserved.
No reuse of code or content without written permission.
EOF
  echo "✓ README.md added"
fi

# init git & commit sources on main
if [ ! -d ".git" ]; then
  git init
fi
git branch -M main || true

git add -A
if ! git diff --cached --quiet; then
  git commit -m "Publish Quarto site (sources)"
else
  echo "ℹ Nothing to commit."
fi

# ensure remote
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi
echo "✓ Remote set to $REMOTE"

# push sources
git push -u origin main

# build & publish to gh-pages
echo "▶ Publishing to gh-pages…"
quarto publish gh-pages

cat <<'DONE'

✅ Deployed to the gh-pages branch.

FINAL STEP (one-time in GitHub UI):
  Repo → Settings → Pages
  • Build and deployment → Source: "Deploy from a branch"
  • Branch: gh-pages   • Folder: /(root)
  Save, then open: https://tanaykasyap.github.io

UPDATING LATER:
  Make changes → run ./publish-gh.sh again.

DONE

