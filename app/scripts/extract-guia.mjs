// Migración única: guia-labs-01-04.html (artifact deprecado) -> src/content/*.json y src/diagramas/*.tsx.
// Uso: node scripts/extract-guia.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const app = new URL('..', import.meta.url)
export const GUIA_PATH = fileURLToPath(new URL('../guia-labs-01-04.html', app))

// Valores de la cuenta que aparecen en la guía -> marcadores (ver src/lib/placeholders.ts).
// Se leen de .env.local (VITE_X=valor -> {{X}}) para no escribirlos en el repo.
const envLocal = new URL('.env.local', app)
const CUENTA = existsSync(envLocal)
  ? Object.fromEntries(readFileSync(envLocal, 'utf8').split('\n')
      .map(l => l.match(/^VITE_(\w+)=(.+)$/)).filter(Boolean).map(([, k, v]) => [v.trim(), `{{${k}}}`]))
  : {}

/** Evalúa la parte de datos del <script> de la guía y devuelve sus constantes tal cual. */
export function loadGuia(path = GUIA_PATH) {
  const html = readFileSync(path, 'utf8')
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  const datos = script.split('// ---------- estado ----------')[0]
  const g = vm.runInNewContext(datos + ';({VARS, AMI, LK, K, HOT, QX, ESTADO, LABS})')
  return { html, ...g }
}

const labId = id => id.replace(/^lab(\d+)$/, (_, n) => n.padStart(2, '0'))
const src = f => f.replace(/^lab(\d+)\//, (_, n) => `lab${n.padStart(2, '0')}/`)

function consola(k) {
  if (!k) return undefined
  const imgs = !k.img ? undefined : (Array.isArray(k.img[0]) ? k.img : [k.img]).map(([f, cap]) => ({ src: src(f), cap }))
  return { p: k.p, s: k.s, img: imgs, m: k.m, n: k.n, l: k.l }
}

function lab(l, HOT) {
  const n = l.id.replace('lab', 'l')
  const hot = Object.fromEntries(
    Object.entries(HOT).filter(([key]) => key.startsWith(n + '-')).map(([key, h]) => [key, { t: h.t, k: consola(h.k) }]),
  )
  return {
    id: labId(l.id),
    name: l.name,
    sub: l.sub,
    lead: l.lead,
    why: l.why,
    caption: l.caption,
    fecha: '23 sep',
    done: l.done ? true : undefined,
    hot: Object.keys(hot).length ? hot : undefined,
    phases: l.phases.map(ph => ({
      h: ph.h,
      note: ph.note,
      cleanup: ph.cleanup ? true : undefined,
      steps: ph.steps.map(st => ({ t: st.t, e: st.e, c: st.c, r: st.r, k: consola(st.k), d: st.d ? true : undefined })),
    })),
    quiz: l.quiz.map(q => ({ s: q.s, o: q.o, a: q.a, x: q.x, img: q.img && src(q.img), cap: q.cap })),
    oral: l.oral?.map(([q, a]) => ({ q, a })),
  }
}

const json = x => {
  let s = JSON.stringify(x, null, 2) + '\n'
  for (const [v, m] of Object.entries(CUENTA)) s = s.replaceAll(v, m)
  return s
}

// <template id="svg-labN"> -> componente TSX
function svgToTsx(svg, name) {
  const jsx = svg
    .replace(/\bclass=/g, 'className=')
    .replace(/\btabindex="(\d+)"/g, 'tabIndex={$1}')
    .replace(/\bmarker-end=/g, 'markerEnd=')
    .replace(/style="([^"]*)"/g, (_, css) => {
      const obj = css.split(';').filter(Boolean).map(d => {
        const [k, v] = d.split(':')
        return `${k.trim().replace(/-(\w)/g, (_, c) => c.toUpperCase())}: '${v.trim()}'`
      })
      return `style={{ ${obj.join(', ')} }}`
    })
  return `// Generado desde guia-labs-01-04.html por scripts/extract-guia.mjs. Zonas clicables: rect.hot con data-hot = clave de lab.hot en el JSON.\nexport default function ${name}() {\n  return (\n${jsx.trim().split('\n').map(l => '    ' + l).join('\n')}\n  )\n}\n`
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { html, HOT, ESTADO, LABS } = loadGuia()
  const out = p => new URL(p, app)
  for (const l of LABS) writeFileSync(out(`src/content/lab${labId(l.id)}.json`), json(lab(l, HOT)))
  writeFileSync(out('src/content/estado.json'), json(ESTADO))

  const repaso = html.match(/"intro", "<h2>(.*?)<\/h2><p class='lead'>(.*?)<\/p>"/)
  writeFileSync(out('src/content/guia.json'), json({
    titulo: html.match(/<h1>(.*?)<\/h1>/)[1],
    intro: html.match(/<\/h1>\s*<p>([\s\S]*?)<\/p>/)[1],
    pie: html.match(/<footer>(.*?)<\/footer>/)[1],
    repaso: { titulo: repaso[1], lead: repaso[2], why: html.match(/"why", "(<strong>Cómo se califica.*?)"\)/)[1] },
  }))

  for (const [, n, svg] of html.matchAll(/<template id="svg-lab(\d+)">\s*([\s\S]*?)<\/template>/g)) {
    const name = 'Lab' + n.padStart(2, '0')
    writeFileSync(out(`src/diagramas/${name}.tsx`), svgToTsx(svg, name))
  }
  console.log(`extract-guia: ${LABS.length} labs, estado, guia y diagramas escritos`)
}
