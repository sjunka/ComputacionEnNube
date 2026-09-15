Laboratorio evolutivo 01

Arquitectura base de Digital Café Luna en AWS

Cloud Computing Posgrado · Semana 1 · Cuenta AWS del estudiante/equipo
| Duración  | Modalidad  | Entorno  | Carácter  |
| --------- | ---------- | -------- | --------- |
90 minutos  Equipos de 4  Cuenta AWS normal  Formativo; con evidencia
1. Propósito y resultado
Materializar una base mínima de arquitectura en AWS y leerla correctamente antes de incorporar cómputo, balanceo
o controles de red más profundos.
Al finalizar, el equipo tendrá una VPC IPv4 con dos subnets ubicadas en Availability Zones distintas y un checkpoint
verificable para continuar el lab evolutivo.
Objetivos de aprendizaje
●  Distinguir el alcance de una Región, una VPC, una Availability Zone y una subnet.
●  Relacionar un bloque CIDR con la estructura mínima de direccionamiento del entorno.
●  Explicar por qué dos subnets en AZ distintas preparan una base para decisiones posteriores de resiliencia, sin
afirmar todavía alta disponibilidad de la aplicación.
●  Aplicar nomenclatura y etiquetas consistentes desde la primera iteración.
●  Validar técnicamente los recursos y dejar evidencia reutilizable.
Alcance de esta iteración
Creamos únicamente la base necesaria para entender Region → VPC → AZ → subnet. No configuraremos Internet
Gateway, rutas de Internet, NAT Gateway, security groups en profundidad, balanceadores, Auto Scaling ni
Infrastructure as Code. Networking profundo corresponde a la Semana 4.
Ruta de trabajo
| Tiempo     | Bloque                       |     | Salida                   |
| ---------- | ---------------------------- | --- | ------------------------ |
| 0–10 min   | Acceso, preflight y Región   |     | Región registrada        |
| 10–25 min  | VPC: crear o validar         |     | VPC disponible           |
| 25–50 min  | Dos subnets en AZ distintas  |     | Subnets disponibles      |
| 50–65 min  | Lectura de arquitectura      |     | Relación explicada       |
| 65–80 min  | Validación técnica           |     | Resultados verificables  |
80–90 min  Evidencia, cleanup y checkpoint  Baseline documentado

Cloud Computing Posgrado · Semana 1 · Lab Evolutivo 01

Arquitectura objetivo

Figura 1. Arquitectura mínima de Semana 1: una VPC regional y dos subnets, cada una en una AZ distinta.
La VPC usa 10.20.0.0/16. Las subnets usan 10.20.1.0/24 y 10.20.2.0/24. En esta semana no las clasificamos como
públicas o privadas: esa propiedad depende del enrutamiento y se trabajará más adelante.
2. Estándar del laboratorio
Región y nomenclatura
Trabajen en us-east-1 (N. Virginia) como Región por defecto del curso, salvo instrucción distinta. Verifiquen la Región
antes de crear recursos y no cambien de Región durante el lab.
Recurso  Nombre
VPC  dcl-dev-vpc
Subnet AZ A  dcl-dev-subnet-a
Subnet AZ B  dcl-dev-subnet-b
Etiquetas obligatorias
| Clave  | Valor de ejemplo  | Propósito  |
| ------ | ----------------- | ---------- |
VPC → dcl-dev-vpc · Subnet A →
| Name  |     | Identificación legible  |
| ----- | --- | ----------------------- |
dcl-dev-subnet-a · Subnet B →
dcl-dev-subnet-b
| dcl:project      | digital-cafe-luna  | Agrupar recursos del caso           |
| ---------------- | ------------------ | ----------------------------------- |
| dcl:environment  | dev                | Distinguir el ambiente              |
| dcl:owner-team   | team-01            | Identificar al equipo               |
| dcl:managed-by   | console            | Registrar el mecanismo de creación  |
Cloud Computing Posgrado · Semana 1 · Lab Evolutivo 01

