# Svelte 5 + TypeScript + shadcn-svelte als App-Stack

Der Nutzer (Programmierer, Einzelanwender) will eine einfache, jederzeit nachvollziehbare Web-App, in deren Code er selbst eingreifen kann. Wir bauen mit Svelte 5 + TypeScript (Vite als Buildtool), Tailwind CSS und shadcn-svelte: Die Rechenkette des Sachwertverfahrens bildet sich 1:1 als `$derived`-Kette ab (jede Zwischengröße eine lesbare Zeile, automatische Neuberechnung bei jeder Eingabe), und shadcn-svelte kopiert alle UI-Komponenten als editierbare `.svelte`-Dateien ins Projekt statt sie als Blackbox-Paket zu installieren.

## Considered Options

- **React + shadcn/ui (Original)** — größtes Ökosystem, aber Hooks/Render-Modell widerspricht dem Einfachheits-Kriterium.
- **Vanilla TypeScript** — null Abhängigkeiten, aber manuelle Reaktivitätsverdrahtung bei ~15 Eingaben und langer Rechenkette.
