#!/usr/bin/env bash
# Abre una URL de la consola AWS en Chrome y captura solo la ventana de Chrome,
# aunque otra ventana la tape (captura por ID de ventana, no por región de pantalla).
# Uso: ./scripts/captura-consola.sh <url> <salida.png> [espera_segundos]
# Con <url> vacía no abre nada: captura la pestaña que ya está al frente.
set -euo pipefail
url=$1; out=$2; wait=${3:-7}

[ -n "$url" ] && open -a "Google Chrome" "$url"
osascript -e 'tell application "Google Chrome" to activate'
sleep "$wait"

# Ventana de Chrome más al frente (la lista viene ordenada de adelante hacia atrás).
wid=$(osascript -l JavaScript -e '
ObjC.import("CoreGraphics");
const l = ObjC.deepUnwrap(ObjC.castRefToObject($.CGWindowListCopyWindowInfo($.kCGWindowListOptionOnScreenOnly, 0)));
l.find(w => w.kCGWindowOwnerName === "Google Chrome" && w.kCGWindowLayer === 0 && w.kCGWindowBounds.Height > 300).kCGWindowNumber')

mkdir -p "$(dirname "$out")"
screencapture -x -o -l"$wid" "$out"
sips -Z 1800 "$out" >/dev/null
echo "$out"
