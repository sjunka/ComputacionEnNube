Laboratorio evolutivo 02
Resiliencia y escalabilidad de Digital Café Luna en AWS
Cloud Computing Posgrado · Semana 2 · Cuenta AWS estándar

Duración

90 minutos

Modalidad

Equipos de 4

Entorno

Carácter

Cuenta AWS estándar

Formativo; con evidencia

1. Propósito y resultado
Demostrar  comportamiento  observable  ante  distribución  y  fallo  de  cómputo,  separando  con  precisión  las
responsabilidades de health, balanceo y recuperación de capacidad.

Al  finalizar, el equipo tendrá un Application Load Balancer conectado a un Target Group y a un Auto Scaling Group
distribuido  en  dos  Availability  Zones.  Observará  cómo  el  tráfico  deja  de  ir  a  un  target  no  elegible  y  cómo el ASG
recupera desired capacity después de terminar deliberadamente una instancia.

Objetivos de aprendizaje
●  Explicar qué observa un health check y por qué un target saludable no equivale a una instancia inmune a fallos.
●  Demostrar que el ALB distribuye solicitudes únicamente hacia targets elegibles.
●  Relacionar min, desired y max capacity con el comportamiento real del Auto Scaling Group.
●  Observar una recuperación de capacidad sin atribuirla incorrectamente al health check del ALB.
●  Registrar evidencia técnica suficiente para reconstruir la secuencia de fallo y recuperación.

Alcance de esta iteración
Incorporamos la conectividad mínima para exponer un ALB, dos instancias reproducibles y un ASG. La configuración
de Internet Gateway, ruta y security groups se trata como prerrequisito operativo, no como clase de networking. No
usaremos NAT Gateway, NACL avanzadas, scaling policies, observabilidad profunda, persistencia ni IaC.

Ruta de trabajo

Tiempo

0–10 min

10–25 min

25–45 min

45–60 min

60–70 min

70–82 min

82–90 min

Bloque

Salida

Preflight + baseline S01

VPC y subnets verificadas

Conectividad mínima + SG

ALB y targets con flujo posible

Launch Template + Target Group

Cómputo reproducible y health definido

ALB + Auto Scaling Group

2 instancias distribuidas

Prueba A: distribución

Prueba B: terminación

Dos targets observados

Reemplazo y recuperación observados

Evidencia + cleanup + checkpoint

Baseline S01 restaurado

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

Arquitectura objetivo

Figura 1. S02 agrega balanceo y recuperación de cómputo sobre el baseline de S01.

La  VPC  y  las  dos  subnets  se  heredan  de  S01.  Para  este  lab  ambas  subnets  reciben  temporalmente  una  ruta
0.0.0.0/0 hacia un Internet Gateway: el ALB será internet-facing y las instancias necesitan salida breve a Internet para
instalar  el  servidor  HTTP  desde  user  data.  Las  instancias  tendrán  public  IPv4  temporal,  pero  el  puerto  80  solo
aceptará tráfico desde el security group del ALB.

2. Estándar del laboratorio

Región y baseline
Trabajen  en  us-east-1  (N.  Virginia)  para  mantener  consistencia  entre  equipos.  Antes  de  crear  recursos, validen el
baseline exacto de S01 y no lo dupliquen.

Recurso

VPC

Subnet A

Subnet B

Distribución

Nomenclatura S02

Recurso

Internet Gateway

Route table temporal

Security group ALB

Security group aplicación

Launch Template

Target Group

Application Load Balancer

Nombre / valor

dcl-dev-vpc · 10.20.0.0/16

dcl-dev-subnet-a · 10.20.1.0/24

dcl-dev-subnet-b · 10.20.2.0/24

Dos Availability Zones distintas

Nombre

dcl-dev-igw-s02

dcl-dev-rt-s02-public

dcl-dev-sg-alb

dcl-dev-sg-app

dcl-dev-lt-web

dcl-dev-tg-web

dcl-dev-alb

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

Auto Scaling Group

dcl-dev-asg-web

Etiquetas
Apliquen  dcl:project=digital-cafe-luna,  dcl:environment=dev,  dcl:owner-team=team-XX  y  dcl:managed-by=console
donde  el  servicio  permita  etiquetar  el  recurso.  El  Name  tag  debe  corresponder  al  recurso,  no  reutilizarse  entre
componentes.

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

3. Preflight técnico
Qué hacemos: Confirmar cuenta, Región, baseline y permisos normales de la cuenta.

