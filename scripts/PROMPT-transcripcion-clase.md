# Prompt: leer la transcripción de una clase en Teams con Claude en el navegador

Uso: abrir Claude Code en esta carpeta, con la extensión Claude in Chrome conectada y la sesión de
Teams/Stream iniciada en Chrome. Pegar el prompt y cambiar la fecha.

---

Usa Claude in Chrome (mi Chrome, con mi sesión de EAFIT) para leer la transcripción de la clase de
Computación en Nube del FECHA (AAAA-MM-DD), de 6:00 a 8:00 p. m.

1. Abre una pestaña nueva en Teams (https://teams.microsoft.com), canal o chat de la clase ST1611,
   y busca la grabación de esa fecha. Si no está ahí, búscala en Stream (https://www.microsoft365.com/launch/stream).
2. Abre la grabación y el panel "Transcripción". No reproduzcas el video ni cambies nada.
3. El panel carga el texto a medida que haces scroll: baja hasta el final y lee todas las líneas
   con su marca de tiempo y quién habla. Si existe el botón "Descargar" (.docx o .vtt), úsalo y lee el archivo.
4. Guarda todo, sin resumir, en `~/Downloads/transcripcion-clase-AAAA-MM-DD.md` con este formato:

   ```
   # Clase AAAA-MM-DD: tema principal

   Fecha: AAAA-MM-DD, 6:00 PM - 8:00 PM
   Fuente: transcripción de Microsoft Teams/Stream (generada por IA, puede tener errores)

   [mm:ss] Nombre: texto
   ```

5. Verifica que la última marca de tiempo esté cerca del final de la grabación. Si falta texto, vuelve a hacer scroll.
6. Después, en `notes.md`, agrega arriba una sección de la clase con lo que dijo el profe, sobre todo
   entregas, fechas, rúbrica, formato y preguntas que hará. Cita la marca de tiempo. No expliques nada.
7. Si dijo algo de entregas o fechas, actualiza `board.md` (tabla y bitácora).

Si Teams pide iniciar sesión o MFA, detente y avísame; no escribas credenciales. No commitees.
