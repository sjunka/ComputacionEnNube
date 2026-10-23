# Architecture Challenge: Digital Café Luna

ST1611 Computación en Nube · EAFIT · Sergio Alfredo Junca Valero (Equipo 1)

Entrega: Architecture Decision Brief (40%) antes del miércoles 28 de octubre de 2026, 6:00 p. m. Defensa (20%) en la sesión: 8 minutos para analizar la restricción adicional, 6 de presentación y unos 6 de preguntas. Guía: `material-md/cloud-computing-posgrado-architecture-challenge-v02.md`.

## Archivos

| Archivo | Qué es |
|---|---|
| `decision-brief.pdf` | Lo que se entrega. Generado desde `decision-brief.md` |
| `decision-brief.md` | Fuente del Brief: problema, arquitectura, 8 decisiones, trade-offs, costo, evolución, evidencia de los Labs 01 a 07 y validación |
| `arquitectura.svg` / `arquitectura.png` | Diagrama. El SVG es la fuente; el PNG va dentro del Brief |
| `defensa.md` | Guion de 6 minutos, preguntas probables, Labs 01 a 07 en una línea y plan para la restricción adicional |

## Cómo se cubre la rúbrica

| Criterio (pts) | Dónde |
|---|---|
| Problema y restricciones (6) | Brief, sección 1 |
| Coherencia de arquitectura (10) | Secciones 2 y 3 y el diagrama |
| Decisiones y justificación (10) | Sección 3 |
| Trade-offs, riesgos y supuestos (6) | Sección 4 |
| Costo y evolución (4) | Secciones 5 y 6 (precios de la AWS Price List API) |
| Diagrama y evidencia (4) | Diagrama y sección 7 (Labs 01 a 07 corridos en cuenta propia) |

## Regenerar el diagrama y el PDF

Desde esta carpeta, con pandoc y Google Chrome:

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=2.0834 \
  --window-size=960,640 --screenshot=$PWD/arquitectura.png file://$PWD/arquitectura.svg
sed -e '/^Versión editable del mismo diagrama:/d' -e '/^```mermaid/,/^```/d' decision-brief.md > /tmp/brief.md
cp arquitectura.png /tmp/ && (cd /tmp && pandoc brief.md -s --embed-resources -o brief.html)
"$CHROME" --headless=new --no-pdf-header-footer --print-to-pdf=$PWD/decision-brief.pdf file:///tmp/brief.html
```

El PDF quita el bloque Mermaid porque repite el diagrama.