Por qué: El lab necesita crear recursos EC2, Elastic Load Balancing, Auto Scaling y VPC. En cuentas AWS estándar
no existe un gate específico de Academy, pero la identidad usada debe tener permisos suficientes.

Inicien sesión en la cuenta AWS y seleccionen us-east-1.

1.
2.  En VPC, confirmen dcl-dev-vpc y las dos subnets heredadas con sus CIDR exactos y AZ distintas.
3.  Verifiquen  que  no  exista  ya  un  stack  S02  activo  con  los mismos nombres. Reutilicen solo si coincide con esta

guía y está en estado esperado.

4.  Si  una  política  IAM  de  la  cuenta  bloquea  una  operación,  registren  el  error  y  escálenlo  al  administrador  de  la

cuenta. No creen access keys como workaround.

Validación: La Región es us-east-1; VPC y subnets coinciden con S01; la identidad puede abrir EC2, Load Balancers,
Target Groups y Auto Scaling Groups.

Paso 1 — Preparar conectividad mínima
Qué  hacemos:  Crear  un  Internet  Gateway  y  una  route  table  temporal  para  que  el  ALB  sea  internet-facing  y  las
instancias puedan instalar el servidor HTTP.

Por  qué:  AWS  requiere un Internet Gateway para seleccionar una VPC en un ALB internet-facing. Además, el user
data necesita salida a Internet para instalar httpd. No usaremos NAT Gateway.

5.  En VPC > Internet gateways, creen dcl-dev-igw-s02 y adjúntenlo a dcl-dev-vpc.
6.  En Route tables, creen dcl-dev-rt-s02-public para dcl-dev-vpc.
7.  Agreguen la ruta 0.0.0.0/0 con destino dcl-dev-igw-s02.
8.  Asocien explícitamente dcl-dev-subnet-a y dcl-dev-subnet-b a esta route table.
9.  No cambien el atributo general de auto-assign public IPv4 de las subnets; el Launch Template lo resolverá para

sus instancias.

Validación: Ambas subnets muestran asociación con dcl-dev-rt-s02-public y la tabla contiene la ruta local 10.20.0.0/16
más 0.0.0.0/0 → Internet Gateway.

Paso 2 — Crear security groups mínimos
Qué hacemos: Separar el acceso al ALB del acceso a las instancias.

Por qué: El ALB debe recibir HTTP desde Internet, pero las instancias no deben aceptar HTTP directamente desde
Internet.

Security group

dcl-dev-sg-alb

dcl-dev-sg-app

Inbound

TCP 80 desde 0.0.0.0/0

TCP 80 desde dcl-dev-sg-alb

Outbound

Default

Default

Validación: No existe regla SSH requerida. El SG de aplicación referencia al SG del ALB como origen del puerto 80.

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

4. Cómputo reproducible y health

Paso 3 — Crear el Launch Template
Qué hacemos: Definir cómo debe nacer cada instancia del ASG.

Por  qué:  La  recuperación  solo  es  útil  si  el  reemplazo  puede  reconstruirse  de  forma  consistente  sin  configuración
manual.

10.  En EC2 > Launch Templates, creen dcl-dev-lt-web.
11.  AMI: Amazon Linux 2023, arquitectura x86_64, desde Quick Start.
12.  Instance type: t3.micro. No configuren key pair ni acceso SSH para este lab.
13.  Network interface: no fijen una subnet; habiliten Auto-assign public IP y asignen dcl-dev-sg-app.
14.  Conserven el volumen root mínimo de la AMI y confirmen Delete on termination = Yes.
15.  En User data, peguen el script siguiente.

#!/bin/bash
set -euxo pipefail
dnf install -y httpd

