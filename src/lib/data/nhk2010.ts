/**
 * Anlage 4 ImmoWertV (zu § 12 Absatz 5 Satz 3)
 * Normalherstellungskosten 2010 (NHK 2010)
 * Quelle: https://www.gesetze-im-internet.de/immowertv_2022/anlage_4.html
 * (Fundstelle: BGBl. I 2021, 2824—2855)
 *
 * Die Kostenkennwerte sind in €/m² Brutto-Grundfläche (BGF) angegeben,
 * Kostenstand Jahresdurchschnitt 2010, inklusive Umsatzsteuer und der je
 * Gebäudeart ausgewiesenen Baunebenkosten (Abschnitt I Nr. 1 Abs. 3).
 *
 * Die Wohnhaus-Typen (Codes 1.01–3.33) stammen aus der Kennwert-Tabelle für
 * freistehende Ein- und Zweifamilienhäuser, Doppelhäuser und Reihenhäuser
 * (in der amtlichen HTML-Fassung als Grafik j2805-1_0090.jpg enthalten).
 */

/** Stufen-Index 0 → Standardstufe 1 … Index 4 → Standardstufe 5. null = Stufe nicht definiert. */
export type Kennwerte = [number | null, number | null, number, number, number];

export interface NhkTyp {
  code: string;
  name: string;
  /** Gruppe für Standardbeschreibungen/Kostengruppen: "wohnhaus" hat Stufen 1–5 + amtliche Wägungsanteile */
  gruppe: "wohnhaus" | "garage" | "sonstig" | "landwirtschaft";
  kennwerte: Kennwerte;
  /** In den Kennwerten bereits enthaltene Baunebenkosten (informativ) */
  baunebenkostenProzent: number;
  /** Modellansatz GND nach Anlage 1; null = in Anlage 1 nicht aufgeführt (abzuleiten) */
  gndDefault: number | null;
  hinweis?: string;
}

// ---------------------------------------------------------------------------
// 1.–3. Freistehende Ein- und Zweifamilienhäuser, Doppel- und Reihenendhäuser,
//        Reihenmittelhäuser (Stufen 1–5, Baunebenkosten 17 %)
//        Korrekturfaktor für freistehende Zweifamilienhäuser: 1,05
// ---------------------------------------------------------------------------

const BAUFORMEN = [
  { prefix: "1", name: "freistehende Einfamilienhäuser" },
  { prefix: "2", name: "Doppel- und Reihenendhäuser" },
  { prefix: "3", name: "Reihenmittelhäuser" },
] as const;

