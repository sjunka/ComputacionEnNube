# Notas de estudio: Checkpoint Lab 1 (30 sep)

Resumen de la sesión de repaso, con foco en lo que fallé.

Archivos de esta carpeta:
- `diagrama.html`: evolución de Lab 01 a Lab 03 (HA, caída de AZ, health type EC2 vs ELB, S3 + EFS, síntomas).
- `sg-vs-nacl.html`: camino del tráfico; la NACL evalúa ida y vuelta, el SG solo la entrada.
- `examen-checkpoint1.html`: 20 preguntas de opción múltiple.
- `examen-simulacro.html`: simulacro de 10 preguntas.
- `checklist-r07-efs.html`: checklist del reto R07, con comandos, capturas, links a la consola y qué decir en cada paso.
- `r07-efs-sustentacion.pdf`: una página para la sustentación del R07.
- `sg-r07.html`: diagrama de los dos SG del R07 (sg-ec2 y sg-efs).

## Puntos débiles

### Síntomas (fallé 3 veces)
- **Timeout**: el paquete no llega. Lo bloquea el SG, la NACL o la ruta.
- **Refused**: el paquete llega, pero nada escucha en ese puerto. Es el servicio.
- **502/503**: solo si hay ALB en el medio. 503 = ningún target healthy.
- Primero preguntar: ¿el cliente habla directo con la EC2 o con el ALB?

### AZ vs subnet
- La AZ es un datacenter de AWS: se elige, no se crea.
- La subnet es un rango de IPs propio: se crea y vive en una sola AZ.

### Launch Template vs user data
- Launch Template = la receta (AMI, tipo, SG, IP pública, user data). El ASG la usa en todo lanzamiento.
- User data = el script dentro de la receta. Corre una vez, en el primer arranque.

### Público o privado
- Lo decide la route table (`0.0.0.0/0 → IGW` asociada a la subnet), no el nombre ni la IP de la instancia.
- Para salir a internet hacen falta: IP pública, subnet pública (ruta al IGW) y un SG que permita la salida.
- Subnet privada que necesita salir: `0.0.0.0/0 → NAT`, con el NAT en la subnet pública.
- NAT ≠ NACL: el NAT es la salida a internet; la NACL es un firewall.

### SG
- Regla = protocolo + puerto + origen. Mejor usar un SG como origen que una IP.
- SG nuevo: la salida permitida y la entrada vacía. Stateful: la respuesta a lo que la instancia inicia vuelve sola.
- El SG funciona como una credencial: importa qué SG lleva la instancia, no su subnet.
- `sg-efs` va en los mount targets, con la regla `2049 ← sg-ec2`.

### S3 y EFS
- El versioning solo protege lo que pasa después de activarlo. El versioning no es un respaldo.
- Mount target = la puerta de la EC2 hacia el EFS, una por AZ.

## Troubleshooting: DRGSS
1. **D**estino: ¿la IP y el puerto son correctos?
2. **R**uta: ¿existe `local`, o `0.0.0.0/0` si el tráfico sale?
3. **G**ateway: IGW/NAT, solo si el tráfico va a internet.
4. **S**G / NACL: ¿el control permite el tráfico?
5. **S**ervicio: ¿hay algo escuchando?

La sigla es propia; los pasos salen del Lab 04. Método: PASS → cambiar una sola variable → FAIL → restaurar → PASS.

## DR
- **RPO**: cuántos datos se pierden (hacia atrás desde el desastre).
- **RTO**: cuánto tiempo está caído el sistema (hacia adelante).
- Modelos, de más barato a más caro: backup & restore, pilot light (solo la DB replicada), warm standby (app completa pero reducida, siempre corriendo), multi-site.
- AWS DRS: replicación continua a staging; se ubica entre pilot light y warm standby.

## Reto R07 · S03 · EFS (30 sep)

- **Tarea:** A escribe, B lee y agrega, A vuelve a leer. **Evidencia:** 2 líneas con hostnames distintos en el mismo archivo.
- **Idea central:** el estado vive en el EFS, no en la instancia.
- **Mount target:** la puerta al EFS, una por AZ, con IP privada. Cada cliente entra por la de su AZ.
- **NFS:** el protocolo del EFS, puerto 2049. `nfs-utils` es el cliente (AL2023 ya lo trae).
- **sg-ec2:** lo llevan los clientes. Deja entrar SSH (22) solo desde EC2 Instance Connect y funciona como carnet.
- **sg-efs:** lo llevan los mount targets. Deja entrar 2049 solo desde sg-ec2.
- **Error que cometí:** pegué el comando con el marcador `<IP-mount-target-A>`, el mount falló y el archivo quedó en el disco local (EBS). Verificar siempre con `mountpoint /mnt/dcl`.
- **Preguntas difíciles:**
  - Cae 1a: B sigue viendo el archivo, porque el EFS es regional.
  - El EFS no necesita el IGW: el NFS va por la ruta local.
  - `0.0.0.0/0` en sg-efs no lo abre a internet (los mount targets solo tienen IP privada), pero sí a toda la VPC.
  - Outbound vacío en sg-ec2: timeout, porque la ida necesita una regla de salida.
- **Cleanup hecho:** solo queda el baseline.

## Costos y cleanup (1 oct)

- Cobro recibido: 472,45 COP (unos 0,11 USD), por horas ya consumidas de las 2 t3.micro, el EFS y las IP públicas del R07 y de labs anteriores.
- Revisión tras el cleanup, en las 17 regiones: 0 EC2, 0 EBS, 0 EFS, 0 Elastic IP, 0 NAT Gateway, 0 ALB/NLB, 0 ASG, 0 RDS, 0 VPC endpoints y 0 buckets S3. Solo queda el baseline (VPC + 2 subnets en 2 AZ).
- `sergio-cli` tiene AdministratorAccess, pero Cost Explorer responde `User not enabled for cost explorer access`. No es un problema de IAM: lo activa el usuario raíz.
  1. Account › IAM user and role access to Billing information › Activate IAM Access.
  2. Billing and Cost Management › Cost Explorer › Launch Cost Explorer (los datos tardan unas 24 horas).
- Sin activarlo, el desglose por servicio está en Billing › Bills con el usuario raíz.
- Hábito: tras cada demo, correr el cleanup y verificar con el recuento por región antes de cerrar.
- Tip del CLI: usar `AWS_PAGER=""` para que ningún comando se quede esperando en el paginador.
