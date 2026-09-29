import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Captura, Consola } from './content/types'

export const imgUrl = (src: string) => `${import.meta.env.BASE_URL}img/${src}`

/** Texto del contenido: trae HTML en línea escrito por nosotros (<code>, <b>…). */
export function Html({ html, as: Tag = 'span', className = '' }: { html: string; as?: 'span' | 'p' | 'div' | 'li'; className?: string }) {
  return <Tag className={`html ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

export function CodeBlock({ code }: { code: string }) {
  const [label, setLabel] = useState('Copiar')
  const pre = useRef<HTMLPreElement>(null)
  const copy = () => {
    const fallback = () => {
      const r = document.createRange()
      r.selectNodeContents(pre.current!)
      getSelection()?.removeAllRanges()
      getSelection()?.addRange(r)
      setLabel('Cmd+C')
    }
    navigator.clipboard?.writeText(code).then(() => {
      setLabel('Copiado')
      setTimeout(() => setLabel('Copiar'), 1400)
    }, fallback) ?? fallback()
  }
  return (
    <div className="relative min-w-0">
      <pre ref={pre} className="overflow-x-auto rounded-md bg-code-bg px-3.5 py-3 font-mono text-[12.5px] leading-normal text-code-ink">{code}</pre>
      <button type="button" onClick={copy} className="absolute top-1.5 right-1.5 rounded-md border border-[#33445a] bg-[#1e2a3a] px-2 py-0.5 text-[11px] text-[#c9d4e3] hover:border-[#6a7d96] hover:text-white">
        {label}
      </button>
    </div>
  )
}

export function Resultado({ text, fecha }: { text: string; fecha?: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-md border border-done">
      <span className="block bg-done-bg px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-done uppercase">
        Resultado real{fecha ? ` · ${fecha}` : ''}
      </span>
      <pre className="overflow-x-auto bg-done-bg px-3.5 py-3 font-mono text-[12.5px] leading-normal">{text}</pre>
    </div>
  )
}

// ---------- visor de capturas ----------
export interface Zoom { title?: string; path?: string; text?: string; src?: string; link?: string }
const ZoomCtx = createContext<(z: Zoom) => void>(() => {})
export const useZoom = () => useContext(ZoomCtx)

export function ZoomProvider({ children }: { children: ReactNode }) {
  const [z, setZ] = useState<Zoom | null>(null)
  const dlg = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (z && !dlg.current?.open) dlg.current?.showModal() }, [z])
  return (
    <ZoomCtx.Provider value={setZ}>
      {children}
      <dialog
        ref={dlg}
        aria-labelledby="ztitle"
        onClose={() => setZ(null)}
        onClick={e => e.target === dlg.current && dlg.current.close()}
        className="m-auto max-h-[92vh] w-[min(1200px,96vw)] rounded-[10px] border border-line bg-surface p-0 text-ink"
      >
        {z && (
          <div className="grid max-h-[92vh] gap-2.5 overflow-auto px-4 py-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 id="ztitle" className="font-semibold">{z.title}</h3>
              <button type="button" className="btn" onClick={() => dlg.current?.close()}>Cerrar</button>
            </div>
            {z.path && <div className="crumb">{z.path}</div>}
            {z.text && <Html as="p" html={z.text} className="text-sm" />}
            {z.src && <img src={z.src} alt={z.title ?? ''} className="h-auto w-full rounded-md border border-line" />}
            {z.link && <a className="golink" href={z.link} target="_blank" rel="noopener">Abrir en la consola ↗</a>}
          </div>
        )}
      </dialog>
    </ZoomCtx.Provider>
  )
}

export function Shot({ img, title }: { img: Captura; title?: string }) {
  const zoom = useZoom()
  const label = img.cap || title || ''
  return (
    <figure className="grid gap-1">
      <button
        type="button"
        aria-label={`Ampliar captura: ${label}`}
        onClick={() => zoom({ title: title || img.cap, text: img.cap, src: imgUrl(img.src) })}
        className="block cursor-zoom-in overflow-hidden rounded-md border border-line bg-bg"
      >
        <img src={imgUrl(img.src)} alt={label} loading="lazy" className="block h-auto w-full" />
      </button>
      {img.cap && <figcaption className="text-[12.5px] text-muted">{img.cap}</figcaption>}
    </figure>
  )
}

export function ConsolaBlock({ k, open }: { k: Consola; open: boolean }) {
  return (
    <details open={open} className="blk min-w-0 rounded-md border border-con bg-surface">
      <summary className="bg-con-bg text-con">En la consola</summary>
      <div className="grid min-w-0 gap-2.5 p-2.5">
        {k.p && <div className="crumb">{k.p}</div>}
        {k.s && <ol className="grid list-decimal gap-0.5 pl-5 text-sm">{k.s.map((s, i) => <Html key={i} as="li" html={s} />)}</ol>}
        {k.n && <Html as="p" html={k.n} className="text-[13px] text-muted" />}
        {k.img?.map(img => <Shot key={img.src} img={img} title={k.p} />)}
        {k.m && (
          <>
            <div className="text-[13px] font-semibold">Qué mirar</div>
            <ul className="grid list-disc gap-0.5 pl-[18px] text-sm">{k.m.map((m, i) => <Html key={i} as="li" html={m} />)}</ul>
          </>
        )}
        {k.l && <a className="golink" href={k.l} target="_blank" rel="noopener">Abrir en la consola ↗</a>}
      </div>
    </details>
  )
}
