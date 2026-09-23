Laboratorio evolutivo 04
Networking y conectividad de Digital Café Luna en AWS
Cloud Computing Posgrado · Semana 4 · Cuenta AWS estándar

Duración

Modalidad

Entorno

Carácter

65 min de lab + 25 min
checkpoint

Equipos de 4

Cuenta AWS estándar

Formativo + evidencia
evaluable

1. Propósito y resultado
Demostrar  que  reachability  no  depende  de una sola configuración: el tráfico debe tener un destino válido, una ruta
aplicable, controles que lo permitan y un servicio que esté escuchando. El laboratorio usa un flujo privado entre dos
subnets para practicar troubleshooting basado en evidencia.

Al finalizar, el equipo habrá convertido temporalmente la Subnet A en pública, habrá accedido a EC2 A mediante EC2
Instance Connect y habrá probado un servicio HTTP en EC2 B usando únicamente su private IP. Después retirará y
restaurará una regla de Security Group para observar dónde se rompe y cómo vuelve el camino.

Objetivos de aprendizaje
●  Explicar por qué una subnet se considera pública cuando su route table tiene una ruta directa al Internet

Gateway.

●  Reconocer que la comunicación A → B permanece dentro del CIDR de la VPC y usa la ruta local.
●  Distinguir direccionamiento, routing, Security Group y servicio destino durante un fallo de reachability.
●  Modificar un control de red de forma deliberada, observar el síntoma y restaurar el estado esperado.
●  Comparar Security Groups stateful con NACL stateless sin convertir NACL en el camino crítico del lab.

Alcance de esta iteración
S04  profundiza  únicamente  lo  necesario  para  razonar  el  camino  del  tráfico.  No  se crea NAT Gateway. IAM, roles,
encryption  y  secrets  quedan  para  S05;  observabilidad  para  S06;  VPN,  Direct Connect, Transit Gateway y BGP se
mantienen conceptuales. Las NACL se revisan como capa de subnet y el challenge práctico es opcional.

Ruta de la sesión

Tiempo

0–10 min

10–20 min

20–32 min

32–50 min

50–55 min

55–80 min

80–90 min

Bloque

Recap + preflight

IGW + route table + SG

Salida

Baseline limpio y camino esperado
identificado

Subnet A pública temporal; controles
mínimos

EC2 A + EC2 B

Dos endpoints en AZ distintas

Prueba principal + fallo controlado

PASS → FAIL → PASS con evidencia

Troubleshooting + NACL conceptual

Causalidad explicada

Checkpoint Lab 1

Cleanup + cierre

Evidencias + defensa aleatoria

Solo baseline S01 permanece

Cloud Computing Posgrado · Semana 4 · Lab Evolutivo 04

Arquitectura objetivo

Figura 1. El acceso externo termina en EC2 A; la prueba central A → B usa private IP y la ruta local de la VPC.

La  Subnet  A  recibe  una  route  table  propia  con  0.0.0.0/0  →  IGW  y  EC2  A  obtiene  public  IPv4  para  EC2 Instance
Connect.  La  Subnet  B  conserva  únicamente  la  ruta  local  de  la  VPC  y EC2 B no recibe public IPv4. El servicio de
prueba  escucha  en  TCP 8080 sobre EC2 B; su Security Group acepta ese puerto solo desde el Security Group de
EC2 A.

2. Estándar del laboratorio

Región y baseline

Recurso

Región

VPC

Subnet A

Subnet B

Distribución

Nomenclatura S04

Recurso

Internet Gateway

Route table Subnet A

Security Group EC2 A

Security Group EC2 B

EC2 A

EC2 B

NACL opcional

Nombre / valor

us-east-1

dcl-dev-vpc · 10.20.0.0/16

dcl-dev-subnet-a · 10.20.1.0/24

dcl-dev-subnet-b · 10.20.2.0/24

Dos Availability Zones distintas

Nombre

dcl-dev-igw-s04

dcl-dev-rt-public-a-s04

dcl-dev-sg-a-s04

dcl-dev-sg-b-s04

dcl-dev-ec2-a-s04

dcl-dev-ec2-b-s04

dcl-dev-nacl-b-s04

Cloud Computing Posgrado · Semana 4 · Lab Evolutivo 04

Apliquen
dcl:owner-team=team-XX y dcl:managed-by=console. El Name tag depende de cada recurso.

las  etiquetas  del  proyecto  cuando  corresponda:  dcl:project=digital-cafe-luna,  dcl:environment=dev,

3. Preflight técnico
Qué hacemos: confirmar el baseline S01, verificar que S02/S03 quedaron limpios y dibujar el camino esperado antes
de crear recursos.

