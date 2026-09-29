# Notas de clase — Computación en Nube (ST1611)

Profesor: Juan Carlos Montoya Mendoza · EAFIT · Bloque 35-302
Lunes y miércoles 18:00–20:00 (Bogotá)

Aquí va lo que dice el profesor en clase: conceptos, ejemplos, aclaraciones.
Tareas, fechas y entregas van en `board.md`.

---

## 2026-09-28 — Correo Architecture Challenge (Ing. Luis Lunar)

**Notas:**
- Guía del Architecture Challenge (proyecto final) sobre el caso **Digital Café Luna**.
- Objetivo: proponer y defender arquitectura cloud según necesidades del negocio, restricciones técnicas y condiciones de operación. Más que seleccionar servicios: justificar decisiones y explicar consecuencias.
- Evaluación individual:
  - Architecture Decision Brief — 40%: documento compacto con diagrama, problema y restricciones, decisiones principales, trade-offs, riesgos, supuestos, aproximación de costos y evidencia técnica cuando aporte.
  - Defensa individual — 20%: presentación y preguntas; justificar decisiones, explicar consecuencias, cómo se comprobaría el comportamiento de la arquitectura.
- Fecha final: miércoles 28 oct. El Brief se entrega días antes de la sesión.
- Leer la guía desde ya; avanzar la propuesta en las sesiones restantes.
- No es necesario desplegar completamente la arquitectura final.
- En la sesión de cierre se presenta una restricción adicional para ver cómo adaptan decisiones. No anticiparla en el documento.

---

## 2026-09-28 — Correo S05 (Ing. Luis Lunar)

**Notas:**
- Sesión miércoles 7 oct: seguridad y gobernanza en AWS.
- Idea central: que una instancia tenga conectividad con un recurso no significa que esté autorizada a usarlo.
- Se comprueba con IAM Roles, políticas de permisos, cifrado y trazabilidad con CloudTrail.
- Preparación: Lecturas S05 (20–24 min) y guía Lab Evolutivo 05 (arquitectura, pasos, validaciones).
- Sugerencia: ejecutar el lab antes; se revisa en clase el 7 oct.
- Conservar baseline S01 y hacer cleanup de recursos temporales de labs anteriores.

---

## 2026-09-28 — Clase (S04 — Networking y conectividad)

**Notas:**
- Conversamos un poco sobre networking.
- El profe recomienda hacer un curso de networking; ayuda para la carrera.
- Hay 3 flujos:
  1. Cliente externo llega a un endpoint público y de ahí a la app. Eso es una ruta.
  2. Aplicación, almacenamiento y estado. Eso es control.
  3. Operador con acceso controlado a recurso privado. Eso es evidencia.
- En networking, eso está embebido en cualquier capa.
- El networking es clave e importante.
- Es la más especializada, más que analítica o machine learning, porque ahí se configura lo clave: comunicación, seguridad, trazabilidad y control.
- El CIDR define el espacio donde puede existir la red.
- La VPC es un área lógica.
- La VPC viene definida por el CIDR.
- El CIDR es el rango de IP a considerar para la distribución de las subnets.
- Si se llenan las IP, toca migrar a una VPC más grande; el CIDR no se puede editar.
- Las funciones Lambda o serverless consumen muchas IP.
- Si se quedan cortas de IP, las Lambdas no funcionan.
- Al definir el CIDR:
  - No solapar con redes externas.
  - Dejar espacio para crecer.
  - Facilitar el troubleshooting.
- La estructura hay que hacerla bien.
- El CIDR define el rango de IP para crear los recursos y la comunicación entre ellos.
- En el trabajo hay que definir una VPC tomando decisiones.
- Dice que es sencillo, pero toca temas importantes.
- Pregunta: ¿cuál fue tu criterio para considerar un CIDR `10.20.0.0/16`? Responder con criterio.
- Una plataforma bien ordenada por subnet y por AZ se ve algo similar a lo del tablero.
- En el diagrama, cajas sin rango de IP distorsionan. Cada cajita (subnet) debe mostrar:
  - Ubicación: AZ.
  - Dirección: CIDR.
  - Salida: route table.
