#!/usr/bin/env bash
# Podmienia znacznik {{SITE_URL}} na docelową domenę (canonical, Open Graph, JSON-LD, sitemap, robots).
# Użycie: ./scripts/set-domain.sh https://twoja-domena.pl
set -euo pipefail

url="${1:-}"
if [[ ! "$url" =~ ^https://[a-zA-Z0-9.-]+(:[0-9]+)?$ ]]; then
  echo "Podaj adres w formacie https://domena.pl (bez końcowego ukośnika)." >&2
  exit 1
fi

cd "$(dirname "$0")/.."
files=(index.html 404.html robots.txt sitemap.xml)
for f in "${files[@]}"; do
  sed -i "s|{{SITE_URL}}|${url}|g" "$f"
done

if grep -rn "{{SITE_URL}}" "${files[@]}"; then
  echo "Uwaga: pozostały nieuzupełnione znaczniki." >&2
  exit 1
fi
echo "Gotowe: ustawiono domenę ${url} w: ${files[*]}"
