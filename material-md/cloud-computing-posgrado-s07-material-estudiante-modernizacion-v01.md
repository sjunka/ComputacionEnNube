Computación en Nube · EAFIT · S07 · Lecturas complementarias · v01

Guía breve de lecturas — Semana 07
Modernización
Computación en Nube · EAFIT · 19 de octubre de 2026

Objetivo.  Preparar  la discusión de modernización como una decisión sobre el modelo de ejecución: workload →
restricción → responsabilidad operacional → VM / container / serverless / managed → trade-off → evidencia. La
meta  no  es  aprender  Lambda,  Docker  o  microservices  en  profundidad,  sino  reconocer  qué  responsabilidades
conserva el equipo y cuáles transfiere según la alternativa.
Carga  esperada:  20–24  minutos  para  las  tres  lecturas  prioritarias.  No  hay  entrega  independiente;  use  la
preparación  para  contrastar el flujo S3 ObjectCreated → Lambda → CloudWatch Logs del Lab Evolutivo 07 con
una reacción equivalente sobre EC2 y explicar qué cambia operacionalmente.

PREGUNTAS ORIENTADORAS
• ¿Qué restricción justificaría mantener una VM en vez de usar Lambda?

• ¿Qué responsabilidades operacionales se transfieren a AWS al usar Lambda y cuáles siguen siendo del

equipo?

• ¿Por qué contenerizar una aplicación no significa automáticamente convertirla en microservices?
• ¿Qué complejidad puede disminuir al adoptar serverless y qué complejidad nueva puede aparecer?

LECTURA PRIORITARIA 1
AWS Decision Guides — Choosing a modern application strategy
Qué leer: en “Choosing a modern application strategy”, revise Introduction, Understand, Consider y la
comparación de Choose únicamente para identificar cómo el modelo operacional depende del workload, las
capacidades del equipo, el nivel de autonomía, la estandarización y la carga de operación. Como contraste breve,
en “Choosing an AWS compute service” use solo la introducción y la tabla de Choose para ubicar EC2/VM,
containers y serverless como opciones con responsabilidades distintas.
Qué no leer: catálogo completo de servicios, Kubernetes en profundidad, criterios detallados de EKS/ECS,
patrones de migración, tooling de plataforma, costos detallados ni recomendaciones que conviertan una opción en
respuesta universal.
Para qué: comprender que la decisión empieza por restricciones del workload y por la responsabilidad operacional
que  el  equipo  quiere  o  necesita  conservar.  “Más  moderno”  no  es  un  criterio  suficiente:  una  VM  puede  seguir
siendo la opción correcta si sus restricciones justifican el control y la operación asociados.
Tiempo estimado: 7–8 minutos.
Abrir: Modern application strategy · AWS compute service

LECTURA PRIORITARIA 2
AWS Lambda + Amazon S3 — Ejecución orientada a eventos
Qué leer: en “Process Amazon S3 event notifications with Lambda”, revise el flujo básico en el que S3 invoca una
función de forma asíncrona ante eventos de creación de objetos y el papel de function, invocation, trigger/event y
execution role. En “Amazon S3 Event Notifications”, ubique ObjectCreated y la garantía operacional de entrega
at-least-once. En la documentación de logs, confirme que CloudWatch Logs sirve como evidencia de las
invocaciones cuando el execution role tiene los permisos necesarios.
Qué no leer: API Gateway, SQS, SNS, Step Functions, DLQ, retries avanzados, concurrency tuning, layers,
performance tuning, destinos adicionales de eventos ni diseño detallado de idempotencia. Quédese con la
consecuencia: un mismo evento puede producir más de una notificación y el consumidor debe diseñarse con esa
posibilidad en mente.
Para qué: entender por qué un workload corto, intermitente y orientado a eventos puede ejecutarse sin mantener
una  VM  dedicada,  y  reconocer  que  serverless  transfiere  la  administración  del  servidor  pero  no  elimina
responsabilidades sobre código, permisos, manejo de eventos, errores y evidencia operacional.
Tiempo estimado: 6–8 minutos.
Abrir: Lambda — Process S3 event notifications · S3 — Event Notifications · Lambda — CloudWatch Logs

Computación en Nube · EAFIT · S07 · Lecturas complementarias · v01

LECTURA PRIORITARIA 3
AWS Prescriptive Guidance — Modernización y desacoplamiento
Qué leer: en “Integrating microservices by using AWS serverless services”, lea únicamente la introducción para
reconocer que monolitos y microservices pueden coexistir y que la decisión depende del caso de uso. Luego, en
“Asynchronous communication”, revise cómo el desacoplamiento puede mejorar aislamiento de fallos y manejo de
picos, pero introduce costos de coordinación, testing y troubleshooting entre varios componentes. Use
microservices solo como una decisión arquitectónica, no como destino obligatorio de modernización.
Qué no leer: descomposición exhaustiva de monolitos, DDD, service mesh, CQRS, event sourcing, saga,
orchestration/choreography en detalle, APIs, mensajería por servicio, Kubernetes ni patrones distribuidos
avanzados.
Para qué: comprender que reducir infraestructura administrada por el equipo no elimina complejidad. Parte puede
desplazarse  hacia  contratos,  eventos,  permisos,  observabilidad,  coordinación  y  fallos  parciales.  El beneficio de
desacoplar debe justificar ese costo adicional.
Tiempo estimado: 7–8 minutos.
Abrir: Prescriptive Guidance — Integrating microservices · Prescriptive Guidance — Asynchronous communication

CIERRE
Llegue a la sesión pudiendo sostener esta decisión: no escogemos VM, containers o serverless porque sean más
modernos;  los  escogemos porque determinadas restricciones justifican sus responsabilidades y trade-offs. En el
Lab 07, la evidencia no es solo que Lambda ejecutó: también importa qué evento la activó, qué permisos necesitó
y qué operación dejó de recaer sobre una VM dedicada.
Transición  hacia  S08:  Ahora  debemos  defender la arquitectura completa bajo restricciones técnicas, operativas,
de costo y negocio.
Frontera  de  esta  semana.  Manténgase  en  VM  vs  container  vs  serverless,  managed  services,  ejecución
event-driven,  desacoplamiento,  microservices  como  decisión  y  responsabilidad  operacional.  No  avance  hacia
Docker profundo, ECS/EKS hands-on, Kubernetes, service mesh, API Gateway, SQS/SNS, Step Functions, Kafka,
CQRS, event sourcing ni tracing distribuido.


