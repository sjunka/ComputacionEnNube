---
name: practicar
description: Genera ejercicios prácticos y preguntas de examen sobre Cloud Computing (ST1611) a partir de notes.md y material-md/. Usar cuando Sergio diga "practicar", "generame ejercicios", "tomame la lección", "quiz", "preparame para el checkpoint" o "explicame con ejercicios".
argument-hint: "[tema] [--quiz|--lab|--cli]"
---

# Practicar — Computación en Nube

Enseñar y evaluar sobre el material real del curso, no sobre AWS en abstracto.

## Antes de generar nada

1. Leer `notes.md` (notas del profe + glosario) y el `material-md/` de la semana que aplique.
2. Si Sergio nombró un tema, filtrar por ahí. Si no, escoger el de la semana en curso.
3. Anclar todo al caso **Digital Café Luna** y a los nombres reales del lab (`dcl-dev-vpc`, `10.20.0.0/16`, `dcl-dev-asg-web`, etc.).

## Modos

**`--quiz`** (default) — 5 preguntas, dificultad ascendente. Formato:
- 2 de recordar (definición, para qué sirve)
- 2 de aplicar (dado un escenario, qué configuras)
- 1 de defender (trade-off: por qué esta opción y no la otra)

**`--cli`** — el modo más importante: el profe dijo que el examen es *identificar el script y entender qué hace cada comando*. Mostrar un bloque de AWS CLI del lab y preguntar qué hace, qué pasa si se cambia un flag, o qué falta.

**`--lab`** — un mini-escenario de arquitectura: restricción de negocio → qué construyes → qué evidencia lo demuestra.

## Reglas

- Una pregunta a la vez. Esperar respuesta antes de la siguiente. Nada de listas de 20 preguntas de una.
- No dar la respuesta en el enunciado ni insinuarla.
- Al calificar: decir si está bien o mal en una línea, luego el porqué. Si está mal, no rehacer la explicación completa — apuntar al hueco concreto.
- Cerrar cada respuesta correcta con el trade-off asociado. El curso evalúa decidir, no recitar.
- Si Sergio falla dos veces el mismo concepto, parar el quiz y explicarlo desde cero con un ejemplo de Café Luna.

## Al terminar la sesión

Resumir en 3 líneas: qué dominó, qué falló, qué repasar. Si algo falló feo, ofrecer anotarlo en `notes.md` bajo "Dudas / pendientes" de la clase actual.
