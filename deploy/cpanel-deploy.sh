#!/bin/bash
# ─────────────────────────────────────────────────────────────
# techfahm.com — pull-based deploy for cPanel shared hosting.
#
# Runs from cron on the cPanel account (every 5 minutes):
#   /bin/bash $HOME/techfahm-deploy/cpanel-deploy.sh
#
# GitHub Actions builds the site and pushes it to the `production` branch.
# This script fetches that branch and, only when it changed, copies it into
# public_html. It never uses `rm -r` or `rsync --delete`: it only removes
# files that the PREVIOUS build deployed and the new one no longer has, so
# the other sites in public_html (techfahm.ca/, turkiyemakinesi.com/,
# logo-banner/, .well-known/acme-challenge/) are never touched.
#
# Force a redeploy:   FORCE=1 bash ~/techfahm-deploy/cpanel-deploy.sh
# Log:                ~/techfahm-deploy/deploy.log
# ─────────────────────────────────────────────────────────────
set -u

REPO_URL="${REPO_URL:-https://github.com/miladmo68/Techfahm.git}"
BRANCH="production"
BASE="$HOME/techfahm-deploy"
SRC="$BASE/build"
DEST="$HOME/public_html"
LOG="$BASE/deploy.log"
LOCK="$BASE/.lock"

GIT="$(command -v git || true)"
[ -z "$GIT" ] && [ -x /usr/local/cpanel/3rdparty/bin/git ] && GIT=/usr/local/cpanel/3rdparty/bin/git
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" >> "$LOG"; }

[ -z "$GIT" ] && { log "ERROR git not found"; exit 1; }
mkdir -p "$BASE"

# one run at a time (stale lock older than 30 min is cleared)
if ! mkdir "$LOCK" 2>/dev/null; then
  if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +30 2>/dev/null)" ]; then rmdir "$LOCK"; mkdir "$LOCK" || exit 0; else exit 0; fi
fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

FIRST=""
if [ ! -d "$SRC/.git" ]; then
  rm -rf "$SRC"
  "$GIT" clone -q --depth 1 --branch "$BRANCH" "$REPO_URL" "$SRC" >> "$LOG" 2>&1 || { log "ERROR clone failed"; exit 1; }
  FIRST=1
fi
cd "$SRC" || exit 1

OLD_LIST="$BASE/.files-old"
NEW_LIST="$BASE/.files-new"
"$GIT" ls-files > "$OLD_LIST"
OLD="$("$GIT" rev-parse HEAD)"

"$GIT" fetch -q --depth 1 origin "$BRANCH" >> "$LOG" 2>&1 || { log "ERROR fetch failed"; exit 1; }
NEW="$("$GIT" rev-parse FETCH_HEAD)"

if [ "$OLD" = "$NEW" ] && [ -z "$FIRST" ] && [ -z "${FORCE:-}" ]; then exit 0; fi

"$GIT" reset -q --hard "$NEW" || { log "ERROR reset failed"; exit 1; }
"$GIT" ls-files > "$NEW_LIST"

# Refuse to publish an incomplete build
for f in index.html .htaccess sitemap.xml 404.html; do
  [ -f "$f" ] || { log "ERROR build is missing $f — nothing published"; exit 1; }
done

# Copy the new build over public_html (tar keeps dotfiles and permissions)
tar --exclude=.git -cf - . | tar -xf - -C "$DEST" || { log "ERROR copy failed"; exit 1; }

# Remove files that the previous build had and this one does not
if [ -z "$FIRST" ]; then
  sort "$OLD_LIST" -o "$OLD_LIST"; sort "$NEW_LIST" -o "$NEW_LIST"
  comm -23 "$OLD_LIST" "$NEW_LIST" | while IFS= read -r f; do
    case "$f" in ""|*..*|/*) continue ;; esac
    rm -f -- "$DEST/$f"
  done
fi

log "deployed $("$GIT" log -1 --format='%s (%h)')"
exit 0
