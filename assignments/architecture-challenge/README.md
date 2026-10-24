# Architecture Challenge: Digital Café Luna

ST1611 Computación en Nube · EAFIT · Sergio Alfredo Junca Valero

Evaluación individual (correo del 28 de septiembre): Architecture Decision Brief (40%) y defensa (20%). Entrega del Brief: la presentación de apertura dice lunes 26 de octubre y la guía v02 dice antes de las 6:00 p. m. del miércoles 28, día de la defensa. Lo seguro es entregarlo el lunes 26. Guía: `material-md/cloud-computing-posgrado-architecture-challenge-v02.md`.

## Archivos

| Archivo | Qué es |
|---|---|
| `decision-brief.pdf` | Lo que se entrega: 6 páginas, con el diagrama vectorial. Se genera desde `decision-brief.md` |
| `decision-brief.md` | Fuente del Brief |
| `arquitectura.svg` | Fuente del diagrama. `arquitectura.png` es su render, para ver el `.md` en GitHub |
| `pdf.css` | Estilo del PDF: tipografía, tablas y número de página |
| `defensa.md` | Guion de 6 minutos, frases ancla, números, preguntas probables y método para la restricción adicional. No se entrega |

## Cómo cubre la rúbrica del Brief

| Criterio (puntos) | Dónde |
|---|---|
| Problema y restricciones (6) | Sección 1: restricciones R1 a R6, prioridad cuando chocan y alcance según la priorización de S01 |
| Coherencia de arquitectura (10) | Sección 2: diagrama con decisiones D1 a D7, flujo de una compra en 4 pasos, región y subnets |
| Decisiones y justificación (10) | Sección 3: cada decisión con restricción, mecanismo, alternativa descartada y lo que sacrifica |
| Trade-offs, riesgos y supuestos (6) | Sección 4: tabla de trade-offs, resiliencia por escenario con RTO/RPO y 7 supuestos con su validación |
| Costo y evolución (4) | Secciones 5 y 6: mes normal y con campaña (Price List API), cost drivers, palancas y evolución por señales |
| Diagrama y evidencia (4) | Sección 7: Labs 01 a 07 con la decisión que sustenta cada uno y lo que no cubren; sección 8: 8 pruebas |

## Regenerar el diagrama y el PDF

Desde esta carpeta, con pandoc y Google Chrome:

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1030,740 --screenshot=$PWD/arquitectura.png file://$PWD/arquitectura.svg
sed 's/(arquitectura\.png)/(arquitectura.svg)/' decision-brief.md \
  | pandoc -s --embed-resources --css pdf.css --metadata pagetitle="Decision Brief Digital Café Luna" -o /tmp/brief.html
"$CHROME" --headless=new --no-pdf-header-footer --print-to-pdf=$PWD/decision-brief.pdf file:///tmp/brief.html
```

El PDF usa el SVG para que el diagrama no pierda nitidez al hacer zoom.
