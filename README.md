# ImmoWert

Private Web-App zur Verkehrswertermittlung einer Wohnimmobilie nach dem
**Sachwertverfahren der ImmoWertV** (§§ 35–39, in Kraft seit 01.01.2022).
Jede Eingabeänderung aktualisiert das Ergebnis sofort; jeder Rechenschritt
wird mit Formel und eingesetzten Zahlen angezeigt.

## Funktionsumfang

- Komplette Rechenkette: Bodenwert → NHK 2010 (gewichteter Kostenkennwert über
  Ausstattungsgrad mit prozentualer Stufenmischung) → Baupreisindex-Umbasierung
  (überschreibbar) → Modernisierungspunkte nach Anlage 2 → Restnutzungsdauer →
  Alterswertminderung → Außenanlagen → Sachwertfaktor → besondere
  objektspezifische Grundstücksmerkmale → Verkehrswert (gerundet auf 1.000 €)
- Vollständige NHK-2010-Tabellen der Anlage 4 (alle Gebäudearten inkl.
  Wohnhaus-Matrix 1.01–3.33, Garagen, Landwirtschaft) als geprüfte,
  kommentierte Datendateien in `src/lib/data/`
- Haus und Garage getrennt bewertbar (eigene BGF, Ausstattung, RND/AWM)
- Autosave in `localStorage`, JSON-Export/-Import, Druckansicht (Strg+P)

## Entwicklung

```bash
pnpm install
pnpm dev        # Entwicklungsserver
pnpm test       # Vitest — reproduziert u. a. das Muster-Gutachten exakt
pnpm check      # svelte-check (TypeScript)
pnpm build      # Produktions-Build nach dist/
```

Stack: Vite + Svelte 5 + TypeScript + Tailwind CSS 4 + shadcn-svelte
(siehe `docs/adr/0001-svelte5-shadcn-svelte.md`).

## Deployment (Cloudflare)

1. Repo zu GitHub pushen (privates Repo — `docs/` ist bis auf die ADRs
   von Git ausgenommen).
2. Cloudflare-Dashboard → *Workers & Pages* → *Create* → *Connect to Git*.
3. Build-Command `pnpm build` (oder `npm run build`), Output-Verzeichnis `dist`.
4. Jeder Push deployt automatisch.

## Hinweise

- Eigennutzung, keine Rechtsberatung/kein Gutachten.
- Datenbasis: ImmoWertV vom 14.07.2021, Anlagen 1, 2 und 4
  (gesetze-im-internet.de). Bodenrichtwert, Sachwertfaktor und Baupreisindex
  werden manuell eingetragen (BORIS, Grundstücksmarktbericht, Destatis).
- Alle Eingaben bleiben lokal im Browser (localStorage); es gibt kein Backend.
