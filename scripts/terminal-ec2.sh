#!/usr/bin/env bash
# Abre EC2 Instance Connect en Chrome, escribe un comando en la terminal y captura la ventana.
# Uso: ./scripts/terminal-ec2.sh <instance-id> "<comando>" <salida.png>
# Requiere que nadie use el teclado mientras corre: las teclas van a la app que esté al frente.
set -euo pipefail
iid=$1; cmd=$2; out=$3
here=$(dirname "$0")

open -a "Google Chrome" "https://us-east-1.console.aws.amazon.com/ec2-instance-connect/ssh?connType=standard&instanceId=$iid&osUser=ec2-user&region=us-east-1&sshPort=22"
sleep 15

# La terminal (xterm.js) no toma el foco sola; una URL javascript: escrita en la barra la enfoca.
osascript - "$cmd" <<'EOF'
on run argv
  tell application "Google Chrome" to activate
  delay 0.5
  tell application "System Events"
    if (name of (first application process whose frontmost is true)) is not "Google Chrome" then error "Chrome no está al frente"
    keystroke "l" using command down
    delay 0.4
    keystroke "javascript:void(document.querySelector(\"textarea.xterm-helper-textarea\").focus())"
    key code 36
    delay 1
    keystroke "clear; " & item 1 of argv
    key code 36
  end tell
end run
EOF
sleep 4

"$here/captura-consola.sh" "" "$out" 0
