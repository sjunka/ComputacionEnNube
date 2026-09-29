---
name: mostrarenaws
description: Documento y app de labs que ponen cada comando CLI de un lab junto a su captura en la consola AWS (Chrome), con la ruta para hacerlo en consola.
disable-model-invocation: true
---

# mostrarenaws

Objetivo: que Sergio entienda en la consola lo que se hizo por CLI y pueda defenderlo si el profesor pide la consola. El argumento es un lab (`lab 03`) o un recurso (`el bucket`). Si no hay argumento, usar el lab más reciente de `board.md`.

## Pasos

1. **Inventario vivo.** Con `export AWS_REGION=us-east-1 AWS_PAGER=""`, correr `describe-*` / `list-*` de solo lectura para cada recurso del alcance y anotar sus IDs reales. Las evidencias en `evidencias/` son históricas: los IDs cambian cada vez que se recrea el lab. Si un recurso no existe, decirlo y preguntar antes de crear algo. Este skill solo lee.
   Listo cuando: cada recurso del alcance tiene ID vivo o está marcado como "no existe".

2. **Emparejar comando y vista.** Para cada recurso, el comando CLI que lo creó o configuró. Sacarlo de `evidencias/<lab>/*.txt`, de su `README.md` o de la guía en `material-md/`. Luego la URL de la consola, según la tabla de abajo.

3. **Capturar.** Por cada vista:
   ```bash
   ./scripts/captura-consola.sh "<url>" evidencias/<lab>/consola/NN-<recurso>.png [espera]
   ```
   Leer la imagen con Read y confirmar que la sesión está iniciada, que la región es N. Virginia y que el dato clave del recurso está visible. Si no:
   - Pantalla de login: pedirle a Sergio que inicie sesión y repetir.
   - Página cargando: repetir con una espera mayor (`12`).
   - El dato quedó abajo o cortado a la derecha: bajar el zoom de Chrome a 75% con `osascript -e 'tell application "Google Chrome" to activate' -e 'tell application "System Events" to keystroke "-" using command down'`, una vez por cada paso de zoom. El zoom queda guardado para todo el dominio de la consola. Page Down no sirve, porque la consola hace scroll en un contenedor interno. Si aun así no cabe, preferir una URL que abra la pestaña correcta (`?tabId=mounts` en EFS).
   - Terminal de una EC2 (Instance Connect): `./scripts/terminal-ec2.sh <i-id> "<comando de solo lectura>" evidencias/<lab>/consola/NN-<recurso>.png`. Escribe con teclas simuladas, así que antes hay que pedirle a Sergio que no toque el teclado ni el mouse y avisarle cuando termine. Si Chrome no queda al frente, el script falla sin escribir nada.
   Listo cuando: cada PNG muestra el dato que lo prueba (versiones, mount targets, reglas del SG, etc.).

4. **Documento.** Escribir `evidencias/<lab>/consola/README.md` con una sección por recurso, en este orden:
   - `## NN. <Recurso>`: nombre y ID vivo.
   - **Comando CLI**: bloque `bash` con el comando.
   - **En la consola**: la ruta de clics (`VPC > Your VPCs > dcl-dev-vpc > Resource map`) y el enlace directo.
   - La captura: `![...](NN-<recurso>.png)`.
   - **Qué mirar**: 2 a 4 viñetas que conecten campos visibles de la imagen con la salida del CLI (p. ej. "`IsLatest=True` del CLI = la fila superior con Show versions").
   - **Si el profe pide hacerlo en consola**: los pasos de creación en consola, tomados de la guía del lab en `material-md/`, que está escrita para la consola.

   Cerrar con un párrafo sobre el cleanup: qué recursos siguen corriendo y con qué costo.

