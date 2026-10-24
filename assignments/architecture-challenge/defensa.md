# Guion de defensa: Digital Café Luna

Sergio Alfredo Junca Valero · Defensa individual (20%): 8 minutos para analizar la restricción adicional, 6 de presentación y unos 6 de preguntas. El Brief entregado no se modifica: la adaptación se explica oralmente. Prohibido anticipar la restricción en el documento.

Cadena que debe sonar en cada respuesta (criterio rector de la guía): **restricción, decisión, mecanismo, evidencia, trade-off, alternativa.**

## Guion de 6 minutos

1. **Problema y prioridades (45 s).** Campaña nacional de pocos días con demanda incierta, datos de clientes y pedidos, equipo pequeño y presupuesto limitado. Prioridad: no perder pedidos, luego vender en el pico, luego resistir la caída de una AZ, luego costo. El equipo pequeño es un límite, no una preferencia. El inventario de tiendas queda para después: valor medio y riesgo alto en la priorización de S01.
2. **Arquitectura (60 s).** Recorrer el diagrama con los pasos 1 a 4: estático desde CloudFront, `/api` al ALB, pedido a RDS, evento a la Lambda. Solo CloudFront es la puerta: el ALB solo acepta su prefix list.
3. **Cinco decisiones con su cadena (2 min 30 s).**
   - D1: el pico de campaña es estático, así que CloudFront lo absorbe y no escala cómputo.
   - D2: ASG de 2 a 6 con health check de tipo ELB. En el Lab 02 era de tipo EC2, que no reemplaza una app colgada. Acción programada la víspera, target tracking durante el pico, techo de 6 como control de costo.
   - D3: RDS Multi-AZ: réplica síncrona y failover del endpoint (RPO 0 ante falla de AZ). Restauración a un punto en el tiempo y copia a us-east-2. "Versionar no es respaldar".
   - D4: red, identidad, cifrado y trazabilidad (S05). SG que referencian SG (Lab 04), IAM Role sin llaves y autenticación IAM a la base (Lab 05), Session Manager sin puerto 22.
   - D7: reportes por evento con Lambda (Lab 07). Entrega al menos una vez, así que la salida usa el id del pedido: idempotente.
4. **Qué sacrifico y qué riesgo conservo (60 s).** Un solo NAT, porque vender no depende de él. Techo de 6 instancias. Sin multi-región: RTO regional de 4 h. El 85% del costo normal es fijo.
5. **Cómo lo validaría (45 s).** Prueba de carga en un ambiente temporal, failover de RDS contando pedidos antes y después, ALB directo con timeout, y el mismo pedido dos veces para ver un solo reporte.

## Frases ancla

- "No escojo servicios por modernos: escojo el que responde a la restricción, y digo qué sacrifico."
- "Una alarma que nadie revisa es solo una notificación: aquí cada alarma actúa o tiene responsable."
- "Llegar no es estar autorizado: la red decide si llega, IAM si puede, el cifrado protege el dato y CloudTrail deja la evidencia."
- "CREATE_COMPLETE no demuestra que funciona: lo demuestran las pruebas de la sección 8."
- "Serverless mueve la frontera de responsabilidad, no la elimina."

## Números que hay que saber

- Costo: USD 173 en un mes normal y 292 en un mes con campaña; 158 y 206 con la capa gratuita de CloudFront. El 85% del mes normal es fijo.
- Trade-offs en dinero: Multi-AZ, USD 26 más al mes. Segundo NAT, 37. Seis EC2 fijas, 61. Créditos de t3 en campaña, 22.
- Más caro: RDS (52) y NAT (35). En campaña, CloudFront (88).
- ASG de 2 a 6, con mínimo 4 la víspera y target tracking al 50% de CPU.
- RTO y RPO: instancia, segundos y 0. AZ, 1 a 2 min y 0. Error humano, 1 h y 5 min. Región, 4 h y 1 h.
- Token IAM de la base: 15 minutos. Restauración a un punto: 7 días.