- La subnet empieza a ser una decisión arquitectónica cuando conecta ubicación, direccionamiento y ruta.
- Tablas de ruteo (route tables).
  - La primera línea de la tabla de ruteo tiene el CIDR de la VPC (local), para entender el tráfico de otras subnets o dispositivos.
  - La siguiente tabla nace por defecto y es condicional: son las subnets privadas, porque no tienen línea hacia el gateway.
  - La pública tiene en la 2da línea `0.0.0.0/0 → Internet Gateway`.
  - Todo el tráfico hacia internet se va al Internet Gateway.
  - Una subnet pasa de privada a pública porque tiene la ruta `0.0.0.0/0` al Internet Gateway.
  - La route table decide el siguiente salto.
  - Flujo (tablero):
    1. Origen: `10.20.1.25`.
    2. Destino: `10.20.2.40` o `0.0.0.0/0`.
    3. Route table: busca coincidencia.
    4. Siguiente salto: local, IGW u otro.
  - `10.20.0.0/16` es el CIDR de la VPC. Ruta `local` = tráfico dentro de la VPC; no le permite salir de la VPC.
  - `0.0.0.0/0 → IGW` = ruta por defecto a internet.
  - Sin ruta útil, el tráfico no llega.
- DMZ: los servidores web se ponen ahí.
- En la nube, el servidor web se pone en una subnet privada y se expone a internet mediante una NAT (red nateada, IP nateada).
  - La NAT está en la subnet pública.
  - La IP privada del servidor web está en la subnet privada, no en la pública.
  - La NAT traduce la IP privada a la pública.
  - La NAT solo permite tráfico de salida, no de entrada.
  - El IGW sí permite tráfico de salida y de entrada.
- Los balanceadores tienen exposición pública. Ese es el deber ser hoy en día.
- Servidor privado con acceso a internet: va en una subnet privada, la NAT se coloca en la pública, y es a través de la NAT que sale a internet.
  - Todo el tráfico de esa subnet sale a la NAT (route table privada: `0.0.0.0/0 → NAT`).
  - En la route table pública, sale de la NAT al Internet Gateway (`0.0.0.0/0 → IGW`).
- Hay NAT que son servicios embebidos en la nube.
- Las contraseñas y secretos tienen reglas y políticas de comunicación.
- FQDN: para no quemar IP, se traduce la IP a dominio.
- Típico error: creer que todo en una subnet pública sale a internet. La subnet es pública porque tiene salida a internet, pero si pongo en ella un recurso privado (sin IP pública), no sale a internet.
- Para que un recurso salga a internet, condiciones:
  1. IP pública.
  2. Subnet pública.
  3. Security group.
- Security group: control stateful, cerca del recurso.
  - El SG protege la conversación del recurso.
  - Diagrama (tablero): Cliente o servicio → SG (inbound permitido 80/443) → Recurso app.
  - Características del SG:
    - Stateful.
    - Reglas allow; no tiene deny explícito.
    - Bloquean la entrada pero no la salida, a menos que se le diga allow.
  - Pregunta: estoy en una instancia y quiero hacer ping, con un SG que no tiene entrada pero sí salida. ¿Funciona?
- NACL: control stateless en la frontera de la subnet. Segunda puerta de seguridad.
  - La NACL filtra el cruce de la subnet.
  - Gráfica (tablero): Origen → inbound (se evalúa) → Subnet, frontera evaluada por NACL → outbound (también se evalúa) → Destino.
  - Características de la NACL:
    - Stateless.
    - Allow y deny.
    - Orden de reglas: se evalúan en orden, funciona como un firewall.
    - Asociada a subnet.
    - Se configura lo que se permite de entrada y lo que se permite de salida.
- SG y NACL filtran en lugares distintos.
- Siga el camino del tráfico, no la intuición.
- La mejor práctica es tener logs.
- Diagnosticar es ubicar dónde se rompe el camino.
  - Hay una herramienta que permite analizar el path de punto A a punto B (VPC Reachability Analyzer).
  - Diagrama (tablero): Origen → Ruta → NACL → SG → Destino.
  - Tener clara la función de red de cada componente: viendo el síntoma, uno sabe cuál es.