const GESCHOSS_DACH_VARIANTEN: {
  suffix: string;
  variante: string;
  /** kennwerte[bauform 1|2|3] als Stufen 1–5 */
  werte: Record<"1" | "2" | "3", [number, number, number, number, number]>;
}[] = [
  {
    suffix: "01",
    variante: "Keller-, Erdgeschoss; Dachgeschoss voll ausgebaut",
    werte: {
      "1": [655, 725, 835, 1005, 1260],
      "2": [615, 685, 785, 945, 1180],
      "3": [575, 640, 735, 885, 1105],
    },
  },
  {
    suffix: "02",
    variante: "Keller-, Erdgeschoss; Dachgeschoss nicht ausgebaut",
    werte: {
      "1": [545, 605, 695, 840, 1050],
      "2": [515, 570, 655, 790, 985],
      "3": [480, 535, 615, 740, 925],
    },
  },
  {
    suffix: "03",
    variante: "Keller-, Erdgeschoss; Flachdach oder flach geneigtes Dach",
    werte: {
      "1": [705, 785, 900, 1085, 1360],
      "2": [665, 735, 845, 1020, 1275],
      "3": [620, 690, 795, 955, 1195],
    },
  },
  {
    suffix: "11",
    variante: "Keller-, Erd-, Obergeschoss; Dachgeschoss voll ausgebaut",
    werte: {
      "1": [655, 725, 835, 1005, 1260],
      "2": [615, 685, 785, 945, 1180],
      "3": [575, 640, 735, 885, 1105],
    },
  },
  {
    suffix: "12",
    variante: "Keller-, Erd-, Obergeschoss; Dachgeschoss nicht ausgebaut",
    werte: {
      "1": [570, 635, 730, 880, 1100],
      "2": [535, 595, 685, 825, 1035],
      "3": [505, 560, 640, 775, 965],
    },
  },
  {
    suffix: "13",
    variante: "Keller-, Erd-, Obergeschoss; Flachdach oder flach geneigtes Dach",
    werte: {
      "1": [665, 740, 850, 1025, 1285],
      "2": [625, 695, 800, 965, 1205],
      "3": [585, 650, 750, 905, 1130],
    },
  },
  {
    suffix: "21",
    variante: "Erdgeschoss, nicht unterkellert; Dachgeschoss voll ausgebaut",
    werte: {
      "1": [790, 875, 1005, 1215, 1515],
      "2": [740, 825, 945, 1140, 1425],
      "3": [695, 770, 885, 1065, 1335],
    },
  },
  {
    suffix: "22",
    variante: "Erdgeschoss, nicht unterkellert; Dachgeschoss nicht ausgebaut",
    werte: {
      "1": [585, 650, 745, 900, 1125],
      "2": [550, 610, 700, 845, 1055],
      "3": [515, 570, 655, 790, 990],
    },
  },
  {
    suffix: "23",
    variante: "Erdgeschoss, nicht unterkellert; Flachdach oder flach geneigtes Dach",
    werte: {
      "1": [920, 1025, 1180, 1420, 1775],
      "2": [865, 965, 1105, 1335, 1670],
      "3": [810, 900, 1035, 1250, 1560],
    },
  },
  {
    suffix: "31",
    variante: "Erd-, Obergeschoss, nicht unterkellert; Dachgeschoss voll ausgebaut",
    werte: {
      "1": [720, 800, 920, 1105, 1385],
      "2": [675, 750, 865, 1040, 1300],
      "3": [635, 705, 810, 975, 1215],
    },
  },
  {
    suffix: "32",
    variante: "Erd-, Obergeschoss, nicht unterkellert; Dachgeschoss nicht ausgebaut",
    werte: {
      "1": [620, 690, 790, 955, 1190],
      "2": [580, 645, 745, 895, 1120],
      "3": [545, 605, 695, 840, 1050],
    },
  },
  {
    suffix: "33",
    variante: "Erd-, Obergeschoss, nicht unterkellert; Flachdach oder flach geneigtes Dach",
    werte: {
      "1": [785, 870, 1000, 1205, 1510],
      "2": [735, 820, 940, 1135, 1415],
      "3": [690, 765, 880, 1060, 1325],
    },
  },
];

const WOHNHAUS_TYPEN: NhkTyp[] = BAUFORMEN.flatMap((bf) =>
  GESCHOSS_DACH_VARIANTEN.map((v) => ({
    code: `${bf.prefix}.${v.suffix}`,
    name: `${bf.name} – ${v.variante}`,
    gruppe: "wohnhaus" as const,
    kennwerte: v.werte[bf.prefix] as Kennwerte,
    baunebenkostenProzent: 17,
    gndDefault: 80,
    hinweis:
      bf.prefix === "1"
        ? "Korrekturfaktor für freistehende Zweifamilienhäuser: 1,05 (über den objektspezifischen Anpassungsfaktor erfassbar)."
        : undefined,
  }))
);

// ---------------------------------------------------------------------------
// 4.–17. Übrige Gebäudearten (Stufen 3–5)
// ---------------------------------------------------------------------------

const st = (s3: number, s4: number, s5: number): Kennwerte => [null, null, s3, s4, s5];

