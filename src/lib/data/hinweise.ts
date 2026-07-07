/**
 * Amtliche Anwendungshinweise aus der Anlage 4 ImmoWertV (Abschnitt I und
 * Fußnoten des Abschnitts II), sinngemäß gekürzt am amtlichen Wortlaut.
 * Quelle: https://www.gesetze-im-internet.de/immowertv_2022/anlage_4.html
 * (Fundstelle: BGBl. I 2021, 2824—2855; Abruf: 07.07.2026)
 *
 * Diese Texte werden in der UI farblich abgesetzt als „Amtlicher Hinweis"
 * angezeigt. Es sind ausschließlich Inhalte der Verordnung — keine
 * Software-Konventionen oder eigenen Einschätzungen.
 */

export interface AmtlicherHinweis {
  quelle: string;
  punkte: string[];
}

/** Anlage 4 Abschnitt I Nr. 2: Brutto-Grundfläche */
export const BGF_HINWEIS: AmtlicherHinweis = {
  quelle: "Anlage 4 Abschnitt I Nr. 2 ImmoWertV",
  punkte: [
    "Anzurechnen sind nur die Grundflächen der Bereiche a (überdeckt und allseitig in voller Höhe umschlossen) und b (überdeckt, nicht allseitig umschlossen). Balkone — auch überdeckte — gehören zu Bereich c und zählen nicht zur BGF.",
    "Maßgeblich sind die äußeren Maße der Baukonstruktionen einschließlich Bekleidung, in Höhe der Oberseite der Boden- oder Deckenbeläge.",
    "Nicht zur BGF gehören z. B. Spitzböden neben dem Dachgeschoss, Kriechkeller, reine Wartungs-/Inspektionsflächen und Flächen unter konstruktiven Hohlräumen (z. B. über abgehängten Decken).",
    "Dachgeschoss: Die Anrechenbarkeit richtet sich nach der Nutzbarkeit; sie setzt eine lichte Höhe von ca. 1,25 m und Begehbarkeit (feste Decke, Zugänglichkeit) voraus. Nicht nutzbare Dachgeschossebenen werden nicht angerechnet.",
  ],
};

/** Anlage 4 Abschnitt I Nr. 3: Besonderheiten bei Ein-/Zweifamilien-, Doppel- und Reihenhäusern */
export const DACHGESCHOSS_HINWEIS: AmtlicherHinweis = {
  quelle: "Anlage 4 Abschnitt I Nr. 3 ImmoWertV",
  punkte: [
    "Gebäude mit nicht nutzbaren Grundrissebenen im Dachraum sind der Gebäudeart „Flachdach oder flach geneigtes Dach“ zuzuordnen.",
    "Bei nicht ausgebautem, nicht ausbaufähigem Dachgeschoss ist in der Regel ein Abschlag vom Kostenkennwert anzusetzen.",
    "Bei ausgebautem Dachgeschoss bestimmt sich der Grad der wirtschaftlichen Nutzbarkeit insbesondere nach dem Verhältnis Wohnfläche zu Grundfläche (Dachneigung, Giebelbreite, Drempelhöhe). Ein fehlender Drempel ist in der Regel durch Abschläge, ein ausgebauter Spitzboden durch Zuschläge zu berücksichtigen.",
    "Teilweiser Dachgeschossausbau oder teilweise Unterkellerung können durch anteilige Heranziehung der Kostenkennwerte der jeweiligen Gebäudearten berücksichtigt werden (Mischkalkulation).",
  ],
};

/** Fußnote 20 zu Anlage 4 Abschnitt II Nr. 12 (Garagen) */
export const GARAGEN_STUFEN_HINWEIS: AmtlicherHinweis = {
  quelle: "Anlage 4 Abschnitt II Nr. 12 ImmoWertV (Fußnote)",
  punkte: [
    "Standardstufe 3: Fertiggaragen; Standardstufe 4: Garagen in Massivbauweise; Standardstufe 5: individuelle Garagen in Massivbauweise mit besonderen Ausführungen wie Ziegeldach, Gründach, Bodenbeläge, Fliesen o. ä., Wasser, Abwasser und Heizung.",
  ],
};

/**
 * Amtliche Korrekturfaktoren und Abgrenzungen je NHK-Code (Fußnoten der
 * Kennwerttabellen in Anlage 4 Abschnitt II). Nur Gebäudearten, für die die
 * Anlage 4 solche Angaben im Text ausweist.
 */
const KORREKTUR_MFH: AmtlicherHinweis = {
  quelle: "Anlage 4 Abschnitt II Nr. 2/3 ImmoWertV (Fußnoten)",
  punkte: [
    "Korrekturfaktoren für die Wohnungsgröße: ca. 35 m² WF/WE = 1,10; ca. 50 m² WF/WE = 1,00; ca. 135 m² WF/WE = 0,85.",
    "Korrekturfaktoren für die Grundrissart: Einspänner 1,05; Zweispänner 1,00; Dreispänner 0,97; Vierspänner 0,95.",
  ],
};

const HINWEISE_JE_CODE: Record<string, AmtlicherHinweis[]> = {
  "4.1": [KORREKTUR_MFH],
  "4.2": [KORREKTUR_MFH],
  "4.3": [KORREKTUR_MFH],
  "5.1": [
    KORREKTUR_MFH,
    {
      quelle: "Anlage 4 Abschnitt II Nr. 3 ImmoWertV (Fußnote)",
      punkte: [
        "Wohnhäuser mit Mischnutzung sind Gebäude mit überwiegend Wohnnutzung und einem geringen gewerblichen Anteil (Anteil der Wohnfläche ca. 75 %). Bei deutlich abweichenden Nutzungsanteilen ist eine Ermittlung durch Gebäudemix sinnvoll.",
      ],
    },
  ],
  "5.2": [
    {
      quelle: "Anlage 4 Abschnitt II Nr. 3 ImmoWertV (Fußnote)",
      punkte: [
        "Geschäftshäuser sind Gebäude mit überwiegend gewerblicher Nutzung und einem geringen Wohnanteil (Anteil der Wohnfläche ca. 20–25 %).",
      ],
    },
  ],
};
HINWEISE_JE_CODE["5.3"] = HINWEISE_JE_CODE["5.2"]!;

/** Amtliche Hinweise für einen NHK-Typcode (Korrekturfaktoren, Abgrenzungen) */
export function hinweiseFuer(code: string): AmtlicherHinweis[] {
  const spezifisch = HINWEISE_JE_CODE[code] ?? [];
  // Dachgeschoss-/Keller-Regeln gelten für alle Wohnhaus-Typen 1.x–3.x
  if (/^[123]\./.test(code)) return [DACHGESCHOSS_HINWEIS, ...spezifisch];
  return spezifisch;
}