- En nuestro proyecto debemos tener cada uno de estos componentes.
- El principal objetivo del ingeniero cloud: garantizar la seguridad de la plataforma.
- Menos componentes expuestos públicamente, se duerme más tranquilo.
- Estrategias y servicios para la no exposición pública de componentes.
  - Decisión guiada: no todo debe ser alcanzable desde internet.
  - Entrada pública → app privada → datos protegidos. Ese es el patrón de tres capas.
    1. Presentación / entrada: ALB o CloudFront en subnet pública. Único expuesto a internet.
    2. Aplicación / lógica: EC2, ECS o Lambda en subnet privada. Solo acepta tráfico del SG del ALB.
    3. Datos: RDS o DynamoDB en subnet privada de datos. Solo acepta tráfico del SG de la app; sin ruta a internet.
    - Cada capa solo habla con la adyacente. Si comprometen la entrada, no llegan directo a los datos (defensa en profundidad).
- Nmap sirve para trazabilidad.
  - Hacer Nmap en una red en la nube es difícil porque nada está expuesto.
- En IPv6 todas las IP son públicas.
  - Pregunta: si las IP son públicas por naturaleza y las pongo a internet, salen. ¿Cómo hago para que desde internet no lleguen a la privada?
  - Egress-only (Internet Gateway): solamente salida, en vez de tener un IGW.
  - No tendría sentido usar una NAT.
- La nube es más segura que el mundo on-premise.
  - Privado por defecto: SG nuevo bloquea toda entrada, subnet sin ruta a internet hasta agregarla, S3 bloquea acceso público. On-premise suele ser red plana.
  - Responsabilidad compartida: AWS protege lo físico, hardware, hipervisor y red base.
  - Todo es API: cada cambio queda en CloudTrail (trazabilidad).
  - Identidad en todo: IAM controla cada acción, no solo la red.
  - Cifrado nativo: KMS, en reposo y en tránsito.
  - Microsegmentación barata: un SG por recurso, sin comprar firewalls.
  - Automatización: IaC repetible y auditable, menos error humano.
  - Matiz: es más segura si se configura bien. La mayoría de incidentes son errores de configuración del cliente (bucket público, SG `0.0.0.0/0:22`), no del proveedor.
- Un servicio de recovery (DR) se analiza: elementos críticos y modelos (backup off-site, warm standby a medio tamaño), en función de tamaño y costo.
  - RTO: puede ser 4 horas para recuperación parcial o 1 hora para total.
  - Servicio en AWS: AWS Elastic Disaster Recovery (DRS). Replica continuamente servidores (on-premise o EC2) a staging barato en otra región; levanta instancias solo en desastre. RPO segundos, RTO minutos.
  - Relacionados: AWS Backup (backups centralizados, copia entre regiones/cuentas) y Route 53 health checks + failover.
  - 4 modelos de DR, de más barato a más caro:
    1. Backup & restore: horas.
    2. Pilot light: solo lo crítico encendido. Lo mínimo necesario para que los sistemas críticos funcionen.
    3. Warm standby: réplica a medio tamaño (half-size).
       - Copia completa pero reducida, siempre encendida en región de respaldo (app, DB replicada, balanceador; ej. 2 instancias en vez de 10).
       - En desastre: escalar a tamaño completo (Auto Scaling) y cambiar DNS. No hay que construir nada.
       - RTO minutos, RPO segundos. Más caro que pilot light (app corre 24/7), más barato que multi-site.
       - Se puede probar en cualquier momento porque ya sirve tráfico.
    4. Multi-site active/active: RTO casi cero.
       - 2+ regiones completas, a tamaño total, sirviendo tráfico real al mismo tiempo.
       - Route 53 reparte usuarios (latencia, geolocalización o peso). DB replicada en ambos sentidos (DynamoDB Global Tables, Aurora Global).
       - Si cae una región, Route 53 manda todo a la otra. No hay que levantar ni escalar nada. RTO y RPO casi cero.
       - El más caro (infraestructura duplicada) y el más complejo (conflictos de escritura, consistencia, latencia entre regiones).
       - Uso: banca, pagos, e-commerce grande, donde un minuto caído cuesta más que duplicar.
