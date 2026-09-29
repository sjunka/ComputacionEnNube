// Modelo de contenido. Agregar un lab, checkpoint o entrega = agregar un labNN.json.
// Casi todo es opcional: una entrega puede no tener diagrama, capturas ni comandos.
// Los textos admiten HTML en línea (<code>, <b>, <em>, <span class='k'>) y marcadores {{ACCOUNT_ID}}.

/** Captura publicada en public/img/<src> (p. ej. "lab03/05-efs.png"). */
export interface Captura {
  src: string
  cap?: string
}

/** Cómo se hace y se ve un paso en la consola AWS. */
export interface Consola {
  p?: string        // ruta de clics
  s?: string[]      // pasos en consola
  img?: Captura[]
  m?: string[]      // qué mirar
  n?: string        // nota
  l?: string        // enlace a la consola (por nombre, no por ID)
}

export interface Paso {
  t: string         // texto del paso
  e?: string        // explicación
  c?: string        // comando CLI
  r?: string        // resultado real
  k?: Consola
  d?: boolean       // hecho por defecto
}

export interface Fase {
  h: string
  note?: string
  cleanup?: boolean
  steps: Paso[]
}

/** Zona clicable del diagrama: <rect data-hot="id"> en src/diagramas/LabNN.tsx. */
export interface Hot {
  t: string
  k: Consola
}

/** Pregunta de escenario con 3 opciones; `a` es el índice de la correcta. */
export interface Pregunta {
  s: string
  o: string[]
  a: number
  x: string
  img?: string
  cap?: string
}

export interface Oral {
  q: string
  a: string
}

export interface Lab {
  id: string        // "03": ruta #/lab/03 y diagrama src/diagramas/Lab03.tsx (opcional)
  name: string
  sub: string
  lead?: string
  why?: string
  caption?: string
  fecha?: string    // fecha de los «Resultado real»
  done?: boolean    // todos los pasos hechos por defecto
  hot?: Record<string, Hot>
  phases: Fase[]
  quiz?: Pregunta[]
  oral?: Oral[]
}

export interface Estado {
  actualizado: string
  items: { pill: 'ok' | 'warn' | 'todo'; tag: string; text: string }[]
  corriendo?: string[]
  costo?: string
}

export interface Guia {
  titulo: string
  intro: string
  pie: string
  repaso: { titulo: string; lead: string; why: string }
}
