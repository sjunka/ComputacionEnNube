---
name: pdf2md
description: Convierte los PDFs nuevos de material/ a Markdown en material-md/ usando markitdown. Usar cuando el usuario diga "convierte los PDFs", "pdfs nuevos a markdown", "markitdown", o agregue material nuevo del profesor.
---

# pdf2md

Ejecuta:

```bash
./scripts/pdf2md.sh
```

Otros directorios: `./scripts/pdf2md.sh <origen> <destino>`.

El script ya es incremental: omite todo PDF que ya tenga su `.md` en el destino y solo reconvierte si el PDF fue modificado después del `.md`. No hay que filtrar nada antes de ejecutarlo, ni borrar el destino. Reporta al usuario los archivos convertidos. Si `uvx` no existe: `brew install uv`.
