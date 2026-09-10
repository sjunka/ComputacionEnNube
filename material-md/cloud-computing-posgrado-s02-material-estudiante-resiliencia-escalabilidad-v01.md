Computación en Nube · EAFIT · S02 · Lecturas complementarias · v01

Guía breve de lecturas — Semana 02
Resiliencia y escalabilidad
Computación en Nube · EAFIT · 14 de septiembre de 2026

Objetivo. Preparar la discusión de Semana 2 siguiendo el comportamiento de una arquitectura ante un fallo: cómo
se detecta un target no saludable, cómo se retira del tráfico, cómo se recupera la capacidad esperada y qué
evidencia permite comprobar que el diseño responde como se esperaba.
Carga esperada: 21–24 minutos para las tres lecturas prioritarias. No hay entrega independiente; la preparación
se utiliza en la discusión y en el Lab Evolutivo 02.

PREGUNTAS ORIENTADORAS
• ¿Por qué un load balancer por sí solo no recupera capacidad perdida?
• ¿Qué tendría que ser cierto sobre una aplicación para poder reemplazar una instancia sin perder información

crítica?

LECTURA PRIORITARIA 1
AWS Well-Architected — Reliability Pillar: diseñar para fallos
Qué leer: revise solo: Design principles → “Automatically recover from failure”, “Test recovery procedures” y “Scale
horizontally to increase aggregate workload availability”; Definitions → “Resiliency, and the components of
reliability”; y las introducciones de “Use fault isolation to protect your workload” y “Design your workload to
withstand component failures”. En esta última, identifique REL11-BP01, REL11-BP02 y REL11-BP03 como
secuencia: detectar → usar recursos sanos → recuperar.
Qué no leer: backup, disaster recovery multi-Region, service quotas avanzadas, chaos engineering,
implementación detallada de monitoreo o alarmas, networking, IAM, seguridad avanzada ni prácticas posteriores a
REL11-BP03.
Para qué: entender que resiliencia no significa ausencia de fallos. El diseño limita impacto y habilita recuperación;
esa intención debe producir un comportamiento observable cuando algo falla.
Tiempo estimado: 8–9 minutos.
Abrir: AWS Well-Architected — Reliability Pillar

LECTURA PRIORITARIA 2
Elastic Load Balancing — targets y health checks
Qué leer: lea el primer párrafo de “How Elastic Load Balancing works”: qué recibe el load balancer y qué es un
target registrado. Luego, en “Health checks for Application Load Balancer target groups”, revise la introducción, el
primer párrafo de “Health check settings” y, en “Target health status”, únicamente initial, healthy y unhealthy. No
memorice defaults ni reason codes.
Qué no leer: HTTPS/certificados, routing host/path, WAF, listeners avanzados, logs, procedimientos de
configuración, reason codes ni networking profundo. El caso fail-open cuando todos los targets están unhealthy es
una excepción: reconózcalo, pero no lo profundice.
Para qué: seguir fallo → detección → retiro de tráfico. Mientras existe capacidad healthy, el ALB deja de enviar
nuevas solicitudes al target unhealthy; redistribuir tráfico no crea capacidad de reemplazo.
Tiempo estimado: 7–8 minutos.
Abrir: Elastic Load Balancing — How it works · ALB target group health checks

Computación en Nube · EAFIT · S02 · Lecturas complementarias · v01

LECTURA PRIORITARIA 3
Amazon EC2 Auto Scaling — capacidad deseada y reemplazo
Qué leer: en “Set scaling limits for your Auto Scaling group”, revise la introducción, las definiciones de desired,
minimum y maximum capacity, y el párrafo sobre una instancia que termina inesperadamente. Deténgase antes
de los pasos de consola. Ejemplo: min=2, desired=2, max=4, sin scaling policy, mantiene dos instancias; si una
termina, el grupo la reemplaza para volver a desired=2. max=4 es solo un límite superior: no significa que el grupo
escalará automáticamente hasta 4 sin una política o acción que cambie desired.
Qué no leer: target tracking, predictive scaling, scheduled scaling, warm pools, lifecycle hooks, instance
maintenance policies, reemplazo avanzado ni CloudWatch avanzado.
Para qué: diferenciar recuperación y escalamiento. Reemplazar una instancia restaura desired capacity; aumentar
o reducir desired requiere otra decisión o mecanismo. El trade-off está entre capacidad disponible y adaptación
dinámica a la demanda.
Tiempo estimado: 6–7 minutos.
Abrir: Amazon EC2 Auto Scaling — Set scaling limits

CIERRE
Llegue a la sesión pudiendo explicar, con sus propias palabras: cómo se conecta fallo → detección → retiro de
tráfico → recuperación de capacidad, qué función cumple cada mecanismo y qué evidencia demuestra la
recuperación.
Transición hacia S03: si una instancia puede desaparecer, el estado importante no puede depender únicamente
de ella.
Frontera de esta semana. No avance hacia object/block/file storage, bases de datos, backup/persistencia, routing
de VPC, IAM/seguridad avanzada, observabilidad profunda ni políticas de escalamiento dinámico.


