#!/usr/bin/env bash
# Lists static assets by size, flags heavy files, and shows whether src/ references them.
# Usage: bash .claude/skills/performance-audit/scripts/asset-report.sh [threshold_kb]
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
THRESHOLD_KB="${1:-200}"
cd "$ROOT"

printf "%-45s %10s  %-6s  %s\n" "FILE" "SIZE" "FLAG" "REFERENCED IN src/"
printf '%.0s-' {1..80}; echo

total=0
while IFS= read -r f; do
  bytes=$(wc -c < "$f" | tr -d ' ')
  total=$((total + bytes))
  kb=$((bytes / 1024))
  rel="${f#public}"
  flag=""
  [ "$kb" -ge "$THRESHOLD_KB" ] && flag="HEAVY"
  if grep -rqF "$rel" src/ 2>/dev/null; then ref="yes"; else ref="no (unused?)"; fi
  if [ "$kb" -ge 1024 ]; then size="$(awk "BEGIN{printf \"%.1f MB\", $bytes/1048576}")"; else size="${kb} KB"; fi
  printf "%-45s %10s  %-6s  %s\n" "$f" "$size" "$flag" "$ref"
done < <(find public -type f ! -name '.DS_Store' -exec ls -S {} + 2>/dev/null)

echo
awk "BEGIN{printf \"Total public/ size: %.1f MB\n\", $total/1048576}"

echo
echo "SVGs with embedded raster data (should be converted to PNG/WebP):"
found=0
while IFS= read -r svg; do
  if grep -q "data:image" "$svg"; then echo "  $svg"; found=1; fi
done < <(find public -name '*.svg')
[ "$found" -eq 0 ] && echo "  none"
exit 0
