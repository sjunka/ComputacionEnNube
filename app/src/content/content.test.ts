// La migración conserva todo lo que tenía el artifact (guia-labs-01-04.html).
import { existsSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { GUIA_PATH, loadGuia } from '../../scripts/extract-guia.mjs'
import type { Consola, Lab } from './types'

const labs: Lab[] = Object.values(import.meta.glob<Lab>('./lab*.json', { eager: true, import: 'default' }))
const diagramas = import.meta.glob<string>('../diagramas/Lab*.tsx', { eager: true, query: '?raw', import: 'default' })

type OrigK = { img?: unknown }
const nImgs = (k?: OrigK | Consola) => !k?.img ? 0 : Array.isArray((k.img as unknown[])[0]) || typeof (k.img as unknown[])[0] === 'object' ? (k.img as unknown[]).length : 1

describe.skipIf(!existsSync(GUIA_PATH))('migración desde el artifact', () => {
  const g = loadGuia()
  const orig = g.LABS as { phases: { steps: { k?: OrigK }[] }[]; quiz: { img?: string }[]; oral?: unknown[] }[]
  const pasos = (ls: { phases: { steps: { k?: OrigK | Consola }[] }[] }[]) => ls.flatMap(l => l.phases.flatMap(p => p.steps))

  test('labs, fases y pasos', () => {
    expect(labs.length).toBe(orig.length)
    expect(labs.flatMap(l => l.phases).length).toBe(orig.flatMap(l => l.phases).length)
    expect(pasos(labs).length).toBe(pasos(orig).length)
  })

  test('bloques de consola y capturas', () => {
    expect(pasos(labs).filter(s => s.k).length).toBe(pasos(orig).filter(s => s.k).length)
    const caps = (ps: { k?: OrigK | Consola }[]) => ps.reduce((n, s) => n + nImgs(s.k), 0)
    expect(caps(pasos(labs))).toBe(caps(pasos(orig)))
    expect(labs.flatMap(l => l.quiz ?? []).filter(q => q.img).length).toBe(orig.flatMap(l => l.quiz).filter(q => q.img).length)
  })

  test('zonas clicables', () => {
    expect(labs.reduce((n, l) => n + Object.keys(l.hot ?? {}).length, 0)).toBe(Object.keys(g.HOT).length)
    const rects = (s: string) => s.match(/data-hot="/g)?.length ?? 0
    expect(Object.values(diagramas).reduce((n, s) => n + rects(s), 0)).toBe(rects(g.html))
    // cada rect del diagrama tiene su entrada en hot
    for (const l of labs) {
      const src = diagramas[`../diagramas/Lab${l.id}.tsx`] ?? ''
      for (const [, key] of src.matchAll(/data-hot="([^"]+)"/g)) expect(l.hot?.[key], key).toBeTruthy()
    }
  })

  test('preguntas y orales', () => {
    expect(labs.flatMap(l => l.quiz ?? []).length).toBe(orig.flatMap(l => l.quiz).length)
    expect(labs.flatMap(l => l.oral ?? []).length).toBe(orig.flatMap(l => l.oral ?? []).length)
  })
})

test('toda captura referenciada está en redact.json', async () => {
  const redact = (await import('./redact.json')).default as Record<string, unknown>
  const srcs = labs.flatMap(l => [
    ...l.phases.flatMap(p => p.steps.flatMap(s => s.k?.img ?? [])).map(i => i.src),
    ...Object.values(l.hot ?? {}).flatMap(h => h.k.img ?? []).map(i => i.src),
    ...(l.quiz ?? []).flatMap(q => (q.img ? [q.img] : [])),
  ])
  for (const s of srcs) expect(redact[s], s).toBeTruthy()
})
