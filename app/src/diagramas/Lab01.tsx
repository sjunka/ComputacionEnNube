// Generado desde guia-labs-01-04.html por scripts/extract-guia.mjs. Zonas clicables: rect.hot con data-hot = clave de lab.hot en el JSON.
export default function Lab01() {
  return (
    <svg viewBox="0 0 640 250" role="img" aria-label="Región us-east-1 con la VPC 10.20.0.0/16 y dos subnets, una en cada AZ">
      <rect className="region" x="6" y="6" width="628" height="238" rx="10"/>
      <text className="lbl" x="20" y="28">Región us-east-1</text><text className="small" x="140" y="28">alcance regional</text>
      <rect className="vpc" x="24" y="42" width="592" height="186" rx="8"/>
      <text className="lbl" x="40" y="64">VPC dcl-dev-vpc</text><text className="mono" x="160" y="64">10.20.0.0/16 · 65 536 IPs</text>
      <rect className="az" x="44" y="80" width="264" height="132" rx="6"/>
      <text className="small" x="58" y="100">AZ A · us-east-1a (failure domain)</text>
      <rect className="sub" x="66" y="114" width="220" height="78" rx="6"/>
      <text className="lbl" x="82" y="140">dcl-dev-subnet-a</text><text className="mono" x="82" y="160">10.20.1.0/24 · 251 usables</text>
      <text className="small" x="82" y="178">vacía: sin instancias aún</text>
      <rect className="az" x="332" y="80" width="264" height="132" rx="6"/>
      <text className="small" x="346" y="100">AZ B · us-east-1b (failure domain)</text>
      <rect className="sub" x="354" y="114" width="220" height="78" rx="6"/>
      <text className="lbl" x="370" y="140">dcl-dev-subnet-b</text><text className="mono" x="370" y="160">10.20.2.0/24 · 251 usables</text>
      <text className="small" x="370" y="178">vacía: sin instancias aún</text>
      <rect className="hot" data-hot="l1-region" x="8" y="8" width="300" height="28" rx="6" tabIndex={0} role="button" aria-label="Ver la región en la consola"/>
      <rect className="hot" data-hot="l1-vpc" x="26" y="44" width="588" height="30" rx="6" tabIndex={0} role="button" aria-label="Ver la VPC en la consola"/>
      <rect className="hot" data-hot="l1-subnets" x="66" y="114" width="220" height="78" rx="6" tabIndex={0} role="button" aria-label="Ver la subnet A en la consola"/>
      <rect className="hot" data-hot="l1-subnets" x="354" y="114" width="220" height="78" rx="6" tabIndex={0} role="button" aria-label="Ver la subnet B en la consola"/>
    </svg>
  )
}
