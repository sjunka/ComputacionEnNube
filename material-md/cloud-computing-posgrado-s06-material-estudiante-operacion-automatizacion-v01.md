Computación en Nube · EAFIT · S06 · Lecturas complementarias · v01

Guía breve de lecturas — Semana 06
Operación y automatización
Computación en Nube · EAFIT · 12 de octubre de 2026

Objetivo. Preparar la discusión de operación siguiendo una cadena verificable: comportamiento esperado → señal
→  métrica  →  condición  →  alarma  →  evidencia  →  definición  declarativa  →  cambio  repetible.  La  meta  no  es
aprender  CloudWatch  o  CloudFormation  de  forma  exhaustiva,  sino  conectar  observabilidad  básica  con  una
operación que pueda explicarse y reproducirse.
Carga  esperada:  20–24  minutos  para  las  tres  lecturas  prioritarias.  No  hay  entrega  independiente;  use  la
preparación  para  interpretar  la  evidencia  del  Lab  Evolutivo  06  y  distinguir  creación  de  infraestructura,
comportamiento observable y cambio repetible.

PREGUNTAS ORIENTADORAS
• ¿Por qué CREATE_COMPLETE no demuestra que el sistema se comporta correctamente?

• ¿Qué evidencia usarías para demostrar que una alarma fue causada por una carga real y no simplemente por

existir?

• ¿Qué diferencia hay entre cambiar infraestructura manualmente y modificar una definición declarativa y aplicar

un update?

• ¿Por qué borrar el stack completo es parte del aprendizaje de IaC y no solo una tarea de cleanup?

LECTURA PRIORITARIA 1
AWS Well-Architected — Operational Excellence
Qué leer: en “Operational excellence”, revise únicamente los principios “Safely automate where possible”, “Make
frequent, small, reversible changes”, “Refine operations procedures frequently” y “Learn from all operational events
and metrics”. En “Design for operations”, lea solo la apertura que conecta aplicaciones, infraestructura,
configuración y procedimientos con una disciplina de operación como código.
Qué no leer: organizational design, SRE en profundidad, incident management avanzado, distributed tracing,
catálogo completo de best practices, pipelines de despliegue ni el resto del pillar como lectura obligatoria.
Para qué: entender por qué una arquitectura creada manualmente puede funcionar y aun así ser difícil de operar o
reproducir. La operación madura busca procedimientos repetibles, cambios pequeños y reversibles, y aprendizaje
sustentado en evidencia.
Tiempo estimado: 6–8 minutos.
Abrir: Operational Excellence — principles · Operational Excellence — design for operations

LECTURA PRIORITARIA 2
Amazon CloudWatch — Metrics y alarms
Qué leer: en “Metrics concepts”, ubique metric, namespace, dimension, statistic y period. En “Alarm evaluation”,
revise los estados OK, ALARM e INSUFFICIENT_DATA y cómo una alarma evalúa una condición durante uno o
más períodos. Para el CPUUtilization usado en el Lab 06, recuerde que EC2 basic monitoring entrega datapoints
en períodos de 5 minutos; detailed monitoring reduce esa cadencia a 1 minuto. ALARM significa que la condición
configurada se hizo verdadera: no identifica por sí sola una causa raíz.
Qué no leer: CloudWatch Agent, dashboards avanzados, custom o high-resolution metrics, anomaly detection,
composite alarms, Logs Insights, tracing ni observabilidad profunda. No convierta esta lectura en una revisión de
logs: una métrica es la señal cuantitativa y la alarma evalúa una condición sobre esa señal.
Para qué: reconstruir la evidencia del Lab 06 como una secuencia causal: carga → AWS/EC2 · CPUUtilization →
statistic/period  →  threshold  → evaluación → estado de alarma, y distinguir esa evidencia de una explicación de
causa raíz.
Tiempo estimado: 7–8 minutos.
Abrir: CloudWatch — Metrics concepts · CloudWatch — Alarm evaluation · EC2 — Monitoring with CloudWatch

Computación en Nube · EAFIT · S06 · Lecturas complementarias · v01

LECTURA PRIORITARIA 3
AWS CloudFormation — Templates, stacks y updates
Qué leer: en “How CloudFormation works”, revise template, stack y change set, además de create, update y
delete a nivel conceptual. En “CloudFormation template Resources syntax”, ubique la diferencia entre logical ID y
physical ID. Quédese con esta idea: el template declara estado deseado; el stack materializa y administra esos
recursos; un update aplica diferencias sobre el stack existente. Use change sets solo como mecanismo para
revisar cambios propuestos antes de ejecutarlos.
Qué no leer: nested stacks, StackSets, custom resources, macros, modules, CDK, drift en profundidad,
despliegues multi-account ni comportamiento detallado de reemplazo para cada tipo de recurso.
Para  qué:  entender  IaC  como  una  definición  declarativa y repetible del estado deseado, no como un script que
automatiza clics. Crear, actualizar y borrar el stack permite comprobar que la misma definición gobierna el ciclo de
vida completo de la infraestructura.
Tiempo estimado: 7–8 minutos.
Abrir: CloudFormation — How it works · CloudFormation — Resources: logical and physical IDs

CIERRE
Llegue  a  la  sesión  pudiendo  separar  tres  evidencias:  un  stack  en  CREATE_COMPLETE  demuestra  que  la
infraestructura  terminó  de  crearse;  una  métrica  describe  una  señal  observable; una alarma demuestra que una
condición sobre esa señal fue evaluada. La definición declarativa permite repetir y revisar el cambio sin depender
de memoria o clics.
Transición hacia S07: Ya podemos observar y reproducir la operación. La siguiente decisión es si el modelo de
ejecución que estamos operando sigue siendo el adecuado.
Frontera  de  esta  semana.  Manténgase  en  métricas,  alarmas,  evidencia  operativa  e  IaC  declarativa  a  nivel
esencial.  Terraform  y  CI/CD  permanecen  conceptuales.  No  avance  hacia  tracing,  OpenTelemetry,  SLI/SLO,
Terraform hands-on, pipelines reales, GitOps, Kubernetes, containers o serverless como decisión de ejecución.


