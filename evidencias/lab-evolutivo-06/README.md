# Laboratorio evolutivo 06: Operación y automatización

Cuenta individual · us-east-1 · 14 oct 2026, 15:50–16:13 UTC (10:50–11:13 Bogotá) · Creado por CloudFormation (`dcl:managed-by = cloudformation`).

| Logical ID | Tipo | Physical ID |
|---|---|---|
| OpsSecurityGroup | AWS::EC2::SecurityGroup | sg-07c1984da0189c7f5 · 0 reglas inbound |
| OpsInstance | AWS::EC2::Instance | i-0260e3f9055d03452 · t3.micro · 10.20.1.202 · us-east-1a · sin IP pública |
| CpuHighAlarm | AWS::CloudWatch::Alarm | dcl-dev-stack-ops-s06-cpu-high · Average ≥ 70 · 300 s · 2 de 2 · sin acciones |

- Template: [s06-ops-cloudformation.yaml](s06-ops-cloudformation.yaml). Validación: [01-validate.txt](01-validate.txt)
- Creación: [02-resources.txt](02-resources.txt), [03-events.txt](03-events.txt), [04-ec2.txt](04-ec2.txt), [05-sg.txt](05-sg.txt). CREATE_COMPLETE en 26 s (15:50:20 → 15:50:46).
- Métrica y alarma: [06-alarm-inicial.txt](06-alarm-inicial.txt), [07-alarm-history.txt](07-alarm-history.txt), [08-alarm-alarm.txt](08-alarm-alarm.txt), [09-cpu.txt](09-cpu.txt), gráfica `consola/07-cpu-grafica.png`
  - CPUUtilization (Average, 5 min): 15:50 75% · 15:55 100% · 16:00 100% · 16:05 30% · 16:10 0.2%
  - Alarma: INSUFFICIENT_DATA → OK 15:51:58 (el primer periodo incluía minutos antes del arranque) → ALARM 15:56:58 (2 de 2 datapoints ≥ 70) → OK 16:07:30 (terminó la carga)
- Update v1 → v2: [10-update.txt](10-update.txt). Change set con `Replacement: False` en los tres recursos; UPDATE_COMPLETE 15:58:34; mismo InstanceId; tag y descripción de la alarma en v2.
- Cleanup: [11-cleanup.txt](11-cleanup.txt). DELETE_COMPLETE 16:12:48. Sin EC2, volúmenes, SG del stack ni alarmas. Queda el baseline S01.

**Causalidad:** la elevación de CPU cae dentro de los 900 s del user data en el InstanceId del stack, la transición a ALARM ocurre cuando hay dos periodos sobre 70% y la alarma vuelve a OK cuando la carga termina.