const SONSTIGE_TYPEN: NhkTyp[] = [
  // 4. Mehrfamilienhäuser (Korrekturfaktoren Wohnungsgröße: ca. 35 m² WF/WE = 1,10; ca. 50 = 1,00; ca. 135 = 0,85;
  //    Grundrissart: Einspänner 1,05 / Zweispänner 1,00 / Dreispänner 0,97 / Vierspänner 0,95)
  { code: "4.1", name: "Mehrfamilienhäuser mit bis zu 6 WE", gruppe: "sonstig", kennwerte: st(825, 985, 1190), baunebenkostenProzent: 19, gndDefault: 80 },
  { code: "4.2", name: "Mehrfamilienhäuser mit 7 bis 20 WE", gruppe: "sonstig", kennwerte: st(765, 915, 1105), baunebenkostenProzent: 19, gndDefault: 80 },
  { code: "4.3", name: "Mehrfamilienhäuser mit mehr als 20 WE", gruppe: "sonstig", kennwerte: st(755, 900, 1090), baunebenkostenProzent: 19, gndDefault: 80 },
  // 5. Wohnhäuser mit Mischnutzung, Banken und Geschäftshäuser
  { code: "5.1", name: "Wohnhäuser mit Mischnutzung", gruppe: "sonstig", kennwerte: st(860, 1085, 1375), baunebenkostenProzent: 18, gndDefault: 80 },
  { code: "5.2", name: "Banken und Geschäftshäuser mit Wohnungen", gruppe: "sonstig", kennwerte: st(890, 1375, 1720), baunebenkostenProzent: 22, gndDefault: 60 },
  { code: "5.3", name: "Banken und Geschäftshäuser ohne Wohnungen", gruppe: "sonstig", kennwerte: st(930, 1520, 1900), baunebenkostenProzent: 22, gndDefault: 60 },
  // 6. Bürogebäude
  { code: "6.1", name: "Bürogebäude, Massivbau", gruppe: "sonstig", kennwerte: st(1040, 1685, 1900), baunebenkostenProzent: 18, gndDefault: 60 },
  { code: "6.2", name: "Bürogebäude, Stahlbetonskelettbau", gruppe: "sonstig", kennwerte: st(1175, 1840, 2090), baunebenkostenProzent: 18, gndDefault: 60 },
  // 7. Gemeindezentren, Saalbauten, Veranstaltungsgebäude
  { code: "7.1", name: "Gemeindezentren", gruppe: "sonstig", kennwerte: st(1130, 1425, 1905), baunebenkostenProzent: 18, gndDefault: 40 },
  { code: "7.2", name: "Saalbauten/Veranstaltungsgebäude", gruppe: "sonstig", kennwerte: st(1355, 1595, 2085), baunebenkostenProzent: 18, gndDefault: 40 },
  // 8. Kindergärten, Schulen
  { code: "8.1", name: "Kindergärten", gruppe: "sonstig", kennwerte: st(1300, 1495, 1900), baunebenkostenProzent: 20, gndDefault: 50 },
  { code: "8.2", name: "Allgemeinbildende Schulen, Berufsbildende Schulen", gruppe: "sonstig", kennwerte: st(1450, 1670, 2120), baunebenkostenProzent: 21, gndDefault: 50 },
  { code: "8.3", name: "Sonderschulen", gruppe: "sonstig", kennwerte: st(1585, 1820, 2315), baunebenkostenProzent: 17, gndDefault: 50 },
  // 9. Wohnheime, Alten- oder Pflegeheime
  { code: "9.1", name: "Wohnheime/Internate", gruppe: "sonstig", kennwerte: st(1000, 1225, 1425), baunebenkostenProzent: 18, gndDefault: 50 },
  { code: "9.2", name: "Alten-/Pflegeheime", gruppe: "sonstig", kennwerte: st(1170, 1435, 1665), baunebenkostenProzent: 18, gndDefault: 50 },
  // 10. Krankenhäuser, Tageskliniken
  { code: "10.1", name: "Krankenhäuser/Kliniken", gruppe: "sonstig", kennwerte: st(1720, 2080, 2765), baunebenkostenProzent: 21, gndDefault: 40 },
  { code: "10.2", name: "Tageskliniken/Ärztehäuser", gruppe: "sonstig", kennwerte: st(1585, 1945, 2255), baunebenkostenProzent: 21, gndDefault: 40 },
  // 11. Beherbergungsstätten, Verpflegungseinrichtungen
  { code: "11.1", name: "Hotels", gruppe: "sonstig", kennwerte: st(1385, 1805, 2595), baunebenkostenProzent: 21, gndDefault: 40 },
  // 12. Sporthallen, Freizeitbäder oder Heilbäder
  { code: "12.1", name: "Sporthallen (Einfeldhallen)", gruppe: "sonstig", kennwerte: st(1320, 1670, 1955), baunebenkostenProzent: 17, gndDefault: 40 },
  { code: "12.2", name: "Sporthallen (Dreifeldhallen/Mehrzweckhallen)", gruppe: "sonstig", kennwerte: st(1490, 1775, 2070), baunebenkostenProzent: 19, gndDefault: 40 },
  { code: "12.3", name: "Tennishallen", gruppe: "sonstig", kennwerte: st(1010, 1190, 1555), baunebenkostenProzent: 17, gndDefault: 40 },
  { code: "12.4", name: "Freizeitbäder/Heilbäder", gruppe: "sonstig", kennwerte: st(2450, 2985, 3840), baunebenkostenProzent: 24, gndDefault: 40 },
  // 13. Verbrauchermärkte, Kauf- oder Warenhäuser, Autohäuser
  { code: "13.1", name: "Verbrauchermärkte", gruppe: "sonstig", kennwerte: st(720, 870, 1020), baunebenkostenProzent: 16, gndDefault: 30 },
  { code: "13.2", name: "Kauf-/Warenhäuser", gruppe: "sonstig", kennwerte: st(1320, 1585, 1850), baunebenkostenProzent: 22, gndDefault: 50 },
  { code: "13.3", name: "Autohäuser ohne Werkstatt", gruppe: "sonstig", kennwerte: st(940, 1240, 1480), baunebenkostenProzent: 21, gndDefault: 30 },
  // 14. Garagen (Stufe 3: Fertiggaragen; Stufe 4: Massivbauweise; Stufe 5: individuelle Massivgaragen
  //     mit besonderen Ausführungen wie Ziegeldach, Gründach, Fliesen, Wasser, Abwasser, Heizung)
  { code: "14.1", name: "Einzelgaragen/Mehrfachgaragen", gruppe: "garage", kennwerte: st(245, 485, 780), baunebenkostenProzent: 12, gndDefault: 60 },
  { code: "14.2", name: "Hochgaragen", gruppe: "garage", kennwerte: st(480, 655, 780), baunebenkostenProzent: 15, gndDefault: 40 },
  { code: "14.3", name: "Tiefgaragen", gruppe: "garage", kennwerte: st(560, 715, 850), baunebenkostenProzent: 15, gndDefault: 40 },
  { code: "14.4", name: "Nutzfahrzeuggaragen", gruppe: "garage", kennwerte: st(530, 680, 810), baunebenkostenProzent: 13, gndDefault: 40, hinweis: "GND in Anlage 1 nicht aufgeführt; hier abgeleitet aus Tief-/Hochgaragen (40 Jahre)." },
  // 15. Betriebs- oder Werkstätten, Produktionsgebäude
  { code: "15.1", name: "Betriebs-/Werkstätten, eingeschossig", gruppe: "sonstig", kennwerte: st(970, 1165, 1430), baunebenkostenProzent: 19, gndDefault: 40 },
  { code: "15.2", name: "Betriebs-/Werkstätten, mehrgeschossig ohne Hallenanteil", gruppe: "sonstig", kennwerte: st(910, 1090, 1340), baunebenkostenProzent: 19, gndDefault: 40 },
  { code: "15.3", name: "Betriebs-/Werkstätten, mehrgeschossig, hoher Hallenanteil", gruppe: "sonstig", kennwerte: st(620, 860, 1070), baunebenkostenProzent: 19, gndDefault: 40 },
  { code: "15.4", name: "Industrielle Produktionsgebäude, Massivbauweise", gruppe: "sonstig", kennwerte: st(950, 1155, 1440), baunebenkostenProzent: 19, gndDefault: 40 },
  { code: "15.5", name: "Industrielle Produktionsgebäude, überwiegend Skelettbauweise", gruppe: "sonstig", kennwerte: st(700, 965, 1260), baunebenkostenProzent: 18, gndDefault: 40 },
  // 16. Lagergebäude
  { code: "16.1", name: "Lagergebäude ohne Mischnutzung, Kaltlager", gruppe: "sonstig", kennwerte: st(350, 490, 640), baunebenkostenProzent: 16, gndDefault: 40 },
  { code: "16.2", name: "Lagergebäude mit bis zu 25 % Mischnutzung", gruppe: "sonstig", kennwerte: st(550, 690, 880), baunebenkostenProzent: 17, gndDefault: 40 },
  { code: "16.3", name: "Lagergebäude mit mehr als 25 % Mischnutzung", gruppe: "sonstig", kennwerte: st(890, 1095, 1340), baunebenkostenProzent: 18, gndDefault: 40 },
  // 17. Sonstige Gebäude (GND in Anlage 1 nicht aufgeführt — abzuleiten)
  { code: "17.1", name: "Museen", gruppe: "sonstig", kennwerte: st(1880, 2295, 2670), baunebenkostenProzent: 18, gndDefault: null },
  { code: "17.2", name: "Theater", gruppe: "sonstig", kennwerte: st(2070, 2625, 3680), baunebenkostenProzent: 22, gndDefault: null },
  { code: "17.3", name: "Sakralbauten", gruppe: "sonstig", kennwerte: st(1510, 2060, 2335), baunebenkostenProzent: 16, gndDefault: null },
  { code: "17.4", name: "Friedhofsgebäude", gruppe: "sonstig", kennwerte: st(1320, 1490, 1720), baunebenkostenProzent: 19, gndDefault: null },
];