- La red determina si el tráfico puede llegar.
  1. Origen y destino: sin ellos no hay decisión de red.
  2. CIDR y subnet ordenan ubicación y camino.
  3. Route table decide el siguiente salto.
  4. SG y NACL filtran en lugares distintos.
  - DRS es donde duele la plata: los sistemas del negocio.
  - RPO (Recovery Point Objective): cuántos datos puedo perder, medido hacia atrás desde el desastre. Depende de la frecuencia de backup/réplica.
  - RTO (Recovery Time Objective): cuánto tiempo puede estar caído, medido hacia adelante. Depende del modelo de DR.
  - Más bajos ambos = más caro. El negocio los define según el costo de cada hora caída o de datos perdidos.
    - Se asocia a recursos (ENI).
    - Reduce la superficie del destino.
    - Las respuestas son permitidas por estado.
    - Primera capa de defensa en una subnet. Primera puerta de seguridad.
    - El tráfico va por la MAC address que está en la NIC.
      - NIC (Network Interface Card): tarjeta de red, con MAC única. En AWS es virtual: ENI (Elastic Network Interface). Lleva MAC, IP privada (y pública si hay) y los SG. Por eso el SG se asocia a la ENI, no a la subnet.
    - Si el inbound es permitido, el outbound (la respuesta) también es permitido. Lo que dejo entrar lo dejo salir, porque es stateful.
- Puertos efímeros: son donde responden los servicios y dispositivos; están asociados al SO.
  - El SG gestiona eso.

---

## 2026-09-23 — Clase (S03 — Datos y almacenamiento)

**Notas:**
- El storage más caro es el FS (file storage). La diferencia es tiempo y velocidad.
- Es el que menos se ve en el mercado porque es muy costoso.
- S3 es diferente: muy usado, muy demandado.

---

## Correo evaluaciones individuales (Ing. Luis Lunar, fecha no indicada)

**Notas:**
- Por propuesta del grupo, las evaluaciones calificadas serán **individuales**. Pesos no cambian; cambia modalidad.
- Aplica a:
  - Checkpoint Lab 1 — 20%
  - Checkpoint Lab 2 — 20%
  - Architecture Challenge — Architecture Decision Brief — 40%
  - Architecture Challenge — Defensa — 20%
- **Checkpoints Lab 1 y 2** (mismo modelo, reemplaza el 70/30 anterior):
  - **50% Funcionamiento**: cada estudiante con su propia implementación; demostrar que el comportamiento esperado funciona, no solo que los recursos existen.
  - **30% Test**: 5 preguntas de escenario, 3 opciones, una explica mejor el comportamiento, decisión o diagnóstico. Basado en clase, lecturas y sobre todo Labs Evolutivos. Sin verdadero/falso, sin comandos, sin nombres de opciones de consola.
    - Ejemplo: instancia de un ASG con desired capacity = 2 terminada manualmente; aparece otra. Respuesta: el ASG detectó capacidad bajo el valor deseado y lanzó reemplazo (no el ALB, no el Target Group).
  - **20% Validación oral**: 2 preguntas sobre la propia plataforma y el comportamiento demostrado.
    - Ejemplo (causalidad): tráfico llega a dos instancias detrás del mismo endpoint. ¿Qué componente distribuye y qué evidencia demuestra que son instancias distintas?
- Ignorar entregables evaluativos indicados en las guías de los Labs (informes, paquetes de evidencias, documentos). Solo cuentan los tres componentes.
- Igual hay que hacer implementaciones, pruebas y validaciones de los labs: se necesitan para construir y entender.
- Objetivo: que funcione → entender por qué funciona → explicar y defender.
- **Architecture Challenge individual**: cada uno su Architecture Decision Brief (arquitectura, restricciones, decisiones, trade-offs, riesgos, supuestos, costo aproximado, evidencia cuando aporte). Defensa individual.
- Guías actualizadas llegarán en los próximos días.

---

## 2026-09-24 — Correo calendario actualizado (Ing. Luis Lunar)

**Notas:**
- Calendario actualizado en `material/calendario-operativo-actualizado-v01-cerrado.pdf` (y `material-md/`).
- El contenido del curso se mantiene. Cambia la organización de sesiones y los materiales se publican con anticipación.
- Fechas clave:
  - 23/09: Lab Evolutivo 03
  - 28/09: S04 — Networking y conectividad
  - 30/09: Lab Evolutivo 04 + Checkpoint Lab 1
  - 21/10: Checkpoint Lab 2
  - 28/10: Architecture Challenge
- Horario se mantiene: 18:00–20:00.
- Lecturas y labs se compartirán con anticipación para llegar preparados.

---

## 2026-09-23 — Correo Checkpoint Lab 1 (Ing. Luis Lunar)

> **Reemplazado** por el correo de evaluaciones individuales (arriba): ahora 50/30/20 individual, sin 6–8 evidencias.

