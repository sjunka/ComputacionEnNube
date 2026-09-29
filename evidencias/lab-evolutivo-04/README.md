# Laboratorio evolutivo 04: Networking y conectividad

Cuenta individual · us-east-1 · 28 sep 2026, 16:39–16:50 (Bogotá) · Creado por AWS CLI (`dcl:managed-by = cli`).

| Recurso | Nombre | Valor |
|---|---|---|
| Internet Gateway | dcl-dev-igw-s04 | igw-03534ced22cd483d2 |
| Route table | dcl-dev-rt-public-a-s04 | rtb-07b4648c9c7ddf5c4 · local + 0.0.0.0/0 → IGW · solo subnet-a |
| SG A | dcl-dev-sg-a-s04 | sg-0f02cc9752b9b8c49 · SSH 22 desde prefix list EC2 Instance Connect |
| SG B | dcl-dev-sg-b-s04 | sg-0965821794a0dbf7d · TCP 8080 solo desde sg-a |
| EC2 A | dcl-dev-ec2-a-s04 | i-0dd26763c906fc540 · 10.20.1.90 · us-east-1a · con IP pública |
| EC2 B | dcl-dev-ec2-b-s04 | i-05b5b0780f61b6fa6 · 10.20.2.177 · us-east-1b · sin IP pública |

- Creación: [01-red-sg-ec2.txt](01-red-sg-ec2.txt)
- PASS → FAIL → PASS: [02-pass-fail-pass.txt](02-pass-fail-pass.txt), capturas `consola/05-pass1.png`, `06-fail.png`, `07-pass2.png`
  - PASS 1 21:47:50 UTC: `Digital Cafe Luna | host=ip-10-20-2-177.ec2.internal | private=10.20.2.177`
  - Regla 8080 revocada. FAIL 21:48:24 UTC: `curl: (28) Connection timed out after 3002 milliseconds`
  - Regla restaurada. PASS 2 21:48:51 UTC: misma respuesta.
- Cleanup: [03-cleanup.txt](03-cleanup.txt). Sin instancias, volúmenes, IGW ni route table S04; solo el SG default. Queda el baseline: VPC, subnet-a (1a), subnet-b (1b) y la main route table.

**Dónde estaba el corte:** en el Security Group de B. Lo que descarta el routing como causa es que la ruta `10.20.0.0/16 → local` no cambió entre PASS y FAIL, y el síntoma fue timeout (paquete descartado) y no `Connection refused` (servicio caído).