// ---------------------------------------------------------------------------
// 18. Landwirtschaftliche Betriebsgebäude (Stufen 3–5; Kennwert „Bauwerk" =
//     Baukonstruktion + technische Anlagen; Korrekturfaktoren für Gebäudegröße
//     und Unterbau sind über den objektspezifischen Anpassungsfaktor erfassbar)
// ---------------------------------------------------------------------------

const lw = (code: string, name: string, s3: number, s4: number, s5: number, bnk = 12): NhkTyp => ({
  code,
  name,
  gruppe: "landwirtschaft",
  kennwerte: st(s3, s4, s5),
  baunebenkostenProzent: bnk,
  gndDefault: 30,
});

const LANDWIRTSCHAFT_TYPEN: NhkTyp[] = [
  lw("18.1.1", "Reithallen", 235, 260, 310),
  lw("18.1.2", "Pferdeställe", 365, 520, 625),
  lw("18.2.1", "Kälberställe", 480, 540, 650),
  lw("18.2.2", "Jungvieh-/Mastbullen-/Milchviehställe ohne Melkstand und Warteraum", 290, 325, 390),
  lw("18.2.3", "Milchviehställe mit Melkstand und Milchlager", 325, 365, 440),
  lw("18.2.4", "Melkhäuser mit Milchlager und Nebenräumen als Einzelgebäude", 1170, 1300, 1560),
  lw("18.3.1", "Ferkelaufzuchtställe", 455, 505, 610),
  lw("18.3.2", "Mastschweineställe", 415, 470, 570),
  lw("18.3.3", "Zuchtschweineställe, Deck-/Warte-/Abferkelbereich", 470, 520, 625),
  lw("18.3.4", "Abferkelstall als Einzelgebäude", 525, 585, 700),
  lw("18.4.1", "Mastgeflügel, Bodenhaltung (Hähnchen, Puten, Gänse)", 260, 290, 350),
  lw("18.4.2", "Legehennen, Bodenhaltung", 420, 470, 560),
  lw("18.4.3", "Legehennen, Volierenhaltung", 610, 675, 810),
  lw("18.4.4", "Legehennen, Kleingruppenhaltung, ausgestalteter Käfig", 675, 740, 895),
  lw("18.5", "Landwirtschaftliche Mehrzweckhallen", 245, 270, 350, 11),
];

