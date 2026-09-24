// Generado desde guia-labs-01-04.html por scripts/extract-guia.mjs. Zonas clicables: rect.hot con data-hot = clave de lab.hot en el JSON.
export default function Lab02() {
  return (
    <svg viewBox="0 0 640 380" role="img" aria-label="Internet entra por el IGW al ALB, que reparte a un Target Group con dos instancias del ASG en dos AZ">
      <defs>
        <marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className="ah" d="M0,0L10,5L0,10z"/></marker>
      </defs>
      <text className="lbl" x="276" y="22">Internet / tu curl</text>
      <path className="flow" d="M320 30 V58" markerEnd="url(#a2)"/>
      <rect className="box" x="250" y="60" width="140" height="30" rx="6"/>
      <text className="lbl" x="262" y="80">IGW dcl-dev-igw-s02</text>
      <path className="flow" d="M320 90 V118" markerEnd="url(#a2)"/>
      <rect className="vpc" x="14" y="104" width="612" height="266" rx="8"/>
      <text className="small" x="26" y="122">VPC 10.20.0.0/16 · route table: 0.0.0.0/0 → IGW</text>
      <rect className="sec" x="180" y="128" width="280" height="54" rx="8"/>
      <text className="mono" x="186" y="142" style={{ fill: 'var(--sec)' }}>sg-alb: 80 desde 0.0.0.0/0</text>
      <rect className="cmp" x="200" y="146" width="240" height="30" rx="6"/>
      <text className="lbl" x="214" y="166">ALB dcl-dev-alb · listener :80</text>
      <path className="flow" d="M320 182 V204" markerEnd="url(#a2)"/>
      <rect className="box" x="210" y="206" width="220" height="26" rx="6"/>
      <text className="lbl" x="222" y="224">Target Group · health GET / → 200</text>
      <path className="flow" d="M280 232 L170 276" markerEnd="url(#a2)"/>
      <path className="flow" d="M360 232 L470 276" markerEnd="url(#a2)"/>
      <rect className="region" x="40" y="250" width="560" height="110" rx="8" style={{ stroke: 'var(--cmp)' }}/>
      <text className="mono" x="50" y="266" style={{ fill: 'var(--cmp)' }}>ASG dcl-dev-asg-web · min 2 / desired 2 / max 4</text>
      <rect className="sub" x="60" y="276" width="240" height="74" rx="6"/>
      <text className="small" x="72" y="292">subnet-a · us-east-1a</text>
      <rect className="cmp" x="84" y="300" width="190" height="40" rx="6"/>
      <text className="lbl" x="96" y="318">EC2 t3.micro (httpd)</text><text className="mono" x="96" y="333">sg-app: 80 solo desde sg-alb</text>
      <rect className="sub" x="340" y="276" width="240" height="74" rx="6"/>
      <text className="small" x="352" y="292">subnet-b · us-east-1b</text>
      <rect className="cmp" x="364" y="300" width="190" height="40" rx="6"/>
      <text className="lbl" x="376" y="318">EC2 t3.micro (httpd)</text><text className="mono" x="376" y="333">nace del Launch Template</text>
      <rect className="hot" data-hot="l2-igw" x="250" y="60" width="140" height="30" rx="6" tabIndex={0} role="button" aria-label="Internet gateway en la consola"/>
      <rect className="hot" data-hot="l2-sgalb" x="180" y="128" width="280" height="16" rx="6" tabIndex={0} role="button" aria-label="SG del ALB en la consola"/>
      <rect className="hot" data-hot="l2-alb" x="200" y="146" width="240" height="30" rx="6" tabIndex={0} role="button" aria-label="ALB en la consola"/>
      <rect className="hot" data-hot="l2-tg" x="210" y="206" width="220" height="26" rx="6" tabIndex={0} role="button" aria-label="Target Group en la consola"/>
      <rect className="hot" data-hot="l2-asg" x="40" y="250" width="560" height="22" rx="6" tabIndex={0} role="button" aria-label="Auto Scaling Group en la consola"/>
      <rect className="hot" data-hot="l2-ec2" x="84" y="300" width="190" height="40" rx="6" tabIndex={0} role="button" aria-label="Instancias en la consola"/>
      <rect className="hot" data-hot="l2-ec2" x="364" y="300" width="190" height="40" rx="6" tabIndex={0} role="button" aria-label="Instancias en la consola"/>
    </svg>
  )
}
