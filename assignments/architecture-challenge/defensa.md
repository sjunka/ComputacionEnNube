# Guion de defensa: Digital Café Luna

Sergio Alfredo Junca Valero · Defensa individual (20%) · miércoles 4 de noviembre de 2026, virtual · 10 minutos de presentación y 2 preguntas. El soporte es el Brief de 2 páginas y el tablero animado (https://sjunka.github.io/digital-cafe-luna/); no hace falta otra presentación. El Brief no se modifica: si el profe trae una restricción nueva, la adaptación se explica de palabra y se marca en el tablero con el modo adaptación.

Cadena que debe sonar en cada decisión: **restricción → decisión → mecanismo → consecuencia → trade-off**, y cerrar con **qué riesgo queda y cómo lo demuestro**.

Lo que evalúa la defensa (guía v02): dominio de las decisiones (5), razonamiento técnico (5), trade-offs, riesgos y adaptación (6), validación y evidencia (4).

## Antes de conectarse

1. Abrir el sitio en Chrome y compartir solo esa pestaña. Pulsar `F` (pantalla completa) y `T` (reloj discreto de 10 minutos).
2. Dejar el PDF abierto en otra pestaña por si el profe pide el documento.
3. Probar el teclado: `→` avanza, `←` retrocede, `1` a `7` cambian de escena, `A` abre el modo adaptación, `Esc` sale.
4. Si falla la red: el sitio es un solo archivo; abrir `web/dist/index.html` local.
5. Cómo se lee el tablero, para decirlo en la primera escena: la ruta gruesa con borde oscuro es la del paso y se dibuja detrás del paquete; el hilo ámbar fino es lo ya recorrido; rojo es tráfico rechazado; lo gris no participa del paso. Medidores, anunciadores y registrador son una simulación con los supuestos S1 a S5 del Brief, no datos de una cuenta.

## Guion de 10 minutos

| Minuto | Tecla | Escena | Qué digo |
|---|---|---|---|
| 0:00 a 1:00 | `1` | El problema | Campaña de pocos días con demanda incierta, datos de clientes y pedidos, equipo pequeño, presupuesto limitado. Prioridad R1 > R2 > R3 > R5; R4 es un límite. El inventario va después: valor medio y riesgo alto en la priorización del caso. |
| 1:00 a 2:00 | `2` | Una compra | La ruta completa: caché de CloudFront, ALB que solo acepta a CloudFront, EC2 sana, RDS con copia síncrona, `incoming/` y Lambda. "Hay una sola puerta y el estado no vive en las instancias." |
| 2:00 a 3:20 | `3` | D1 · Llega la campaña | Restricción: pico corto, incierto y estático. Decisión: no dimensionar para el pico. Mecanismo: caché en el borde, ASG de 2 a 6 con target tracking al 50% y mínimo 4 la víspera. Consecuencia: fuera de campaña pago 2. Trade-off: USD 61 al mes menos que 6 fijas, a cambio de vigilar el escalamiento; con el techo de 6, un pico mayor degrada la API. Evidencia: en el Lab 06 la alarma tardó dos periodos de 5 min. |
| 3:20 a 4:40 | `4` | D2 · Cae una zona | Restricción: un pedido confirmado no se pierde. Mecanismo: health check de tipo ELB y reemplazo del ASG; RDS copia síncrona y mueve el endpoint. Consecuencia: RTO 1 a 2 min, RPO 0. Trade-off: USD 26 al mes y 2 instancias siempre. Evidencia: Lab 02, 35 s para sacar la instancia y 2 min 40 s para que el reemplazo atendiera, sin cortar el servicio. |
| 4:40 a 5:50 | `5` | D3 · Una sola puerta | Restricción: datos de clientes. Mecanismo: cada SG acepta solo a la capa anterior; IAM Roles sin llaves; token IAM a la base; CloudTrail. "Llegar no es estar autorizado." Trade-off: más reglas y un solo NAT (USD 37 menos): si cae su AZ, la venta sigue sin parches. Evidencia: Labs 04 y 05. |
| 5:50 a 6:50 | `6` | D4 · Todo como código | Restricción: equipo pequeño. Mecanismo: un template por capa, change set, el mismo template para la prueba de carga; alarmas que actúan o avisan al de turno. "Una alarma que nadie mira es solo una notificación." Trade-off: portabilidad y disciplina de no tocar la consola (drift). Evidencia: Lab 06. |
| 6:50 a 7:50 | `7` | D5 · Reporte por evento | Restricción: trabajo intermitente que no debe competir con la API. Mecanismo: `ObjectCreated` → Lambda asíncrona, salida por id. Trade-off: entrega al menos una vez, así que la idempotencia es obligatoria; nueva ruta de diagnóstico. Evidencia: Lab 07. |
| 7:50 a 9:00 | bajar a la sección 5 | Costo y evolución | USD 173 en un mes normal y 292 con campaña. El 85% es fijo: el piso lo ponen la base y la red. En campaña manda el tráfico (CloudFront 88, créditos 22). Lo que no hago ahora y la señal que lo dispararía. |
| 9:00 a 10:00 | bajar a "Evidencia" | Cómo lo demuestro | Tres pruebas: carga hasta 10 veces en un ambiente temporal; failover de RDS contando pedidos antes y después; llamar al ALB directo y ver el timeout. Cerrar con la tesis. |

## Frases ancla

- "No escojo servicios por modernos: escojo el que responde a la restricción, y digo qué sacrifico."
- "La capacidad más barata es la que no necesito: el pico estático nunca llega a las EC2."
- "El balanceador reparte, el ASG repone y la base no se pierde porque no vive en las instancias."
- "Llegar no es estar autorizado: la red decide si llega, IAM si puede y CloudTrail deja la evidencia."
- "Una alarma que nadie mira es solo una notificación."
- "Serverless mueve la frontera de responsabilidad, no la elimina: IAM, eventos, logs y costo siguen siendo míos."
- "CREATE_COMPLETE no demuestra que funciona: lo demuestran las pruebas."

## Números que hay que saber

- Costo: USD 173 en un mes normal y 292 con campaña; 158 y 206 con la capa gratuita de CloudFront. El 85% del mes normal es fijo.
- Trade-offs en dinero: Multi-AZ, USD 26 más al mes. Segundo NAT, 37. Seis EC2 fijas, 61. Créditos de t3 en campaña, 22. CloudFront pasa de 16 a 88.
- Lo más caro: RDS (52) y NAT (35). En campaña, CloudFront (88).
- ASG de 2 a 6, mínimo 4 la víspera, target tracking al 50% de CPU.
- RTO y RPO: instancia, servicio continuo y 0. AZ, 1 a 2 min y 0. Error humano, 1 h y 5 min. Región, 4 h y 1 h.
- Lab 02: 35 s para sacar la instancia del target group y 2 min 40 s para que el reemplazo atendiera. Lab 06: CREATE_COMPLETE en 26 s; alarma con 2 de 2 periodos de 5 min sobre 70%.
- Token IAM de la base: 15 minutos. Restauración a un punto: 7 días.
- Consumo supuesto: pico de 10 veces por 3 a 5 días; 30.000 pedidos en un mes normal y 150.000 con campaña.

## Las 2 preguntas: probables y respuesta corta

- **¿Por qué un solo NAT si la resiliencia pesa más que el costo?** Porque vender no depende de él: la AMI trae la app, el token de la base se firma localmente, S3 va por el gateway endpoint y el pago entra como webhook. Si la pasarela exigiera llamadas salientes, pondría un NAT por AZ (USD 37 más).
- **¿Por qué un balanceador solo no recupera capacidad?** El ALB solo manda tráfico a targets sanos; el que repone instancias es el ASG (Lab 02).
- **¿Por qué health check de tipo ELB?** El de tipo EC2 solo ve la instancia detenida; con ELB, el ASG también reemplaza una app colgada que no responde.
- **¿Qué debe ser cierto de la app para reemplazar instancias sin perder nada?** Que sea stateless: sesión en cookie firmada, carrito en la base, archivos en S3, app en la AMI.
- **¿Por qué RDS y no DynamoDB o PostgreSQL en EC2?** Pedidos relacionales con transacciones y un equipo que sabe SQL. En EC2 operaría réplica, backups y parches; DynamoDB obliga a remodelar por patrones de acceso y ata más a AWS.
- **¿Versionar en S3 no es respaldo?** Protege objetos, no la base. La base se respalda con restauración a un punto y copia a us-east-2 (Lab 03).
- **¿Por qué no Aurora Serverless v2?** Escala la base, pero con alta disponibilidad necesita dos instancias y su costo es menos predecible. Si RDS se vuelve el cuello de botella, la evalúo junto con ElastiCache.
- **¿Por qué us-east-1 y no São Paulo?** Más barata, con todos los servicios, la de los labs; CloudFront acerca lo estático y la API tolera la ida y vuelta.
- **¿Y si el pico supera las 6 instancias?** La API se degrada, pero lo estático sigue en CloudFront. La alarma de p95 con el ASG en 6 avisa; subir el máximo es un update del stack de minutos, si el presupuesto lo permite.
- **¿Qué hace la Lambda si llega el mismo evento dos veces?** Escribe el mismo `reports/<id>.json`: queda uno solo. Si falla tras los reintentos, la alarma de errores avisa y se reprocesa desde `incoming/`; el pedido está a salvo en RDS.
- **¿Por qué CloudFormation y no Terraform?** Una sola nube y un equipo pequeño: CloudFormation guarda el estado por mí. Terraform es portable, pero obliga a custodiar el archivo de estado.
- **¿Cómo pruebas que el ALB no es accesible directo?** Un `curl` al DNS del ALB da timeout; por CloudFront responde 200.
- **¿Contenerizar es hacer microservicios?** No: un contenedor empaqueta y los microservicios descomponen. Fargate sería el mismo monolito empaquetado; lo dejo para cuando haya despliegues semanales.

## Restricciones adicionales que conviene anticipar

La guía dice que la restricción será común, no exigirá tecnologías fuera del curso y no cambia el Brief. Método para cualquiera: (1) ¿qué restricción R1 a R6 toca y cómo cambia la prioridad?; (2) ¿qué decisión mantengo y cuál cambio?; (3) ¿qué gano, qué sacrifico y qué riesgo nuevo aparece, en USD si se puede?; (4) ¿con qué prueba lo valido? En el tablero: `A`, escribir la restricción, marcar los módulos y agregar piezas; el resumen dice qué decisiones toca.

Plantilla oral: "Mantengo X porque…; cambio Y por Z porque…; gano…, sacrifico…; el riesgo nuevo es…, y lo valido con…".

1. **Presupuesto a la mitad (unos USD 90 al mes).** Toca R5, que sube de prioridad. Mantengo CloudFront, el ASG con techo, Lambda y CloudFormation. Cambio RDS a Single-AZ con restauración a un punto (USD 26 menos) y quito el NAT (unos 37 menos): parches con una AMI nueva e instance refresh, operador por EC2 Instance Connect Endpoint y logs de la app a S3 por el gateway endpoint. Con la capa gratuita de CloudFront (16 menos) queda cerca de USD 90. Sacrifico RPO 0 ante una caída de AZ: la base se restaura en 1 h con hasta 5 min de pedidos perdidos. Valido con un ensayo de restauración y AWS Budgets al 80%. Marcas: RDS Cambiar, NAT Quitar.
2. **Los datos personales no pueden salir de Colombia.** Toca R1. AWS no tiene región en Colombia. Separo: los datos personales quedan en infraestructura en el país (centro de datos propio o proveedor local) y en AWS solo viajan tokens o el id del cliente; la app consulta el dato personal por VPN cuando lo necesita. Es nube híbrida: gano cumplimiento, sacrifico latencia y sumo un sitio que operar (choca con R4). Antes confirmaría si lo exige la ley o un contrato, porque la Ley 1581 permite transferir a países con nivel adecuado. Valido con la latencia de la VPN en la prueba de carga.
3. **El pico es 10 veces mayor que el supuesto.** Toca R2 y vuelve la base el cuello de botella. Subo el techo del ASG con presupuesto aprobado, cacheo en CloudFront el catálogo de `/api` (GET de solo lectura con TTL corto), agrego ElastiCache o una réplica de lectura y subo la clase de RDS la víspera (el cambio de clase es un failover de 1 a 2 min: hacerlo antes, no durante). Sacrifico costo variable y frescura del catálogo. Valido con una prueba de carga al nuevo pico mirando p95, CPU y conexiones de RDS.
4. **Disponibilidad de 99,99% o RTO regional de minutos.** Toca R3. Paso de backup y restore a warm standby en us-east-2: réplica de lectura de RDS entre regiones, ASG mínimo y ALB allá, y failover del origen en CloudFront o en Route 53. RTO de minutos y RPO de segundos (la réplica es asíncrona). Casi duplica el costo fijo y suma complejidad. Valido con un ensayo de failover regional que mida RTO y RPO reales.
5. **El equipo se reduce a una persona.** R4 se endurece. Mantengo todo administrado, porque el ASG, el ALB y el failover de RDS ya se recuperan solos. Quito piezas (el NAT), dejo cada alarma con acción automática o runbook de una página, y los templates documentan la arquitectura. Riesgo: el conocimiento queda en una persona y la guardia se vuelve pesada. Valido con un simulacro en el que esa persona sigue el runbook sola.
6. **Cifrado con llaves propias o auditoría estricta.** Toca R1. KMS con customer managed key en S3 y RDS (USD 1 al mes por llave). En RDS el cifrado se fija al crear: snapshot, copia con la llave nueva y restauración, con una ventana de corte. Sumo data events de CloudTrail en los buckets con datos de clientes y registro de sesiones de Session Manager. Riesgo: perder acceso a la llave es perder los datos. Valido intentando leer con un rol sin permiso sobre la llave.
7. **La pasarela exige llamadas salientes.** Ahora vender depende de la salida a Internet: pongo un NAT por AZ (USD 37 más) para que la caída de una AZ no corte los pagos. Es el supuesto 3 del Brief. Valido quitando la ruta al NAT de una AZ: los pagos deben seguir por la otra.
8. **El inventario de tiendas entra ya.** Toca R6. Uso el patrón de D5: cada tienda sube su archivo de stock a `incoming/inventario/`, una Lambda actualiza la base y la web lee de ahí. Riesgo: vender algo sin stock por desfase entre tienda y web; lo mitigo con reserva al confirmar y conciliación diaria. Valido subiendo dos veces el mismo archivo (idempotencia) y uno con error (alarma).
9. **No depender de servicios propietarios.** Mantengo lo portable: PostgreSQL, Linux, HTTP. Cambio CloudFormation por Terraform (con el estado en S3 y bloqueo) y los reportes a un proceso en contenedor o en la VM. Sacrifico operación: el equipo administra más piezas. Valido levantando el stack con Terraform en un ambiente temporal.
10. **Bots o ataque de denegación durante la campaña.** CloudFront ya trae Shield Standard. Agrego AWS WAF en CloudFront con reglas por tasa y control de bots (unos USD 5 al mes más las reglas). Riesgo: falsos positivos que bloqueen clientes reales. Valido con tráfico sintético que supere el límite y revisando qué bloqueó.
11. **Borrar los datos de un cliente que lo pida (Ley 1581).** En RDS, borrado del registro; los backups lo purgan al vencer los 7 días; en S3, los reportes se guardan por id y los logs no llevan datos personales. Riesgo: un dato personal que se cuele en un log. Valido buscando el id del cliente en logs y buckets tras el borrado.

## Antes de la sesión

1. Repasar el Brief con el tablero y poder dibujar la arquitectura de memoria con los pasos 1 a 4.
2. Saber los números sin mirar.
3. Cronometrar los 10 minutos en voz alta con `T`.
4. Ensayar dos restricciones de la lista con el modo adaptación (`A`).
