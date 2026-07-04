/**
 * Anlage 2 ImmoWertV (zu § 12 Absatz 5 Satz 1)
 * Ermittlung der Restnutzungsdauer bei Modernisierungen
 * Quelle: https://www.gesetze-im-internet.de/immowertv_2022/anlage_2.html
 * (Fundstelle: BGBl. I 2021, 2820—2821)
 */

/** Tabelle 1: Modernisierungselemente mit den maximal zu vergebenden Punkten */
export interface Modernisierungselement {
  id: string;
  bezeichnung: string;
  maxPunkte: number;
}

export const MODERNISIERUNGSELEMENTE: Modernisierungselement[] = [
  { id: "dach", bezeichnung: "Dacherneuerung inklusive Verbesserung der Wärmedämmung", maxPunkte: 4 },
  { id: "fenster", bezeichnung: "Modernisierung der Fenster und Außentüren", maxPunkte: 2 },
  { id: "leitungen", bezeichnung: "Modernisierung der Leitungssysteme (Strom, Gas, Wasser, Abwasser)", maxPunkte: 2 },
  { id: "heizung", bezeichnung: "Modernisierung der Heizungsanlage", maxPunkte: 2 },
  { id: "waermedaemmung", bezeichnung: "Wärmedämmung der Außenwände", maxPunkte: 4 },
  { id: "baeder", bezeichnung: "Modernisierung von Bädern", maxPunkte: 2 },
  { id: "innenausbau", bezeichnung: "Modernisierung des Innenausbaus, z. B. Decken, Fußböden, Treppen", maxPunkte: 2 },
  { id: "grundriss", bezeichnung: "Wesentliche Verbesserung der Grundrissgestaltung", maxPunkte: 2 },
];

/** Tabelle 2: Modernisierungsgrad nach Gesamtpunktzahl (informativ für die Anzeige) */
export const MODERNISIERUNGSGRADE: { vonPunkte: number; bisPunkte: number; grad: string }[] = [
  { vonPunkte: 0, bisPunkte: 1, grad: "nicht modernisiert" },
  { vonPunkte: 2, bisPunkte: 5, grad: "kleine Modernisierungen im Rahmen der Instandhaltung" },
  { vonPunkte: 6, bisPunkte: 10, grad: "mittlerer Modernisierungsgrad" },
  { vonPunkte: 11, bisPunkte: 17, grad: "überwiegend modernisiert" },
  { vonPunkte: 18, bisPunkte: 20, grad: "umfassend modernisiert" },
];

/**
 * Tabelle 3: Variablen a, b, c und relatives Alter (Schwellenwert) je Modernisierungspunktzahl.
 * RND = a · Alter² / GND − b · Alter + c · GND   (nur wenn relatives Alter ≥ Schwellenwert)
 * sonst: RND = GND − Alter.
 * Die RND ist auf maximal 70 % der GND gestreckt (Modellannahme der Anlage 2;
 * bei kernsanierten Objekten bis zu 90 % — Kernsanierung wird über das Baujahr abgebildet).
 */
export interface RndKoeffizienten {
  punkte: number;
  a: number;
  b: number;
  c: number;
  /** Schwellenwert „ab einem relativen Alter von" als Anteil (0.60 = 60 %) */
  abRelativemAlter: number;
}

export const RND_TABELLE3: RndKoeffizienten[] = [
  { punkte: 0, a: 1.25, b: 2.625, c: 1.525, abRelativemAlter: 0.6 },
  { punkte: 1, a: 1.25, b: 2.625, c: 1.525, abRelativemAlter: 0.6 },
  { punkte: 2, a: 1.0767, b: 2.2757, c: 1.3878, abRelativemAlter: 0.55 },
  { punkte: 3, a: 0.9033, b: 1.9263, c: 1.2505, abRelativemAlter: 0.55 },
  { punkte: 4, a: 0.73, b: 1.577, c: 1.1133, abRelativemAlter: 0.4 },
  { punkte: 5, a: 0.6725, b: 1.4578, c: 1.085, abRelativemAlter: 0.35 },
  { punkte: 6, a: 0.615, b: 1.3385, c: 1.0567, abRelativemAlter: 0.3 },
  { punkte: 7, a: 0.5575, b: 1.2193, c: 1.0283, abRelativemAlter: 0.25 },
  { punkte: 8, a: 0.5, b: 1.1, c: 1.0, abRelativemAlter: 0.2 },
  { punkte: 9, a: 0.466, b: 1.027, c: 0.9906, abRelativemAlter: 0.19 },
  { punkte: 10, a: 0.432, b: 0.954, c: 0.9811, abRelativemAlter: 0.18 },
  { punkte: 11, a: 0.398, b: 0.881, c: 0.9717, abRelativemAlter: 0.17 },
  { punkte: 12, a: 0.364, b: 0.808, c: 0.9622, abRelativemAlter: 0.16 },
  { punkte: 13, a: 0.33, b: 0.735, c: 0.9528, abRelativemAlter: 0.15 },
  { punkte: 14, a: 0.304, b: 0.676, c: 0.9506, abRelativemAlter: 0.14 },
  { punkte: 15, a: 0.278, b: 0.617, c: 0.9485, abRelativemAlter: 0.13 },
  { punkte: 16, a: 0.252, b: 0.558, c: 0.9463, abRelativemAlter: 0.12 },
  { punkte: 17, a: 0.226, b: 0.499, c: 0.9442, abRelativemAlter: 0.11 },
  { punkte: 18, a: 0.2, b: 0.44, c: 0.942, abRelativemAlter: 0.1 },
  { punkte: 19, a: 0.2, b: 0.44, c: 0.942, abRelativemAlter: 0.1 },
  { punkte: 20, a: 0.2, b: 0.44, c: 0.942, abRelativemAlter: 0.1 },
];

export const MAX_MODERNISIERUNGSPUNKTE = 20;

export function modernisierungsgrad(punkte: number): string {
  const eintrag = MODERNISIERUNGSGRADE.find((g) => punkte >= g.vonPunkte && punkte <= g.bisPunkte);
  return eintrag?.grad ?? "unbekannt";
}
