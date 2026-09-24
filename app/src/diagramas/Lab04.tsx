// Generado desde guia-labs-01-04.html por scripts/extract-guia.mjs. Zonas clicables: rect.hot con data-hot = clave de lab.hot en el JSON.
export default function Lab04() {
  return (
    <svg viewBox="0 0 640 360" role="img" aria-label="Instance Connect entra por el IGW a EC2 A en la subnet pública; A llama por IP privada al puerto 8080 de EC2 B en la subnet privada usando la ruta local">
      <defs>
        <marker id="a4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className="ah" d="M0,0L10,5L0,10z"/></marker>
      </defs>
      <text className="lbl" x="30" y="22">Tú (consola) → EC2 Instance Connect</text>
      <path className="flow" d="M150 30 V56" markerEnd="url(#a4)"/>
      <rect className="box" x="80" y="58" width="140" height="28" rx="6"/>
      <text className="lbl" x="92" y="77">IGW dcl-dev-igw-s04</text>
      <path className="flow" d="M150 86 V132" markerEnd="url(#a4)"/>
      <rect className="vpc" x="10" y="98" width="620" height="252" rx="8"/>
      <text className="lbl" x="24" y="120">VPC 10.20.0.0/16</text>
      <rect className="sub" x="26" y="130" width="280" height="206" rx="6"/>
      <text className="lbl" x="40" y="150">subnet-a · pública</text>
      <text className="mono" x="40" y="166">rt-public-a: local + 0.0.0.0/0 → IGW</text>
      <rect className="sec" x="44" y="180" width="244" height="92" rx="8"/>
      <text className="mono" x="52" y="196" style={{ fill: 'var(--sec)' }}>sg-a: 22 desde prefix list EIC</text>
      <rect className="cmp" x="60" y="204" width="212" height="58" rx="6"/>
      <text className="lbl" x="74" y="226">EC2 A (bastión de prueba)</text>
      <text className="mono" x="74" y="244">IP pública + 10.20.1.x</text>
      <text className="small" x="44" y="300">¿pública? sí: su route table</text>
      <text className="small" x="44" y="316">tiene ruta directa al IGW</text>
      <rect className="sub" x="334" y="130" width="280" height="206" rx="6"/>
      <text className="lbl" x="348" y="150">subnet-b · privada</text>
      <text className="mono" x="348" y="166">main RT: solo 10.20.0.0/16 → local</text>
      <rect className="sec" x="352" y="180" width="244" height="92" rx="8"/>
      <text className="mono" x="360" y="196" style={{ fill: 'var(--sec)' }}>sg-b: 8080 solo desde sg-a</text>
      <rect className="cmp" x="368" y="204" width="212" height="58" rx="6"/>
      <text className="lbl" x="382" y="226">EC2 B · python http :8080</text>
      <text className="mono" x="382" y="244">sin IP pública · 10.20.2.x</text>
      <text className="small" x="352" y="300">sin salida a Internet: el user</text>
      <text className="small" x="352" y="316">data no descarga nada</text>
      <path className="flow" d="M272 233 H366" markerEnd="url(#a4)"/>
      <text className="mono" x="282" y="226">curl B_IP:8080</text>
      <text className="small" x="282" y="252">ruta local</text>
    </svg>
  )
}