**Notas:**
- **Checkpoint Lab 1**: miércoles 30 de septiembre. Primer corte de los Labs Evolutivos, **20%** de la nota final.
- Integra S01–S04. No evalúa memorización de procedimientos: demostrar que lo construido funciona, presentar evidencia y explicar decisiones técnicas y su causalidad.
- **70% — Ejecución y evidencia del equipo**: funcionamiento, continuidad de lo construido en los labs, calidad de evidencias, decisiones técnicas, relaciones causa–efecto, trade-offs y cleanup.
- **30% — Defensa**: se elige en el momento a un integrante elegible del equipo para responder preguntas. Su nota es común para todo el equipo.
- Preparar unas **6 a 8 evidencias** relevantes de los Labs Evolutivos. No se requiere informe adicional ni documentar el paso a paso.
- Preguntas de la defensa: por qué funciona la solución, qué pasaría ante cambios o fallos, cómo diagnosticar un problema, qué trade-offs introducen las decisiones. No se evalúan comandos de memoria.
- Usar material S04 y Lab Evolutivo 04 para prepararse.
- Dudas sobre la dinámica se revisan en clase.
- Guía del estudiante del Checkpoint Lab 1 en `material/` (y `material-md/`).

---

## 2026-09-23 — Correo S04 (Ing. Luis Lunar)

**Notas:**
- Material compartido: Material del estudiante S04 y Lab Evolutivo 04 — Networking y conectividad (en `material/`).
- Sesión conceptual S04: lunes 28 de septiembre, 18:00–20:00.
- Miércoles 30 de septiembre: Lab 04 y **Checkpoint Lab 1**.
- Revisar ambos documentos antes. En el lab, entender cómo VPC, subnets, routing y Security Groups intervienen en el flujo de tráfico, y cómo validar cuándo una comunicación está permitida o bloqueada.
- Objetivo: llegar con contexto para la práctica y el troubleshooting.
- Indicaciones del Checkpoint Lab 1 (evidencias y criterios) llegarán en otro correo.

---

## 2026-09-23 — Clase (correo Ing. Luis Lunar)

**Notas:**
- Hoy continúa **S03 — Datos y almacenamiento**, 18:00–20:00.
- Material compartido: Material del estudiante S03 y Lab Evolutivo 03 — Datos y almacenamiento (en `material/`).
- Lab Evolutivo 03 se trabaja el miércoles 23 de septiembre.
- Recomendación: revisar ambos documentos antes. Leer el lab para entender qué se construye, qué comportamiento se espera observar y qué evidencias obtener.
- Material anticipado para usar la clase en analizar decisiones, resolver dudas y practicar.

---

## 2026-09-16 — Clase

**Notas:**
- **Portabilidad**: llevar la app de una nube a otra sin reescribirla. Ejemplo: un contenedor Docker.
- **Interoperabilidad**: sistemas de distintas nubes trabajando juntos gracias a estándares. Ejemplo: una API REST.
- Terraform despliega arquitectura como código, no solo en la nube. Garantiza niveles de portabilidad.
- **Vendor lock-in**: quedar amarrado a un proveedor porque salir es muy caro. Ejemplo: DynamoDB, Lambda.
- El vendor lock-in no permite cierta cantidad de innovación, porque los procesos de innovación pertenecen al proveedor.
- **No vendor lock-in**: poder cambiar de proveedor sin reescribir la app. Ejemplo: Docker, Kubernetes, Terraform.
- **Multi-nube**: cuando tengo 2 providers.
- **Nube híbrida**: nube pública más infraestructura propia (on-prem), conectadas. Ejemplo: un banco con el core en su data center y la app web en AWS.
- **On-premise**: servidores propios en el data center de la empresa, comprados y operados por ella. Es lo opuesto a la nube.
- **Nube privada**: una nube tipo AWS (autoservicio, VMs por demanda) pero de uso exclusivo de una empresa. Ejemplo: un banco con OpenStack en su data center.
- Para una nube privada se necesita un orquestador, un facturador y tecnología específica para gestión y virtualización.
- Debe garantizar la soberanía de esas cargas.
- Vamos a comenzar con el laboratorio 2.
- La estrategia que vamos a usar es tagging.
- 1 VPC solo puede tener 1 Internet Gateway.
- Las subnets tienen una tabla de ruteo asociada, y eso las hace privadas.
- Los targets del balanceador no son solo una máquina: pueden ser una dirección IP u otro balanceador.
- Hay 3 tipos de balanceadores. El ALB trabaja a nivel de capa 7.
- **RTO** (Recovery Time Objective): cuánto tiempo puedes estar caído.
- **RPO** (Recovery Point Objective): cuántos datos puedes perder.
- **Tarea:** hacer el Lab Evolutivo 02 para entender bien los conceptos.
- Debemos tener esos conceptos claros.
- Es hosting y geolocation.

