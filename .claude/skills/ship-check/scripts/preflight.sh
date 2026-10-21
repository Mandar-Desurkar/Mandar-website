#!/usr/bin/env bash
# Pre-deploy gate for the portfolio. Exits 1 if any hard check fails.
# Usage: bash .claude/skills/ship-check/scripts/preflight.sh [--skip-build]
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

SKIP_BUILD=0
[ "${1:-}" = "--skip-build" ] && SKIP_BUILD=1

FAILS=0
WARNS=0
pass() { printf "  \033[32mPASS\033[0m %s\n" "$1"; }
fail() { printf "  \033[31mFAIL\033[0m %s\n" "$1"; FAILS=$((FAILS + 1)); }
warn() { printf "  \033[33mWARN\033[0m %s\n" "$1"; WARNS=$((WARNS + 1)); }
section() { printf "\n\033[1m== %s ==\033[0m\n" "$1"; }

run_step() { # name, command...
  local name="$1"; shift
  local log; log="$(mktemp)"
  if "$@" >"$log" 2>&1; then pass "$name"; else fail "$name"; tail -25 "$log" | sed 's/^/      /'; fi
  rm -f "$log"
}

# Prints matches (file:line) indented; returns 0 if anything matched.
scan() { # pattern, label, level(fail|warn)
  local out
  out="$(grep -rnE "$1" src/ 2>/dev/null)"
  if [ -n "$out" ]; then
    "$3" "$2 ($(printf '%s\n' "$out" | wc -l | tr -d ' ') found)"
    printf '%s\n' "$out" | head -10 | sed 's/^/      /'
  else
    pass "No $2"
  fi
}

section "Code quality"
run_step "TypeScript (tsc --noEmit)" npx tsc --noEmit
run_step "ESLint" npm run lint --silent
if [ "$SKIP_BUILD" -eq 0 ]; then
  run_step "Production build (next build)" npm run build --silent
else
  warn "Production build skipped (--skip-build)"
fi

section "Content"
scan 'href="#"|link: *"#"|github: *"#"' "placeholder links" fail
scan 'lorem|ipsum|TODO|TBD|FIXME' "TODO/lorem markers" warn
scan 'console\.(log|debug)' "console.log calls" warn

section "Security"
out="$(grep -rn 'target="_blank"' src/ | grep -v 'noopener')"
if [ -n "$out" ]; then fail "target=_blank without rel=noopener"; printf '%s\n' "$out" | sed 's/^/      /'; else pass "External links use rel=noopener"; fi
out="$(grep -rnE "window\.open\([^)]*'_blank'\)" src/)"
if [ -n "$out" ]; then warn "window.open without noopener"; printf '%s\n' "$out" | sed 's/^/      /'; else pass "window.open calls safe"; fi
out="$(git ls-files | grep -E '(^|/)\.env' | grep -v '\.example$')"
if [ -n "$out" ]; then fail "env files tracked by git: $out"; else pass "No .env files tracked"; fi
out="$(git grep -nIE '(sk_live|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|api[_-]?key *[:=] *["'"'"'][A-Za-z0-9]{16,})' -- . ':!package-lock.json' ':!.claude' 2>/dev/null)"
if [ -n "$out" ]; then fail "Possible secrets committed"; printf '%s\n' "$out" | head -5 | sed 's/^/      /'; else pass "No obvious secrets"; fi

section "SEO files"
for f in sitemap robots opengraph-image icon; do
  if ls src/app/$f.* >/dev/null 2>&1; then pass "src/app/$f.* present"; else warn "src/app/$f.* missing"; fi
done
grep -q "metadataBase" src/app/layout.tsx 2>/dev/null && pass "metadataBase set" || warn "metadataBase not set in layout.tsx"
ls src/app/not-found.* >/dev/null 2>&1 && pass "Custom 404 page" || warn "No src/app/not-found.tsx"

section "Asset weight (public/)"
heavy="$(find public -type f -size +300k -exec ls -lh {} \; | awk '{print $5, $9}')"
if [ -n "$heavy" ]; then
  fail "Assets over 300 KB"
  printf '%s\n' "$heavy" | sed 's/^/      /'
else
  pass "No asset over 300 KB"
fi

printf "\n\033[1mResult:\033[0m %d fail(s), %d warning(s)\n" "$FAILS" "$WARNS"
[ "$FAILS" -eq 0 ]