Por qué: si existe una ruta, IGW o instancia residual, el comportamiento observado puede no corresponder al diseño
S04 y el troubleshooting pierde valor.

Inicien sesión en la cuenta AWS y seleccionen us-east-1.

1.
2.  Confirmen dcl-dev-vpc y las dos subnets con sus CIDR exactos y AZ distintas.
3.  Verifiquen que dcl-dev-subnet-b no tenga una asociación explícita con una route table que contenga 0.0.0.0/0 →

IGW. Si existe, completen primero el cleanup pendiente.

4.  Confirmen que no existan EC2, EFS, ALB, ASG, IGW, route tables o Security Groups temporales de S02/S03 que

condicionen la prueba.

5.  Verifiquen permisos normales para VPC, route tables, Internet Gateway, Security Groups, EC2 y EC2 Instance

Connect. No creen access keys como workaround.

6.  Antes de tocar la consola, completen mentalmente el camino: A → private IP de B → ruta local → SG de B →

TCP 8080 → servicio.

Validación:  el  baseline  coincide  con  S01;  Subnet  B  está  aislada  de  Internet  por  routing;  no  hay  dependencias
temporales heredadas; el equipo puede explicar el camino esperado antes de implementarlo.

4. Preparar el camino mínimo

Paso 1 — Hacer pública temporalmente la Subnet A
Qué hacemos: crear el único camino hacia Internet que necesita S04.

Por  qué:  EC2  Instance  Connect  desde  la  consola  requiere  que  EC2  A  tenga  una  dirección  pública  y esté en una
subnet con ruta hacia Internet. Subnet B no necesita ni debe recibir esa ruta.

7.  Creen dcl-dev-igw-s04 y adjúntenlo a dcl-dev-vpc.
8.  Creen dcl-dev-rt-public-a-s04 para dcl-dev-vpc.
9.  Agreguen 0.0.0.0/0 → dcl-dev-igw-s04.
10.  Asocien explícitamente dcl-dev-subnet-a a esta route table. No asocien dcl-dev-subnet-b.
11.  Verifiquen que ambas route tables conservan 10.20.0.0/16 → local.
Validación: Subnet A usa una route table con local + 0.0.0.0/0 → IGW; Subnet B usa una tabla sin ruta directa a IGW.
El tráfico 10.20.0.0/16 sigue resolviéndose por la ruta local.

Paso 2 — Crear Security Groups mínimos
Qué hacemos: separar el acceso administrativo a EC2 A del flujo de aplicación A → B.

Por qué: un Security Group debe expresar la intención del flujo, no abrir puertos indiscriminadamente.

Security Group

Inbound

dcl-dev-sg-a-s04

SSH TCP 22 desde
com.amazonaws.us-east-1.ec2-instance-c
onnect

Outbound

Default

dcl-dev-sg-b-s04

Custom TCP 8080 desde dcl-dev-sg-a-s04  Default

Validación: B no permite TCP 8080 desde 0.0.0.0/0 ni desde todo el VPC; la fuente es el Security Group de A. No se
requiere regla SSH en B.

Paso 3 — Lanzar EC2 A y EC2 B
Qué hacemos: crear dos instancias pequeñas con roles de red distintos.

Por qué: A es el punto de acceso del estudiante; B representa un servicio alcanzable solo por private IP dentro de la
VPC.

Cloud Computing Posgrado · Semana 4 · Lab Evolutivo 04

12.  AMI: Amazon Linux 2023 estándar; instance type: t3.micro o el tipo pequeño equivalente autorizado por el curso.

Mantengan el root volume mínimo y Delete on termination = Yes.

13.  EC2 A: dcl-dev-subnet-a, Auto-assign public IP = Enable, Security Group = dcl-dev-sg-a-s04, sin key pair.

Nombre: dcl-dev-ec2-a-s04.

14.  EC2 B: dcl-dev-subnet-b, Auto-assign public IP = Disable, Security Group = dcl-dev-sg-b-s04, sin key pair.

Nombre: dcl-dev-ec2-b-s04.

15.  En EC2 B, peguen el user data siguiente para levantar un servicio HTTP local sin instalar paquetes desde

Internet.

