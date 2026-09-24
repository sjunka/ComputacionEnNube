# Prompt de desarrollo: base de la app «Labs Digital Café Luna» (Vite + React + Tailwind, GitHub Pages)

Primera parte del plan. El juego de verificación viene después, con `scripts/PROMPT-juego-labs.md`. Copia lo que está entre las dos líneas `---` en Claude Code (Opus, esfuerzo alto), desde la raíz del repo `ComputacionEnNube`.

---

## Misión

Construye en `app/` la app web que reemplaza a la guía de los Labs Evolutivos que hoy vive en un artifact de claude.ai (fuente: `guia-labs-01-04.html`). El artifact queda deprecado y la app pasa a ser el foco del proyecto. Curso ST1611 Computación en Nube (EAFIT), caso Digital Café Luna, AWS us-east-1.

Alcance de esta tarea: el **esqueleto publicado**, el **contenido como datos** y la **guía** con todo lo que hoy muestra el artifact. Nada de juego ni verificación todavía, pero deja el modelo de datos listo para agregarlos.

## Lee antes de escribir código

1. `CLAUDE.md` y `board.md`: contexto del curso y fechas.
2. `guia-labs-01-04.html` completo: es la fuente del contenido. En el `<script>`: `VARS*`, `AMI`, `C`, `LK` (enlaces a la consola por nombre), `K` (bloques de consola: `p` ruta de clics, `s` pasos, `img` capturas, `m` qué mirar, `n` nota, `l` enlace), `HOT` (zonas clicables de los diagramas), `QX` (preguntas con captura), `ESTADO` (estado de la cuenta) y `LABS` (labs → fases → pasos con `t` texto, `e` explicación, `c` comando, `r` resultado real, `k` consola, `d` hecho por defecto; además `quiz` y `oral`). Las `<template id="svg-labN">` son los diagramas.
3. `evidencias/lab-evolutivo-NN/`: capturas de consola (`consola/*.png` y `lab-evolutivo-01/consola-*.png`).
4. `.claude/skills/mostrarenaws/SKILL.md`: el skill que genera capturas y datos de consola. Su paso 5 hoy escribe en el artifact; lo vas a redirigir a la app.

## Decisiones tomadas (no las reabras)

- **Stack:** Vite + React + TypeScript + Tailwind v4 (`npm i tailwindcss @tailwindcss/vite`, plugin `tailwindcss()` en `vite.config.ts`, `@import "tailwindcss";` en el CSS). Vitest para pruebas. Sin backend.
- **Ruteo y base:** `base: '/ComputacionEnNube/'` en `vite.config.ts` y `HashRouter`, para que recargar una ruta en GitHub Pages no dé 404. Una ruta por lab (`#/lab/03`) y una para el repaso.
- **Publicación:** `.github/workflows/deploy.yml` en la raíz del repo. En push a `main` que toque `app/**` (y con `workflow_dispatch`): `npm ci`, `npm test` y `npm run build` en `app/`, y publicación de `app/dist` con `actions/configure-pages`, `actions/upload-pages-artifact` y `actions/deploy-pages` (permisos `pages: write` e `id-token: write`).
- **Visibilidad:** el repo es público y el sitio también. El material del profe es público y no es sensible.
- **Datos de la cuenta AWS fuera de lo publicado:** el Account ID (278835524469), las IP públicas y los IDs de recursos van en `app/.env.local` (ignorado con `*.local`). Detalle abajo.
- **Diseño:** conserva la identidad de la guía actual (IBM Plex Sans y Mono desde Google Fonts; tokens `--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--done`, `--warn`, `--bad`, `--net`, `--cmp`, `--dat`, `--sec`, `--con`, con sus valores claros y oscuros) como tema de Tailwind (`@theme`). Tema claro y oscuro según `prefers-color-scheme`, usable a 400 px, textos en español.

## Estructura

```
app/
  index.html · vite.config.ts · package.json · .env.example
  src/content/types.ts         tipos: Lab, Fase, Paso, Consola, Captura, Hot, Pregunta, Oral, Estado
  src/content/lab01.json …     un archivo por lab
  src/content/estado.json      estado de la cuenta (reemplaza a la base de datos del artifact)
  src/content/index.ts         carga todos los labNN.json (import.meta.glob), en orden
  src/content/redact.json      zonas a tapar por captura, en porcentajes
  src/diagramas/LabNN.tsx      un componente SVG por lab, con sus zonas clicables
  src/lib/placeholders.ts      resuelve {{MARCADORES}} con import.meta.env
  src/…                        componentes de la guía
  public/img/labNN/            capturas ya tapadas (generadas por sync-img, no a mano)
  scripts/extract-guia.mjs     migración única desde guia-labs-01-04.html
  scripts/sync-img.mjs         copia y tapa capturas desde evidencias/
  scripts/check-leaks.mjs      falla si algo publicable contiene datos de la cuenta
```

Regla de oro: **agregar un lab, un checkpoint o una entrega es agregar un JSON (y sus capturas)**, sin tocar componentes. Diseña los tipos para eso: una entrega puede no tener diagrama, capturas ni comandos.

## Datos de la cuenta

