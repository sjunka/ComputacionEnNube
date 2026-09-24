# Prompt de desarrollo: app «Labs Digital Café Luna» (Vite + React + Tailwind, GitHub Pages)

Pensado para Claude Code con Opus en esfuerzo alto. Copia todo lo que está entre las dos líneas `---`, desde la raíz del repo `ComputacionEnNube`.

Segunda etapa. Primero se corre `scripts/PROMPT-app-labs.md`, que deja hechas las fases 0, 1, 2 y 7 de este documento. Si `app/` ya existe con la guía migrada, empieza aquí en la fase 3 y usa las fases 0, 1, 2 y 7 solo como referencia.

---

## Misión

Construye en `app/` la app web con la que Sergio practica y demuestra los Labs Evolutivos del curso ST1611 (Computación en Nube, EAFIT; caso conductor Digital Café Luna, AWS us-east-1). La app reemplaza a la guía que hoy vive en un artifact de claude.ai (fuente: `guia-labs-01-04.html`), que queda **deprecado**. Desde ahora la app es el foco del proyecto: cada checkpoint, lab y entrega del curso entra como contenido nuevo de esta app.

La app tiene dos caras: una **guía** (cada paso por CLI y en la consola AWS, con capturas reales) y un **juego de verificación** (Sergio hace el lab en su cuenta y la app confirma, con evidencia de la cuenta, que quedó bien).

## Lee antes de escribir código

1. `CLAUDE.md` del repo y `board.md`: contexto del curso, fechas y cómo califica el profe los checkpoints (50% implementación que funciona, 30% test de 5 preguntas de escenario con 3 opciones, 20% oral con 2 preguntas; máximo 50 minutos).
2. `guia-labs-01-04.html` completo. Es la fuente de verdad del contenido. Dentro del `<script>`: `VARS*`, `AMI`, `C`, `LK`, `K` (bloques de consola: `p` ruta de clics, `s` pasos, `img` capturas, `m` qué mirar, `n` nota, `l` enlace), `HOT` (zonas clicables de los diagramas), `QX` (preguntas con captura), `ESTADO`, `LABS` (labs → fases → pasos con `t`, `e`, `c`, `r`, `k`, `d`; más `quiz` y `oral`). Las plantillas `<template id="svg-labN">` son los diagramas.
3. `evidencias/lab-evolutivo-NN/`: salidas CLI (`*.txt`), `README.md` y capturas de consola (`consola/*.png`, `consola-*.png`).
4. `.claude/skills/mostrarenaws/SKILL.md`, `scripts/captura-consola.sh` y `scripts/terminal-ec2.sh`: el flujo que produce capturas y datos de consola.
5. `material-md/*lab-evolutivo-0[1-4]*.md` y `material-md/*checkpoint-lab-01*.md`: las guías del profe (escritas para la consola) y la guía del checkpoint.

## Decisiones ya tomadas (no las reabras)

- **Stack:** Vite + React + TypeScript + Tailwind v4 (`npm i tailwindcss @tailwindcss/vite`, plugin en `vite.config.ts`, `@import "tailwindcss";`). Vitest para las pruebas. Sin backend.
- **Ubicación:** `app/` dentro de este repo. `base: '/ComputacionEnNube/'` y `HashRouter`.
- **Publicación:** GitHub Pages con `.github/workflows/deploy.yml` en la raíz: en push a `main` que toque `app/**`, `npm ci`, `npm test`, `npm run build` en `app/`, y publicación de `app/dist` con `actions/configure-pages`, `actions/upload-pages-artifact` y `actions/deploy-pages`.
- **Visibilidad:** el repo `sjunka/ComputacionEnNube` es **público** y el sitio también lo será. El material del profe es público y no es sensible.
- **Datos de la cuenta AWS fuera de lo publicado:** el Account ID (278835524469), las IP públicas y los IDs de recursos van en `app/.env.local` (ignorado por git con `*.local`). Ver «Datos de la cuenta».
- **Seguridad:** la app nunca pide ni guarda credenciales AWS, nunca llama a AWS ni a APIs de IA desde el navegador. La verificación siempre es: script de solo lectura en CloudShell y JSON pegado en la app.
- **Idioma y forma:** textos en español, tema claro y oscuro, usable en el celular (~400 px). Conserva la identidad visual actual de la guía (IBM Plex Sans/Mono, paleta con tokens `--net`, `--cmp`, `--dat`, `--sec`, `--con`) como tokens de Tailwind.

