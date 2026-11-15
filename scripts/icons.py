"""Erzeugt src/icons.json mit genau den MDI-Symbolen, die der Code und die Beispielkonfiguration nutzen."""
import json, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
full = json.loads((root / "node_modules/@iconify-json/mdi/icons.json").read_text())
names = set()
for f in list((root / "src").rglob("*.tsx")) + list((root / "src").rglob("*.ts")) + [root / "example-config.yaml"]:
    if f.exists():
        names |= set(re.findall(r"mdi:([a-z0-9-]+)", f.read_text()))
names |= {"satellite-variant", "map-outline", "battery", "battery-50", "cellphone", "tablet", "watch", "remote", "motion-sensor", "thermometer"}

icons, aliases = {}, {}
for n in sorted(names):
    if n in full["icons"]:
        icons[n] = full["icons"][n]
    elif n in full.get("aliases", {}):
        a = full["aliases"][n]
        aliases[n] = a
        icons[a["parent"]] = full["icons"][a["parent"]]
    else:
        print("fehlt:", n)
out = {"prefix": "mdi", "icons": icons, "aliases": aliases, "width": full.get("width", 24), "height": full.get("height", 24)}
(root / "src/icons.json").write_text(json.dumps(out, separators=(",", ":")))
print(len(icons), "Symbole")