- El contenido lleva marcadores en lugar de valores reales: `{{ACCOUNT_ID}}`, `{{BUCKET}}` (el nombre del bucket contiene el Account ID), `{{IP_CLIENT_A}}`, `{{IP_CLIENT_B}}`, `{{VPC_ID}}`, etc. `app/.env.example` los lista vacíos como `VITE_ACCOUNT_ID=`; `app/.env.local` tiene los valores reales y nunca se commitea.
- `placeholders.ts` los reemplaza en desarrollo con `import.meta.env.VITE_*`. Vite incrusta las `VITE_*` en el bundle, así que el workflow **no** las define: en el sitio público un marcador se ve como `‹tu Account ID›`.
- `sync-img.mjs` (con `sharp` como dependencia de desarrollo) copia las capturas de `evidencias/` a `public/img/labNN/` y tapa con rectángulos sólidos las zonas de `redact.json`. Toda captura de ventana completa de la consola tapa la insignia de cuenta de arriba a la derecha; las que muestran IP públicas (lista de EC2, pie de Instance Connect) tapan esas zonas. Mira cada imagen para fijar las coordenadas. Los originales de `evidencias/` no se tocan.
- `check-leaks.mjs` busca en `src/content`, `public` y `dist` el Account ID real (leído de `.env.local` si existe), `\b\d{12}\b` y `AKIA[0-9A-Z]{16}`, y falla si encuentra algo. Corre en `npm run build` (como `prebuild` o `postbuild`) y en el workflow.

## Pasos

Trabaja en orden. Cada paso cierra solo cuando su criterio se cumple. Al cerrar cada uno, dale a Sergio un resumen corto; no commitees ni empujes sin que él lo pida.

### 1. Esqueleto y publicación
Proyecto en `app/`, Tailwind v4 con los tokens, `HashRouter`, layout base, Vitest, `.env.example`, `*.local` en el `.gitignore` de la raíz, workflow de Pages y `check-leaks`.
**Listo cuando:** `npm test`, `npm run build` y `npm run preview` funcionan y la app vacía carga en `/ComputacionEnNube/`. Dile a Sergio que active Settings › Pages › Source = GitHub Actions; tú no puedes.

### 2. Migración del contenido
`extract-guia.mjs` saca el `<script>` de `guia-labs-01-04.html`, evalúa en `node:vm` la parte de datos (todo lo anterior al comentario `// ---------- estado ----------`) y escribe `lab01.json` a `lab04.json` y `estado.json`: resuelve las referencias `k:K['…']` a objetos, pasa las zonas de `HOT` al lab que les corresponde, reparte `QX` en el `quiz` de cada lab y cambia valores de cuenta por marcadores. Las cuatro plantillas SVG pasan a componentes con sus zonas clicables. Corre `sync-img.mjs` para llenar `public/img/`.
**Listo cuando:** una prueba de Vitest compara con el original la cantidad de labs, fases, pasos, bloques de consola, capturas, zonas clicables, preguntas y orales, y todo coincide; `check-leaks` pasa.

### 3. Guía
Todo lo que hace hoy el artifact:
- Encabezado con barra de progreso global y botones «Mostrar todas las explicaciones» y «Reiniciar» (con confirmación dentro de la página).
- Panel de estado de la cuenta leído de `estado.json`, con la lista de lo que está corriendo y su costo por hora.
- Pestañas por lab con su avance, más «Repaso».
- Por lab: introducción, idea clave, diagrama clicable (cada zona abre la captura, la ruta de clics y el enlace a la consola), fases con contador y pasos con casilla (progreso en `localStorage`).
- En cada paso: el comando con botón Copiar, el «Resultado real», el bloque «En la consola» (ruta de clics, pasos, capturas con visor ampliable, qué mirar, enlace a la consola) y la explicación.
- Selector CLI / Consola que decide qué bloque se abre primero; se recuerda en `localStorage`.
- Repaso: preguntas de escenario con 3 opciones (con captura cuando la tienen) y preguntas orales desplegables.
**Listo cuando:** los Labs 01 a 04 muestran todo lo que muestra el artifact; el progreso, la pestaña y el modo sobreviven a recargar; todo se usa con teclado; nada se sale de la pantalla a 400 px; tema claro y oscuro legibles. Revisa una vez con una captura headless de Chrome y corrige lo que veas.

### 4. Redirigir `/mostrarenaws` y deprecar el artifact
- En `.claude/skills/mostrarenaws/SKILL.md`, reemplaza el paso de «Guía interactiva»: ahora agrega o actualiza el bloque `consola` de cada paso en `app/src/content/labNN.json` (con marcadores, nunca valores de cuenta), registra las capturas nuevas en `redact.json`, corre `node app/scripts/sync-img.mjs` y actualiza `app/src/content/estado.json` con el inventario vivo. Quita del skill todo lo del artifact (`ArtifactData`, republicar con `files`).
- En `CLAUDE.md` del repo: la app en `app/` es el foco del proyecto, el repo es público y los datos de cuenta van en `app/.env.local`. Menciona `scripts/PROMPT-juego-labs.md` como la siguiente etapa.
- Prepara un banner de deprecación para el artifact, con el enlace al sitio (`https://sjunka.github.io/ComputacionEnNube/`), y **pregúntale a Sergio** antes de republicarlo.
**Listo cuando:** el skill ya no menciona el artifact y describe el flujo completo hacia la app.

## Pide confirmación antes de

- Crear, modificar o borrar recursos en AWS (solo puedes usar comandos de lectura).
- Cambiar datos de cuenta en archivos ya commiteados fuera de `app/`, o reescribir el historial de git.
- Republicar o modificar el artifact.
- Commitear o empujar.

## Informe final

Qué quedó funcionando en cada paso, cómo se corre (`cd app && npm run dev`, con `.env.local` copiado de `.env.example`), qué verificaste (pruebas, build, preview, `check-leaks`, captura headless) y qué necesita a Sergio (activar Pages, aprobar el banner del artifact, commit y push).

---

Ejecutar después: `cd app && cp .env.example .env.local && npm run dev`
