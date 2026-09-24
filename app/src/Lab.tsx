import { useState, type ComponentType, type KeyboardEvent, type MouseEvent } from 'react'
import { stepId } from './content'
import type { Lab, Paso } from './content/types'
import { CodeBlock, ConsolaBlock, Html, Resultado, imgUrl, useZoom } from './ui'

// Diagramas: src/diagramas/LabNN.tsx, opcionales. Agregar uno no requiere registrarlo.
const DIAGRAMAS: Record<string, ComponentType> = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: ComponentType }>('./diagramas/Lab*.tsx', { eager: true }))
    .map(([p, m]) => [p.match(/Lab(\w+)\.tsx$/)![1], m.default]),
)

export type Modo = 'cli' | 'console'

interface Props {
  lab: Lab
  isDone: (id: string, def: boolean) => boolean
  toggle: (id: string, v: boolean) => void
  modo: Modo
  expandAll: boolean
}

export default function LabView({ lab, isDone, toggle, modo, expandAll }: Props) {
  const zoom = useZoom()
  const Diagrama = DIAGRAMAS[lab.id]

  const openHot = (key: string | null) => {
    const h = key ? lab.hot?.[key] : undefined
    if (!h) return
    const img = h.k.img?.[0]
    zoom({
      title: h.t,
      path: h.k.p,
      text: img?.cap ?? h.k.m?.[0] ?? h.k.n ?? 'Sin captura: este lab ya no está desplegado.',
      src: img && imgUrl(img.src),
      link: h.k.l,
    })
  }
  const hotOf = (e: MouseEvent | KeyboardEvent) => (e.target as Element).closest('.hot')?.getAttribute('data-hot') ?? null

  return (
    <div className="grid gap-4">
      <div className="grid gap-2.5">
        <h2 className="text-xl font-semibold text-balance">{lab.name} · {lab.sub}</h2>
        {lab.lead && <Html as="p" html={lab.lead} className="max-w-[68ch] text-base" />}
        {lab.why && <Html as="div" html={lab.why} className="why rounded-lg bg-accent-bg px-4 py-3 text-sm" />}
      </div>

      {Diagrama && (
        <figure
          className="overflow-x-auto rounded-lg border border-line bg-surface p-3.5 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg]:min-w-[560px]"
          onClick={e => openHot(hotOf(e))}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              const key = hotOf(e)
              if (key) { e.preventDefault(); openHot(key) }
            }
          }}
        >
          <Diagrama />
          {lab.caption && <figcaption className="mt-2 text-[13px] text-muted">{lab.caption}</figcaption>}
          <div className="mt-1.5 flex flex-wrap gap-3.5 text-xs text-muted">
            {([['net', 'red'], ['cmp', 'cómputo'], ['dat', 'datos'], ['sec', 'security group']] as const).map(([c, t]) => (
              <span key={c}><i className="mr-1.5 inline-block size-2.5 rounded-xs align-[-1px]" style={{ background: `var(--${c})` }} />{t}</span>
            ))}
          </div>
          {lab.hot && <p className="mt-1.5 text-[12.5px] text-con">Toca una caja del diagrama para ver ese recurso en la consola.</p>}
        </figure>
      )}

      {lab.phases.map((ph, pi) => {
        const ids = ph.steps.map((st, si) => [stepId(lab, pi, si), !!(st.d || lab.done)] as const)
        const done = ids.filter(([id, def]) => isDone(id, def)).length
        const complete = done === ids.length
        return (
          <section key={pi} className={`grid gap-2.5 rounded-lg border bg-surface px-4 py-3.5 ${ph.cleanup ? 'border-bad' : 'border-line'}`}>
            <header className="flex flex-wrap items-baseline justify-between gap-2.5">
              <h3 className={`font-semibold ${ph.cleanup ? 'text-bad' : ''}`}>{ph.h}</h3>
              <span className={`font-mono text-xs font-medium tabular-nums ${complete ? 'text-done' : 'text-muted'}`}>{done}/{ids.length}</span>
            </header>
            {ph.note && <Html as="p" html={ph.note} className="text-[13.5px] text-muted" />}
            <ul className="grid gap-1">
              {ph.steps.map((st, si) => {
                const [id, def] = ids[si]
                return (
                  <Step key={id + expandAll} id={id} st={st} fecha={lab.fecha} checked={isDone(id, def)}
                    onCheck={v => toggle(id, v)} modo={modo} initialOpen={expandAll} />
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

interface StepProps {
  id: string
  st: Paso
  fecha?: string
  checked: boolean
  onCheck: (v: boolean) => void
  modo: Modo
  initialOpen: boolean
}

function Step({ id, st, fecha, checked, onCheck, modo, initialOpen }: StepProps) {
  const [open, setOpen] = useState(initialOpen)
  const hasBody = !!(st.e || st.c || st.r || st.k)
  const cli = (st.c || st.r) && (
    <details key="cli" open={modo === 'cli'} className="blk min-w-0 rounded-md border border-line">
      <summary className="text-muted">Comando CLI</summary>
      <div className="grid min-w-0 gap-2.5 p-2.5">
        {st.c && <CodeBlock code={st.c} />}
        {st.r && <Resultado text={st.r} fecha={fecha} />}
      </div>
    </details>
  )
  const con = st.k && <ConsolaBlock key="con" k={st.k} open={modo === 'console'} />

  return (
    <li className={`-mx-2 grid grid-cols-[18px_1fr] gap-x-2.5 rounded-md px-2 py-1.5 transition-[background,box-shadow] motion-reduce:transition-none ${checked ? 'bg-done-bg shadow-[inset_3px_0_0_var(--done),0_0_10px_-2px_var(--done)]' : 'hover:bg-bg'}`}>
      <input type="checkbox" id={'cb-' + id} aria-label="Hecho" checked={checked} onChange={e => onCheck(e.target.checked)}
        className="mt-[5px] size-[17px] cursor-pointer accent-done" />
      <button type="button" aria-expanded={hasBody ? open : undefined} aria-controls={hasBody ? 'body-' + id : undefined}
        onClick={() => setOpen(!open)} className="rounded text-left text-[15px] hover:underline hover:decoration-muted hover:decoration-dotted hover:underline-offset-[3px]">
        <Html html={st.t} />
        {hasBody && <span className="ml-1.5 font-mono text-[11px] font-medium whitespace-nowrap text-accent">¿qué hace?</span>}
      </button>
      {hasBody && open && (
        <div id={'body-' + id} className="col-start-2 mt-1.5 grid min-w-0 gap-2">
          {modo === 'cli' ? [cli, con] : [con, cli]}
          {st.e && <Html as="div" html={st.e} className="border-l-[3px] border-accent pl-3 text-sm" />}
        </div>
      )}
    </li>
  )
}
