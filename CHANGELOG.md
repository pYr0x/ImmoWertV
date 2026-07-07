# Changelog

Alle nennenswerten Änderungen an dieser App werden hier dokumentiert.

## [1.1.0] – 2026-07-07

Erste produktionsreife Fassung nach Validierung gegen zwei reale Gutachten.

### Neu

- **Amtliche Anwendungshinweise** aus Anlage 4 ImmoWertV direkt in der UI
  (neue Komponente `AmtlicherHinweis.svelte`, Datenbasis `src/lib/data/hinweise.ts`),
  farblich abgesetzt als Verordnungstext:
  - Hinweis zur Brutto-Grundfläche (Anlage 4 Abschnitt I Nr. 2) im BGF-Abschnitt.
  - Hinweise zur Gebäudeart je nach gewähltem NHK-Typ.
  - Bedeutung der Standardstufen bei Garagen (Fußnote zu Abschnitt II Nr. 12).
- **Amtliche Standardbeschreibungen** der Gebäudestandards (Anlage 4 Abschnitt III,
  Stufen 3–5) als aufklappbare Einstufungshilfe in der Ausstattungsmatrix
  (neue Datenbasis `src/lib/data/standards.ts`, `standardsFuer(code)`).
- **Amtliche Hinweise zur Punktevergabe** (Anlage 2 Abschnitt I) als aufklappbarer
  Bereich im Modernisierungs-Abschnitt (Kernsanierung, sachverständige Würdigung u. a.).

### Geändert

- **BPI-Standardkonstanten** auf die amtliche Destatis-Umbasierung (Basis 2021 = 100)
  umgestellt: Defaults in `src/lib/state.ts` auf `index2010: 70.8`, `index2021: 100`
  geändert, UI-Labels und Hinweis in `App.svelte` entsprechend angepasst. Die
  Muster-Gutachten-Tests verwenden weiterhin 90,1/127,0 als explizite Eingabe.
- **Formelanzeigen** durchgängig um die symbolische Gleichung ergänzt
  (z. B. `Herstellungskosten = Kennwert (Stichtag) × BGF = …`), damit jeder
  Rechenschritt ohne Vorwissen nachvollziehbar ist.
- **Restnutzungsdauer:** Die zuvor implementierte Kappung auf 70 % der GND
  entfällt. Die „maximal 70 %" in Anlage 2 beschreiben die Modellasymptote für
  sehr alte Gebäude, keine Kappung; für junge modernisierte Gebäude liefert die
  Formel regulär mehr (bis 90 % der GND). Feld `gekappt` aus `RndErgebnis` entfernt.
- `Feld`-Komponente: `content-start` für saubere Ausrichtung in Grid-Zeilen.

### Tests

- Neue Beispiel-Tests (`sachwert.beispiele.test.ts`), die zwei reale
  Gutachten centgenau reproduzieren.
- RND-Test an die entfernte Kappung angepasst (Modellasymptote statt Kappung).
