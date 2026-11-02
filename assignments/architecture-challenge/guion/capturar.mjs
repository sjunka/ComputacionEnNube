// Captura las 43 láminas como se presentan: enlace directo (no arranca solo) y solo la flecha →.
// Requiere playwright-core (npm i playwright-core fuera del repo) y Google Chrome.
// Uso: node capturar.mjs <carpeta de salida>
import { chromium } from 'playwright-core'
const out = process.argv[2]
const URL = 'https://sjunka.github.io/digital-cafe-luna/?escena=problema&paso=1'
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
const p = await ctx.newPage()
await p.goto(URL)
await p.waitForTimeout(1500)
const paso = () => p.locator('text=/Paso \\d+ de \\d+/').first().textContent()
const escenas = [6, 5, 6, 6, 6, 6, 6]
// El tablero no debe avanzar solo: si esto falla, el guion no sirve.
await p.waitForTimeout(10000)
if ((await paso()).trim() !== 'Paso 1 de 6') throw new Error('avanzó solo: ' + (await paso()))
let n = 0
for (const total of escenas) {
  for (let s = 1; s <= total; s++) {
    n++
    const t = (await paso()).trim()
    if (t !== `Paso ${s} de ${total}`) throw new Error(`lámina ${n}: ${t}`)
    await p.mouse.move(0, 0)
    await p.screenshot({ path: `${out}/${String(n).padStart(2, '0')}.png` })
    await p.keyboard.press('ArrowRight')
    await p.waitForTimeout(600)
  }
}
await p.setViewportSize({ width: 1920, height: 1180 })
for (const id of ['costo-h', 'evidencia-h']) {
  await p.evaluate(i => { const e = document.getElementById(i); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 20) }, id)
  await p.waitForTimeout(600)
  n++
  await p.screenshot({ path: `${out}/${String(n).padStart(2, '0')}.png` })
}
console.log(n, 'capturas')
await b.close()
