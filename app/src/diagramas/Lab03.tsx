// Generado desde guia-labs-01-04.html por scripts/extract-guia.mjs. Zonas clicables: rect.hot con data-hot = clave de lab.hot en el JSON.
export default function Lab03() {
  return (
    <svg viewBox="0 0 640 400" role="img" aria-label="Dos EC2 en AZ distintas montan el mismo EFS por NFS a través de un mount target por AZ; aparte, un bucket S3 con versiones">
      <defs>
        <marker id="a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className="ahd" d="M0,0L10,5L0,10z"/></marker>
        <marker id="a3b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className="ah" d="M0,0L10,5L0,10z"/></marker>
      </defs>
      <rect className="vpc" x="10" y="10" width="420" height="380" rx="8"/>
      <text className="lbl" x="24" y="32">VPC dcl-dev-vpc</text><text className="small" x="140" y="32">IGW + RT s03 temporales (Instance Connect, dnf)</text>
      <rect className="sub" x="26" y="46" width="186" height="190" rx="6"/>
      <text className="small" x="38" y="64">subnet-a · 1a</text>
      <rect className="cmp" x="42" y="74" width="154" height="54" rx="6"/>
      <text className="lbl" x="54" y="96">client-a</text><text className="mono" x="54" y="114">escribe writer=…</text>
      <path className="flowd" d="M119 128 V168" markerEnd="url(#a3)"/>
      <text className="mono" x="126" y="152" style={{ fill: 'var(--dat)' }}>NFS 2049</text>
      <rect className="dat" x="42" y="170" width="154" height="50" rx="6"/>
      <text className="lbl" x="54" y="192">mount target A</text><text className="mono" x="54" y="208">IP privada 10.20.1.x</text>
      <rect className="sub" x="228" y="46" width="186" height="190" rx="6"/>
      <text className="small" x="240" y="64">subnet-b · 1b</text>
      <rect className="cmp" x="244" y="74" width="154" height="54" rx="6"/>
      <text className="lbl" x="256" y="96">client-b</text><text className="mono" x="256" y="114">lee y agrega reader=…</text>
      <path className="flowd" d="M321 128 V168" markerEnd="url(#a3)"/>
      <text className="mono" x="328" y="152" style={{ fill: 'var(--dat)' }}>NFS 2049</text>
      <rect className="dat" x="244" y="170" width="154" height="50" rx="6"/>
      <text className="lbl" x="256" y="192">mount target B</text><text className="mono" x="256" y="208">IP privada 10.20.2.x</text>
      <path className="flowd" d="M119 220 V282" markerEnd="url(#a3)"/>
      <path className="flowd" d="M321 220 V282" markerEnd="url(#a3)"/>
      <rect className="dat" x="42" y="284" width="356" height="86" rx="8"/>
      <text className="lbl" x="58" y="308">EFS dcl-dev-efs-shared (Regional)</text>
      <text className="mono" x="58" y="328">/estado-compartido.txt</text>
      <text className="small" x="58" y="348">un solo namespace: A y B ven el mismo archivo</text>
      <text className="small" x="58" y="362">sg-efs: 2049 solo desde sg-ec2</text>
      <rect className="dat" x="450" y="60" width="180" height="250" rx="8"/>
      <text className="lbl" x="464" y="84">S3 bucket</text><text className="small" x="464" y="100">fuera de la VPC, API HTTPS</text>
      <text className="mono" x="464" y="126">key: estado.txt</text>
      <rect className="box" x="470" y="138" width="140" height="40" rx="5" style={{ stroke: 'var(--done)' }}/>
      <text className="small" x="480" y="155" style={{ fill: 'var(--done)' }}>v2 IsLatest=true</text><text className="mono" x="480" y="170">PROCESADO</text>
      <rect className="box" x="470" y="186" width="140" height="40" rx="5"/>
      <text className="small" x="480" y="203">v1 noncurrent</text><text className="mono" x="480" y="218">CREADO</text>
      <text className="small" x="464" y="252">Lifecycle: borra noncurrent</text>
      <text className="small" x="464" y="268">a los 7 días</text>
      <text className="lbl" x="486" y="352">CloudShell</text>
      <path className="flow" d="M540 336 V314" markerEnd="url(#a3b)"/>
      <rect className="hot" data-hot="l3-vpc" x="12" y="12" width="416" height="28" rx="6" tabIndex={0} role="button" aria-label="VPC y rutas en la consola"/>
      <rect className="hot" data-hot="l3-ca" x="42" y="74" width="154" height="54" rx="6" tabIndex={0} role="button" aria-label="Terminal de client-a"/>
      <rect className="hot" data-hot="l3-cb" x="244" y="74" width="154" height="54" rx="6" tabIndex={0} role="button" aria-label="Terminal de client-b"/>
      <rect className="hot" data-hot="l3-mt" x="42" y="170" width="154" height="50" rx="6" tabIndex={0} role="button" aria-label="Mount target A en la consola"/>
      <rect className="hot" data-hot="l3-mt" x="244" y="170" width="154" height="50" rx="6" tabIndex={0} role="button" aria-label="Mount target B en la consola"/>
      <rect className="hot" data-hot="l3-efs" x="42" y="284" width="356" height="86" rx="6" tabIndex={0} role="button" aria-label="EFS en la consola"/>
      <rect className="hot" data-hot="l3-s3" x="450" y="60" width="180" height="172" rx="6" tabIndex={0} role="button" aria-label="Versiones del bucket en la consola"/>
      <rect className="hot" data-hot="l3-lc" x="450" y="236" width="180" height="74" rx="6" tabIndex={0} role="button" aria-label="Lifecycle del bucket en la consola"/>
    </svg>
  )
}
