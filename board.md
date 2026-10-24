# Board — Computación en Nube (ST1611)

Profesor: Juan Carlos Montoya Mendoza · EAFIT · Bloque 35-302

Pega aquí, sin formato, todo lo que diga el profesor. Yo lo organizo después.

## Equipo

**Equipo 1** (el mío):
- Juan José Henao Aristizábal
- Sergio Alfredo Junca Valero (yo)
- Ioav Mizrachi Muñoz
- Mateo Muñoz Bustamante

Otros equipos:
- **Equipo 2**: David Elias Franco Velez, Antonio Carmona Gaviria, Freddy Palacios Angel, Andres Prada Rodriguez
- **Equipo 3**: Tomas Marin Aristizabal, Elizabeth Toro Chalarca, Julian Giraldo Chica, Santiago Higuita Usuga
- **Equipo 4**: Juan Pablo Yepes Garcia, Daniela Villamizar Mendoza, Jose Fabian Gonzalez Tavera

## Entregas

| # | Nombre | Fecha | Estado |
|---|--------|-------|--------|
| 1 | Lab Evolutivo 03 — Datos y almacenamiento (práctica, no se entrega) | 2026-09-23 | Hecho en cuenta propia (`evidencias/lab-evolutivo-03/`) |
| 2 | Lab Evolutivo 04 — Networking y conectividad (práctica) | 2026-09-30 | Pendiente |
| 3 | **Checkpoint Lab 1** — S01–S04, individual — 20% | 2026-09-30 | Pendiente |
| 3b | Lab Evolutivo 05 — Seguridad y gobernanza (práctica, ejecutar antes) | 2026-10-07 | Hecho en cuenta propia el 3 oct por CLI (app: `lab05.json`); cleanup verificado de nuevo el 14 oct; una página en `estudio/lab05/` |
| 3b2 | Lab Evolutivo 06 — Operación y automatización (CloudFormation + CloudWatch) | 2026-10-14 | Hecho en cuenta propia el 14 oct por CLI (app: `lab06.json`); una página en `estudio/lab06/` |
| 3c | Lab Evolutivo 07 — Modernización: S3 ObjectCreated → Lambda → CloudWatch Logs (ejecutar antes) | 2026-10-21 | Hecho en cuenta propia el 16 oct por CLI (app: `lab07.json`); cleanup verificado |
| 4 | **Checkpoint Lab 2** — S05–S07, individual — 20% (50% funcionamiento + 50% test) | 2026-10-21 | Pendiente; guía en `material-md/cloud-computing-posgrado-checkpoint-lab-02-guia-estudiante-v01.md`; examen de práctica en `estudio/examen-checkpoint2.html`; tutor por lab en `estudio/lab05-tutor.html` (https://claude.ai/artifact/UqPgE3RSHYWAGD4iQsSnCP); montaje con `bash estudio/checkpoint2.sh up` |
| 5 | **Architecture Challenge** (caso Digital Café Luna) — Decision Brief individual (40%, entregar días antes) + Defensa individual (20%) | 2026-10-28 | Brief final en `assignments/architecture-challenge/decision-brief.pdf` (6 páginas; entregar el **lunes 26 oct**: la apertura dice 26, la guía v02 dice antes de las 6 p. m. del 28). Guion en `defensa.md`; índice y rúbrica en `README.md`; guion en `defensa.md`; guía en `material-md/cloud-computing-posgrado-architecture-challenge-v02.md` |

Checkpoint 1: 50% funcionamiento de implementación propia + 30% test (5 preguntas de escenario, 3 opciones) + 20% oral (2 preguntas). Checkpoint 2: 50% funcionamiento + 50% test (sin oral, correo del 14 oct). Sin informes ni paquetes de evidencias. Detalle en `notes.md`.

## Bitácora

### 2026-09-08 — Clase 1
- (pegar notas aquí)

### 2026-09-09 — Clase 2
- (pegar notas aquí)

### 2026-09-14 — Clase 3
- Clase remota por Teams (profe indispuesto), mismo horario 6:00-6:05 p.m.
- **Lab Evolutivo 02 se corre el miércoles**, no el lunes.
- Profesor subió material nuevo: *Cloud Native Architecture and Design* (handbook) y *Cloud Application Architecture Patterns*. Ya convertidos a `material-md/`.

### 2026-09-16 — Clase 4
- Conceptos: portabilidad, interoperabilidad, vendor lock-in, multi-nube, nube híbrida, on-premise, nube privada, RTO/RPO.
- Se comenzó el Lab Evolutivo 02 (resiliencia y escalabilidad: ALB, Target Group, Launch Template, ASG).
- **Tarea:** hacer el Lab Evolutivo 02 para entender bien los conceptos.

### 2026-09-23 / 24 — Correos Ing. Luis Lunar
- S03 hoy; Lab 03 el 23/09. Material S03 y S04 publicado en `material/`.
- S04 conceptual 28/09; Lab 04 + Checkpoint Lab 1 el 30/09.
- Calendario actualizado (`material/calendario-operativo-actualizado-v01-cerrado.pdf`).
- Evaluaciones pasan a individuales; pesos iguales. Guías actualizadas por llegar.
- Labs 02 y 03 corridos en cuenta propia el 23/09 con evidencias en `evidencias/`; cuenta en baseline S01. Guía interactiva Labs 01–04: https://claude.ai/artifact/9uVzAyNiJb8B2CFF7PdPeP

### 2026-10-03 — Lab 05 y borrador del Brief
- Lab 05 corrido por CLI en la cuenta propia: PASS de GetObject en `allowed/*`, AccessDenied por Resource (`restricted/`) y por Action (PutObject), SSE-S3 verificado, AttachRolePolicy hallado en CloudTrail Event history. Las pruebas corrieron por user data y se leyeron con `get-console-output` (no por Instance Connect).
- Cleanup hecho: sin EC2, volúmenes, SG, route table, IGW, bucket, policy, role ni instance profile de S05. Solo baseline S01.
- Architecture Decision Brief (borrador) en `assignments/architecture-challenge/`. Costos son estimados a verificar en AWS Pricing Calculator.

### 2026-10-14 — Correos Ing. Luis Lunar (S07 y Checkpoint Lab 2)
- Material S07 (modernización) y guía del Checkpoint Lab 2 en `material/` y `material-md/`.
- Checkpoint Lab 2 el 21 oct: 50% funcionamiento + 50% test; reemplaza el 50/30/20 de la guía.
- Lab 07 se va ejecutando antes y se revisa en la sesión del 21 oct.

### 2026-10-14 — Clase S06 y Lab 06
- Lab 06 corrido antes de clase por CLI: stack CREATE_COMPLETE, CPU 75 → 100 → 100%, alarma OK → ALARM (15:56:58 UTC) → OK, update v1 → v2 sin replacement, Delete stack. Cleanup verificado: solo baseline S01.
- Una página de estudio: `estudio/lab06/lab06-una-pagina.pdf` y `estudio/lab05/lab05-una-pagina.pdf`.
- Capturas originales de consola fuera del repo (`.gitignore`); en la app van tapadas.

### 2026-10-16 — Lab 07 y preparación del Checkpoint Lab 2
- Lab 07 corrido por CLI en la cuenta propia (12:24–12:27 Bogotá): `incoming/order-001.json` → `ObjectCreated:Put` → 1 invocación → línea JSON en CloudWatch Logs con el mismo key y requestId.
- Sin permiso de invocación, S3 rechaza la notificación (`Unable to validate the following destination configurations`). Control negativo: `incoming/*.txt` y `archive/*.json` no invocan.
- Cleanup verificado: sin bucket, función, log group ni role de S07. Solo baseline S01.
- Examen de práctica S05–S07 (30 preguntas, simulacro de 5) y guion de demostración en `estudio/examen-checkpoint2.html`.

### 2026-10-21 — Día del Checkpoint Lab 2
- `estudio/checkpoint2.sh up|down|status [05|06|07]`: monta y desmonta los tres labs (up ≈ 1.5 min, down ≈ 1.5 min). Probado a las 10:02: la policy de S05 da allowed solo a GetObject en `allowed/*` (simulate-principal-policy), el stack de S06 queda en CREATE_COMPLETE en 32 s y el log de S07 aparece. Cleanup verificado.
- Tutor web con pestañas por lab (cadena, corrida real, test de 35 preguntas, orales): `estudio/lab05-tutor.html`, publicado en https://claude.ai/artifact/UqPgE3RSHYWAGD4iQsSnCP
- Plan de la tarde: `up` a las 17:10 para que la alarma de S06 esté en ALARM a las 17:40; las pruebas se hacen a mano en la demo; `down` al terminar la sesión.

### 2026-10-23 — Brief final del Architecture Challenge
- Brief revisado contra la rúbrica. Se integró el Lab 07: decisión 7 (tareas posteriores al pedido por `ObjectCreated` → Lambda, idempotente), fila de trade-off, costo de Lambda (Price List API: menos de USD 1 al mes) y paso de validación.
- Sección de evidencia como tabla Labs 01 a 07 → decisión. Diagrama con la cadena S3 → Lambda → CloudWatch Logs.
- `decision-brief.pdf` (5 páginas) para entregar antes del 28 oct a las 6:00 p. m. Guion de defensa con Lab 07 y resumen de una línea por lab.

### 2026-10-23 — Brief revisado para la mejor nota
- Revisado contra la rúbrica, la guía v02, el caso de S01 (inventario en tiendas, reportes) y las cadenas de cada semana.
- Cambios: prioridad explícita R1 > R2 > R3 > R5 > R6, decisiones D1 a D8 con restricción, mecanismo, alternativa descartada y sacrificio, resiliencia por escenario (RTO/RPO), 7 supuestos con validación y 8 pruebas.
- Arreglos de diseño: solo CloudFront entra al ALB (prefix list), autenticación IAM a la base, health check de tipo ELB (el Lab 02 usaba EC2), alarmas con acción (el Lab 06 tenía `ActionsEnabled: false`), un solo NAT porque vender no depende de él.
- Costo con la Price List API: USD 173 en mes normal y 292 en mes con campaña, con créditos de t3 y CloudFront de Sudamérica. Diagrama nuevo con D1 a D7 y el flujo de una compra.

## Sin clasificar

