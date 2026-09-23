# Laboratorio evolutivo 02: Resiliencia y escalabilidad de Digital Café Luna

Cuenta individual 278835524469 · Región us-east-1 · 23 sep 2026, 11:02–11:16 (Bogotá) · Creado por AWS CLI (`dcl:managed-by = cli`).

## Recursos creados

| Recurso | Nombre | ID / valor |
|---|---|---|
| Internet Gateway | dcl-dev-igw-s02 | igw-09eebf8ec650ff675 (reutilizado del lab en equipo) |
| Route table | dcl-dev-rt-s02-public | rtb-09ef2bbc36d2f058e · local + 0.0.0.0/0 → IGW · subnets A y B |
| SG ALB | dcl-dev-sg-alb | sg-0be5786e1d8f54d60 · TCP 80 desde 0.0.0.0/0 |
| SG app | dcl-dev-sg-app | sg-06a59f4237f63124a · TCP 80 solo desde sg-alb |
| Launch Template | dcl-dev-lt-web | lt-0c66ac580745ce890 · AL2023 x86_64 · t3.micro · IP pública · sin key pair |
| Target Group | dcl-dev-tg-web | HTTP:80 · health GET / → 200 · intervalo 10 s · healthy threshold 2 |
| ALB | dcl-dev-alb | internet-facing · us-east-1a y 1b · listener HTTP:80 → TG |
| ASG | dcl-dev-asg-web | min 2 / desired 2 / max 4 · health check type EC2 · sin scaling policy |

## Prueba A: distribución

[prueba-a-distribucion.txt](prueba-a-distribucion.txt)

- ALB `active` en dos AZ; dos targets `healthy`.
- 20 peticiones al DNS del ALB: 10 a `i-0f977899c4df950ce` (us-east-1a) y 10 a `i-062e3a461f4ebac71` (us-east-1b).
- `curl` directo a la IP pública de una instancia: timeout. `sg-app` solo acepta el 80 desde `sg-alb`.

## Prueba B: terminación controlada

[prueba-b-terminacion.txt](prueba-b-terminacion.txt)

| Hora | Evento | Responsable |
|---|---|---|
| 11:07:23 | Se termina `i-062e3a461f4ebac71` (desired sigue en 2) | Fallo inducido |
| 11:07:24 | Una petición todavía la alcanza (conexión en shutting-down) | ALB |
| 11:07:58 | La instancia sale del Target Group; todo el tráfico va a `i-0f977899c4df950ce` | Health + TG + ALB |
| 11:08:59 | Activity: *"taken out of service in response to an EC2 health check indicating it has been terminated or stopped"* | ASG (health EC2) |
| 11:09:01 | Activity: *"Launching a new EC2 instance: i-07f9d1d4d672826e8"* | ASG recupera desired |
| 11:09:06–11:09:51 | El reemplazo pasa por `initial` y `unhealthy` mientras el user data instala httpd | Health check |
| 11:10:03 | Reemplazo `healthy` y recibe tráfico; 10/10 en la repetición de la Prueba A | ALB |

El servicio nunca dejó de responder. El reemplazo lo hizo el ASG por su health check EC2, no el health check del ALB.

## Respuestas de cierre

| Pregunta | Respuesta |
|---|---|
| ¿Qué hace health? | Decide si un target es elegible para recibir tráfico (GET / → 200). No reemplaza nada. |
| ¿Qué hace el ALB? | Da un endpoint estable y reparte peticiones solo entre targets healthy. No mantiene capacidad. |
| ¿Qué hace el ASG? | Mantiene desired capacity: al ver una instancia no running, lanza otra desde el Launch Template y la registra en el TG. |
| ¿Por qué max=4 no implica escalar a 4? | max es solo un límite. Sin scaling policy nadie decide crecer; el grupo se queda en desired=2. |

## Cleanup

[cleanup.txt](cleanup.txt). Se borraron ASG (con sus instancias), ALB, Target Group, Launch Template, los dos SG, la route table y el IGW. Quedan solo `dcl-dev-vpc` y las dos subnets. Sin volúmenes huérfanos.
