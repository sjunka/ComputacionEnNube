# Architecture Challenge: Digital Café Luna

ST1611 Computación en Nube · EAFIT · Sergio Alfredo Junca Valero

Evaluación final individual: Architecture Decision Brief (40%) y defensa (20%), **miércoles 4 de noviembre de 2026, virtual** (correo del profe del 26 de octubre). El Brief tiene máximo 2 páginas y la defensa son 10 minutos y 2 preguntas, con el Brief y el diagrama como soporte.

## Versión que se entrega

Vive en `web/`, que es su propio repo (`sjunka/digital-cafe-luna`) y este repo ignora:

- Brief de 2 páginas: `web/public/brief.pdf`, publicado en https://sjunka.github.io/digital-cafe-luna/brief.pdf
- Copia del mismo PDF en este repo, para entregar: `decision-brief.pdf`
- Tablero animado para la defensa: https://sjunka.github.io/digital-cafe-luna/
- Fuente única del texto: `web/src/content.ts`. El PDF sale de la misma página (`?vista=brief`) con `npm run pdf`, que exige 2 páginas.

## Archivos de esta carpeta

| Archivo | Qué es |
|---|---|
| `defensa.md` | Guion de 10 minutos con teclas, frases ancla, números, preguntas probables y 11 restricciones adicionales con su respuesta. No se entrega |
| `decision-brief.pdf` | El Brief que se entrega: copia del PDF de 2 páginas de `web/public/brief.pdf` |
| `decision-brief.md`, `arquitectura.svg`, `arquitectura.png`, `pdf.css` | Fuente de la versión de 6 páginas con 8 decisiones (23 de octubre); su PDF queda en el historial de git. Sirve como respaldo de cifras y argumentos |

## Cómo cubre la rúbrica

| Criterio (puntos) | Dónde |
|---|---|
| Problema y restricciones (6) | Sección 1: R1 a R6 con lo que exige cada una, prioridad cuando chocan y alcance |
| Coherencia de arquitectura (10) | Sección 2: una figura con capas, AZ, CIDR y rutas; cinco decisiones, una por dimensión (cómputo, resiliencia y datos, red y seguridad, operación, modernización) |
| Decisiones y justificación (10) | Sección 3: D1 a D5, cada una con restricción → decisión → mecanismo → consecuencia → trade-off, alternativas descartadas y evidencia de un lab |
| Trade-offs, riesgos y supuestos (6) | Sección 4: qué gano, qué sacrifico, qué riesgo permanece y cómo lo detecto; RTO y RPO por escenario; 5 supuestos con su validación |
| Costo y evolución (4) | Sección 5: mes normal y con campaña (Price List API), costo fijo frente a variable, palancas, qué hago ahora y qué después con la señal que lo dispara |
| Diagrama y evidencia (4) | Figura 1 con la ruta de una compra y D1 a D5; evidencia de los Labs 01 a 07 en cada decisión |