export const NHK_TYPEN: NhkTyp[] = [...WOHNHAUS_TYPEN, ...SONSTIGE_TYPEN, ...LANDWIRTSCHAFT_TYPEN];

export function nhkTyp(code: string): NhkTyp | undefined {
  return NHK_TYPEN.find((t) => t.code === code);
}

// ---------------------------------------------------------------------------
// Abschnitt III: Kostengruppen mit Wägungsanteilen und Standardbeschreibungen
// ---------------------------------------------------------------------------

export interface Kostengruppe {
  id: string;
  name: string;
  /** Wägungsanteil in Prozent */
  gewicht: number;
  /** Beschreibungstexte je Standardstufe (Index 0 = Stufe 1 … 4 = Stufe 5), null = Stufe nicht definiert */
  beschreibungen: [string | null, string | null, string | null, string | null, string | null];
}

/**
 * Kostengruppen für freistehende Ein- und Zweifamilienhäuser, Doppelhäuser und
 * Reihenhäuser — Wägungsanteile und Texte amtlich (Anlage 4 Abschnitt III Nr. 1).
 */
export const KOSTENGRUPPEN_WOHNHAUS: Kostengruppe[] = [
  {
    id: "aussenwaende",
    name: "Außenwände",
    gewicht: 23,
    beschreibungen: [
      "Holzfachwerk, Ziegelmauerwerk; Fugenglattstrich, Putz, Verkleidung mit Faserzementplatten, Bitumen-Schindeln oder einfachen Kunststoffplatten; kein oder deutlich nicht zeitgemäßer Wärmeschutz (vor ca. 1980)",
      "ein-/zweischaliges Mauerwerk, z. B. Gitterziegel oder Hohlblocksteine; verputzt und gestrichen oder Holzverkleidung; nicht zeitgemäßer Wärmeschutz (vor ca. 1995)",
      "ein-/zweischaliges Mauerwerk, z. B. aus Leichtziegeln, Kalksandsteinen, Gasbetonsteinen; Edelputz; Wärmedämmverbundsystem oder Wärmedämmputz (nach ca. 1995)",
      "Verblendmauerwerk, zweischalig, hinterlüftet, Vorhangfassade (z. B. Naturschiefer); Wärmedämmung (nach ca. 2005)",
      "aufwendig gestaltete Fassaden mit konstruktiver Gliederung (Säulenstellungen, Erker etc.), Sichtbeton-Fertigteile, Natursteinfassade, Elemente aus Kupfer-/Eloxalblech, mehrgeschossige Glasfassaden; Dämmung im Passivhausstandard",
    ],
  },
  {
    id: "dach",
    name: "Dach",
    gewicht: 15,
    beschreibungen: [
      "Dachpappe, Faserzementplatten/Wellplatten; keine bis geringe Dachdämmung",
      "einfache Betondachsteine oder Tondachziegel, Bitumenschindeln; nicht zeitgemäße Dachdämmung (vor ca. 1995)",
      "Faserzement-Schindeln, beschichtete Betondachsteine und Tondachziegel, Folienabdichtung; Rinnen und Fallrohre aus Zinkblech; Dachdämmung (nach ca. 1995)",
      "glasierte Tondachziegel, Flachdachausbildung tlw. als Dachterrassen; Konstruktion in Brettschichtholz, schweres Massivflachdach; besondere Dachformen, z. B. Mansarden-, Walmdach; Aufsparrendämmung, überdurchschnittliche Dämmung (nach ca. 2005)",
      "hochwertige Eindeckung z. B. aus Schiefer oder Kupfer, Dachbegrünung, befahrbares Flachdach; aufwendig gegliederte Dachlandschaft, sichtbare Bogendachkonstruktionen; Rinnen und Fallrohre aus Kupfer; Dämmung im Passivhausstandard",
    ],
  },
  {
    id: "fenster",
    name: "Fenster und Außentüren",
    gewicht: 11,
    beschreibungen: [
      "Einfachverglasung; einfache Holztüren",
      "Zweifachverglasung (vor ca. 1995); Haustür mit nicht zeitgemäßem Wärmeschutz (vor ca. 1995)",
      "Zweifachverglasung (nach ca. 1995), Rollläden (manuell); Haustür mit zeitgemäßem Wärmeschutz (nach ca. 1995)",
      "Dreifachverglasung, Sonnenschutzglas, aufwendigere Rahmen, Rollläden (elektr.); höherwertige Türanlage z. B. mit Seitenteil, besonderer Einbruchschutz",
      "große, feststehende Fensterflächen, Spezialverglasung (Schall- und Sonnenschutz); Außentüren in hochwertigen Materialien",
    ],
  },
  {
    id: "innenwaende",
    name: "Innenwände und -türen",
    gewicht: 11,
    beschreibungen: [
      "Fachwerkwände, einfache Putze/Lehmputze, einfache Kalkanstriche; Füllungstüren, gestrichen, mit einfachen Beschlägen ohne Dichtungen",
      "massive tragende Innenwände, nicht tragende Wände in Leichtbauweise (z. B. Holzständerwände mit Gipskarton), Gipsdielen; leichte Türen, Stahlzargen",
      "nicht tragende Innenwände in massiver Ausführung bzw. mit Dämmmaterial gefüllte Ständerkonstruktionen; schwere Türen, Holzzargen",
      "Sichtmauerwerk, Wandvertäfelungen (Holzpaneele); Massivholztüren, Schiebetürelemente, Glastüren, strukturierte Türblätter",
      "gestaltete Wandabläufe (z. B. Pfeilervorlagen, abgesetzte oder geschwungene Wandpartien); Vertäfelungen (Edelholz, Metall), Akustikputz, Brandschutzverkleidung; raumhohe aufwendige Türelemente",
    ],
  },
  {
    id: "decken",
    name: "Deckenkonstruktion und Treppen",
    gewicht: 11,
    beschreibungen: [
      "Holzbalkendecken ohne Füllung, Spalierputz; Weichholztreppen in einfacher Art und Ausführung; kein Trittschallschutz",
      "Holzbalkendecken mit Füllung, Kappendecken; Stahl- oder Hartholztreppen in einfacher Art und Ausführung",
      "Beton- und Holzbalkendecken mit Tritt- und Luftschallschutz (z. B. schwimmender Estrich); geradläufige Treppen aus Stahlbeton oder Stahl, Harfentreppe, Trittschallschutz",
      "Decken mit größerer Spannweite, Deckenverkleidung (Holzpaneele/Kassetten); gewendelte Treppen aus Stahlbeton oder Stahl, Hartholztreppenanlage in besserer Art und Ausführung",
      "Decken mit großen Spannweiten, gegliedert, Deckenvertäfelungen (Edelholz, Metall); breite Stahlbeton-, Metall- oder Hartholztreppenanlage mit hochwertigem Geländer",
    ],
  },
  {
    id: "fussboeden",
    name: "Fußböden",
    gewicht: 5,
    beschreibungen: [
      "ohne Belag",
      "Linoleum-, Teppich-, Laminat- und PVC-Böden einfacher Art und Ausführung",
      "Linoleum-, Teppich-, Laminat- und PVC-Böden besserer Art und Ausführung, Fliesen, Kunststeinplatten",
      "Natursteinplatten, Fertigparkett, hochwertige Fliesen, Terrazzobelag, hochwertige Massivholzböden auf gedämmter Unterkonstruktion",
      "hochwertiges Parkett, hochwertige Natursteinplatten, hochwertige Edelholzböden auf gedämmter Unterkonstruktion",
    ],
  },
  {
    id: "sanitaer",
    name: "Sanitäreinrichtungen",
    gewicht: 9,
    beschreibungen: [
      "einfaches Bad mit Stand-WC; Installation auf Putz; Ölfarbenanstrich, einfache PVC-Bodenbeläge",
      "1 Bad mit WC, Dusche oder Badewanne; einfache Wand- und Bodenfliesen, teilweise gefliest",
      "1 Bad mit WC, Dusche und Badewanne, Gäste-WC; Wand- und Bodenfliesen, raumhoch gefliest",
      "1 bis 2 Bäder mit tlw. zwei Waschbecken, tlw. Bidet/Urinal, Gäste-WC, bodengleiche Dusche; Wand- und Bodenfliesen; jeweils in gehobener Qualität",
      "mehrere großzügige, hochwertige Bäder, Gäste-WC; hochwertige Wand- und Bodenplatten (oberflächenstrukturiert, Einzel- und Flächendekors)",
    ],
  },
  {
    id: "heizung",
    name: "Heizung",
    gewicht: 9,
    beschreibungen: [
      "Einzelöfen, Schwerkraftheizung",
      "Fern- oder Zentralheizung, einfache Warmluftheizung, einzelne Gasaußenwandthermen, Nachtstromspeicher-, Fußbodenheizung (vor ca. 1995)",
      "elektronisch gesteuerte Fern- oder Zentralheizung, Niedertemperatur- oder Brennwertkessel",
      "Fußbodenheizung, Solarkollektoren für Warmwassererzeugung, zusätzlicher Kaminanschluss",
      "Solarkollektoren für Warmwassererzeugung und Heizung, Blockheizkraftwerk, Wärmepumpe, Hybrid-Systeme; aufwendige zusätzliche Kaminanlage",
    ],
  },
  {
    id: "technik",
    name: "Sonstige technische Ausstattung",
    gewicht: 6,
    beschreibungen: [
      "sehr wenige Steckdosen, Schalter und Sicherungen, kein Fehlerstromschutzschalter (FI-Schalter), Leitungen teilweise auf Putz",
      "wenige Steckdosen, Schalter und Sicherungen",
      "zeitgemäße Anzahl an Steckdosen und Lichtauslässen, Zählerschrank (ab ca. 1985) mit Unterverteilung und Kippsicherungen",
      "zahlreiche Steckdosen und Lichtauslässe, hochwertige Abdeckungen, dezentrale Lüftung mit Wärmetauscher, mehrere LAN- und Fernsehanschlüsse",
      "Video- und zentrale Alarmanlage, zentrale Lüftung mit Wärmetauscher, Klimaanlage, Bussystem",
    ],
  },
];

