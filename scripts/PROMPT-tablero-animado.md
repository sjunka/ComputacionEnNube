Actúa como diseñador front-end senior y como experto en [DOMINIO, por ejemplo arquitectura en la nube]. Quiero un sitio que explique [QUÉ, por ejemplo la arquitectura de X y sus decisiones] a [AUDIENCIA] con un tablero SVG animado. Cada escena cuenta una idea en pasos: un paquete recorre el camino y ese camino se ilumina detrás de él. [Si aplica: el mismo contenido sale en un PDF de N páginas.]

Proyecto: [RUTA]. Stack por defecto: Vite + React + TypeScript + GSAP con MotionPathPlugin, compilado a un solo `index.html` con `vite-plugin-singlefile`. Publicación: [GitHub Pages en la rama `gh-pages` / otra]. Lee primero el README, el CLAUDE.md y el código existente.

Implementación de referencia, para leer y no copiar a ciegas: el repo público `sjunka/digital-cafe-luna`, archivos `src/panel/motion.ts`, `src/panel/scenes.ts`, `src/panel/Panel.tsx` y `src/content.test.ts`.

## Skills

1. `impeccable` para todo lo visual: PRODUCT.md, dirección visual, construcción dentro de su craft floor y revisión final con capturas reales. Aplica su veredicto en un solo lote y confirma con una ronda más. Mundo visual: [tablero mímico de sala de control, como Digital Café Luna / propón 2 o 3 y elijo yo].
2. `ui-ux-pro-max` para tipografía, paleta y patrones de GSAP. Si no se puede invocar, consulta su base de datos: `python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<consulta>" --domain gsap` (también sirven `typography`, `color` y `ux`).
3. `dataviz` para cualquier gráfico (costos, métricas). Valida la paleta con su script antes de usarla.

## Antes de codificar

Propón esto y espera mi OK:

1. Las escenas (máximo 7) y sus pasos (4 a 6 por escena). Para cada paso: el texto, la ruta que recorre el paquete, los módulos que se encienden y la lámpara o lectura que cambia.
2. El mapa del tablero: módulos, vías fijas y rutas, en un viewBox fijo (por ejemplo, 1000 de ancho).

## Arquitectura de la animación

- Una sola fuente de contenido (`src/content.ts`) con los textos de escenas, pasos y registro, y el documento completo si hay PDF. El sitio y el PDF leen de ahí.
- La geometría vive en un solo archivo: módulos (x, y, w, h, título), vías fijas y rutas.
- Las rutas son trazos ortogonales `M x y H x V y` que empiezan y terminan en el borde de un módulo. Sin saltos: si el paquete pasa de un módulo a otro, una ruta los conecta.
- El estado del tablero es declarativo: foco, lámparas, lecturas, medidores y tres listas de rutas.
  - `routes`: rutas ya recorridas en la escena.
  - `now`: rutas recorridas en este paso.
  - `bad`: rutas rechazadas.
- Cada paso es una lista de tiempos `{ flow, burst, bad, patch, pause }`.
- Funciones puras `stepStart(escena, paso)` y `stateAt(escena, paso)`.
  - `stateAt` alimenta el modo sin movimiento, los enlaces `?escena=&paso=` y el botón "anterior".
  - La animación parte de `stepStart`.
- Motor `playStep`: una timeline de GSAP por paso. Mátala al cambiar de paso y al desmontar.

## Reglas de iluminación (lo más importante)

1. La ruta del paso se dibuja detrás del paquete, con la misma duración y la misma curva.
   - Usa `pathLength=1`, `stroke-dasharray: 1 1` y `stroke-dashoffset` de 1 a 0.
   - Durante el trazo, pon `transition: none` en línea.
   - Al cambiar de paso, limpia los estilos en línea.
2. Dos capas.
   - Lo ya recorrido es un hilo fino dentro de la vía.
   - La ruta del paso es gruesa: borde oscuro (casing) bajo un núcleo de color, para que contraste con el fondo.
   - Si el paso vuelve a usar una vía ya recorrida, también se redibuja gruesa detrás del paquete.
3. Lo que participa del paso (foco) se enciende cuando sale el paquete. Lámparas y lecturas cambian cuando llega.
4. Lo que no participa queda en baja saliencia: trazos y lámparas grises, texto legible a 4.5:1, nunca con opacidad. Un módulo en falla nunca se atenúa.
5. Los paquetes se dibujan debajo de los módulos, así desaparecen dentro de cada nodo que atraviesan.
   - Entre una vía y la siguiente hay una pausa corta.
   - El paquete es claro con borde oscuro, distinto del color de la ruta.
6. El tráfico rechazado va en rojo desde el primer tramo. La ruta termina en la barra que lo detiene, con una placa que dice por qué.
7. El color marca solo estado. Una leyenda en el tablero explica la ruta del paso, lo ya recorrido, lo rechazado y las placas de decisión.
8. Los valores simulados (medidores, registro) se rotulan como simulación y citan el supuesto del que salen.

## Controles y accesibilidad

- Botones de anterior, reproducir o pausar, siguiente y reiniciar.
- Teclado: `→` `←`, espacio, `1` a `N` para las escenas, `R`, `F` (pantalla completa) y `?` (atajos).
- Con `prefers-reduced-motion` o `?movimiento=reducido`, cada paso muestra su estado final, sin desplazamientos ni parpadeos.
- El tablero se lee sin animación, y el texto del paso va en una región `aria-live`.
- Escritorio primero: a 1280×720 se ven, sin desplazar, el tablero completo y el panel de control. [Móvil: sí/no.]

## Tests que deben existir

- Cada escena tiene tantos pasos animados como pasos de texto.
- Los guiones solo usan rutas y módulos que existen.
- Al terminar cada paso, todo módulo que toca una ruta del paso está en foco. El test analiza los segmentos de cada ruta y los cruza con las cajas. Rómpelo a propósito una vez para comprobar que falla.
- Si hay PDF:
  - La impresión sale de la misma página (`?vista=imprimir`) con Chrome headless `--print-to-pdf`.
  - Un script falla si el PDF no da exactamente N páginas.

## Verificación visual (no la saltes)

1. Hoja de contacto por escena: con puppeteer, captura el SVG en el estado final de cada paso (modo reducido). Revísala paso por paso: ruta correcta, foco correcto, sin choques de texto.
2. Tiras de animación: cuadros cada 120 ms, aproximadamente, de los pasos con más movimiento. Confirma que la ruta crece detrás del paquete y que los módulos se encienden al salir.
3. Mide en 1280×720, 1440×900 y 1920×1080 que tablero, medidores y panel quepan.
4. Cero errores de consola. Si hay PDF, rasterízalo con `pdftoppm` y míralo.

## Publicación

- Antes del build corre un script que falle si aparece un dato sensible: [lo que aplique, por ejemplo IDs de cuenta de 12 dígitos, llaves `AKIA…` o IDs de recursos].
- `npm run deploy` corre test, build y PDF, y sube `dist/` a la rama `gh-pages`. Después verifica la URL y el PDF publicados.
- Haz commit y push solo cuando yo lo pida.
