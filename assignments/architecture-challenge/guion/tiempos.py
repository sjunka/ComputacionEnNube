"""Calcula el tiempo de cada lámina de guion.md (150 palabras por minuto) y reescribe las líneas Tiempo y Total."""
import re, sys

PPM = 150
ASIGNADO = 600
ruta = sys.argv[1] if len(sys.argv) > 1 else "guion.md"
texto = open(ruta, encoding="utf-8").read()

OPC = re.compile(r"\[([^\]]*)\]\{\.opc\}")
def palabras(t):
    return len(re.sub(r"[\[\]{}.]opc|\*\*|`", "", t).split())
def seg(n):
    return round(n * 60 / PPM)

partes = re.split(r"(?m)^(?=### )", texto)
base_total = opc_total = 0
salida = []
for p in partes:
    if re.match(r"### \d\d ·", p):
        cuerpo = [l for l in p.splitlines()[1:] if l.strip() and not l.startswith(("**Tiempo", "**Clic", "!["))]
        cuerpo = "\n".join(cuerpo)
        extra = sum(palabras(m) for m in OPC.findall(cuerpo))
        base = palabras(OPC.sub("", cuerpo))
        sb, st = seg(base), seg(base + extra)
        base_total += sb
        opc_total += st
        linea = f"**Tiempo:** {sb} s" + (f" ({st} s con lo opcional)" if extra else "")
        p = re.sub(r"(?m)^\*\*Tiempo:\*\*.*$", lambda _: linea, p, count=1)
    salida.append(p)
texto = "".join(salida)

def mmss(s):
    return f"{s // 60}:{s % 60:02d}"
texto = re.sub(r"(?m)^\*\*Sin lo opcional:\*\*.*$", f"**Sin lo opcional:** {base_total} s ({mmss(base_total)})", texto)
texto = re.sub(r"(?m)^\*\*Con lo opcional:\*\*.*$", f"**Con lo opcional:** {opc_total} s ({mmss(opc_total)}), {'dentro' if opc_total <= ASIGNADO else 'por encima'} de los {ASIGNADO} s", texto)
open(ruta, "w", encoding="utf-8").write(texto)
print(f"sin opcional {base_total} s, con opcional {opc_total} s, asignado {ASIGNADO} s")
