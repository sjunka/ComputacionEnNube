import { useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { ESTADO, GUIA, LABS, stepId } from './content'
import LabView, { type Modo } from './Lab'
import { resolve } from './lib/placeholders'
import { KEY, useStored } from './lib/store'
import Repaso from './Repaso'
import { Html, ZoomProvider } from './ui'

const PASOS = LABS.flatMap(lab => lab.phases.flatMap((ph, pi) =>
  ph.steps.map((st, si) => ({ lab: lab.id, id: stepId(lab, pi, si), def: !!(st.d || lab.done) }))))

export default function App() {
  const [saved, setSaved] = useStored<Record<string, boolean>>(KEY, {})
  const [modo, setModo] = useStored<Modo>(KEY + '-mode', 'cli')
  const [tab, setTab] = useStored<string>(KEY + '-tab', `/lab/${LABS.at(-1)?.id}`)
  const [expandAll, setExpandAll] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { if (pathname !== '/' && pathname !== tab) setTab(pathname) }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  useEffect(() => {
    if (!confirm) return
    const t = setTimeout(() => setConfirm(false), 3000)
    return () => clearTimeout(t)
  }, [confirm])

  const isDone = (id: string, def: boolean) => (id in saved ? saved[id] : def)
  const toggle = (id: string, v: boolean) => setSaved({ ...saved, [id]: v })
  const count = (lab?: string) => {
    const ps = PASOS.filter(p => !lab || p.lab === lab)
    return [ps.filter(p => isDone(p.id, p.def)).length, ps.length]
  }
  const [done, total] = count()

  const reset = () => {
    if (confirm) { setSaved({}); setConfirm(false) } else setConfirm(true)
  }

  const tabCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-md border px-[11px] py-[5px] text-sm font-semibold ${isActive ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-muted hover:border-muted hover:text-ink'}`

  return (
    <ZoomProvider>
      <main className="mx-auto grid max-w-[820px] gap-[18px] px-4 pt-7 pb-18">
        <header className="grid gap-2">
          <h1 className="text-[1.8rem] leading-tight font-bold text-balance max-[520px]:text-[1.45rem]">{GUIA.titulo}</h1>
          <Html as="p" html={GUIA.intro} className="max-w-[68ch] text-muted" />
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Forma de trabajo" className="inline-flex overflow-hidden rounded-md border border-line bg-surface">
              {(['cli', 'console'] as const).map(m => (
                <button key={m} type="button" aria-pressed={modo === m} onClick={() => setModo(m)}
                  className={`px-3 py-[5px] text-[13px] font-semibold [&+&]:border-l [&+&]:border-line ${modo === m ? (m === 'cli' ? 'bg-ink text-bg' : 'bg-con text-white') : 'text-muted hover:text-ink'}`}>
                  {m === 'cli' ? 'CLI' : 'Consola'}
                </button>
              ))}
            </div>
            <div className="h-2 min-w-[140px] flex-1 overflow-hidden rounded bg-line" role="progressbar" aria-label="Avance global" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
              <div className="h-full bg-done transition-[width] duration-250 motion-reduce:transition-none" style={{ width: `${total ? (100 * done) / total : 0}%` }} />
            </div>
            <span className="font-mono text-[13px] font-medium text-muted tabular-nums">{done}/{total}</span>
            <button type="button" className="btn" onClick={() => setExpandAll(!expandAll)}>
              {expandAll ? 'Ocultar explicaciones' : 'Mostrar todas las explicaciones'}
            </button>
            <button type="button" className={`btn ${confirm ? 'border-bad text-bad' : ''}`} onClick={reset}>
              {confirm ? '¿Seguro? Clic otra vez' : 'Reiniciar'}
            </button>
          </div>
        </header>

        <EstadoPanel />

        <nav aria-label="Labs" className="sticky top-0 z-10 flex flex-wrap gap-1.5 bg-bg py-2">
          {LABS.map(l => {
            const [d, t] = count(l.id)
            return (
              <NavLink key={l.id} to={`/lab/${l.id}`} className={tabCls}>
                {l.name}<span className="font-mono text-[11px] font-medium opacity-85 max-[520px]:hidden">{l.sub} · {d}/{t}</span>
              </NavLink>
            )
          })}
          <NavLink to="/repaso" className={tabCls}>
            Repaso<span className="font-mono text-[11px] font-medium opacity-85 max-[520px]:hidden">test + oral</span>
          </NavLink>
        </nav>

        <Routes>
          <Route path="/lab/:id" element={<LabRoute isDone={isDone} toggle={toggle} modo={modo} expandAll={expandAll} />} />
          <Route path="/repaso" element={<Repaso />} />
          <Route path="*" element={<Navigate to={tab} replace />} />
        </Routes>

        <Html as="p" html={GUIA.pie} className="text-[13px] text-muted" />
      </main>
    </ZoomProvider>
  )
}

function LabRoute(props: Omit<Parameters<typeof LabView>[0], 'lab'>) {
  const lab = LABS.find(l => l.id === useParams().id)
  return lab ? <LabView key={lab.id} lab={lab} {...props} /> : <Navigate to={`/lab/${LABS.at(-1)?.id}`} replace />
}

const PILL = { ok: 'bg-done-bg text-done', warn: 'bg-warn-bg text-warn-ink', todo: 'bg-accent-bg text-accent' }

function EstadoPanel() {
  return (
    <div className="grid gap-2 rounded-lg border border-line bg-surface px-4 py-3.5 text-sm">
      <strong>Estado de tu cuenta {resolve('{{ACCOUNT_ID}}')} · us-east-1 · {ESTADO.actualizado}</strong>
      <ul className="grid list-disc gap-1 pl-[18px]">
        {ESTADO.items.map((it, i) => (
          <li key={i}><span className={`pill ${PILL[it.pill] ?? PILL.todo}`}>{it.tag}</span> <Html html={it.text} /></li>
        ))}
      </ul>
      {!!ESTADO.corriendo?.length && (
        <div className="grid gap-1 rounded-md bg-warn-bg px-3 py-2 text-warn-ink">
          <strong>Corriendo ahora · {ESTADO.costo}</strong>
          <ul className="list-disc pl-[18px]">{ESTADO.corriendo.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
      )}
      <p className="font-mono text-[11px] font-medium text-muted">Estado guardado en la app: lo actualiza /mostrarenaws en cada corrida.</p>
      <p>Los bloques verdes <b>«Resultado real»</b> muestran lo que salió al correr los comandos; los bloques <b>«En la consola»</b>, cómo se ve cada recurso.</p>
    </div>
  )
}