## Preguntas probables

Las preguntas orientadoras de cada semana, aplicadas al caso:

- **¿Por qué un balanceador solo no recupera capacidad?** El ALB solo manda tráfico a targets sanos; el que repone instancias es el ASG (Lab 02).
- **¿Qué debe ser cierto de la app para reemplazar una instancia sin perder nada?** Que sea stateless: sesión en RDS, archivos en S3 y la app en la AMI (supuesto 2).
- **¿Por qué S3 y RDS, y no EFS?** Lo decide el patrón de acceso. Objetos por clave van a S3; pedidos relacionales con transacciones, a RDS. No hay archivos que varias instancias editen a la vez, así que EFS sobra, y es el almacenamiento más caro.
- **¿Qué hace falta para que algo sea alcanzable desde Internet?** IP pública, ruta al Internet Gateway y un SG que lo permita. La app y la base no tienen ninguna de las dos primeras.
- **Si la EC2 llega a S3, ¿por qué puede recibir AccessDenied?** Porque llegar no es estar autorizado: la policy no concede esa Action sobre ese Resource (Lab 05).
- **¿Por qué el cifrado no demuestra autorización?** El cifrado protege el dato en reposo; quién lo lee lo decide IAM.
- **¿Qué miras en CloudTrail?** `eventName`, `userIdentity`, `eventTime`, `sourceIPAddress` y `requestParameters`.
- **¿Por qué CREATE_COMPLETE no prueba que funciona?** Solo dice que CloudFormation terminó. El comportamiento se prueba con señales: carga, métrica, alarma (Lab 06).
- **¿Por qué borrar el stack es parte de IaC?** Demuestra que todo el estado está en el template, y por eso puedo levantar y borrar el ambiente de prueba de carga.
- **¿Qué justificaría una VM en vez de Lambda?** Un proceso continuo, con estado local o dependencias del sistema operativo. La API es continua y el equipo opera Linux, así que va en EC2; los reportes son cortos e intermitentes, así que van en Lambda.
- **¿Qué transfiere Lambda a AWS y qué no?** AWS opera servidor, SO, runtime, capacidad y disponibilidad. Yo sigo a cargo de IAM, código, eventos, logs y costo.
- **¿Contenerizar es hacer microservicios?** No. Un contenedor empaqueta; los microservicios descomponen. Llevar la API a Fargate sería el mismo monolito empaquetado.
- **¿Qué complejidad nueva trae lo orientado a eventos?** Entrega al menos una vez, idempotencia, orden y errores parciales. Por eso solo lo uso en reportes.

Del caso:

- **¿Por qué un solo NAT si la resiliencia pesa más que el costo?** Porque vender no depende de él. La AMI trae la app, el token de la base se firma localmente, S3 va por el endpoint y el pago entra como webhook. Si la pasarela exigiera llamadas salientes, pondría un NAT por AZ (USD 37 más).
- **¿Por qué no Aurora Serverless v2?** Escala la base con la demanda, pero con alta disponibilidad necesita dos instancias y su costo es menos predecible. Si la alarma muestra que RDS es el cuello de botella, la evalúo junto con ElastiCache.
- **¿Por qué us-east-1 y no São Paulo?** Los cuatro criterios de S01: São Paulo es más cara, no es necesariamente más cercana en red desde Colombia, y CloudFront ya resuelve la latencia de lo estático.
- **¿Y si el pico supera las 6 instancias?** La API se degrada, pero lo estático sigue en CloudFront. La alarma de p95 con el ASG en su máximo dispara la decisión. Subir el máximo es un update del stack de minutos, si el presupuesto lo permite.
- **¿Y si la Lambda falla?** Lambda reintenta, la alarma de `Errors` avisa y el reporte se reprocesa desde `incoming/`. El pedido está a salvo en RDS.
- **¿Cómo pruebas que el ALB no es accesible directo?** Un `curl` al DNS del ALB da timeout; por CloudFront responde 200.
- **¿Por qué el ALB está en subnets públicas?** Para que CloudFront lo alcance; el SG con la prefix list cierra todo lo demás, y es el mismo control que probé en el Lab 04. Alternativa: VPC origins de CloudFront con un ALB interno, que ahorra 2 IPv4 (USD 7 al mes) y elimina la exposición, a cambio de una pieza que no practiqué en los labs.
- **¿Cómo sabes que el costo es real?** Son precios de la Price List API con supuestos de consumo explícitos. En operación lo controlan AWS Budgets y las etiquetas de costo.