3. Paso a paso en la consola
Regla de reejecución: antes de crear, busquen recursos del proyecto. Si un recurso ya existe con el nombre, CIDR y
ubicación correctos, no lo dupliquen; valídenlo y continúen.
Paso 0 — Acceder y verificar la cuenta
Qué hacemos: Acceder a la cuenta AWS, abrir la consola y confirmar la Región y los permisos básicos del lab.
Por qué: Los recursos regionales se administran por Región. Trabajar en una Región distinta puede hacer que un
recurso parezca inexistente o quede fuera del baseline del equipo.
1. Inicien sesión en la cuenta AWS asignada al estudiante/equipo y confirmen que la identidad utilizada puede
consultar y crear VPC y subnets.
2. Abran AWS Management Console y registren la Región visible en el selector superior.
3. Busquen VPC y abran el servicio. Confirmen que el selector de Región no cambió.
Validación: La consola de VPC muestra la Región acordada. Regístrenla en el checkpoint final.
Paso 1 — Crear o validar la VPC
Qué hacemos: Usar una VPC IPv4 con el bloque 10.20.0.0/16 y el nombre dcl-dev-vpc.
Por qué: La VPC establece el espacio de red aislado del caso y será el contenedor regional que reutilizaremos en las
siguientes iteraciones.
4. En VPC dashboard, revisen primero Your VPCs y busquen dcl-dev-vpc.
5. Si existe y su IPv4 CIDR es 10.20.0.0/16, validen State = Available y continúen sin crear otra VPC.
6. Si no existe, elijan Create VPC > VPC only. Configuren Name tag = dcl-dev-vpc; IPv4 CIDR manual input =
10.20.0.0/16; IPv6 CIDR block = No IPv6 CIDR block; Tenancy = Default.
7. Agreguen las etiquetas del estándar. Sustituyan team-01 por el número de su equipo y creen la VPC.
Validación: dcl-dev-vpc aparece en State = Available, con IPv4 CIDR = 10.20.0.0/16 y las etiquetas requeridas.
Paso 2 — Identificar dos Availability Zones
Qué hacemos: Elegir dos AZ disponibles dentro de la misma Región y registrarlas como AZ A y AZ B.
Por qué: Cada subnet pertenece a una AZ. Separarlas físicamente deja preparada la base para discutir resiliencia en
Semana 2 sin adelantar mecanismos de networking de Semana 4.
8. En el menú de VPC, abran Subnets y elijan Create subnet.
9. Seleccionen dcl-dev-vpc y observen las Availability Zones disponibles.
10. Elijan dos AZ distintas. No asuman que las letras identifican la misma ubicación física entre cuentas; para este
lab solo necesitamos dos AZ diferentes dentro de la misma Región.
Validación: AZ A y AZ B son distintas y pertenecen a la Región registrada en el Paso 0.
Cloud Computing Posgrado · Semana 1 · Lab Evolutivo 01

Paso 3 — Crear o validar dos subnets
Qué hacemos: Crear una subnet /24 en cada AZ usando el plan de direccionamiento acordado.
Por qué: La subnet define un segmento de direcciones dentro de la VPC y queda asociada a una sola Availability
Zone. En esta etapa queremos hacer visible esa relación, no diseñar todavía exposición a Internet o routing
avanzado.
Nombre Ubicación CIDR IPv4 Uso en esta semana
dcl-dev-subnet-a AZ A 10.20.1.0/24 Base
dcl-dev-subnet-b AZ B 10.20.2.0/24 Base
11. En Subnets, busquen primero dcl-dev-subnet-a y dcl-dev-subnet-b. Si existen, validen VPC, AZ y CIDR y no los
dupliquen.
12. Si faltan, elijan Create subnet y seleccionen VPC ID = dcl-dev-vpc.
13. Agreguen dcl-dev-subnet-a en AZ A con 10.20.1.0/24.
14. Agreguen dcl-dev-subnet-b en AZ B con 10.20.2.0/24.
15. Agreguen las etiquetas obligatorias a cada subnet y creen los recursos.
Validación: Las dos subnets aparecen en State = Available, pertenecen a dcl-dev-vpc, están en AZ distintas y sus
CIDR no se superponen.
Paso 4 — Leer la arquitectura antes de continuar
Qué hacemos: Interpretar la estructura construida como una jerarquía de alcance y failure domains.
Por qué: El objetivo del lab no es acumular recursos. Es poder explicar qué representa cada decisión y qué todavía
no hemos resuelto.
Elemento Qué representa Qué no debemos inferir todavía
Región Área geográfica AWS seleccionada Que la solución sea multi-Región
VPC Espacio de red regional del Que exista conectividad a Internet
proyecto
AZ Failure domain dentro de la Región Que desplegar dos recursos
garantice HA por sí solo
Subnet Segmento CIDR ubicado en una AZ Que sea pública o privada por su
nombre
Validación: Un integrante del equipo puede explicar, en menos de un minuto, la relación Region → VPC → AZ →
subnet y señalar qué decisiones quedan abiertas para las próximas semanas.
Cloud Computing Posgrado · Semana 1 · Lab Evolutivo 01

