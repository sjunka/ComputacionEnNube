# Prompt: animaciones en la app de labs (GSAP, Three.js, Remotion)

Pega este prompt en una sesión nueva dentro de `/Users/sjunka/Documents/ComputacionEnNube`.

---

Actúa como experto en cloud y en front-end. Trabaja en `app/` (Vite + React 19 + TS + Tailwind, publicada en GitHub Pages). Lee primero `CLAUDE.md`, `board.md` y `app/src/diagramas/` para entender cómo se dibujan hoy los diagramas de los labs.

## Librerías disponibles

Ya instaladas en `app/package.json`:

- `gsap` 3.15: animación de SVG y DOM (flujo de paquetes, aparición de recursos, líneas de conexión).
- `three` 0.186 + `@types/three`: escenas 3D (topología de red, VPC/subredes/AZ en capas).
- `remotion` 4.0: composiciones de video en React. Solo está el paquete base; para previsualizar dentro de la app falta `@remotion/player`, y para exportar MP4 falta `@remotion/cli`. Pide confirmación antes de instalarlos.

## Objetivo

Elegir y construir UNA animación para el lab: [NN y tema, por ejemplo "Lab 03: tráfico de Internet a EC2 pasando por IGW, route table y security group"].

Antes de codificar:

1. Dime qué librería encaja mejor y por qué (trade-offs: peso del bundle, accesibilidad, mantenimiento). Si GSAP sobre el SVG existente alcanza, no uses Three.js ni Remotion.
2. Propón el guion en 4 a 6 pasos y espera mi OK.

## Restricciones

- Los labs son datos: el contenido va en `app/src/content/labNN.json`; la animación es un componente en `app/src/diagramas/` y se referencia desde el JSON. No hardcodear texto del lab en el componente.
- Cargar Three.js y Remotion con `React.lazy` / import dinámico para no inflar el bundle inicial.
- Limpiar en `useEffect` (kill de timelines GSAP, `dispose()` de geometrías, materiales y renderer de Three.js).
- Respetar `prefers-reduced-motion`: mostrar el estado final estático.
- Controles de play, pausa y reinicio; el diagrama debe seguir siendo legible sin animación.
- Nada de datos de cuenta (Account ID, IPs, IDs de recursos): usar marcadores `{{ACCOUNT_ID}}` y similares. El repo y el sitio son públicos.
- Cambios mínimos: no refactorizar los diagramas existentes de Lab01 a Lab04.

## Verificación

1. `npm test` y `npm run build` en `app/` (el build corre `check-leaks`).
2. Levantar `npm run dev` y revisar en el navegador: la animación corre, pausa, reinicia y respeta reduced-motion.
3. Reportar el tamaño del bundle antes y después.
4. No commitear ni empujar hasta que yo lo pida.
