Checkpoint Lab 1 — 20%
Evidencias y defensa
Cloud Computing Posgrado · Labs Evolutivos S01–S04

Peso

Modalidad

Defensa

Resultado

70% equipo + 30% defensa

Por equipo

4–6 min · 3–4 preguntas

Calificación común

1. Propósito y regla de entrega
El  Checkpoint  Lab  1  evalúa  la  evolución  real  de  los  Labs  Evolutivos  S01–S04:  ejecución,  evidencia,  decisiones,
comportamiento observado y comprensión técnica. No agrega una nueva práctica ni pide reconstruir el procedimiento
de los laboratorios.

REGLA EXPLÍCITA: No se solicita un informe técnico ni la reproducción de los pasos de los laboratorios. Los Labs
Evolutivos ya contienen el procedimiento. El checkpoint evalúa ejecución real, evidencia, decisiones y comprensión del
comportamiento observado.

La  calificación  resultante  es  común  para  todos  los  integrantes  del  equipo.  El  70%  corresponde  a  ejecución  y
evidencia del equipo; el 30% depende de la defensa de un integrante seleccionado al azar al momento de evaluar.

Qué debe traer el equipo
●  Un paquete digital de 6–8 evidencias seleccionadas. No un informe.
●  Evidencias legibles y ordenadas por S01, S02, S03 y S04; cada pieza puede llevar únicamente un nombre corto

que indique qué demuestra.

●  Acceso a las evidencias originales o a la consola cuando el recurso aún exista.
●  Todos los integrantes preparados para defender las decisiones del equipo.

Regla de evidencia: Una captura de un recurso creado no es evidencia suficiente cuando el lab exige demostrar
comportamiento.

2. Paquete mínimo de evidencias
El  equipo  selecciona  evidencia  suficiente  para  cubrir  los  cuatro  labs  sin  acumular  screenshots  repetitivos.  Una
evidencia puede ser una captura, salida de terminal/CLI o un par antes/después cuando el comportamiento requiera
comparación.

Cobertura

Evidencia esperada

Qué debe demostrar

S01

S02

S02

S03

S03

S04

S04

VPC + dos subnets + CIDR/AZ

Distribución mediante ALB

Terminación + reemplazo

S3 Versioning + lectura anterior

EFS compartido

Routing + reachability

Troubleshooting PASS → FAIL → PASS

Cierre

Cleanup / checkpoint

El baseline existe y coincide con el diseño
del curso.

Respuestas provenientes de al menos dos
targets/instancias.

ASG recupera desired capacity y el nuevo
target vuelve a healthy.

Dos versiones de la misma key y
recuperación de un estado previo; lifecycle
configurado.

El mismo archivo escrito desde una instancia
y leído desde otra.

Subnet A pública temporal, B sin IGW directo
y flujo A → B por private IP.

El cambio del SG rompe y restaura el mismo
flujo sin cambiar routing.

Recursos temporales eliminados y baseline
S01 preservado.

Cloud Computing Posgrado · Checkpoint Lab 1 · 20%

No  es  obligatorio  presentar  ocho  archivos  separados  si  una  pieza  bien  seleccionada  cubre  más  de  un  punto.  El
docente puede pedir abrir una evidencia original para comprobar legibilidad o contexto.

3. Rúbrica — 70% ejecución y evidencia del equipo

Criterio

Evidencia técnica suficiente

Peso

20%

Funcionamiento observable y continuidad
S01 → S04

20%

Decisiones, causalidad y trade-offs

20%

Cleanup y checkpoints

10%

Anclas de calificación del 70%

Nivel

100% del criterio

80% del criterio

60% del criterio

0–40% del criterio

Logro esperado

La evidencia es legible, trazable al lab y
demuestra comportamiento; no se limita a
creación de recursos.

El equipo conecta baseline,
distribución/recuperación, persistencia
compartida/versionada y
reachability/troubleshooting.

Las explicaciones distinguen mecanismos y
justifican por qué una decisión produjo el
comportamiento observado.

Los recursos temporales/costosos se
eliminaron cuando correspondía y el baseline
necesario se conservó sin dependencias
accidentales.

Interpretación

Evidencia completa y coherente; causalidad correcta; sin
contradicciones relevantes.

Cumple lo central; falta una evidencia secundaria o hay una
explicación menor incompleta.

Existe ejecución parcial, pero la evidencia no alcanza a demostrar
todo el comportamiento requerido.

Evidencia ausente, contradictoria o limitada a “el recurso existe”
cuando el lab exigía comportamiento.

El criterio Cleanup y checkpoints puede quedar pendiente durante la defensa si S04 todavía está activo. Se confirma
al terminar la sesión, después del cleanup obligatorio del Lab 04.

4. Rúbrica — 30% defensa aleatoria

Criterio

Causalidad técnica

Troubleshooting

Decisiones y trade-offs

Peso

12%

10%

8%

Qué se observa

Explica qué mecanismo produjo el
comportamiento de su propia evidencia y
evita atribuciones incorrectas.

Distingue hipótesis y propone qué
evidencia revisaría antes de cambiar
configuración.

Justifica por qué se eligió, conservó o
eliminó un recurso y reconoce la
restricción asociada.

Reglas de la defensa
●  El docente selecciona al azar un integrante en el momento de la defensa.
●  Duración: 4–6 minutos por equipo; objetivo operativo: 4–5 minutos.
●  Se realizan 3–4 preguntas basadas en los labs y en las evidencias del propio equipo.
●  El integrante responde sin ayuda de los demás miembros. Los demás permanecen en silencio durante la

defensa.

Cloud Computing Posgrado · Checkpoint Lab 1 · 20%

●  No se evalúa memoria de comandos, nombres de opciones de consola ni trivia de AWS. Se evalúan causalidad,

decisiones, troubleshooting y comprensión.

●  La puntuación de la defensa se suma al 70% del equipo y el resultado final es común para todos los integrantes.

Cloud Computing Posgrado · Checkpoint Lab 1 · 20%