/**
 * Kostengruppen für Garagen — Beschreibungstexte amtlich (Anlage 4 Abschnitt III Nr. 8,
 * nur Stufen 3–5). ACHTUNG: Die Anlage 4 enthält für Garagen KEINE amtlichen
 * Wägungsanteile; die folgenden Gewichte sind eine verbreitete Konvention aus
 * Bewertungssoftware (vgl. Muster-Gutachten) und in der App editierbar.
 */
export const KOSTENGRUPPEN_GARAGE: Kostengruppe[] = [
  {
    id: "aussenwaende",
    name: "Außenwände",
    gewicht: 23,
    beschreibungen: [null, null, "offene Konstruktion", "Einschalige Konstruktion", "aufwendig gestaltete Fassaden mit konstruktiver Gliederung (Säulenstellungen, Erker etc.)"],
  },
  {
    id: "konstruktion",
    name: "Konstruktion",
    gewicht: 23,
    beschreibungen: [null, null, "Stahl- und Betonfertigteile", "überwiegend Betonfertigteile; große stützenfreie Spannweiten", "größere stützenfreie Spannweiten"],
  },
  {
    id: "dach",
    name: "Dach",
    gewicht: 15,
    beschreibungen: [null, null, "Flachdach, Folienabdichtung", "Flachdachausbildung; Wärmedämmung", "befahrbares Flachdach (Parkdeck)"],
  },
  {
    id: "fenster",
    name: "Fenster und Außentüren",
    gewicht: 11,
    beschreibungen: [null, null, "einfache Metallgitter", "begrünte Metallgitter, Glasbausteine", "Außentüren in hochwertigen Materialien"],
  },
  {
    id: "fussboeden",
    name: "Fußböden",
    gewicht: 18,
    beschreibungen: [null, null, "Beton", "Estrich, Gussasphalt", "beschichteter Beton oder Estrichboden"],
  },
  {
    id: "technik",
    name: "Sonstige technische Ausstattung",
    gewicht: 10,
    beschreibungen: [
      null,
      null,
      "Strom- und Wasseranschluss; Löschwasseranlage; Treppenhaus; Brandmelder",
      "Sprinkleranlage; Rufanlagen; Rauch- und Wärmeabzugsanlagen; mechanische Be- und Entlüftungsanlagen; Parksysteme für zwei PKW übereinander; Personenaufzugsanlagen",
      "Video- und zentrale Alarmanlage; Beschallung; Parksysteme für drei oder mehr PKW übereinander; aufwendigere Aufzugsanlagen",
    ],
  },
];
