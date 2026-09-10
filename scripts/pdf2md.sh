#!/usr/bin/env bash
# Convierte PDFs nuevos de material/ a markdown en material-md/ usando markitdown.
# Uso: scripts/pdf2md.sh [dir_origen] [dir_destino]
set -euo pipefail

SRC="${1:-$(dirname "$0")/../material}"
DST="${2:-$(dirname "$0")/../material-md}"
mkdir -p "$DST"

found=0
skipped=0
while IFS= read -r -d '' pdf; do
  out="$DST/$(basename "${pdf%.*}").md"
  # ya convertido = el .md existe y el PDF no es mas reciente -> se omite
  if [[ -f "$out" && ! "$pdf" -nt "$out" ]]; then
    skipped=$((skipped+1)); continue
  fi
  echo "==> $(basename "$pdf")"
  # escribe a temporal: si markitdown falla no queda un .md vacio
  tmp="$out.part"
  if uvx --from 'markitdown[pdf]' markitdown "$pdf" > "$tmp"; then
    mv "$tmp" "$out"
  else
    rm -f "$tmp"; echo "ERROR convirtiendo $pdf" >&2; continue
  fi
  found=$((found+1))
done < <(find "$SRC" -type f -iname '*.pdf' -print0)

echo "listo: $found convertido(s), $skipped ya existente(s) omitido(s) en $DST"
