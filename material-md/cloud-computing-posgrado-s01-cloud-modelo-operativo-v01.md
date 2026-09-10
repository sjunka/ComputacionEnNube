COMPUTACIÓN EN NUBE
Cloud como
01 PROBLEMA
modelo operativo
02 FRONTERA
De infraestructura aprovisionada a capacidad que se consume, distribuye
y gobierna.
03 DECISIÓN
Semana 1 · Sesión conceptual · 7 de septiembre de 2026
EAFIT · Especialización 04 EVIDENCIA
Luis Eduardo
Pregunta rectora
¿Qué cambia cuando
dejamos de “tener
servidoresˮ y
empezamos a operar
capacidades cloud?
PROBLEMA RESTRICCIÓN DECISIÓN TRADEOFF EVIDENCIA

PUNTO DE PARTIDA
La infraestructura tradicional obliga a decidir antes de conocer la
demanda
Control directo, pero con compromisos de capacidad, tiempo y operación.
DECISIÓN ANTICIPADA
| 1              | 2        |           | 3        | 4               | 5           |
| -------------- | -------- | --------- | -------- | --------------- | ----------- |
| COMPRAR        | INSTALAR |           | OPERAR   | ESPERAR         | AJUSTAR     |
| capacidad      | semanas  |           | hardware | demanda         | otra compra |
| CAPACIDAD FIJA |          | LEAD TIME |          | CARGA OPERATIVA |             |
El pico empuja al
La infraestructura disponible depende  Energía, hardware, reemplazos y
sobredimensionamiento; el promedio
de compra, instalación y coordinación. disponibilidad recaen en la organización.
expone a saturación.
Restricción central: la organización compromete capacidad antes de observar cómo se comporta el negocio.
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO 02

DEFINICIÓN OPERATIVA
Cloud es un modelo de acceso y consumo, no una ubicación
NIST lo reconoce por cinco características esenciales.
AUTOSERVICIO
Capacidad bajo demanda sin negociación manual por cada solicitud.
1
ACCESO POR RED
Capacidades disponibles mediante mecanismos estándar.
2
RECURSOS COMPARTIDOS
Pool dinámico con aislamiento lógico entre consumidores.
3
ELASTICIDAD
Capacidad que puede crecer o disminuir con rapidez.
4
SERVICIO MEDIDO
Consumo observable para control técnico y económico.
5
CHECK: si faltan varias de estas propiedades, podemos tener hosting o virtualización sin una experiencia cloud completa.
03
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO

CAMBIO DE MODELO
Mover servidores a cloud ≠ adoptar un modelo cloud
La ubicación puede cambiar sin que cambie la forma de operar.
LIFT & SHIFT SIN CAMBIO OPERATIVO ADOPCIÓN DEL MODELO
Servidor fijo → VM fija en cloud
APROVISIONAR bajo demanda
capacidad sigue estática
AJUSTAR según señales
cambios siguen manuales
AUTOMATIZAR operación repetible
observabilidad limitada
MEDIR salud + consumo
costos pueden volverse invisibles
Decisión de arquitectura
cambia la unidad de operación: de activos
individuales a capacidades y políticas.
Pregunta: ¿qué tendría que cambiar en procesos, automatización y gobierno para que el cambio de ubicación produzca
valor?
04
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO

MODELOS DE SERVICIO
IaaS, PaaS y SaaS describen qué capacidad estamos
consumiendo
El modelo de servicio cambia el nivel de abstracción; no dice si una opción es “mejorˮ.
| IaaS | PaaS | SaaS |
| ---- | ---- | ---- |
Infraestructura como servicio Plataforma como servicio Software como servicio
| consume recursos de  | consume una plataforma  |     |
| -------------------- | ----------------------- | --- |
consume una aplicación terminada
| infraestructura | administrada |     |
| --------------- | ------------ | --- |
conserva más decisiones del  reduce trabajo sobre runtime e  minimiza operación de la
| sistema | infraestructura | plataforma |
| ------- | --------------- | ---------- |
traslada el foco a uso, datos y
| útil cuando el control es requisito | favorece foco en aplicación |     |
| ----------------------------------- | --------------------------- | --- |
acceso
| Pregunta útil | Pregunta útil | Pregunta útil |
| ------------- | ------------- | ------------- |
¿Qué queremos consumir? ¿Qué queremos construir? ¿Qué queremos simplemente usar?
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO 05