## Restricción adicional: método para los 8 minutos

1. **Minutos 0 a 2.** ¿Qué restricción (R1 a R6) toca y cómo cambia la línea de prioridad? Reescribirla.
2. **Minutos 2 a 5.** ¿Qué decisión (D1 a D8) mantengo y cuál cambio? Mirar primero la sección 6 del Brief: varias restricciones ya tienen una señal y un siguiente paso.
3. **Minutos 5 a 7.** ¿Qué nuevo trade-off o riesgo aparece y cuánto cuesta en USD al mes?
4. **Minutos 7 a 8.** ¿Con qué prueba lo validaría? Reusar una de la sección 8 o definir una nueva.

Plantilla oral: "Mantengo X porque…; cambio Y por Z porque…; gano…, sacrifico…, el riesgo nuevo es…, y lo valido con…".

Primer movimiento ante restricciones posibles:

- **Presupuesto a la mitad (unos USD 90).** RDS Single-AZ (−26), sin NAT (−37: parches con una AMI nueva y acceso por EC2 Instance Connect Endpoint) y la capa gratuita de CloudFront (−15): queda en unos USD 95. Riesgo nuevo: si cae una AZ, la base se restaura (RTO 1 h, RPO 5 min).
- **Los datos personales no pueden salir de Colombia.** No hay región de AWS en Colombia. Los datos personales irían a infraestructura en el país, y la app en AWS los consultaría por VPN: nube híbrida. Trade-off: latencia y un sitio que operar (choca con R4).
- **Cifrado con llaves propias.** KMS con customer managed key en S3 y RDS (USD 1 al mes por llave). En RDS el cifrado se fija al crear: hay que tomar un snapshot, copiarlo con la llave nueva y restaurar, con una ventana de corte.
- **99,99% o RTO regional de minutos.** Warm standby en us-east-2: réplica de lectura de RDS entre regiones, ASG mínimo y failover de DNS del origen de la API. Casi duplica el costo fijo y suma complejidad.
- **Sin acceso SSH o auditoría estricta.** Ya no hay puerto 22: Session Manager con registro de sesiones en S3, y CloudTrail con data events en los buckets de datos de clientes.
- **Pico 10 veces mayor que el supuesto.** Subir el máximo del ASG con presupuesto aprobado, cachear en CloudFront el catálogo de `/api` que es de solo lectura, ElastiCache, y subir la clase de RDS antes de la campaña. Trade-off: costo y consistencia de la caché.
- **Inventario en línea ya, no después.** Cada tienda sube sus cambios de stock a `incoming/inventario/` con el patrón de D7. Riesgo: consistencia entre tienda y web; validar con conciliación diaria.
- **El equipo se reduce a una persona.** Mantengo todo administrado y automatizo más: el ASG y RDS ya se recuperan solos. Quito piezas (el NAT), dejo runbooks y alarmas a SNS. Riesgo: el conocimiento queda concentrado en una persona.

## Antes de la sesión

1. Entregar `decision-brief.pdf` a más tardar el **lunes 26 de octubre**. La presentación de apertura lo pone ese día; la guía v02 dice antes de las 6:00 p. m. del 28.
2. Releer el Brief con el diagrama y poder dibujarlo de memoria, con los pasos 1 a 4.
3. Saber los números de la sección anterior sin mirar.
4. Cronometrar los 6 minutos en voz alta.
