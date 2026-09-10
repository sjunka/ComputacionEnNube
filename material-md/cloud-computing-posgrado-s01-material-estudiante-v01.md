Computación en Nube · EAFIT · S01 · Lecturas complementarias · v01

Guía breve de lecturas — Semana 01
Cloud como modelo operativo
Computación en Nube · EAFIT · 7 de septiembre de 2026

Objetivo.  Preparar  la  discusión  de  Semana  1  distinguiendo  cloud  de  hosting  o  virtualización  convencional,
entendiendo  cómo  cambian  control  y  responsabilidad  entre  IaaS,  PaaS  y  SaaS,  y  relacionando  Regions  y
Availability Zones con decisiones básicas de disponibilidad.
Carga  esperada:  20–24 minutos para las tres lecturas prioritarias. No hay entrega independiente; la preparación
se utiliza en la discusión y en el Lab Evolutivo 01.

PREGUNTAS ORIENTADORAS
• ¿Qué responsabilidad conserva el cliente aunque utilice servicios administrados?
• ¿Por qué una región con múltiples Availability Zones cambia la forma de pensar disponibilidad?

LECTURA PRIORITARIA 1
NIST SP 800-145 — The NIST Deﬁnition of Cloud Computing
Alcance:  revise  la  definición  de  cloud  computing,  las  cinco  Essential  Characteristics  y  los  tres  Service Models:
IaaS,  PaaS  y  SaaS.  Use  estas  categorías  para  reconocer  qué  cambia  en  la  forma  de  consumir  capacidad  y
cuánto control conserva el consumidor.
No  leer:  no  profundice  en  los  deployment  models  ni  intente  mapear  todavía  cada  categoría  a  un  catálogo  de
servicios AWS. La meta es construir una referencia agnóstica, no memorizar productos.
Propósito:  distinguir  una  experiencia cloud de hosting o virtualización convencional y utilizar IaaS, PaaS y SaaS
como niveles de abstracción que redistribuyen control y tareas operativas.
Tiempo estimado: 8–10 minutos.
Abrir: NIST SP 800-145 — publicación oficial

LECTURA PRIORITARIA 2
AWS — Modelo de responsabilidad compartida
Alcance: revise la explicación general de “seguridad de la nube” y “seguridad en la nube”. Observe que la frontera
entre AWS y el cliente cambia según el servicio utilizado y el nivel de administración que el proveedor asume.
No leer: programas de compliance, controles regulatorios específicos, configuraciones de IAM, cifrado, hardening
del sistema operativo ni ejemplos detallados por servicio. Esos mecanismos llegan en semanas posteriores.
Propósito:  comprender  que  delegar  operación  no  elimina la responsabilidad del cliente sobre decisiones, datos,
accesos y configuración. Un servicio más administrado cambia la frontera; no transfiere toda la responsabilidad.
Tiempo estimado: 5–6 minutos.
Abrir: AWS — Modelo de responsabilidad compartida

Computación en Nube · EAFIT · S01 · Lecturas complementarias · v01

LECTURA PRIORITARIA 3
AWS — Regions and Availability Zones
Alcance: revise únicamente la introducción, “Regions” y “Availability Zones”. Identifique la diferencia entre un área
geográfica y una ubicación aislada dentro de esa región, y conecte esa separación con la idea de failure domain.
No leer: listado completo de regiones, Local Zones, Wavelength Zones, Outposts, edge locations, replicación entre
regiones,  patrones  de  disaster  recovery,  VPC,  subnets,  routing  ni  conectividad.  Networking  profundo  llega  en
Semana 4.
Propósito:  relacionar  geografía  e  aislamiento  con  disponibilidad:  elegir  una  región  ubica  el  workload;  distribuir
componentes entre AZs reduce la dependencia de una sola ubicación, pero requiere una arquitectura que pueda
aprovechar esa separación.
Tiempo estimado: 6–8 minutos.
Abrir: AWS Documentation — Regions and Availability Zones

CIERRE
Llegue  a  la  sesión  pudiendo  explicar,  con  sus  propias  palabras: qué hace que cloud sea un modelo distinto de
“alquilar servidores”; cómo IaaS, PaaS y SaaS cambian control y responsabilidad; y por qué Region y Availability
Zone son decisiones arquitectónicas, no solo nombres de ubicación.
Frontera  de  esta  semana.  No avance hacia balanceadores, Auto Scaling, selección de almacenamiento, routing
de VPC, políticas IAM, backup/DR, Infrastructure as Code ni patrones detallados de Well-Architected. Esos temas
se desarrollan cuando el curso introduzca la decisión que los necesita.


