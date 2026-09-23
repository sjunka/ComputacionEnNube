# Laboratorio evolutivo 03: Datos y almacenamiento de Digital Café Luna

Cuenta individual 278835524469 · Región us-east-1 · 23 sep 2026, 11:16–11:24 (Bogotá) · Creado por AWS CLI (`dcl:managed-by = cli`).

## Recursos creados

| Recurso | Nombre | ID / valor |
|---|---|---|
| Internet Gateway | dcl-dev-igw-s03 | igw-072d04444eb9d773e |
| Route table | dcl-dev-rt-s03-public | rtb-0cc46f3a9970f247b · 0.0.0.0/0 → IGW · subnets A y B |
| SG EC2 | dcl-dev-sg-ec2-s03 | sg-0e38e2426a5d13715 · SSH 22 desde prefix list `com.amazonaws.us-east-1.ec2-instance-connect` |
| SG EFS | dcl-dev-sg-efs-s03 | sg-00a5300c281ae9da1 · NFS 2049 solo desde sg-ec2-s03 |
| EFS | dcl-dev-efs-shared | fs-032d170d8b46278b7 · Regional · General Purpose · Elastic · cifrado · sin backup |
| Mount targets | A y B | 10.20.1.167 (us-east-1a) · 10.20.2.8 (us-east-1b) |
| EC2 | dcl-dev-s03-client-a | i-0fdb6090847097409 · 10.20.1.67 · us-east-1a |
| EC2 | dcl-dev-s03-client-b | i-02de01cffd8bd16cf · 10.20.2.219 · us-east-1b |
| S3 | dcl-s03-team01-278835524469-6474 | Versioning Enabled · Block Public Access activo |

Salida de creación: [01-red-efs-ec2.txt](01-red-efs-ec2.txt)

## S3: versiones y lifecycle

[02-s3-versioning-lifecycle.txt](02-s3-versioning-lifecycle.txt)

- `estado.txt` subido dos veces: dos VersionId, solo uno con `IsLatest=True`.
- Versión anterior recuperada con `get-object --version-id`: `estado=CREADO`. Versión actual: `estado=PROCESADO`.
- Lifecycle `dcl-s03-noncurrent-cleanup` en `Enabled`: borra noncurrent a los 7 días y los delete markers expirados.

## EFS: write A → read B → read A

[03-efs-compartido.txt](03-efs-compartido.txt)

- client-a monta por el mount target A y escribe `writer=ip-10-20-1-67…`.
- client-b monta por el mount target B, lee esa línea y agrega `reader=ip-10-20-2-219…`.
- client-a vuelve a leer y ve las dos líneas.
- `df -hT` en client-a: `/mnt/dcl` es `nfs4` desde `10.20.1.167:/` (8.0E), distinto del disco raíz `/dev/nvme0n1p1 xfs 8.0G`. El archivo no vive en el EBS de la instancia.

Nota: la guía entra a las instancias con EC2 Instance Connect desde la consola. Aquí se usó el mismo mecanismo por CLI (`aws ec2-instance-connect send-ssh-public-key` con una llave temporal de 60 s), sin key pair de EC2. Para eso se abrió el puerto 22 solo a la IP pública propia (/32) durante la prueba y se quitó antes del cleanup.

## Contraste object / block / file

| Patrón | Acceso | Qué mostró el lab | Trade-off |
|---|---|---|---|
| S3 · object | API HTTP, bucket/key | Versiones independientes del cómputo | No es un filesystem POSIX |
| EBS · block | Disco adjunto a una EC2 | Solo el root de cada cliente (contraste) | Zonal, un consumidor |
| EFS · file | NFS, varios clientes | Mismo archivo desde dos AZ | Depende de mount targets y red; costo de servicio compartido |

## Respuestas de cierre

| Pregunta | Respuesta |
|---|---|
| ¿Qué estado de S3 sobrevivió a una sobrescritura aparente? | La versión anterior de `estado.txt` (`CREADO`), con su propio VersionId. |
| ¿Qué evidencia demuestra que el archivo de EFS no pertenece al root disk de A? | B, con otro disco y en otra AZ, leyó lo que escribió A, y A vio lo que agregó B. `df` muestra `/mnt/dcl` como NFS del EFS, no el xfs del root. |
| ¿Cuándo preferirías block en lugar de file u object? | Un solo servidor que necesita disco de baja latencia y acceso por bloques, por ejemplo una base de datos en una EC2. |
| ¿Qué trade-off introduces al conservar versiones o un filesystem compartido? | Versiones: más almacenamiento y costo, y cleanup más complejo (lo acota el lifecycle). EFS: dependencia de red y mount targets, y costo mayor por GB que EBS. |

## Cleanup

[04-cleanup.txt](04-cleanup.txt). Se quitó la regla SSH temporal, se terminaron los dos clientes, se borraron mount targets, EFS, todas las versiones y el bucket, los dos SG, la route table y el IGW. Quedan solo `dcl-dev-vpc` y las dos subnets.
