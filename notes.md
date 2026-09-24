# Notas de clase — Computación en Nube (ST1611)

Profesor: Juan Carlos Montoya Mendoza · EAFIT · Bloque 35-302
Lunes y miércoles 18:00–20:00 (Bogotá)

Aquí va lo que dice el profesor en clase: conceptos, ejemplos, aclaraciones.
Tareas, fechas y entregas van en `board.md`.

---

## 2026-09-23 — Clase

**Notas:**
- Configurar un SG con una entrada vacía.
- Configurar el Auto Scaling.
- **Preguntas tipo parcial:** las dos anteriores (SG con entrada vacía, configurar Auto Scaling).
- Profesor habla de cómo va a ser el examen final:
  - Lo importante es el checkpoint; hay que prepararse para eso.
- ¿Quién distribuye (el tráfico entre) las instancias? El balanceador.
  - **ALB**: reparte el tráfico. Recibe peticiones en un solo endpoint y las envía a instancias sanas del Target Group.
  - **ASG**: lanza, termina y reparte las instancias entre AZ para mantener la desired capacity.
  - Evidencia de instancias distintas: recargar el endpoint del ALB y ver cambiar instance ID, IP privada o AZ.
  - En el test: "distribuir tráfico" es el ALB; "reemplazar o lanzar instancias" es el ASG.
- El test son 5 preguntas de selección. No es tipo certificación: solo verifica que hayan hecho los labs.
- La actividad hay que hacerla 8–9 veces.
- Objetivo: saber explicar y sustentar a través de la implementación.
- Pregunta: ¿cuántos Internet Gateway puede tener una VPC? Uno solo (1 IGW por VPC, y un IGW se asocia a una sola VPC).
- Línea base: no incluye el Internet Gateway; sí están las 2 AZ.
- Línea base: la VPC, las 2 subnets y que están repartidas en 2 AZ.
- La instancia tiene un security group: yo le doy acceso y le digo quién (el EC2).
  - Si la regla es por IP y cambia la IP del EC2, pierde acceso. Si la regla es por SG y la instancia está en ese SG, sigue teniendo acceso.
- Versionamiento no es respaldo.
- El puerto 22 es TCP, para SSH.
- Trabajo final: complejidad diferente. Esperar el envío por el channel (probable que no cambie, porque cambiaría todo el evaluativo). El entregable diseña la arquitectura y la implementación.

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
