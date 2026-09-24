// {{MARCADOR}} -> valor de VITE_MARCADOR (solo en `npm run dev`, desde .env.local) o ‹etiqueta›.
// En el build no se usan las VITE_*: así el bundle publicado nunca lleva datos de la cuenta.
const ETIQUETAS: Record<string, string> = {
  ACCOUNT_ID: 'tu Account ID',
  BUCKET: 'tu bucket',
  VPC_ID: 'id de la VPC',
  RTB_MAIN: 'id de la main route table',
  SG_EC2_S03: 'id de sg-ec2-s03',
  IP_LAB02_EC2: 'IP pública de la EC2',
  IP_CLIENT_A: 'IP pública de client-a',
  IP_CLIENT_B: 'IP pública de client-b',
}

type Env = Record<string, string | boolean | undefined>
const devEnv: Env = import.meta.env.DEV ? import.meta.env : {}

export function resolve(text: string, env: Env = devEnv): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => {
    const v = env['VITE_' + k]
    return typeof v === 'string' && v ? v : `‹${ETIQUETAS[k] ?? k}›`
  })
}

/** Resuelve los marcadores en todos los textos de un objeto de contenido. */
export function resolveDeep<T>(data: T, env: Env = devEnv): T {
  return JSON.parse(JSON.stringify(data).replace(/\{\{\w+\}\}/g, m => JSON.stringify(resolve(m, env)).slice(1, -1)))
}
