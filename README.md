# Nexus Dashboard

Szenisches Vollbild-Dashboard für Home Assistant als **eine** Lovelace-Karte: Glas-Karten über animierten Hintergründen, Symbolleiste links, fünf Seiten.

| Seite | Szene | Inhalt |
|---|---|---|
| Zuhause | Regengarten | Uhr & Wetter, Müllabfuhr, Kraftstoffpreise, Licht pro Raum (Helligkeit, Farben), Saugroboter, Steckdosen, Termine, nächste Abholung, Aufgaben, Fernseher |
| Haus | Abenddämmerung | Schaltzentrale für alle Lampen und Verbraucher (nach Räumen), beliebige eingebettete HA-Karten (`house_cards`, z. B. Lageplan oder Grundriss) |
| Woche | Herbstwald | Nächste Termine, 14-Tage-Raster mit Mülltagen, Countdown Heiligabend, „Meine Woche“, Akkus aller Geräte |
| Abend | Lagerfeuer | Nachtuhr, Zentrale mit Hausschaltern und Abläufen, Notaus (gedrückt halten), Fernseher |
| Lage | Fluss bei Nacht | Wetter mit Vorhersage, Warnlage, Pegel mit Grenzen, Sonne & Mond, Kameras |
| Netz | Weltraum | Lebende Übersichtskarte aller Bereiche |

Alle Grafiken sind eigene SVG/CSS-Zeichnungen. Die Karte nutzt die Anmeldung von Home Assistant direkt – kein Token, keine eigene Seite.

## Installation

**Ressource hinzufügen** (Einstellungen → Dashboards → ⋮ → Ressourcen → Ressource hinzufügen, Typ „JavaScript-Modul“):

```
https://cdn.jsdelivr.net/gh/indy1979-hub/nexus-dashboard@main/dist/nexus-dashboard.js
```

Für eine feste Version statt `@main` einen Commit-Hash einsetzen, z. B. `@<commit>`.

**Dashboard anlegen**: neues Dashboard → Ansicht vom Typ „Panel (einzelne Karte)“ → Karte manuell hinzufügen, Inhalt aus [`example-config.yaml`](example-config.yaml) einfügen und die Entitäten durch eigene ersetzen.

## Konfiguration

Alle hausbezogenen Angaben stehen in der Kartenkonfiguration, nicht im Code. Nicht genutzte Blöcke einfach weglassen. Siehe [`example-config.yaml`](example-config.yaml).

- `rooms` – Räume mit `lights`, `switches`, `style` (`pendant`, `twin`, `stairs`)
- `calendars`, `todos`, `waste` – Kalender, Aufgabenlisten, Müllsensoren (Tage + Datum)
- `routines`, `night_actions`, `house_switches`, `emergency` – Abläufe und Schalter
- `warnings`, `gauge`, `sky`, `cameras` – Lageseite
- `extra_pages` – weitere Seiten in der Symbolleiste; Inhalte aus einer vorhandenen HA-Ansicht (`source`) oder eigene `sections`, Hintergrund wählbar (u. a. Nordlicht)
- `network_health` – bis zu sechs Gesundheitswerte als eigener Knoten auf der Netzkarte
- `fuel` – Kraftstoffpreise (günstigster Preis, Wunschpreis, Preisalarm, Tankstellen im Vergleich)
- `house_cards` – Liste `{ title, icon, card: { … } }` mit beliebigen Lovelace-Karten; `switchboard_exclude` – Entitäten/Muster für die Schaltzentrale ausblenden

## Selbst bauen

```
npm install
npm run build
```

Ergebnis: `dist/nexus-dashboard.js`.

## Lizenz

MIT
