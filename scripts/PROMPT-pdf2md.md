# Prompt reusable: conversión PDF -> Markdown con markitdown

Copia esto en otra consola de Claude Code:

---

Quiero convertir PDFs a Markdown usando https://github.com/microsoft/markitdown.

Crea:

1. `scripts/pdf2md.sh` — script bash ejecutable que:
   - recibe opcionalmente dir origen (default `material/`) y destino (default `material-md/`)
   - crea el destino si no existe
   - recorre recursivamente los `*.pdf` del origen (case-insensitive, soporta espacios en nombres)
   - convierte solo los "nuevos": el `.md` no existe, o el PDF es más reciente que el `.md` (`[[ -f "$out" && ! "$pdf" -nt "$out" ]] && continue` — no usar `"$out" -nt "$pdf"`: falla cuando ambos tienen el mismo mtime)
   - ejecuta `uvx --from 'markitdown[pdf]' markitdown "$pdf" > "$out"` (el extra `[pdf]` es obligatorio; sin él markitdown lanza `MissingDependencyException`)
   - escribe a un archivo temporal `.part` y lo mueve solo si la conversión tuvo éxito (nunca dejar `.md` vacíos)
   - lleva un contador de omitidos y en el resumen final imprime convertidos + omitidos, para que se vea que no reprocesa lo ya hecho
   - imprime cada archivo convertido y un conteo final
   - `set -euo pipefail`

2. Una skill en `.claude/skills/pdf2md/SKILL.md` que dispare con "convierte los PDFs", "pdfs nuevos a markdown", "markitdown" y ejecute el script.

Comentarios y salida en español.

---

Ejecutar: `./scripts/pdf2md.sh` — o `./scripts/pdf2md.sh docs/ docs-md/`