4. Verificación técnica
Usen CloudShell si está disponible para la identidad de la cuenta. Si no tienen acceso, realicen las mismas
comprobaciones desde las vistas de VPC y registren la limitación. No creen access keys como workaround.
4.1 Confirmar identidad y Región
# Identidad de la sesión actual
aws sts get-caller-identity
# Región asociada a las AZ visibles en la sesión
aws ec2 describe-availability-zones --query 'AvailabilityZones[0].RegionName' --output text
4.2 Consultar la VPC
aws ec2 describe-vpcs \
--filters 'Name=tag:dcl:project,Values=digital-cafe-luna' \
--query 'Vpcs[].{Name:Tags[?Key==`Name`]|[0].Value,VpcId:VpcId,CIDR:CidrBlock,State:State}' \
--output table
4.3 Consultar las subnets
aws ec2 describe-subnets \
--filters 'Name=tag:dcl:project,Values=digital-cafe-luna' \
--query 'Subnets[].{Name:Tags[?Key==`Name`]|[0].Value,SubnetId:SubnetId,CIDR:CidrBlock,AZ:AvailabilityZone,State:State}' \
--output table
5. Criterios de aceptación y evidencias
● La Región de trabajo está registrada y se mantuvo consistente durante el lab.
● Existe una VPC dcl-dev-vpc en State = Available con CIDR 10.20.0.0/16.
● Existen exactamente las dos subnets del diseño, con 10.20.1.0/24 y 10.20.2.0/24, ubicadas en AZ distintas y sin
superposición.
● VPC y subnets tienen nombres y etiquetas consistentes.
● El equipo puede explicar la relación Region → VPC → AZ → subnet sin confundir alcance regional y zonal.
● La evidencia permite reconstruir el checkpoint si algún recurso del baseline se elimina accidentalmente.
Evidencias mínimas para la bitácora
● Captura de dcl-dev-vpc mostrando Name, VPC ID, State y CIDR; el selector de Región debe ser visible cuando
sea posible.
● Captura de la lista de subnets mostrando Name, Subnet ID, CIDR y Availability Zone de ambas subnets.
● Salida de las consultas CLI de VPC y subnets, o nota explícita de restricción de CloudShell si no está disponible.
● Respuesta breve: ¿por qué tener dos subnets en AZ distintas no significa, por sí solo, que la aplicación sea
altamente disponible?
Cloud Computing Posgrado · Semana 1 · Lab Evolutivo 01

6. Checkpoint reutilizable para Semana 2
Completen esta tabla antes de cerrar la sesión. Estos datos sirven para verificar el baseline conservado en la cuenta
y para reconstruirlo sin rediseñar si algún recurso se elimina accidentalmente.
Dato Valor esperado Valor del equipo
Región us-east-1
VPC dcl-dev-vpc · 10.20.0.0/16 · vpc-…
Subnet A dcl-dev-subnet-a · 10.20.1.0/24 · AZ
A · subnet-…
Subnet B dcl-dev-subnet-b · 10.20.2.0/24 · AZ
B · subnet-…
Owner team team-XX
7. Conservación y limpieza
CONSERVAR COMO BASELINE
● VPC dcl-dev-vpc y su CIDR 10.20.0.0/16.
● dcl-dev-subnet-a y dcl-dev-subnet-b con sus CIDR y Availability Zones.
● Naming y etiquetas del proyecto.
● La tabla de checkpoint y las evidencias del equipo.
ELIMINAR
● Cualquier recurso creado solo para troubleshooting y que no forme parte de la arquitectura objetivo.
● Cualquier componente adicional con costo o sin función para la continuidad del lab.
Este diseño no requiere NAT Gateway, Internet Gateway, balanceadores, instancias ni otros recursos adicionales. La
VPC y las dos subnets se conservan como baseline. En una cuenta AWS real, eliminen cualquier recurso accidental
o creado para troubleshooting que no forme parte explícita del baseline, especialmente si puede generar costo. Si no
crearon elementos fuera del alcance, no hay cleanup destructivo sobre la VPC ni las subnets.
8. Cierre técnico
● ¿Qué parte de la arquitectura es regional y qué parte es zonal?
● ¿Qué decisión queda preparada al distribuir subnets en dos AZ y qué falta para convertir esa preparación en una
arquitectura realmente resiliente?
● ¿Qué información del checkpoint necesitarían para reconstruir el baseline si alguno de sus recursos se elimina
accidentalmente?
Siguiente iteración: reutilizaremos esta base para incorporar cómputo y analizar disponibilidad y escalabilidad. Las
decisiones de routing, exposición y seguridad de red se profundizarán en la Semana 4.
Fuentes oficiales
● AWS — Regions and Availability Zones
● AWS — VPC basics
● AWS — Create a VPC
● AWS — Create a subnet
● AWS — Tagging best practices
Cloud Computing Posgrado · Semana 1 · Lab Evolutivo 01
