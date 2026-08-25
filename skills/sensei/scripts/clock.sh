#!/usr/bin/env bash
# UserPromptSubmit: inject the session clock so the agent never has to count.
s="${SENSEI_HOME:-$HOME/.sensei}/session.json"
[ -f "$s" ] || exit 0
start=$(jq -r '.started_at // empty' "$s"); phase=$(jq -r '.phase // "?"' "$s")
[ -n "$start" ] || exit 0
now=$(date +%s)
st=$(date -d "$start" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "${start%%.*}" +%s 2>/dev/null || python3 -c "import sys,datetime;print(int(datetime.datetime.fromisoformat(sys.argv[1].replace('Z','+00:00')).timestamp()))" "$start" 2>/dev/null || echo "$now")
min=$(( (now - st) / 60 ))
msg="SENSEI CLOCK: ${min}/20 min · phase: ${phase}"
[ "$min" -ge 20 ] && msg="$msg · TIME IS UP: go to Log now, record green:false if not green"
[ "$min" -ge 15 ] && [ "$min" -lt 20 ] && msg="$msg · move to explain-back"
jq -n --arg m "$msg" '{hookSpecificOutput:{hookEventName:"UserPromptSubmit",additionalContext:$m}}'
