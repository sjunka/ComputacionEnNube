Checkpoint Lab 2 — 20%

Evaluación individual

Cloud Computing Posgrado · Labs Evolutivos S05–S07 · 21 de octubre de 2026

Peso

Modalidad

Modelo de evaluación

Resultado

20% del curso

Individual

50% funcionamiento + 30%
test + 20% validación oral

Calificación individual

1. Propósito y modalidad
El Checkpoint Lab 2 valida de forma individual que cada estudiante pueda implementar, comprobar y explicar
los comportamientos trabajados en Labs Evolutivos S05–S07. La evaluación no agrega una práctica nueva:
utiliza los labs como base técnica y verifica dominio real sobre la plataforma.

REGLA INDIVIDUAL: cada estudiante es responsable de su propia implementación durante la evaluación. La
plataforma utilizada como evidencia debe corresponder a su trabajo individual.

ENTREGABLES: para efectos del checkpoint, hagan caso omiso de informes, paquetes de evidencias u otros
entregables que aparezcan en las guías originales de los Labs Evolutivos. No se solicita un informe adicional.
Se evaluará únicamente el modelo 50% + 30% + 20% descrito en este documento.

Las implementaciones, pruebas y validaciones descritas en los labs siguen siendo necesarias porque
constituyen la base técnica de la evaluación. Lo que cambia es la forma de calificarlas.

2. Modelo de evaluación

Componente

Peso

Qué se evalúa

Funcionamiento del laboratorio

50%

Test aplicado

Validación oral

30%

20%

La implementación funciona y el
estudiante puede demostrar el
comportamiento solicitado sobre su
propia plataforma. No basta con que el
recurso exista.

5 preguntas de selección múltiple. Cada
pregunta presenta un escenario y 3
opciones; una sola opción es la mejor
respuesta.

2 preguntas individuales relacionadas
directamente con la implementación
mostrada: causalidad, troubleshooting,
decisiones o trade-offs.

La nota del checkpoint se calcula así: Funcionamiento × 0.50 + Test × 0.30 + Validación oral × 0.20.

3. Alcance técnico del 50% — funcionamiento
El docente seleccionará comportamientos representativos del alcance para validarlos durante la evaluación. No
es necesario mantener activos simultáneamente todos los recursos costosos de las semanas anteriores; sí es
necesario poder disponer de la implementación requerida para la validación que corresponda.

Cobertura

Comportamiento que puede validarse

S05

S06

Identidad y autorización: uso de IAM Role y credenciales
temporales; operación permitida/denegada según policy;
diferencia entre reachability y authorization; protección y
trazabilidad según el lab.

Operación y automatización: observabilidad mediante
métricas/logs/alarmas y despliegue o cambio reproducible
mediante Infrastructure as Code, con validación del resultado.

Cloud Computing Posgrado · Checkpoint Lab 2 · 20%

Cobertura

S07

Comportamiento que puede validarse

Modernización y eventos: flujo serverless/event-driven
definido en el lab, incluyendo activación por evento, ejecución
de la función y evidencia observable en logs.

Criterio central: la validación debe demostrar comportamiento. Una pantalla donde únicamente se vea que
un recurso existe no sustituye una prueba funcional cuando el lab exige observar una respuesta, un cambio
de estado o un flujo.

4. Test aplicado — 30%
El test tendrá exactamente 5 preguntas. Cada pregunta vale 1.0 punto sobre 5.0 dentro de este componente y
presenta 3 opciones de respuesta, con una sola opción correcta.

●  Las preguntas parten de escenarios similares a los observados en clase y en los labs.
●  Se evalúan relaciones causa–efecto, diagnóstico, elección de mecanismo y comprensión de decisiones.
●  No se utilizarán preguntas de verdadero/falso, memorización de comandos, nombres de botones de consola ni

trivia de AWS.

●  Los contenidos del test se limitan a lo trabajado hasta la fecha del checkpoint.

5. Validación oral — 20%
Cada estudiante responderá 2 preguntas vinculadas con su propia plataforma o con el comportamiento que
acaba de demostrar. Las preguntas pueden ser distintas entre estudiantes, pero mantendrán un nivel de
dificultad equivalente.

Tipo de pregunta

Qué busca comprobar

Causalidad / funcionamiento

Troubleshooting / decisión

Explicar qué mecanismo produjo el comportamiento
observado y distinguir responsabilidades entre componentes.

Explicar qué revisaría primero ante un fallo, qué evidencia
utilizaría y por qué; o justificar una decisión y su trade-off.

No se evalúa memoria: la validación oral busca comprensión técnica de la implementación, no recordar
comandos ni rutas exactas de la consola.

6. Preparación para el checkpoint
●  Revise los Labs Evolutivos incluidos en el alcance y asegúrese de comprender qué comportamiento valida cada

prueba.

●  Verifique con anticipación que puede acceder a su cuenta y a los recursos necesarios para la evaluación.
●  Llegue preparado para mostrar el funcionamiento solicitado sin depender de la implementación de otra persona.
●  Revise el material de lectura recomendado como apoyo conceptual; el foco de la evaluación permanece en los

labs y en las decisiones que estos materializan.

7. Qué no se solicita
●
Informe técnico adicional.
●  Paquete de screenshots o bitácora como entregable evaluativo independiente.
●  Reproducción escrita del paso a paso de los labs.
●  Memorización de comandos o de opciones de consola.
La evaluación busca comprobar una secuencia simple: la implementación funciona → el estudiante entiende
por qué funciona → puede explicarla y diagnosticarla.

Cloud Computing Posgrado · Checkpoint Lab 2 · 20%


