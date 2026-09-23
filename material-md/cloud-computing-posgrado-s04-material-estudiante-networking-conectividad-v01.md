Computación en Nube · EAFIT · S04 · Lecturas complementarias · v01

Guía breve de lecturas — Semana 04
Networking y conectividad
Computación en Nube · EAFIT · 28 de septiembre de 2026

Objetivo.  Preparar  la  discusión  de  networking  siguiendo  el  camino  real  del  tráfico:  origen  /  destino → CIDR →
subnet  →  routing  →  control  →  reachability  →  troubleshooting  →  evidencia.  La  meta  no  es  memorizar
componentes de VPC, sino poder explicar qué condición habilita o bloquea una comunicación.
Carga  esperada:  20–24  minutos  para  las  tres  lecturas  prioritarias.  No  hay  entrega  independiente;  use  la
preparación  para  justificar  decisiones  y  diagnosticar  reachability  con  evidencia  en  la  discusión  y  en  el  Lab
Evolutivo 04.

PREGUNTAS ORIENTADORAS

• ¿Qué condiciones deben cumplirse para que un recurso dentro de una VPC pueda ser alcanzado desde

Internet?

• Si A no puede comunicarse con B, ¿qué evidencia revisarías para distinguir un problema de routing, Security

Group o servicio destino sin cambiar configuraciones al azar?

LECTURA PRIORITARIA 1
Amazon VPC — Route tables y selección de rutas
Qué leer: en “Route table concepts”, revise únicamente Destination, Target, Local route y Route table association.
En “Subnet route tables”, lea la introducción, “Routes” y “Subnet route table association”. Termine en “How route
priority works” leyendo solo “Longest prefix match”. Relacione cada destino con el siguiente salto que
seleccionaría la VPC.
Qué no leer: route propagation, Transit Gateway, VPC peering avanzado, BGP, prefix lists en detalle, gateway
route tables, middlebox routing ni escenarios híbridos complejos.
Para qué: entender que routing responde si existe un camino hacia el destino y cuál target se usa para continuar
ese camino. Una ruta válida no autoriza por sí misma el tráfico: reachability también depende de direccionamiento,
controles y del servicio que escucha en el destino.
Tiempo estimado: 7–8 minutos.
Abrir: VPC — Route table concepts · VPC — Subnet route tables · VPC — Longest prefix match

LECTURA PRIORITARIA 2
Amazon VPC — Internet Gateway y subnets públicas
Qué leer: en “Enable internet access for a VPC using an internet gateway”, revise “Internet gateway basics” y su
“Routing configuration”. Identifique qué implica una ruta 0.0.0.0/0 cuyo target es un Internet Gateway, por qué esa
asociación hace pública a la subnet y qué papel cumple una public IPv4 address para comunicación IPv4
desde/hacia Internet.
Qué no leer: NAT Gateway, egress-only Internet Gateway, IPv6 en profundidad, bastion patterns, diseño multi-tier
avanzado, Direct Connect/VPN ni configuración operativa paso a paso.
Para qué: poder explicar por qué una subnet es pública por su routing, sin confundirlo con que cualquier recurso
dentro  de  ella  sea  automáticamente  alcanzable.  Para  reachability  desde  Internet  deben  coincidir  camino,
direccionamiento público, controles de red y un servicio destino disponible.
Tiempo estimado: 6–8 minutos.
Abrir: VPC — Internet Gateway

LECTURA PRIORITARIA 3
Amazon VPC — Security Groups y Network ACLs
Qué leer: revise “Security group basics” para ubicar el control asociado al recurso; “Network ACL basics” para
ubicar el control asociado a la subnet; y, en “Infrastructure security in Amazon VPC”, únicamente “Compare

Computación en Nube · EAFIT · S04 · Lecturas complementarias · v01

security groups and network ACLs”. Concéntrese en ámbito, stateful vs stateless, allow-only frente a allow/deny y
tratamiento del tráfico de retorno.
Qué no leer: puertos efímeros en profundidad, reglas complejas y numeración avanzada de NACL, IAM, WAF,
Network Firewall, Flow Logs, Security Hub ni controles de seguridad de semanas posteriores.
Para  qué:  distinguir  controles  que  actúan  en  lugares  diferentes  del  camino.  Durante  troubleshooting,  esa
diferencia permite buscar evidencia en la capa correcta: una ruta puede existir y aun así el tráfico ser rechazado
por un control o llegar a un destino que no está escuchando.
Tiempo estimado: 7–8 minutos.
Abrir: VPC — Security groups · VPC — Network ACLs · VPC — SG vs NACL

CIERRE
Llegue  a  la  sesión  pudiendo  reconstruir  una  comunicación  de  extremo  a  extremo:  identifique  origen  y  destino,
verifique el CIDR y la subnet, determine qué ruta gana por longest prefix match, ubique el siguiente salto, revise
qué controles aplican y concluya qué evidencia confirmaría o descartaría cada hipótesis de fallo.
Transición hacia S05: La red determina si el tráfico puede llegar. Eso todavía no responde quién está autorizado a
hacer qué cuando llega.
Frontera de esta semana. No avance hacia IAM, roles, encryption, secrets o governance; logs, metrics y alarms;
NAT,  Transit  Gateway, BGP o conectividad híbrida profunda. VPN y Direct Connect quedan solo como contexto,
no como lectura requerida.