FRONTERA OPERATIVA
El modelo de servicio mueve la frontera operativa
A mayor nivel de abstracción, el proveedor opera más capas; el cliente conserva decisiones relevantes.
| CAPA       | IaaS    | PaaS    | SaaS      |
| ---------- | ------- | ------- | --------- |
| DATOS      | CLIENTE | CLIENTE | CLIENTE   |
| APLICACIÓN | CLIENTE | CLIENTE | PROVEEDOR |
RUNTIME / MIDDLEWARE
|                   | CLIENTE   | PROVEEDOR | PROVEEDOR |
| ----------------- | --------- | --------- | --------- |
| SISTEMA OPERATIVO | CLIENTE   | PROVEEDOR | PROVEEDOR |
| VIRTUALIZACIÓN    | PROVEEDOR | PROVEEDOR | PROVEEDOR |
SERVIDORES / STORAGE / RED
|     | PROVEEDOR | PROVEEDOR | PROVEEDOR |
| --- | --------- | --------- | --------- |
CLIENTE OPERA PROVEEDOR OPERA La frontera exacta depende del servicio y del proveedor.
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO 06

MODELO APLICADO
Shared Responsibility: delegar operación no delega la
responsabilidad sobre el resultado
AWS protege la infraestructura de cloud; el cliente protege cómo usa y configura lo que consume.
AWS · SEGURIDAD “DEˮ CLOUD CLIENTE · SEGURIDAD “ENˮ CLOUD
datos y clasificación
instalaciones y hardware
identidad y permisos
red e infraestructura global
configuración segura
capa de virtualización
aplicación y controles que conserva
operación de capas administradas
resiliencia según el diseño elegido
APLICADO: en una VM el cliente conserva más operación; en un servicio administrado AWS opera más capas, pero datos, acceso, configuración
y decisiones de resiliencia siguen teniendo dueño.
07
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO

INFRAESTRUCTURA GLOBAL
La nube también tiene geografía: Region y Availability Zone
resuelven decisiones distintas
La ubicación afecta latencia, regulación y costo; las AZ aportan aislamiento dentro de una Region.
AWS REGION
DECISIÓN DE REGION
área geográfica
• usuarios / latencia
• datos / regulación
AZ A AZ B AZ C
• servicios disponibles
• costo y operación
recursos recursos recursos
DECISIÓN DE AZ
aislamiento de fallos
y distribución
08
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO

FAILURE DOMAINS
Alta disponibilidad es una decisión de arquitectura, no una
propiedad automática de cloud
Distribuir componentes entre failure domains reduce impacto, pero introduce coordinación y costo.
SINGLEAZ MULTIAZ
servicio
AZ A
AZ A AZ B
Distribuir ≠ duplicar sin criterio
Falla AZ → servicio afectado
hay que considerar estado, datos, dependencias y failover.
TRADEOFF: mayor aislamiento frente a fallos ↔ mayor costo, sincronización y complejidad operativa.
09
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO

CÓMPUTO
Cómputo: elegir dónde ejecutar también decide cuánto queremos
operar
En Semana 1 basta distinguir capacidad de máquina frente a ejecución más administrada.
EJECUCIÓN SERVICIO
VM
ADMINISTRADA GESTIONADO
capacidad de máquina plataforma / runtime capacidad lista para usar
• SO y runtime bajo mayor control • menos capas por operar • mínima infraestructura visible
• unidad operativa visible • más foco en workload • configuración y datos importan
• más tareas de mantenimiento • más dependencia del servicio • menor flexibilidad de capas
MÁS CONTROL MENOS OPERACIÓN DE INFRAESTRUCTURA
Criterio: control requerido + carga operacional + patrón del workload. No seleccionar por catálogo.
AWS aparecerá como implementación en el lab y en semanas posteriores; el principio es anterior al producto.
10
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO

