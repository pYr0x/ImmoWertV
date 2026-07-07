# TODO – Abweichungen aus der Validierung (07.07.2026)

Befunde aus dem Abgleich der Sachwert-Berechnung mit zwei Beispiel-Gutachten
(`docs/download-immobilienbewertung-bonn-beispiel.pdf`, Verkehrswert 522.000 €;
`docs/verkehrswertermittlung.pdf` Burscheid, Verkehrswert 437.000 €) und dem
amtlichen Verordnungstext (gesetze-im-internet.de). Der Rechenkern reproduziert
beide Gutachten centgenau (siehe `src/lib/berechnung/sachwert.beispiele.test.ts`);
die folgenden Punkte sind Modell-/Feature-Lücken, keine Rechenfehler.

## 2. Herstellungskosten sonstiger Bauteile ergänzen

- **Ist:** Kein Eingabefeld für Zuschläge auf die Herstellungskosten vor der
  Alterswertminderung (Gauben, Balkone, Vordach, Terrasse, Kamin, Außentreppe …).
- **Beleg:** Burscheid-Gutachten S. 33: Summe sonstige Bauteile 159.350 €, wird zu den
  HK des Basisgebäudes addiert und unterliegt derselben AWM wie das Gebäude.
- **Anpassung:** Positionsliste (Bezeichnung + Betrag €) je Gebäude im State; Summe wird
  in `herstellungskosten`-Kette nach `kennwertStichtag × BGF` addiert, bevor AWM greift.

## 3. Regionalfaktor als eigener Rechenschritt

- **Ist:** Nur `anpassungsfaktor` auf den Kostenkennwert (vor BPI). Multiplikativ
  äquivalent, erfasst aber sonstige Bauteile (Punkt 2) nicht mit, und die
  Rundungsreihenfolge weicht vom Gutachten-Schema ab.
- **Beleg:** Burscheid S. 37: (HK Basisgebäude 322.254,66 + sonstige Bauteile 159.350) × 1,06
  = 510.500,94 € — Regionalfaktor wirkt auf die Summe.
- **Anpassung:** Eigenes Feld „Regionalfaktor", angewendet auf (HK + sonstige Bauteile),
  kaufmännisch auf Cent gerundet.

## 4. Bodenwert mit mehreren Teilflächen

- **Ist:** `bodenwert.flaeche × bodenwert.richtwert` — genau eine Fläche.
- **Beleg:** Burscheid S. 25: Bauland 530 m² × 381,10 € + Hinterland/Gartenland
  680 m² × 85 € = 259.783 €. Muss aktuell manuell vorverrechnet werden.
- **Anpassung:** Liste von Teilflächen (Bezeichnung, Fläche, Wertansatz €/m²), Summe als
  Bodenwert; optional Anpassungsfaktoren je Teilfläche (Umrechnungskoeffizienten).

## 5. Modernisierungspunkte auch für die Garage

- **Ist:** `App.svelte` nutzt für die Garage fest `restnutzungsdauerEinfach` (GND − Alter);
  Modernisierungspunkte sind nur beim Hauptgebäude erfassbar.
- **Beleg:** Burscheid S. 35/36 wendet Tabelle 3 der Anlage 2 auch auf die Garage an
  (GND 60, Alter 25, 5 Punkte → RND 36 statt 35 Jahre).
- **Anpassung:** Optionale Punktevergabe (oder Pauschalpunktzahl) für die Garage in der UI;
  die Rechenfunktion `restnutzungsdauer` unterstützt das bereits (durch Test abgedeckt).

## 6. Schalter: RND ohne Modernisierung linear statt Tabelle-3-Formel

- **Ist:** Oberhalb des Schwellenwerts wendet die App auch bei 0 Punkten die Formel an
  (streng nach Tabelle 3, die eine 0-Punkte-Zeile hat).
- **Beleg:** Bonn-Gutachten S. 26 setzt ohne Modernisierungen RND = GND − Alter an
  (10 statt 15 Jahre; beim dortigen Objekt +34.782 € Unterschied im Gebäudewert).
  Beide Lesarten kommen in der Praxis vor.
- **Anpassung:** Umschalter „ohne Modernisierung linear (GND − Alter)" beim Hauptgebäude,
  Default: Formel nach Anlage 2 (heutiges Verhalten). Beide Pfade sind als pure
  Funktionen vorhanden und getestet.

## Erledigt (im Zuge der Validierung)

- ~~BPI-Standardkonstanten auf amtliche Destatis-Umbasierung umgestellt~~ — Defaults in
  `src/lib/state.ts` auf `index2010: 70.8`, `index2021: 100` (Basis 2021 = 100) geändert,
  UI-Labels/Hinweis in `App.svelte` angepasst. Muster-Gutachten-Tests nutzen weiterhin
  90,1/127,0 als explizite Eingabe — unberührt, 44 Tests grün.
- ~~70-%-Kappung der RND entfernt~~ — die „maximal 70 % der GND" in Anlage 2 sind die
  Modellasymptote für sehr alte Gebäude, keine Rechenanweisung; die Kappung hätte junge
  modernisierte Gebäude fälschlich beschnitten (Burscheid: 56 statt 58 Jahre).
- ~~Regressionstests für beide Beispiel-Gutachten~~ — `sachwert.beispiele.test.ts`, 39 Tests grün.
