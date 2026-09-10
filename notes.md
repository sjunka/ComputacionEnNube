# Notas de clase — Computación en Nube (ST1611)

Profesor: Juan Carlos Montoya Mendoza · EAFIT · Bloque 35-302
Lunes y miércoles 18:00–20:00 (Bogotá)

Aquí va lo que dice el profesor en clase: conceptos, ejemplos, aclaraciones.
Tareas, fechas y entregas van en `board.md`.

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
