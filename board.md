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
| 3b | Lab Evolutivo 05 — Seguridad y gobernanza (práctica, ejecutar antes) | 2026-10-07 | Hecho en cuenta propia el 3 oct por CLI (app: `lab05.json`); cleanup verificado |
| 4 | **Checkpoint Lab 2** — individual — 20% | 2026-10-21 | Pendiente |
| 5 | **Architecture Challenge** (caso Digital Café Luna) — Decision Brief individual (40%, entregar días antes) + Defensa individual (20%) | 2026-10-28 | Borrador del Brief en `assignments/architecture-challenge/decision-brief.md`, pendiente de revisión; guía en `material-md/cloud-computing-posgrado-architecture-challenge-v02.md` |

Checkpoints 1 y 2: 50% funcionamiento de implementación propia + 30% test (5 preguntas de escenario, 3 opciones) + 20% oral (2 preguntas). Sin informes ni paquetes de evidencias. Detalle en `notes.md`.

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

## Sin clasificar

