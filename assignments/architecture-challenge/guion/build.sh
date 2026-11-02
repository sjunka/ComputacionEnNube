#!/bin/sh
# Regenera los tiempos de guion.md y el PDF. Uso: ./build.sh
set -e
cd "$(dirname "$0")"
python3 tiempos.py guion.md
pandoc guion.md -f markdown -t html5 --standalone --section-divs --css estilo.css --metadata pagetitle="Guion de ensayo" -o guion.html
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=guion.pdf "file://$PWD/guion.html" 2>/dev/null
rm guion.html
echo "guion.pdf listo"
# Página del artefacto: mismo guion.md, con las capturas como archivos aparte.
pandoc guion.md -f markdown -t html5 --section-divs --no-highlight -o cuerpo.tmp
cat artefacto-head.html cuerpo.tmp > guion-artefacto.html
printf '</main>\n' >> guion-artefacto.html
rm cuerpo.tmp
sed -i '' -E 's#<img src="laminas/([0-9]+)\.png"[^>]*>#<img src="laminas/\1.png" alt="Lámina \1 del tablero" loading="lazy">#' guion-artefacto.html