RED · SOLO LO ESENCIAL
Networking: VPC y subnets definen el espacio de conectividad y
aislamiento
Una VPC es regional; cada subnet pertenece a una sola Availability Zone.
VPC · 10.0.0.0/16
LO QUE IMPORTA HOY
frontera lógica de
VPC
red
AZ A AZ B
SUBNET
rango IP en una AZ
subnet A subnet B
10.0.1.0/24 10.0.2.0/24
espacio de
CIDR
direcciones
se profundizan en
RUTAS
Semana 4
Evidencia del Lab 01
identificar VPC, CIDR, subnets
y AZ.
11
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO

PERSISTENCIA · SOLO LO ESENCIAL
Storage: primero definimos cómo se accede y qué debe persistir
Object, block y file resuelven patrones distintos; la elección viene del acceso, no del nombre del servicio.
|        | OBJECT |        | BLOCK |        | FILE |
| ------ | ------ | ------ | ----- | ------ | ---- |
| ACCESO |        | ACCESO |       | ACCESO |      |
objetos por clave / API volúmenes para un sistema jerarquía de archivos compartida
| CUÁNDO ENCAJA |     | CUÁNDO ENCAJA |     | CUÁNDO ENCAJA |     |
| ------------- | --- | ------------- | --- | ------------- | --- |
contenido, backups, datos no  workloads que esperan filesystem
discos de VM, bases y filesystems
| estructurados |     |     |     | común |     |
| ------------- | --- | --- | --- | ----- | --- |
Pregunta de arquitectura: ¿qué comportamiento necesita la aplicación cuando escribe, lee, comparte y recupera datos?
Durabilidad, disponibilidad, backup y lifecycle se profundizan en Semana 3.
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO 12

ELASTICIDAD
Elasticidad conecta demanda, capacidad y consumo medido
Escalar es poder crecer; ser elástico implica ajustar capacidad conforme cambia la demanda.
DEMANDA / CAPACIDAD MECANISMO
DEMANDA CAPACIDAD demanda / salud /
OBSERVAR
1 consumo
DECIDIR política o criterio
2
AJUSTAR capacidad disponible
3
MEDIR resultado y costo
4
tiempo → Trade-off agilidad ↔ costo y gobierno
13
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO

CASO TRANSVERSAL
Digital Café Luna: la primera decisión cloud debe maximizar
aprendizaje sin perder control
Campaña nacional, demanda incierta y una plataforma que hoy depende de infraestructura limitada.
| ESCENARIO        | ¿QUÉ WORKLOAD PONDRÍAMOS PRIMERO EN CLOUD? |       |        |             |
| ---------------- | ------------------------------------------ | ----- | ------ | ----------- |
| Campaña nacional | CANDIDATO                                  | VALOR | RIESGO | APRENDIZAJE |
| por pocos días   | web / campaña                              |       |        |             |
|                  |                                            | ALTO  | MEDIO  | ALTO        |
demanda variable
|     | pedidos | ALTO | ALTO | ALTO |
| --- | ------- | ---- | ---- | ---- |
datos de clientes
|     | inventario | MEDIO | ALTO | MEDIO |
| --- | ---------- | ----- | ---- | ----- |
inventario en tiendas
equipo pequeño
|     | reportes | MEDIO | BAJO | MEDIO |
| --- | -------- | ----- | ---- | ----- |
presupuesto limitado
EVIDENCIA ESPERADA decisión + supuesto + trade-off + cómo la validaríamos
No elegir productos todavía.
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO 14

CIERRE
Cinco ideas que deben quedar claras antes del primer lab
El miércoles convertimos estos principios en una arquitectura base observable.
Cloud es un modelo operativo No basta con cambiar la ubicación de una VM.
01
El modelo de servicio mueve la frontera Control y carga operativa cambian juntos.
02
La responsabilidad sigue compartida Datos, acceso y configuración conservan dueño.
03
La disponibilidad se diseña Region y AZ son mecanismos; la arquitectura decide cómo usarlos.
04
Elasticidad necesita señales y medición Capacidad variable sin gobierno también escala costo y riesgo.
05
LAB EVOLUTIVO 01 Region → VPC  2 subnets → CIDR → validación de conectividad → checkpoint de arquitectura
15
COMPUTACIÓN EN NUBE · EAFIT · POSGRADO
