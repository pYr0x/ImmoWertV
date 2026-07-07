# ImmoWertV

Eine private Web-App, mit der ein Hausbesitzer den Verkehrswert seiner Doppelhaushälfte nach dem Sachwertverfahren der ImmoWertV (in Kraft seit 01.01.2022) transparent und nachvollziehbar berechnet. Jede Eingabeänderung aktualisiert das Ergebnis sofort; alle Formeln sind sichtbar.

## Language

### Verfahren

**ImmoWertV**:
Die Immobilienwertermittlungsverordnung vom 14.07.2021, in Kraft seit 01.01.2022. Rechtsgrundlage aller Berechnungen.
_Avoid_: ImmoWertV 2021, ImmoWertV 2022 (beide meinen dieselbe Verordnung — im Projekt nur „ImmoWertV")

**Sachwertverfahren**:
Das Wertermittlungsverfahren nach §§ 35 ff. ImmoWertV. Einziges im Projekt umgesetztes Verfahren.

**Verkehrswert**:
Der Endwert der Berechnung nach § 194 BauGB: marktangepasster Sachwert zzgl./abzgl. besonderer objektspezifischer Grundstücksmerkmale, kaufmännisch gerundet.
_Avoid_: Marktwert, Endpreis

### Berechnungsgrößen

**NHK**:
Normalherstellungskosten 2010 — Kostenkennwerte in €/m² BGF je Gebäudetyp und Standardstufe (Anlage 4 ImmoWertV).
_Avoid_: Herstellungskosten (das ist Kostenkennwert × Baupreisindex-Faktor × BGF)

**BGF**:
Brutto-Grundfläche in m² — Bezugsgröße der NHK-Kostenkennwerte (Bereiche a und b nach DIN 277).
_Avoid_: Wohnfläche (andere Größe, keine Berechnungsgrundlage)

**Standardstufe**:
Qualitätsstufe 1–5 einer Kostengruppe nach Anlage 4 ImmoWertV (Garagen: nur Stufe 3–5).
_Avoid_: Ausstattungsstufe

**Ausstattungsgrad**:
Die vom Nutzer erfasste prozentuale Verteilung der Standardstufen je Kostengruppe; bestimmt zusammen mit der Kostengruppen-Gewichtung den gewichteten Kostenkennwert.
_Avoid_: Ausstattung (umgangssprachlich)

**Kostengruppe**:
Bauteilgruppe mit fester Gewichtung bei der Ausstattungsbewertung (z. B. Außenwände 23 %, Dach 15 %). Haus und Garage haben unterschiedliche Kostengruppen und Gewichtungen.

**Baupreisindex-Faktor**:
Faktor zur zeitlichen Anpassung der NHK (Basis 2010) an den Wertermittlungsstichtag. Wird von der App vorgeschlagen und ist vom Nutzer überschreibbar.
_Avoid_: BPI (unklar, ob Index oder Faktor gemeint)

**Modernisierungspunkte**:
Summe (max. 20) der Punkte aus den acht Modernisierungselementen der Anlage 2 ImmoWertV; werden je Element einzeln erfasst, nie als Gesamtzahl eingegeben.

**Restnutzungsdauer (RND)**:
Nach Anlage 2 ImmoWertV aus Alter, Gesamtnutzungsdauer und Modernisierungspunkten berechnete verbleibende Nutzungsdauer; wird transparent mit Formel und Schwellenwert-Prüfung angezeigt.

**Gesamtnutzungsdauer (GND)**:
Modellgröße der wirtschaftlichen Nutzungsdauer ab Herstellung (Anlage 1 ImmoWertV; Ein-/Zweifamilienhäuser 80 Jahre).

**Alterswertminderung (AWM)**:
Linearer Wertabschlag (GND − RND) / GND × 100 auf die Herstellungskosten (§ 38 ImmoWertV); für Haus und Garage getrennt.

**Bodenwert**:
Grundstücksfläche × Bodenrichtwert (§ 40 ImmoWertV). Der Bodenrichtwert wird manuell eingetragen (Quelle: BORIS).

**Außenanlagen**:
Bauliche Außenanlagen und sonstige Anlagen, pauschal als vom Nutzer wählbarer Prozentsatz des Gebäudesachwerts angesetzt.

**Sachwertfaktor**:
Marktanpassungsfaktor des Gutachterausschusses (§ 39 ImmoWertV), manuell eingetragen; multipliziert den vorläufigen Sachwert.
_Avoid_: Marktanpassung (das ist der daraus resultierende €-Betrag)

**Besondere objektspezifische Grundstücksmerkmale**:
Zu-/Abschläge in € nach der Marktanpassung (§ 8 Abs. 3 ImmoWertV), manuell eingetragen.

### Objekte

**Bewertungsobjekt**:
Das zu bewertende Grundstück mit Haus und Garage. Haus und Garage werden getrennt bewertet (eigene BGF, eigener Ausstattungsgrad, eigene RND/AWM).
