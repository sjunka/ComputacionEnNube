import { resolveDeep } from '../lib/placeholders'
import estadoJson from './estado.json'
import guiaJson from './guia.json'
import type { Estado, Guia, Lab } from './types'

// Todos los labNN.json, en orden de nombre de archivo.
const mods = import.meta.glob<Lab>('./lab*.json', { eager: true, import: 'default' })
export const LABS: Lab[] = Object.keys(mods).sort().map(p => resolveDeep(mods[p]))
export const ESTADO = resolveDeep(estadoJson as Estado)
export const GUIA = resolveDeep(guiaJson as Guia)

/** Id de progreso de un paso: el mismo esquema que usaba el artifact. */
export const stepId = (lab: Lab, fase: number, paso: number) => `lab${Number(lab.id)}-${fase}-${paso}`
