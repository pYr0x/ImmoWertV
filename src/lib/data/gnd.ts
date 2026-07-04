/**
 * Anlage 1 ImmoWertV (zu § 12 Absatz 5 Satz 1)
 * Modellansätze für die Gesamtnutzungsdauer (GND)
 * Quelle: https://www.gesetze-im-internet.de/immowertv_2022/anlage_1.html
 * (Fundstelle: BGBl. I 2021, 2819)
 */
export interface GndEintrag {
  art: string;
  jahre: number;
}

export const GND_TABELLE: GndEintrag[] = [
  { art: "freistehende Ein- und Zweifamilienhäuser, Doppelhäuser, Reihenhäuser", jahre: 80 },
  { art: "Mehrfamilienhäuser", jahre: 80 },
  { art: "Wohnhäuser mit Mischnutzung", jahre: 80 },
  { art: "Geschäftshäuser", jahre: 60 },
  { art: "Bürogebäude, Banken", jahre: 60 },
  { art: "Gemeindezentren, Saalbauten, Veranstaltungsgebäude", jahre: 40 },
  { art: "Kindergärten, Schulen", jahre: 50 },
  { art: "Wohnheime, Alten- und Pflegeheime", jahre: 50 },
  { art: "Krankenhäuser, Tageskliniken", jahre: 40 },
  { art: "Beherbergungsstätten, Verpflegungseinrichtungen", jahre: 40 },
  { art: "Sporthallen, Freizeitbäder, Heilbäder", jahre: 40 },
  { art: "Verbrauchermärkte, Autohäuser", jahre: 30 },
  { art: "Kauf- und Warenhäuser", jahre: 50 },
  { art: "Einzelgaragen", jahre: 60 },
  { art: "Tief- und Hochgaragen als Einzelbauwerk", jahre: 40 },
  { art: "Betriebs- und Werkstätten, Produktionsgebäude", jahre: 40 },
  { art: "Lager- und Versandgebäude", jahre: 40 },
  { art: "Landwirtschaftliche Betriebsgebäude", jahre: 30 },
];

/**
 * Hinweis aus Anlage 1: Für nicht aufgeführte Arten baulicher Anlagen ist die
 * Gesamtnutzungsdauer aus der GND vergleichbarer baulicher Anlagen abzuleiten.
 */