---

## 2026-09-09 — Clase 2

**Tema:** IAM en AWS

**Notas:**
- Aprender a configurar roles usando el gateway y políticas.
- El profesor es instructor de grupos de Amazon.
- Aprender patrones de arquitectura, o patrones de automatización.
- Un patrón es una conducta.
- Ejemplo de arquitectura por eventos: la compañía necesita un sistema para monitorear eventos; los archivos se almacenan en el repositorio central y luego se genera una alerta.
- En la nube hay 2 o más maneras de hacer las cosas: trade-off entre eficiencia y costo.
- Los laboratorios son evolutivos. Hay que aprender y garantizar que cuando nos sentemos en la consola podamos defender nuestro proyecto.
- La invitación del profe es hacer los laboratorios.
- Los checkpoints deben ser preparados, porque el tiempo máximo son 50 minutos.
- Al entrar a la consola, definir la región.
- El idioma es inglés.
- Escoger la región de Virginia (us-east-1).
- Dejarlo por defecto en esa región.
- Subnet: segmentación lógica de unos componentes IP.
- Una IP es una dirección lógica de un host.
- El arquitecto cloud, lo primero que hace es una buena segmentación de red.
- Capacity plan: estudio que se hace a nivel de ingeniería para entender el consumo tecnológico del servicio prestado; hacer una estimación de lo que la empresa va a consumir en un futuro.
- Evitar sobredimensionar, porque la empresa pierde dinero; y si se subdimensiona, se puede perder goodwill.
- Las IP públicas están expuestas a internet.
- Una privada es un rango de IP privadas a ese segmento.
- Tenemos que aprender todas las palabras de los laboratorios.
- No se permite el overlapping (los rangos CIDR no se pueden solapar).
- Crear una VPC: entrar a Amazon, escoger VPC, dar crear, escoger "VPC only" y un name tag que está en el documento de laboratorio.
- Al crear la VPC, por defecto hay asociadas unas AZ.
- Cada VPC es imaginar que fuera un data center.
- ¿Una subnet puede estar en más de una AZ? No: una subnet solo puede pertenecer a una AZ.
- Hay que volver a poner los tags dentro de la subnet/AZ.
- La parte final del laboratorio es más con el AWS CLI, mediante scripts.
- Las preguntas del examen son identificar el script y entender qué hace cada comando.
- Pregunta de examen: ¿cuál es la función de la VPC?
- La parte importante de un laboratorio: las evidencias.
- Habilidades diferenciadoras: capacidades de análisis y conocimiento del negocio.
- Es importante que las empresas tengan gobierno de datos, con trazabilidad; si no, la IA no puede actuar en la empresa.

**Dudas / pendientes:**
-

---

## 2026-09-08 — Clase 1

**Tema:**

**Notas:**
-

---

# Glosario de laboratorios

Términos que aparecen en los labs (S01–S02). Ordenados por capas, no alfabético.

## Modelo cloud

| Término | Qué es |
|---|---|
| **IaaS** | Infraestructura como servicio. Alquilas máquinas y redes; tú administras SO y arriba. EC2. |
| **PaaS** | Plataforma como servicio. Subes código, el proveedor corre el runtime. Elastic Beanstalk, Lambda. |
| **SaaS** | Software como servicio. Solo usas la app. Gmail, Salesforce. |
| **Responsabilidad compartida** | AWS asegura *la* nube (hardware, hipervisor); tú aseguras lo que pones *en* la nube (datos, accesos, configuración). Delegar operación no transfiere responsabilidad. |
| **Region** | Área geográfica (`us-east-1` = Virginia). Elegirla ubica el workload. |
| **Availability Zone (AZ)** | Centro de datos aislado dentro de una región. Es el *failure domain*: si cae uno, los otros siguen. |

## Red

