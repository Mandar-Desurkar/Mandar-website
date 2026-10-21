#!/usr/bin/env bash
# Stop hook: if project files changed since docs/PROJECT_CONTEXT.md was last written,
# send Claude back to update it before the response ends.
# Uses git status, so .gitignore'd paths (node_modules, .next, build output) never trigger it.

input="$(cat)"
# Already continuing because of this hook: let the response end (prevents loops).
[ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false' 2>/dev/null)" = "true" ] && exit 0

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -n "$ROOT" ] && cd "$ROOT" || exit 0

CONTEXT="docs/PROJECT_CONTEXT.md"
[ -f "$CONTEXT" ] || exit 0

changed=()
while IFS= read -r path; do
  [ "$path" = "$CONTEXT" ] && continue
  case "$path" in tsconfig.tsbuildinfo|next-env.d.ts|AGENTS.md) continue ;; esac
  [ -e "$path" ] || continue   # deleted files can't be compared by mtime
  [ "$path" -nt "$CONTEXT" ] && changed+=("$path")
done < <(git status --porcelain --untracked-files=all 2>/dev/null | sed -E 's/^.. //; s/^.* -> //; s/^"(.*)"$/\1/')

[ "${#changed[@]}" -eq 0 ] && exit 0

list="$(printf '%s, ' "${changed[@]:0:15}")"
list="${list%, }"
[ "${#changed[@]}" -gt 15 ] && list="$list, and $(( ${#changed[@]} - 15 )) more"

reason="Project files changed since docs/PROJECT_CONTEXT.md was last updated: ${list}. Before finishing, update docs/PROJECT_CONTEXT.md: refresh 'Current state', tick/add 'Backlog' items, record any new 'Decisions', and add a dated (YYYY-MM-DD) 'Changelog' line summarising what changed and why. Keep it concise. Then end your response with one short line saying the context was updated."

jq -n --arg r "$reason" '{decision: "block", reason: $r}'