## Arquitectura

```
app/
  src/content/types.ts        tipos del modelo (Lab, Fase, Paso, Consola, Hot, Pregunta, Mision, Objetivo, Reto)
  src/content/lab01.json …    un archivo por lab; luego checkpoint1.json, challenge.json, etc.
  src/content/diagramas/      un componente SVG por lab (migrado de las plantillas)
  src/verify/                 reglas de verificación por lab (funciones puras) + pruebas
  src/lib/placeholders.ts     resuelve {{MARCADORES}} con import.meta.env
  public/img/labNN/           capturas ya tapadas (generadas, no a mano)
  public/verify/              scripts de CloudShell que Sergio descarga o copia
  scripts/extract-guia.mjs    migración única desde guia-labs-01-04.html
  scripts/sync-img.mjs        copia y tapa capturas desde evidencias/
```

El modelo de contenido es la única fuente para guía, juego y repaso. Agregar un checkpoint nuevo debe ser agregar un JSON (y sus capturas), sin tocar componentes.

## Datos de la cuenta

- En el contenido van marcadores: `{{ACCOUNT_ID}}`, `{{IP_CLIENT_A}}`, `{{IP_CLIENT_B}}`, `{{BUCKET}}` (el nombre del bucket contiene el Account ID), etc. `app/.env.example` los lista vacíos; `app/.env.local` tiene los valores reales y nunca se commitea.
- En desarrollo, `placeholders.ts` los reemplaza con `import.meta.env.VITE_*`. Vite incrusta las `VITE_*` en el bundle, así que el workflow de publicación **no** las define: en el sitio público un marcador se ve como `‹tu Account ID›`.
- `sync-img.mjs` (con `sharp` como dependencia de desarrollo) copia las capturas de `evidencias/` a `public/img/` y tapa con rectángulos sólidos las zonas declaradas en `app/src/content/redact.json` (coordenadas en porcentaje por imagen). Toda captura de ventana completa de la consola lleva tapada la insignia de cuenta de arriba a la derecha; las que muestran IP públicas (lista de EC2, pie de Instance Connect) llevan esas zonas. Mira cada imagen para fijar las coordenadas. Los originales de `evidencias/` no se tocan.
- Antes de publicar, `npm run check:leaks` busca en `app/dist` y `app/public` el Account ID real y los patrones `\b\d{12}\b`, `AKIA[0-9A-Z]{16}` e IPs públicas conocidas, y falla si encuentra algo. Corre también en el workflow.

## Fases

Trabaja en orden. Cada fase cierra solo cuando su criterio se cumple en `npm run dev` **y** en `npm run build && npm run preview`. Al cerrar cada fase, dale a Sergio un resumen corto y espera su visto bueno antes de la siguiente. No commitees ni empujes sin que él lo pida.

### Fase 0 · Esqueleto y publicación
Vite + React + TS + Tailwind v4 + Vitest en `app/`, `HashRouter`, tokens de tema, layout base, workflow de Pages, `.env.example`, `*.local` en `.gitignore`, `check:leaks`.
**Criterio:** `npm test` y `npm run build` pasan; el workflow es válido (`actionlint` si está disponible). Dile a Sergio que active Settings › Pages › Source = GitHub Actions; tú no puedes.

### Fase 1 · Migración del contenido
`extract-guia.mjs` extrae el `<script>` de `guia-labs-01-04.html`, evalúa en `node:vm` la parte de datos (hasta el comentario `// ---------- estado ----------`) y serializa `LABS`, `K`, `HOT`, `QX` y `ESTADO` a los JSON del modelo, resolviendo las referencias `k:K['…']` a objetos y moviendo IDs y valores de cuenta a marcadores. Los SVG pasan a componentes con las zonas de `HOT`.
**Criterio:** una prueba de Vitest compara conteos contra el original (labs, fases, pasos, bloques de consola, zonas clicables, preguntas y orales) y todos coinciden; ninguna cadena del JSON contiene el Account ID real.

### Fase 2 · Guía
Pestañas por lab, pasos con casilla (progreso en `localStorage`), selector CLI / Consola que decide qué bloque se abre primero, bloque de consola (ruta, pasos, capturas con visor ampliable, qué mirar, enlace), diagramas clicables, repaso con test y orales.
**Criterio:** los Labs 01 a 04 muestran todo lo que muestra hoy el artifact; el progreso y el modo sobreviven a recargar; funciona con teclado y en 400 px.