| Término | Qué es |
|---|---|
| **VPC** | Tu red privada aislada dentro de AWS. Se define con un CIDR, ej. `10.0.0.0/16`. |
| **CIDR** | Notación `IP/máscara` para un rango de IPs. Número menor = rango mayor. |
| **Subnet (subred)** | Pedazo del CIDR de la VPC. Vive en **una sola AZ**. Multi-AZ exige mínimo dos. |
| **Subnet pública** | Tiene ruta al Internet Gateway en su route table. |
| **Subnet privada** | Sin ruta directa a internet. Ahí van bases de datos y backend. |
| **Internet Gateway (IGW)** | Puerta de la VPC hacia internet. Tráfico entrante y saliente. |
| **NAT Gateway** | Deja que las subnets privadas *salgan* a internet (updates, APIs) sin ser alcanzables desde afuera. Se paga por hora y por GB. |
| **Route table** | Tabla de rutas. Define qué subnet es pública o privada. `0.0.0.0/0` = todo internet. |
| **Security Group (SG)** | Firewall a nivel de instancia. **Con estado**: si permites la entrada, la respuesta sale sola. Solo reglas allow. |
| **NACL** | Firewall a nivel de subnet. **Sin estado**: hay que permitir entrada y salida por separado. Permite reglas deny. |

## Cómputo

| Término | Qué es |
|---|---|
| **EC2** | Máquina virtual. La unidad básica de IaaS. |
| **Instance type** | Tamaño y familia de la máquina. `t3.micro` = burstable, pequeña, la del lab. |
| **AMI** | Imagen de máquina: el molde (SO + software) desde el que se lanza una instancia. |
| **Launch Template** | Receta reutilizable: qué AMI, qué tipo, qué SG, qué user data. El ASG la usa para crear instancias idénticas. |
| **User Data** | Script que corre al primer arranque de la instancia. Ahí se instala la app. |
| **EBS** | Disco de bloques que se monta en la EC2. Atado a una AZ. |

## Resiliencia y escalabilidad

| Término | Qué es |
|---|---|
| **ALB** | Application Load Balancer. Reparte tráfico HTTP entre varios targets, en varias AZ. |
| **Listener** | Regla del ALB: en qué puerto y protocolo escucha, y a qué target group manda. |
| **Target Group** | Conjunto de destinos registrados (las EC2) al que el ALB envía tráfico. |
| **Health check** | Sonda periódica del ALB al target. Estados: `initial`, `healthy`, `unhealthy`. |
| **Retiro de tráfico** | El ALB deja de mandar solicitudes nuevas al target `unhealthy`. **No crea capacidad nueva.** |
| **Auto Scaling Group (ASG)** | Grupo que mantiene un número de instancias vivas. Si una muere, la reemplaza. |
| **Desired capacity** | Cuántas instancias quiere el ASG *ahora*. Es lo que restaura tras un fallo. |
| **Min / Max capacity** | Límites inferior y superior. `max` es solo un techo: no escala solo sin una política. |
| **Scaling policy** | Mecanismo que cambia `desired` según demanda. Sin ella, el ASG solo recupera, no escala. |
| **Resiliencia** | No es ausencia de fallos. Es limitar el impacto y poder recuperarse, de forma observable. |

**Secuencia clave del Lab 02:** fallo → detección (health check) → retiro de tráfico (ALB) → recuperación de capacidad (ASG vuelve a `desired`).

Distinción de examen: el **ALB redistribuye**, el **ASG reemplaza**. Recuperar ≠ escalar.

## Almacenamiento

| Término | Qué es |
|---|---|
| **Objeto (S3)** | Archivos completos por API HTTP. Barato, regional, escala infinito. Se reescribe entero. |
| **Bloque (EBS)** | Disco crudo montado en una EC2. Una AZ, tamaño fijo, escritura aleatoria. |
| **Archivos (EFS)** | Sistema de archivos compartido por NFS entre varias EC2. Más caro que los dos anteriores. |

## Identidad

| Término | Qué es |
|---|---|
| **Política (policy)** | JSON que declara qué acciones se permiten sobre qué recursos. |
| **Rol (role)** | Identidad sin credenciales fijas. La define su *trust policy* (quién la asume) + *permissions policy* (qué puede hacer). |
| **Instance profile** | El envoltorio que adjunta un rol a una EC2. Evita meter access keys en el código. |
