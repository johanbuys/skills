#!/usr/bin/env bash
# Sync the canonical shared files (shared/) into every skill that carries a copy.
#
# The duplication is deliberate: each skill stays self-contained when installed
# individually via `npx skills add --skill <name>`. This script makes the
# duplication safe: edit the canonical file under shared/, run this script, and
# every copy is stamped. A skill carries a copy iff the file already exists in
# its tree — adding a shared file to a new skill = `cp` it once, then sync.
#
# Usage:
#   scripts/sync-shared.sh          # stamp canonical over all copies
#   scripts/sync-shared.sh --check  # exit 1 if any copy drifts from canonical (CI / pre-commit)

set -euo pipefail
cd "$(dirname "$0")/.."

SHARED_FILES=(
  "references/doc-layout.md"
  "references/html-artifacts.md"
  "assets/overview-template.html"
)

mode="${1:-sync}"
drift=0

for rel in "${SHARED_FILES[@]}"; do
  canonical="shared/$rel"
  [ -f "$canonical" ] || { echo "missing canonical: $canonical" >&2; exit 2; }
  for copy in skills/*/"$rel"; do
    [ -f "$copy" ] || continue
    if ! cmp -s "$canonical" "$copy"; then
      if [ "$mode" = "--check" ]; then
        echo "DRIFT: $copy differs from $canonical" >&2
        drift=1
      else
        cp "$canonical" "$copy"
        echo "stamped: $copy"
      fi
    fi
  done
done

if [ "$mode" = "--check" ]; then
  if [ "$drift" -eq 1 ]; then
    echo "shared-file drift detected — edit shared/ and run scripts/sync-shared.sh" >&2
    exit 1
  fi
  echo "shared files in sync"
fi
