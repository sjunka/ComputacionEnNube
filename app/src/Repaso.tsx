import { useState } from 'react'
import { GUIA, LABS } from './content'
import type { Pregunta } from './content/types'
import { Html, Shot } from './ui'

const ABC = 'ABCDEFG'

export default function Repaso() {
  const { titulo, lead, why } = GUIA.repaso
  return (
    <div className="grid gap-4">
      <div className="grid gap-2.5">
        <h2 className="text-xl font-semibold text-balance">{titulo}</h2>
        <Html as="p" html={lead} className="max-w-[68ch] text-base" />
      </div>
      <Html as="div" html={why} className="why rounded-lg bg-accent-bg px-4 py-3 text-sm" />
      <div className="grid gap-3.5">
        {LABS.flatMap(lab => (lab.quiz ?? []).map((q, qi) => (
          <Card key={`${lab.id}-${qi}`} q={q} tag={`${lab.name} · pregunta ${qi + 1}${q.img ? ' · consola' : ''}`} />
        )))}
      </div>
      <h3 className="font-semibold">Preguntas orales de práctica</h3>
      {LABS.flatMap(lab => (lab.oral ?? []).map((o, i) => (
        <details key={`${lab.id}-${i}`} className="rounded-lg border border-line bg-surface px-4 py-3.5">
          <summary className="cursor-pointer font-semibold"><Html html={o.q} /></summary>
          <Html as="p" html={o.a} className="mt-2 text-sm" />
        </details>
      )))}
    </div>
  )
}

function Card({ q, tag }: { q: Pregunta; tag: string }) {
  const [sel, setSel] = useState<number | null>(null)
  return (
    <div className="card">
      <span className="font-mono text-[11px] font-medium tracking-wider text-muted uppercase">{tag}</span>
      <Html as="p" html={q.s} className="font-medium" />
      {q.img && <div className="max-w-[620px]"><Shot img={{ src: q.img, cap: q.cap }} title={q.s} /></div>}
      <div className="grid gap-1.5">
        {q.o.map((o, oi) => {
          const state = sel == null ? '' : oi === q.a ? 'border-done bg-done-bg' : oi === sel ? 'border-bad bg-bad-bg' : ''
          return (
            <button key={oi} type="button" onClick={() => setSel(oi)}
              className={`btn px-3 py-2 text-left text-sm leading-snug text-ink ${state}`}>
              <b>{ABC[oi]}.</b> <Html html={o} />
            </button>
          )
        })}
      </div>
      {sel != null && (
        <p className="border-l-[3px] border-done pl-3 text-sm" aria-live="polite">
          <strong>{ABC[q.a]}.</strong> <Html html={q.x} />
        </p>
      )}
    </div>
  )
}