#!/bin/bash
set -eux
mkdir -p /opt/dcl
PRIVATE_IP=$(hostname -I | awk '{print $1}')
HOST=$(hostname)
printf 'Digital Cafe Luna | host=%s | private=%s
' "$HOST" "$PRIVATE_IP" > /opt/dcl/index.html
cat > /etc/systemd/system/dcl-http.service <<'EOF'
[Unit]
After=network-online.target
[Service]
WorkingDirectory=/opt/dcl
ExecStart=/usr/bin/python3 -m http.server 8080 --bind 0.0.0.0
Restart=always
[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now dcl-http

Validación: A tiene public IPv4; B no tiene public IPv4; ambas tienen private IPv4 dentro de sus subnets; B pasa los
status checks y su user data no depende de Internet.

5. Prueba principal — A → private IP de B

Paso 4 — Entrar a EC2 A con EC2 Instance Connect
Qué hacemos: abrir una terminal en EC2 A desde la consola de EC2.

Por qué: el acceso administrativo llega únicamente a A. Desde allí observaremos el flujo privado hacia B sin exponer
B a Internet.

16.  En EC2, seleccionen dcl-dev-ec2-a-s04 > Connect > EC2 Instance Connect.
17.  Conecten usando el public IPv4 de A. Amazon Linux 2023 estándar incluye EC2 Instance Connect; no se

requiere key pair.

18.  Registren la private IPv4 de EC2 B en una variable.

export B_IP="10.20.2.X"
echo "Destino de prueba: ${B_IP}:8080"

Validación:  la  terminal  de  A  está  disponible  y  B_IP  coincide  con la private IPv4 de EC2 B. La ruta 10.20.0.0/16 →
local  se  verifica  en  las  route  tables  de  la  VPC;  la  tabla  de  rutas  del  sistema  operativo  invitado  no  sustituye  esa
evidencia.

Paso 5 — Estado esperado: SG permite
Qué hacemos: abrir una nueva conexión HTTP desde A hacia TCP 8080 de B.

Por  qué:  una  respuesta  válida  demuestra  simultáneamente  direccionamiento  correcto,  ruta  local  aplicable,  control
permitido y servicio destino escuchando.

curl -sS --connect-timeout 3 "http://${B_IP}:8080/"

Validación:  la  respuesta  contiene  Digital  Cafe  Luna,  el  hostname  de  B  y  su private IP. Registren esta salida como
PASS 1.

Cloud Computing Posgrado · Semana 4 · Lab Evolutivo 04

Paso 6 — Fallo controlado: retirar la regla
Qué  hacemos:  eliminar  temporalmente  de  dcl-dev-sg-b-s04  la  regla  inbound  TCP  8080  cuyo  source  es
dcl-dev-sg-a-s04.

Por qué: cambiamos una sola variable del camino. La ruta local, las IP y el servicio permanecen iguales; por diseño,
el síntoma debe apuntar al control.

curl -sS --connect-timeout 3 "http://${B_IP}:8080/" || echo "FAIL esperado: TCP 8080 no permitido"

Validación: una conexión nueva termina en timeout, síntoma esperado cuando el Security Group descarta el tráfico.
Si  aparece  Connection  refused,  traten  ese  resultado  como  un  síntoma  distinto:  el  destino  fue  alcanzable,  pero  el
servicio no aceptó la conexión. Registren el timeout como FAIL controlado. No cambien routing ni reinicien instancias
para resolverlo.

Paso 7 — Restaurar la regla
Qué hacemos: volver a crear inbound TCP 8080 en dcl-dev-sg-b-s04 con source dcl-dev-sg-a-s04.

Por qué: restaurar exactamente la variable retirada debe recuperar el comportamiento sin tocar el resto del camino.

curl -sS --connect-timeout 3 "http://${B_IP}:8080/"

Validación: el mismo endpoint vuelve a responder. Registren esta salida como PASS 2.

OJO TÉCNICO: las reglas de Security Group se aplican a conexiones nuevas. Para la prueba usen solicitudes HTTP
independientes; no mantengan una conexión persistente abierta entre PASS, FAIL y PASS.

6. Troubleshooting basado en evidencia
Ante  un  fallo  real,  no  empiecen  cambiando  configuraciones  al  azar.  Reconstruyan  el  camino  y  busquen  el  primer
punto que no coincide con la intención.

Pregunta

Evidencia útil

Lectura

¿El destino es el correcto?

Private IP de B + CIDR 10.20.2.0/24

Direccionamiento

¿Existe una ruta aplicable?

Route table de A y B; 10.20.0.0/16 → local  Routing

¿El control permite el flujo?

SG de B: TCP 8080 desde SG de A

Control stateful

¿El servicio responde?

PASS previo / status checks / user data

Servicio destino

¿El problema es Internet?

La prueba usa private IP dentro de
10.20.0.0/16

No: IGW no está en este flujo

NACL — validación conceptual
Una  NACL  opera  a  nivel  de  subnet,  puede  permitir  o negar reglas y es stateless: el retorno debe estar autorizado
explícitamente. Los Security Groups operan a nivel de interfaz/instancia y son stateful. En este lab el camino crítico
usa Security Groups para que la causa del fallo sea inequívoca.

Challenge opcional — solo si quedan ≥7 minutos: crear una NACL temporal asociada únicamente a Subnet B y
razonar las reglas mínimas para permitir TCP 8080 desde 10.20.1.0/24 y el retorno hacia puertos efímeros. No forma
parte del criterio de aceptación. Si afecta el tiempo del Checkpoint, no se ejecuta.

Evidencias mínimas de S04
●  Route table de Subnet A con local + 0.0.0.0/0 → IGW y evidencia de que Subnet B no tiene ruta directa a IGW.
●  EC2 A con public IPv4 y EC2 B sin public IPv4, ambas en sus subnets correspondientes.
●  Terminal de A con PASS 1 → FAIL controlado → PASS 2 hacia la misma private IP y puerto 8080.
●  Regla de dcl-dev-sg-b-s04 restaurada: TCP 8080 desde dcl-dev-sg-a-s04.
●  Explicación breve: dónde estaba el corte y qué evidencia descarta routing como causa del FAIL controlado.

Cloud Computing Posgrado · Semana 4 · Lab Evolutivo 04

7. Checkpoint coordinado
A  los  55  minutos  se  detiene  la  construcción.  El  equipo  pasa  al  Checkpoint  Lab  1  con  su  paquete  de  evidencias
S01–S04.  La  rúbrica,  el paquete mínimo y la defensa aleatoria están definidos en el artefacto Checkpoint Lab 1 —
Evidencias y defensa. El cleanup final de S04 se valida después de la defensa.

8. Costos, conservación y cleanup

Cost awareness

Recurso

Qué puede generar costo

Control

2 × EC2 pequeñas

Tiempo de cómputo

Crear solo durante el lab; terminar al
cerrar

Root EBS

Storage mientras exista el volumen

Volumen mínimo; Delete on termination

Public IPv4 de EC2 A

Cargo mientras esté asignada

Solo A; liberar al terminar

Data transfer

Puede aplicar según tráfico

IGW / route table / SG

Sin cargo horario directo por el recurso

Pruebas mínimas; sin descargas
innecesarias

Temporales; eliminar para restaurar
baseline

No  se  crea  NAT  Gateway.  El  objetivo  de  costos  es  simple:  usar  recursos  pequeños,  mantenerlos  solo  durante  la
sesión y no conservar infraestructura porque ya fue creada.

CONSERVAR COMO BASELINE
●  dcl-dev-vpc · 10.20.0.0/16.
●  dcl-dev-subnet-a · 10.20.1.0/24 y su Availability Zone.
●  dcl-dev-subnet-b · 10.20.2.0/24 y su Availability Zone.
●  Naming/tags del proyecto y evidencias/checkpoint del equipo.

ELIMINAR — cleanup obligatorio
19.  Terminen dcl-dev-ec2-a-s04 y dcl-dev-ec2-b-s04. Verifiquen que sus root volumes no queden huérfanos.
20.  Eliminen dcl-dev-sg-b-s04 y dcl-dev-sg-a-s04 cuando ya no tengan dependencias.
21.  Si ejecutaron el challenge, reasocien Subnet B a su NACL original y eliminen dcl-dev-nacl-b-s04.
22.  Desasocien dcl-dev-rt-public-a-s04 de Subnet A; Subnet A vuelve a la main route table.
23.  Eliminen dcl-dev-rt-public-a-s04.
24.  Desadjunte y eliminen dcl-dev-igw-s04.
25.  Eliminen cualquier recurso accidental o de troubleshooting que no pertenezca al baseline S01.
Validación de cleanup: no quedan EC2, public IPv4 asignadas por S04, route table S04, IGW S04, Security Groups
S04 ni NACL opcional. Permanecen únicamente VPC, dos subnets y el checkpoint.

9. Cierre técnico
●  Una subnet es pública por su routing hacia un Internet Gateway; una instancia además necesita direccionamiento

público y controles adecuados para ser alcanzable desde Internet.

●  La ruta local permite comunicación entre direcciones del CIDR de la VPC, incluso cuando una de las subnets no

tiene salida directa a Internet.

●  Reachability exige que ruta, direccionamiento, controles y servicio destino sean coherentes al mismo tiempo.
●  Troubleshooting útil cambia una variable a la vez y conserva evidencia del síntoma antes y después de la

corrección.

Fuentes oficiales
●  AWS — Enable internet access for a VPC using an internet gateway
●  AWS — Subnet route tables
●  AWS — Tutorial: EC2 Instance Connect
●  AWS — Security group rules and referencing

Cloud Computing Posgrado · Semana 4 · Lab Evolutivo 04

●  AWS — Compare Security Groups and network ACLs
●  AWS — Python in Amazon Linux 2023

Cloud Computing Posgrado · Semana 4 · Lab Evolutivo 04


