// Falla si algo publicable (src, public, dist) contiene datos de la cuenta AWS.
// Busca: los valores de .env.local (si existe), cualquier número de 12 dígitos y access keys.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const TEXT = new Set(['.json', '.ts', '.tsx', '.js', '.mjs', '.css', '.html', '.svg', '.txt', '.md', '.map'])

const envFile = join(root, '.env.local')
const secrets = existsSync(envFile)
  ? readFileSync(envFile, 'utf8').split('\n')
      .map(l => l.match(/^VITE_\w+=(.+)$/)?.[1]?.trim())
      .filter(v => v && v.length >= 6)
  : []

const patterns = [/\b\d{12}\b/, /AKIA[0-9A-Z]{16}/]

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (TEXT.has(extname(p))) yield p
  }
}

const hits = []
for (const d of ['src', 'public', 'dist'].map(d => join(root, d)).filter(existsSync)) {
  for (const f of walk(d)) {
    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      const bad = secrets.find(s => line.includes(s)) ?? patterns.map(re => line.match(re)?.[0]).find(Boolean)
      if (bad) hits.push(`${relative(root, f)}:${i + 1}: ${bad}`)
    })
  }
}

if (hits.length) {
  console.error('check-leaks: datos de cuenta en archivos publicables:\n' + hits.join('\n'))
  process.exit(1)
}
console.log('check-leaks: sin datos de cuenta')
