#!/usr/bin/env bash
# PreToolUse: the kata dir is hand-written after setup. Deny agent writes there.
in=$(cat)
s="${SENSEI_HOME:-$HOME/.sensei}/session.json"
[ -f "$s" ] || exit 0
f=$(jq -r '.tool_input.file_path // empty' <<<"$in")
phase=$(jq -r '.phase // empty' "$s")
k=$(jq -r '.kata_dir // empty' "$s")
[ -n "$f" ] && [ -n "$k" ] || exit 0
case "$f" in
  *"$k"*)
    [ "$phase" = "setup" ] && exit 0
    jq -n '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",
      permissionDecisionReason:"Sensei: the kata dir is hand-written after setup. Give a hint instead."}}'
    ;;
esac
exit 0
