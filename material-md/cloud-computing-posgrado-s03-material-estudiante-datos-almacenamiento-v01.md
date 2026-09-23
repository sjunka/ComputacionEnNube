Computación en Nube · EAFIT · S03 · Lecturas complementarias · v01

Guía breve de lecturas — Semana 03
Datos y almacenamiento
Computación en Nube · EAFIT · 21 de septiembre de 2026

Objetivo.  Preparar  la discusión sobre persistencia partiendo de una pregunta: si el cómputo puede desaparecer,
¿dónde  debe  vivir  el  estado que debe sobrevivir? Las lecturas conectan estado → patrón de acceso → object /
block / file → elección → protección o retención → trade-off → evidencia.
Carga  esperada:  21–24 minutos para las tres lecturas prioritarias. No hay entrega independiente; la preparación
se utiliza para justificar decisiones en la discusión y en el Lab Evolutivo 03.

PREGUNTAS ORIENTADORAS

• ¿Qué tendría que exigir una aplicación para que S3 dejara de ser una buena elección y necesitara block o file

storage?

•  ¿Por  qué  conservar  versiones  de  un  objeto  y  compartir  un  filesystem  resuelven  problemas  distintos aunque

ambos protejan estado fuera del cómputo?

LECTURA PRIORITARIA 1
AWS Decision Guides — Choosing an AWS storage service
Qué  leer:  revise  “Introduction”;  en  “Understand”,  únicamente  “Definitions”  para  Block,  File  system  y  Object;  en
“Consider”,  solo “Protocol”; y, en “Choose”, la primera tabla comparativa, limitada a las filas Block, File system y
Object. Use esa ruta para contrastar S3, EBS y EFS según el patrón de acceso que exige la aplicación.
Qué  no  leer:  cache,  catálogo  completo  de  servicios,  FSx  y  storage  especializado,  client  type,  tuning  de
performance, migration strategy, seguridad, costos detallados, servicios de transferencia ni la sección “Use”.
Para  qué:  evitar  elegir  almacenamiento  por  nombre  de  servicio.  Primero  identifique  cómo  debe  acceder  la
aplicación  al  dato;  luego  razone  object,  block  o file. S3, EBS y EFS aparecen como opciones derivadas de esa
decisión, con trade-offs distintos de acoplamiento y compartición.
Tiempo estimado: 8–9 minutos.
Abrir: AWS — Choosing an AWS storage service

LECTURA PRIORITARIA 2
Amazon S3 — Versioning y Lifecycle
Qué  leer: en “How S3 Versioning works”, revise la introducción y “Versioning workflows” para distinguir current y
noncurrent versions, reconocer qué ocurre al sobrescribir un objeto y cómo recuperar una versión anterior. Luego,
en  “Lifecycle  configuration  elements”,  lea  únicamente  “NoncurrentVersionExpiration”  para  entender  el  propósito
general de automatizar la retención de versiones no actuales.
Qué  no  leer:  replication,  MFA  Delete,  storage  class  transitions  en  detalle,  Glacier  profundo,  reglas  con  filtros
complejos, ejemplos XML/API, casos avanzados de delete markers ni disaster recovery multi-Region.
Para  qué:  separar  dos  decisiones.  Versioning  conserva  historial  recuperable  frente  a  sobrescrituras o borrados
accidentales;  Lifecycle  automatiza  qué  hacer  con  versiones  no actuales para aplicar una política de retención y
controlar costo. Habilitar versiones no define por sí solo cuánto tiempo conservarlas.
Tiempo estimado: 7–8 minutos.
Abrir: S3 Versioning — How it works · S3 Lifecycle — configuration elements

LECTURA PRIORITARIA 3
Amazon EFS — ﬁlesystem compartido
Qué leer: en “What is Amazon Elastic File System?”, lea la introducción y la descripción de “Regional”. Luego, en
“How Amazon EFS works”, revise desde la apertura hasta la explicación de acceso concurrente por NFS y mount
targets; en “How Amazon EFS works with Amazon EC2”, lea únicamente “Regional EFS file systems” y deténgase
antes de “One Zone EFS file systems”.

Computación en Nube · EAFIT · S03 · Lecturas complementarias · v01

Qué  no leer: performance modes, throughput tuning, One Zone en profundidad, replication, AWS Backup, Direct
Connect/VPN, permisos NFS, IAM, cifrado, security groups ni networking detallado.
Para  qué:  reconocer  cuándo  varios  clientes  necesitan  acceder  de  forma  concurrente  a  la  misma  jerarquía  de
archivos mediante NFS. Ese requisito de filesystem compartido es distinto de consumir objetos por API o adjuntar
block storage a un cómputo específico.
Tiempo estimado: 6–7 minutos.
Abrir: Amazon EFS — What is EFS? · Amazon EFS — How it works

CIERRE
Llegue  a  la  sesión  pudiendo  justificar,  con  sus  propias  palabras:  qué  estado  debe  sobrevivir  al  cómputo,  qué
patrón  de  acceso  exige,  por  qué  ese  patrón  conduce  a  object,  block  o  file  storage,  qué  mecanismo  protege  o
retiene el dato y qué evidencia permitiría comprobar que la decisión funciona como se esperaba.
Transición hacia S04: Ya decidimos dónde vive el estado. Ahora importa qué camino debe recorrer el tráfico para
llegar hasta él.
Frontera de esta semana. No avance hacia networking profundo, IAM/KMS o seguridad avanzada, observabilidad,
bases  de  datos  en  profundidad,  disaster  recovery  multi-Region  ni  políticas  de  scaling.  Esos  temas  se  trabajan
cuando la secuencia del curso introduce la decisión que los necesita.


