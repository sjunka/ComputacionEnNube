# Notas de estudio: Checkpoint Lab 1 (30 sep)

Resumen de la sesión de repaso, con foco en lo que fallé.

Archivos de esta carpeta:
- `diagrama.html`: evolución de Lab 01 a Lab 03 (HA, caída de AZ, health type EC2 vs ELB, S3 + EFS, síntomas).
- `sg-vs-nacl.html`: camino del tráfico; la NACL evalúa ida y vuelta, el SG solo la entrada.
- `examen-checkpoint1.html`: 20 preguntas de opción múltiple.
- `examen-simulacro.html`: simulacro de 10 preguntas.

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