5. **App de labs.** Llevar lo mismo a la app en `app/` (tipos en `app/src/content/types.ts`):
   - En `app/src/content/labNN.json`, en cada paso con recurso, agregar o actualizar su bloque `k`: `p` (ruta de clics), `s` (pasos en consola), `img` (`[{"src": "labNN/archivo.png", "cap": "pie"}]`), `m` (qué mirar), `n` (nota) y `l` (enlace de la tabla de abajo, por nombre y no por ID, para que sobreviva a una recreación).
   - Nunca valores de cuenta en el JSON: el Account ID, el bucket (lo lleva), las IP públicas y los IDs de recursos van como marcadores (`{{ACCOUNT_ID}}`, `{{BUCKET}}`, `{{IP_CLIENT_A}}`…). Un marcador nuevo se agrega a `app/.env.example` (vacío), a `app/.env.local` (con el valor) y a `ETIQUETAS` en `app/src/lib/placeholders.ts`.
   - Zonas clicables del diagrama: `<rect className="hot" data-hot="…" tabIndex={0} role="button" aria-label="…"/>` en `app/src/diagramas/LabNN.tsx` y su entrada en `hot` del JSON. Preguntas con captura: en `quiz`, con `img`.
   - Registrar cada captura nueva en `app/src/content/redact.json`: `"labNN/archivo.png": {"from": "evidencias/lab-evolutivo-NN/consola/archivo.png", "zonas": [[x, y, ancho, alto]]}`, en porcentajes de la imagen. Mirar la imagen con Read y tapar la insignia de cuenta (arriba a la derecha, sin tapar el selector de región), Owner ID, ARNs, el nombre del bucket (también en la barra de URL y el breadcrumb) y las IP públicas (lista de EC2, pie de Instance Connect). Solo se publica lo que está en `redact.json`.
   - Correr `node app/scripts/sync-img.mjs` y mirar con Read el PNG tapado en `app/public/img/labNN/`.
   - Estado de la cuenta: reescribir `app/src/content/estado.json` con el inventario del paso 1: `actualizado`, `items` (`pill` ok|warn|todo, `tag`, `text`), `corriendo` (lista) y `costo`.
   - Verificar: `cd app && npm test && npm run build`. El build corre `check-leaks`, que falla si algo publicable contiene el Account ID, un valor de `.env.local` o una access key.
   Listo cuando: el lab tiene bloque `k` en cada paso con recurso, toda captura referenciada está en `redact.json` (lo prueba `npm test`), `estado.json` dice lo que devolvió el inventario y el build pasa.

6. Abrir el documento con `open` y la app con `cd app && npm run dev` (lee `app/.env.local`). Darle a Sergio la ruta del documento. El sitio público (https://sjunka.github.io/ComputacionEnNube/) se actualiza con el push a `main`, que solo se hace cuando Sergio lo pide.

## Enlaces directos (us-east-1)

Base: `https://us-east-1.console.aws.amazon.com/`. Si un enlace no lleva a la vista correcta, navegar por el menú y corregir la fila.

| Recurso | Ruta |
|---|---|
| VPC (Resource map) | `vpcconsole/home?region=us-east-1#VpcDetails:VpcId=<vpc-id>` |
| Subnets de una VPC | `vpcconsole/home?region=us-east-1#subnets:vpcId=<vpc-id>` |
| Route table | `vpcconsole/home?region=us-east-1#RouteTableDetails:RouteTableId=<rtb-id>` |
| Internet Gateway | `vpcconsole/home?region=us-east-1#InternetGateway:internetGatewayId=<igw-id>` |
| Security group | `ec2/home?region=us-east-1#SecurityGroup:groupId=<sg-id>` |
| EC2 | `ec2/home?region=us-east-1#InstanceDetails:instanceId=<i-id>` |
| Launch template | `ec2/home?region=us-east-1#LaunchTemplateDetails:launchTemplateId=<lt-id>` |
| ALB | `ec2/home?region=us-east-1#LoadBalancer:loadBalancerArn=<arn>` |
| Target group | `ec2/home?region=us-east-1#TargetGroup:targetGroupArn=<arn>` |
| ASG | `ec2/home?region=us-east-1#AutoScalingGroupDetails:id=<nombre>` |
| EFS | `efs/home?region=us-east-1#/file-systems/<fs-id>` |
| S3 objetos con versiones | `https://s3.console.aws.amazon.com/s3/buckets/<bucket>?region=us-east-1&tab=objects&showversions=true` |
| S3 lifecycle | `https://s3.console.aws.amazon.com/s3/buckets/<bucket>?region=us-east-1&tab=management` |

## Guardarraíl

Capturar solo vistas de recursos. Las páginas de IAM *Security credentials*, los valores de Secrets Manager y cualquier vista con access keys quedan fuera, porque el PNG se commitea.
