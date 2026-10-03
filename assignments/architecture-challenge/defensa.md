# Guion de defensa: Digital Café Luna

Sergio Alfredo Junca Valero · 6 minutos de presentación + unos 6 de preguntas. Antes de empezar se revela una restricción adicional y hay 8 minutos para analizarla. El Brief ya entregado no se modifica: la adaptación se explica oralmente.

Cadena que debe sonar en cada respuesta: restricción, decisión, mecanismo, evidencia, trade-off, alternativa.

## Guion de 6 minutos

1. **Problema (45 s).** Campaña nacional de pocos días, demanda incierta, datos de clientes y pedidos, equipo pequeño, presupuesto limitado. Prioridades: elasticidad, resiliencia y costo acotado.
2. **Arquitectura (60 s).** Mostrar el diagrama. CloudFront y ALB son lo único público. App en subnets privadas, base de datos en subnets sin ruta a Internet, dos AZ.
3. **Cuatro decisiones (2 min 30 s).**
   - Estático a S3 y CloudFront: el pico de campaña no consume cómputo.
   - EC2 con ASG 2 a 6 detrás de ALB: lo probé en el Lab 02 (retiro de tráfico y reemplazo). El máximo 6 es el techo de costo.
   - RDS PostgreSQL Multi-AZ: datos transaccionales y equipo que conoce SQL; failover automático.
   - Seguridad por capas: cada SG referencia al anterior; IAM Role sin access keys (Lab 05); CloudTrail para atribuir.
4. **Qué sacrifico y qué riesgo conservo (60 s).** Un solo NAT (si cae su AZ, la app pierde salida a Internet, no a S3 ni a la base). Sin DR en otra región: falla regional implica restaurar, RTO de horas. EC2 en vez de serverless: capacidad ociosa fuera de campaña.
5. **Cómo lo validaría (45 s).** Prueba de carga hasta el pico, terminar una instancia, forzar failover de RDS y medir RTO, intentar llegar a la base desde fuera y ver el timeout.

## Preguntas probables y respuesta corta

- **¿Por qué EC2 y no serverless o contenedores?** Equipo pequeño y modelo conocido. Serverless exige rediseñar y capacitar antes de la campaña. Alternativa a futuro: ECS Fargate.
- **¿Por qué RDS y no DynamoDB?** Pedidos y clientes son relacionales y transaccionales. DynamoDB escala mejor pero obliga a modelar por patrones de acceso.
- **¿Qué pasa si cae una AZ?** ALB y ASG siguen en la otra AZ; RDS hace failover. Se pierde el NAT si estaba en esa AZ.
- **¿Por qué un solo NAT?** Cuesta unos USD 35 a 50 al mes por unidad. Aceptable porque la app casi no necesita Internet; S3 va por gateway endpoint.
- **¿Qué es lo más caro y cómo lo bajas?** NAT, RDS Multi-AZ y horas de cómputo. Quitar el NAT con endpoints, bajar el ASG después de la campaña.
- **¿Cómo pruebas que el AccessDenied es autorización y no red?** El GetObject permitido funciona desde la misma EC2 y el mismo role; solo cambia Resource o Action (Lab 05).
- **¿RPO y RTO?** RPO de 5 minutos y RTO de 1 hora ante falla de zona; 4 horas ante falla regional con backup y restore. Son supuestos que el negocio debe confirmar.
- **¿Cómo escalas si el pico supera 6 instancias?** Subir el máximo tras medir; target tracking sobre CPU; CloudFront ya absorbe lo estático.

## Plan para la restricción sorpresa (8 minutos)

Ordenar la respuesta así: 1) qué decisión mantengo, 2) qué cambio, 3) qué nuevo trade-off o riesgo aparece, 4) cómo validaría el cambio. Ejemplos de restricción y primer movimiento:

- **Presupuesto recortado a la mitad:** quitar el NAT con endpoints, RDS Single-AZ en no productivo, máximo del ASG más bajo. Riesgo: menos resiliencia.
- **Datos que no pueden salir del país o requisito de cifrado con llaves propias:** KMS con customer managed key en S3 y RDS. Trade-off: costo y gestión de llaves.
- **Disponibilidad exigida de 99,99% o RTO de minutos ante falla regional:** warm standby en otra región con réplica de RDS y Route 53 failover. Trade-off: costo y complejidad.
- **Equipo sin acceso SSH permitido:** SSM Session Manager con endpoints, sin puerto 22. Riesgo: más endpoints y configuración.
- **Pico 10 veces mayor:** subir máximo del ASG, caché en CloudFront para /api de solo lectura, ElastiCache. Trade-off: invalidación de caché y consistencia.

## Antes de la sesión

1. Releer el Brief completo con el diagrama.
2. Poder dibujar el diagrama de memoria en un tablero.
3. Tener los números de costo verificados en Pricing Calculator.
4. Cronometrar los 6 minutos en voz alta.