### Fase 3 · Misión verificada (Lab 03 primero)
- `public/verify/verificar-lab03.sh`: bash de solo lectura (`describe-*`, `list-*`, `get-*`) que imprime un único JSON compacto: VPC (CIDR), subnets (AZ, CIDR), route tables (rutas y asociaciones), SG (reglas de entrada con origen por SG, prefix list o CIDR), bucket (versioning, versiones de `estado.txt`, lifecycle), EFS (estado, cifrado, backups, mount targets con AZ, IP y SG) e instancias (nombre, AZ, estado). Sin secretos en la salida.
- En la app: Sergio pega el JSON; cada objetivo de la misión es una función pura `(evidencia) => {ok, pista}` en `src/verify/lab03.ts`. Las pistas nombran el recurso y lo que falta («el SG del EFS permite 2049 desde un CIDR, no desde dcl-dev-sg-ec2-s03»). El JSON pegado vive solo en `localStorage` y hay un botón para borrarlo.
- Los Labs 01, 02 y 04 siguen el mismo patrón después.
**Criterio:** pruebas de Vitest con una evidencia válida (todo verde) y con una variante rota por objetivo (falla solo ese). Si el Lab 03 sigue desplegado (comprueba con `aws ec2 describe-instances` de solo lectura), corre el script de verdad y usa su salida, sin valores de cuenta, como fixture.

### Fase 4 · Confirmar con la consola
Retos que piden un dato visible solo en la consola (Version ID de la versión anterior, IP del mount target de us-east-1b, Source de la regla NFS, Desired/Min/Max del ASG) y lo comparan con la evidencia de la misión.
**Criterio:** un dato correcto da verde; uno incorrecto dice dónde buscarlo (ruta de clics del bloque de consola).

### Fase 5 · Consola simulada
«¿Dónde haces clic para…?» sobre las capturas reales. Zonas en porcentaje por imagen dentro del JSON del lab.
**Criterio:** responde a mouse, toque y teclado; al menos 3 retos por lab con capturas.

### Fase 6 · Modo checkpoint
Cronómetro de 50 minutos, 5 preguntas de escenario al azar del banco del lab, 2 tarjetas orales con autoevaluación y la lista «tu implementación funciona» (que puede tomar el resultado de la misión verificada). Puntaje final con la ponderación 50/30/20.
**Criterio:** una prueba cubre el cálculo del puntaje; al recargar a mitad del intento, el cronómetro y las respuestas se conservan.

### Fase 7 · Integrar el flujo y deprecar el artifact
- Actualiza `mostrarenaws`: su paso de guía interactiva escribe en `app/src/content/labNN.json` y deja las capturas en `evidencias/` para que `sync-img.mjs` las lleve a la app; el estado vivo de la cuenta pasa a `app/src/content/estado.json` con marcadores. Quita del skill la integración con el artifact.
- Actualiza `CLAUDE.md` del repo: la app en `app/` es el foco del proyecto; el repo es público; datos de cuenta en `app/.env.local`.
- Prepara el aviso de deprecación del artifact (un banner con el enlace a la app) y **pregúntale a Sergio** antes de publicarlo; solo él decide cuándo se republica.
**Criterio:** correr `/mostrarenaws lab 03` de principio a fin actualiza la app sin tocar el artifact.

### Fase 8 · Arma el diagrama (opcional, al final)
Arrastrar componentes (VPC, subnets, SG, mount targets, ALB, ASG) y conectarlos, con reglas de validación por lab. React Flow está permitido.

## Pide confirmación antes de

- Crear, modificar o borrar recursos en AWS (solo tienes permiso para comandos de lectura).
- Reescribir el historial de git o forzar un push.
- Limpiar los datos de cuenta de los archivos ya commiteados fuera de `app/` (propuesta por defecto: cambiarlos por marcadores en un commit nuevo, sin reescribir el historial).
- Republicar o cambiar el artifact.
- Commitear o empujar.

## Informe final

Qué quedó funcionando por fase, cómo se corre (`cd app && npm run dev`), qué verificaste (pruebas, build, preview, `check:leaks`) y qué quedó pendiente o necesita a Sergio (activar Pages, aprobar el banner del artifact, limpieza de datos viejos).

---

Ejecutar después: `cd app && npm run dev`
