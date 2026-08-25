#!/usr/bin/env bash
# Stop: refuse to end while a session is open unless the Log phase wrote the learner model.
in=$(cat)
[ "$(jq -r '.stop_hook_active // false' <<<"$in")" = "true" ] && exit 0
d="${SENSEI_HOME:-$HOME/.sensei}"; s="$d/session.json"
[ -f "$s" ] || exit 0
phase=$(jq -r '.phase // empty' "$s"); start=$(jq -r '.started_at // empty' "$s")
st=$(date -d "$start" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "${start%%.*}" +%s 2>/dev/null || echo 0)
ly=$(stat -c %Y "$d/learner.yaml" 2>/dev/null || stat -f %m "$d/learner.yaml" 2>/dev/null || echo 0)
if [ "$phase" != "debrief" ] || [ "$ly" -lt "$st" ]; then
  jq -n '{decision:"block",reason:"Sensei: session still open. Finish the Log phase — update learner.yaml, append log.jsonl, commit, delete session.json — then stop."}'
fi
exit 0
