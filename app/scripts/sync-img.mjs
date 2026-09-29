// Copia las capturas de evidencias/ a public/img/ tapando las zonas de src/content/redact.json.
// Solo publica lo que está en redact.json. Los originales no se tocan.
// Uso: node scripts/sync-img.mjs   (desde app/ o desde la raíz del repo)
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const app = new URL('..', import.meta.url)
const repo = new URL('..', app)
const { _formato, ...capturas } = JSON.parse(readFileSync(new URL('src/content/redact.json', app), 'utf8'))

for (const [dest, { from, zonas }] of Object.entries(capturas)) {
  const img = sharp(fileURLToPath(new URL(from, repo)))
  const { width, height } = await img.metadata()
  const rects = zonas.map(([x, y, w, h]) => ({
    input: { create: { width: Math.round((w * width) / 100), height: Math.round((h * height) / 100), channels: 3, background: '#000' } },
    left: Math.round((x * width) / 100),
    top: Math.round((y * height) / 100),
  }))
  const out = fileURLToPath(new URL(`public/img/${dest}`, app))
  mkdirSync(dirname(out), { recursive: true })
  await img.composite(rects).png().toFile(out)
  console.log(`${dest}  ${zonas.length} zona(s)`)
}