TOKEN=$(curl -sS -X PUT \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" \
  http://169.254.169.254/latest/api/token)

INSTANCE_ID=$(curl -sS \
  -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/instance-id)

AZ=$(curl -sS \
  -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/placement/availability-zone)

echo "Digital Café Luna | instance=${INSTANCE_ID} | az=${AZ}" \
  > /var/www/html/index.html

systemctl enable --now httpd

Validación: El Launch Template existe, no fija subnet, asigna public IPv4 temporal, usa dcl-dev-sg-app y contiene user
data reproducible.

Paso 4 — Crear el Target Group y health check
Qué  hacemos:  Definir  el  conjunto  de  destinos  al  que  el  ALB  puede  enviar  tráfico  y  cómo  decide  si  un  target  es
elegible.

Por qué: El health check del Target Group responde a una pregunta concreta: ¿este target puede atender HTTP en
este momento?

16.  En EC2 > Target Groups, creen dcl-dev-tg-web.
17.  Target type = Instances; Protocol = HTTP; Port = 80; VPC = dcl-dev-vpc.
18.  Health check: HTTP, path /, success code 200. Para agilizar el lab pueden usar interval = 10 s y healthy threshold

= 2.

19.  No registren instancias manualmente; el Auto Scaling Group las registrará después.
Validación: El Target Group existe y no contiene targets todavía.

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

5. Balanceo y Auto Scaling

Paso 5 — Crear el Application Load Balancer
Qué hacemos: Exponer un único endpoint y distribuir tráfico hacia el Target Group.

Por  qué:  El  cliente no necesita conocer las instancias. El ALB selecciona targets elegibles y deja de enviar nuevas
solicitudes a targets que ya no lo sean.

20.  En EC2 > Load Balancers, creen un Application Load Balancer llamado dcl-dev-alb.
21.  Scheme = Internet-facing; IP address type = IPv4; VPC = dcl-dev-vpc.
22.  Seleccionen dcl-dev-subnet-a y dcl-dev-subnet-b, cada una en su AZ.
23.  Security group = dcl-dev-sg-alb.
24.  Listener HTTP :80 → Forward to dcl-dev-tg-web.
25.  Esperen a que State = Active y copien el DNS name.
Validación: dcl-dev-alb está Active, habilitado en dos AZ y su listener HTTP reenvía a dcl-dev-tg-web.

Paso 6 — Crear el Auto Scaling Group
Qué  hacemos:  Mantener  dos  instancias  activas  a  partir  del  mismo  Launch  Template  y  distribuirlas  entre  las  dos
subnets.

Por  qué:  desired  capacity  expresa la capacidad que el grupo intentará mantener. min y max son límites; max=4 no
significa que el grupo escalará automáticamente hasta cuatro instancias.

26.  En EC2 > Auto Scaling Groups, creen dcl-dev-asg-web usando dcl-dev-lt-web.
27.  VPC = dcl-dev-vpc; subnets = dcl-dev-subnet-a y dcl-dev-subnet-b.
28.  Attach to an existing load balancer target group = dcl-dev-tg-web.
29.  Health check type: conserven EC2. No habiliten Elastic Load Balancing health checks en este lab.
30.  Group size: Desired capacity = 2; Min desired capacity = 2; Max desired capacity = 4.
31.  No  creen  scaling  policy.  El  objetivo  es  observar  recuperación  de  desired  capacity,  no  elasticidad  basada  en

demanda.

32.  Agreguen Name=dcl-dev-web y etiquetas del proyecto con propagación a instancias cuando aplique.
Validación: El ASG muestra min=2 / desired=2 / max=4; aparecen dos instancias InService; el Target Group termina
mostrando dos targets healthy.

OJO  TÉCNICO:  En  este  lab  el  Target  Group  usa  health  checks  para  decidir  si  el  ALB  debe  enviar  tráfico.  El  ASG
conserva el health check type EC2; por tanto, un fallo del health check del ALB no se usa como señal de reemplazo del
ASG. Esa separación es deliberada para observar la causalidad sin ambigüedad.

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

6. Prueba A — Distribución
Qué  hacemos:  Enviar  múltiples  solicitudes  al  endpoint  del  ALB  y  demostrar  que  las  respuestas  provienen  de  al
menos dos instancias.

Por  qué:  El  DNS  del  ALB  representa  un  punto  de  entrada  estable,  mientras  que  las  instancias  detrás  del  Target
Group son reemplazables.

33.  Confirmen en dcl-dev-tg-web que hay dos targets en estado healthy.
34.  Copien el DNS name de dcl-dev-alb.
35.  Desde un navegador, abran http://<ALB_DNS> para validar acceso básico.
36.  Para  obtener  evidencia  repetible,  ejecuten  varias  solicitudes  desde  un  terminal.  El  resultado  debe  contener al

menos dos instance IDs; la distribución exacta no tiene que ser 50/50.

ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names dcl-dev-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

for i in {1..20}; do
  curl -s "http://${ALB_DNS}"
  echo
done | sort | uniq -c

Validación:  La salida contiene respuestas de por lo menos dos instance IDs y, normalmente, de las dos AZ. Si solo
aparece un ID, confirmen primero que ambos targets estén healthy y repitan la muestra.

Verificación técnica opcional por AWS CLI

TG_ARN=$(aws elbv2 describe-target-groups \
  --names dcl-dev-tg-web \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

aws elbv2 describe-target-health \
  --target-group-arn "$TG_ARN" \
  --query 'TargetHealthDescriptions[].{Instance:Target.Id,State:TargetHealth.State}' \
  --output table

aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names dcl-dev-asg-web \
  --query 'AutoScalingGroups[0].{Min:MinSize,Desired:DesiredCapacity,Max:MaxSize,Instances:Instances[].InstanceId}' \
  --output json

Si no tienen AWS CLI local configurado, pueden usar CloudShell o realizar la validación equivalente en consola. No
creen access keys solo para ejecutar estos comandos.

Evidencia de la Prueba A
●  Captura del ALB Active con su DNS name.
●  Captura del Target Group con dos targets healthy.
●  Salida de solicitudes mostrando al menos dos instance IDs.
●  Captura del ASG con min=2 / desired=2 / max=4.

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

7. Prueba B — Terminación controlada
Qué hacemos: Terminar deliberadamente una instancia perteneciente al ASG y observar la recuperación.

Por  qué:  Queremos  separar  tres  comportamientos:  health  decide  elegibilidad,  ALB decide a dónde enviar tráfico y
ASG mantiene la capacidad deseada.

37.  En EC2 > Instances, identifiquen las dos instancias cuyo Auto Scaling group es dcl-dev-asg-web y registren sus

IDs.

38.  Seleccionen una de ellas y ejecuten Instance state > Terminate instance. No reduzcan desired capacity del ASG.
39.  Mantengan abiertas tres vistas: Target Group > Targets, Auto Scaling Group > Activity y EC2 > Instances.
40.  Continúen haciendo solicitudes al ALB mientras observan el cambio. El servicio debe seguir respondiendo desde

el target elegible restante.

41.  Observen  que  la  instancia  terminada  deja  de  ser  elegible  para  nuevas  solicitudes.  Puede  aparecer

temporalmente como draining/unused mientras se completa la desregistración.

42.  En Activity history, observen la actividad que lanza una instancia para recuperar la capacidad del grupo.
43.  Espere a que la nueva instancia pase por Pending → InService; después, en el Target Group, observe initial →

healthy.

44.  Repitan la Prueba A y verifiquen que el nuevo instance ID ya recibe tráfico.

Secuencia que debe poder explicarse

Evento observable

Se termina una instancia del ASG

Responsabilidad

Fallo inducido / EC2

El target deja de ser elegible para nuevas solicitudes

Health + Target Group

El ALB continúa con targets elegibles

Application Load Balancer

El ASG detecta una instancia no running y queda por debajo de
desired

Auto Scaling / EC2 health

El ASG lanza un reemplazo

Recuperación de desired capacity

La nueva instancia se registra y pasa health checks

ASG + Target Group

El ALB vuelve a enviar tráfico al nuevo target

Balanceo

El grupo vuelve a dos instancias

desired=2 recuperado

NO  afirmar:  “el  health  check  del ALB provocó el reemplazo”. En esta configuración los health checks de ELB no están
habilitados  como  health  source  del  ASG.  La instancia fue terminada; Auto Scaling detecta que ya no está running y la
reemplaza para mantener desired capacity.

Validación:  Existe  evidencia  de  la  instancia  terminada,  de  la  actividad  de reemplazo, de un nuevo instance ID, del
retorno a dos targets healthy y de solicitudes atendidas por el reemplazo.

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

8. Evidencias y criterios de aceptación
●  VPC dcl-dev-vpc y subnets dcl-dev-subnet-a / dcl-dev-subnet-b con sus CIDR heredados de S01.
●  ALB dcl-dev-alb en estado Active y endpoint accesible.
●  Target Group dcl-dev-tg-web con dos targets healthy antes de la prueba de fallo.
●  Prueba de distribución con respuestas de al menos dos instance IDs.
●  ASG dcl-dev-asg-web con min=2 / desired=2 / max=4 y sin scaling policy.
●
●  Activity history o vista equivalente que muestre el lanzamiento del reemplazo.
●  Nuevo instance ID registrado en el Target Group y posteriormente healthy.
●  Repetición de la prueba de distribución mostrando recuperación.
●  Explicación breve y correcta de qué hace health, qué hace ALB y qué hace ASG.

ID de la instancia terminada y evidencia de su cambio de estado.

Respuesta de cierre

Pregunta

¿Qué hace health?

¿Qué hace el ALB?

¿Qué hace el ASG?

¿Por qué max=4 no implica escalar automáticamente a 4?

Respuesta del equipo

Checkpoint hacia Semana 3
Conserven  las  evidencias  del  fallo  y  de  la  recuperación,  pero  restauren  la  infraestructura  al  baseline  de  S01.  La
siguiente semana cambia la pregunta arquitectónica:

“si  una  instancia  puede  desaparecer,  el  estado  que  necesitamos  conservar  no  puede  depender
únicamente de ella”

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

9. Costos, conservación y cleanup

Recursos con costo durante el lab

Recurso

Por qué puede generar costo

Control del lab

Application Load Balancer

Tiempo aprovisionado + capacidad
procesada (LCU)

Crear tarde y eliminar al terminar

EC2 del ASG

EBS root

Public IPv4

Data transfer

Tiempo de cómputo On-Demand

t3.micro; desired=2; cleanup inmediato

Almacenamiento mientras existe el
volumen

Volumen mínimo; Delete on termination

Direcciones públicas del ALB y de las
instancias

Uso temporal; se liberan al eliminar
recursos

Puede aplicar según patrón de tráfico

Solo tráfico mínimo de prueba

No  se  crea  NAT  Gateway.  Internet  Gateway,  route  table,  security  groups,  Target  Group,  Launch  Template  y  Auto
Scaling no se tratan como una razón para mantener infraestructura: son temporales en esta iteración aunque algunos
no tengan un cargo horario independiente.

CONSERVAR COMO BASELINE
●  VPC dcl-dev-vpc · 10.20.0.0/16.
●  dcl-dev-subnet-a · 10.20.1.0/24 y su Availability Zone.
●  dcl-dev-subnet-b · 10.20.2.0/24 y su Availability Zone.
●  Naming/tags del proyecto y evidencias/checkpoint del equipo.

ELIMINAR — cleanup obligatorio
45.  Escalen dcl-dev-asg-web a min=0 y desired=0; esperen a que las instancias terminen. Verifiquen que no queden

instancias del grupo ni volúmenes root huérfanos.

46.  Eliminen dcl-dev-asg-web.
47.  Eliminen dcl-dev-alb y esperen a que sus interfaces de red se liberen.
48.  Eliminen dcl-dev-tg-web.
49.  Eliminen dcl-dev-lt-web y sus versiones.
50.  Eliminen dcl-dev-sg-app y dcl-dev-sg-alb cuando ya no tengan dependencias.
51.  Desasocien dcl-dev-rt-s02-public de ambas subnets; las subnets volverán a usar la main route table de la VPC.
52.  Eliminen dcl-dev-rt-s02-public.
53.  Desadjunte y eliminen dcl-dev-igw-s02.
54.  Verifiquen que solo permanezcan los recursos declarados en CONSERVAR COMO BASELINE.
Validación de cleanup: No existen ALB, ASG, instancias S02, Target Group, Launch Template, security groups S02,
route table S02 ni Internet Gateway S02. Permanecen únicamente la VPC, las dos subnets y el checkpoint.

10. Cierre técnico
●  Health responde si un target es elegible para atender solicitudes; no es sinónimo de recuperación.
●  El ALB distribuye tráfico entre targets elegibles; no mantiene desired capacity.
●  El ASG intenta mantener desired capacity y reconstruye cómputo usando el Launch Template.
●  max=4  limita  el  tamaño  permitido,  pero  sin  una  scaling  policy no existe una decisión automática de crecer por

demanda.

Fuentes oficiales
●  AWS — Create an Application Load Balancer —

https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html

●  AWS — Health checks for instances in an Auto Scaling group —

https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html

●  AWS — Prepare to attach an Elastic Load Balancing load balancer —

https://docs.aws.amazon.com/autoscaling/ec2/userguide/getting-started-elastic-load-balancing.html

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02

●  AWS — Manual scaling for Amazon EC2 Auto Scaling —

https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scaling-manually.html
●  AWS — Elastic Load Balancing pricing — https://aws.amazon.com/elasticloadbalancing/pricing/
●  AWS — Amazon VPC pricing — https://aws.amazon.com/vpc/pricing/

Cloud Computing Posgrado · Semana 2 · Lab Evolutivo 02


