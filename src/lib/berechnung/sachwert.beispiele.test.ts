/**
 * Validierung gegen zwei weitere veröffentlichte Beispiel-Gutachten:
 *
 * 1. docs/download-immobilienbewertung-bonn-beispiel.pdf
 *    (deinimmo GmbH, Doppelhaushälfte Bonn, Stichtag 16.08.2025,
 *    Verkehrswert 522.000 €). Haupthaus + Anbau, keine Modernisierungen.
 *
 * 2. docs/verkehrswertermittlung.pdf
 *    (immobilien-wertermittlung.de, Demo-EFH Burscheid, Stichtag 24.09.2025,
 *    Verkehrswert 437.000 €). Gemischte Ausstattungsstufen, Regionalfaktor,
 *    sonstige Bauteile, Modernisierungspunkte für Haus UND Garage,
 *    Nießbrauch als besonderes objektspezifisches Grundstücksmerkmal.
 *
 * Jeder erwartete Wert steht wörtlich so im jeweiligen Gutachten.
 */

import { describe, expect, it } from "vitest";
import {
  alterswertminderung,
  baupreisindexFaktor,
  bgfSumme,
  bodenwert,
  gewichteterKennwert,
  herstellungskosten,
  restnutzungsdauer,
  restnutzungsdauerEinfach,
  round2,
  sachwertKette,
  type Ausstattung,
} from "./sachwert";
import { KOSTENGRUPPEN_GARAGE, KOSTENGRUPPEN_WOHNHAUS, nhkTyp } from "$lib/data/nhk2010";

// ---------------------------------------------------------------------------
// Beispiel 1: Bonn (Doppelhaushälfte, Haupthaus 1955 + Anbau 1971)
// ---------------------------------------------------------------------------

describe("Beispiel Bonn: Bodenwert (S. 16)", () => {
  it("453 m² × 950 €/m² (angepasster BRW) = 430.350,00 €", () => {
    expect(bodenwert(453, 950)).toBe(430_350);
  });
});

describe("Beispiel Bonn: Restnutzungsdauer ohne Modernisierung (S. 26/27)", () => {
  // Das Gutachten setzt ohne Modernisierungen RND = GND − Alter an.
  it("Hauptgebäude: 80 − 70 = 10 Jahre", () => {
    expect(restnutzungsdauerEinfach(80, 70)).toBe(10);
  });

  it("Anbau: 80 − 54 = 26 Jahre", () => {
    expect(restnutzungsdauerEinfach(80, 54)).toBe(26);
  });

  // Streng nach Anlage 2 Tabelle 3 (0 Punkte, Schwelle 60 %) ergäbe die Formel
  // für das Hauptgebäude 15 Jahre — das Gutachten weicht hier bewusst auf das
  // lineare Modell aus. Beide Ansätze sind über die zwei Funktionen abbildbar.
  it("Anlage-2-Formel mit 0 Punkten ergäbe für das Hauptgebäude 15 Jahre", () => {
    const erg = restnutzungsdauer(80, 70, 0);
    expect(erg.formelAngewendet).toBe(true);
    expect(erg.rnd).toBe(15);
  });
});

describe("Beispiel Bonn: Alterswertminderung (S. 27–29)", () => {
  it("Hauptgebäude: 87,5 % von 278.258,20 € = 243.475,93 €", () => {
    const erg = alterswertminderung(278_258.2, 80, 10);
    expect(erg.prozent).toBeCloseTo(87.5, 10);
    expect(erg.betrag).toBe(243_475.93);
    expect(erg.restwert).toBe(34_782.27);
  });

  it("Anbau: 67,5 % von 146.592,00 € = 98.949,60 €", () => {
    const erg = alterswertminderung(146_592, 80, 26);
    expect(erg.prozent).toBeCloseTo(67.5, 10);
    expect(erg.betrag).toBe(98_949.6);
    expect(erg.restwert).toBe(47_642.4);
  });
});

describe("Beispiel Bonn: Gesamtkette bis Verkehrswert (S. 29–32)", () => {
  it("reproduziert 522.064,86 € und gerundet 522.000 €", () => {
    const erg = sachwertKette({
      hausRestwert: 34_782.27,
      garageRestwert: 47_642.4, // Anbau als zweites Gebäude
      aussenanlagenProzent: 5,
      bodenwert: 430_350,
      sachwertfaktor: 1.01,
      besondereMerkmale: [],
    });
    expect(erg.bauwerkeNachAwm).toBe(82_424.67);
    expect(erg.aussenanlagenBetrag).toBe(4_121.23);
    expect(erg.bauwerkeInklAussenanlagen).toBe(86_545.9);
    expect(erg.vorlaeufigerSachwert).toBe(516_895.9);
    expect(erg.marktangepassterSachwert).toBe(522_064.86);
    expect(erg.verkehrswert).toBe(522_000);
  });
});

// ---------------------------------------------------------------------------
// Beispiel 2: Burscheid (freistehendes EFH Typ 1.11, Baujahr 2000)
// ---------------------------------------------------------------------------

/** Ausstattung Hauptgebäude laut Gutachten S. 28/29 */
const AUSSTATTUNG_BURSCHEID_HAUS: Ausstattung = {
  aussenwaende: [60, 40, 0, 0, 0],
  dach: [0, 0, 0, 100, 0],
  fenster: [0, 100, 0, 0, 0],
  innenwaende: [0, 0, 100, 0, 0],
  decken: [0, 0, 100, 0, 0],
  fussboeden: [0, 0, 0, 100, 0],
  sanitaer: [0, 0, 100, 0, 0],
  heizung: [0, 0, 100, 0, 0],
  technik: [0, 0, 0, 0, 100],
};

/** Ausstattung Garage laut Gutachten S. 31/32 */
const AUSSTATTUNG_BURSCHEID_GARAGE: Ausstattung = {
  aussenwaende: [0, 0, 100, 0, 0],
  konstruktion: [0, 0, 100, 0, 0],
  dach: [0, 0, 0, 100, 0],
  fenster: [0, 0, 0, 100, 0],
  fussboeden: [0, 0, 100, 0, 0],
  technik: [0, 0, 0, 0, 100],
};

describe("Beispiel Burscheid: Bodenwert mit Teilflächen (S. 24/25)", () => {
  it("530 m² × 381,10 €/m² + 680 m² × 85 €/m² = 259.783,00 €", () => {
    const bauland = bodenwert(530, 381.1);
    const hinterland = bodenwert(680, 85);
    expect(bauland).toBe(201_983);
    expect(hinterland).toBe(57_800);
    expect(round2(bauland + hinterland)).toBe(259_783);
  });
});

describe("Beispiel Burscheid: BGF (S. 27)", () => {
  it("Haus: 4 Ebenen à 50,38 m² = 201,52 m²", () => {
    expect(
      bgfSumme([
        { name: "Dachgeschoss", flaeche: 50.38 },
        { name: "1. Obergeschoss", flaeche: 50.38 },
        { name: "Erdgeschoss", flaeche: 50.38 },
        { name: "Keller", flaeche: 50.38 },
      ])
    ).toBe(201.52);
  });
});

describe("Beispiel Burscheid: gewichteter Kostenkennwert (S. 28–32)", () => {
  it("Haus Typ 1.11: Stufenverteilung 13,8/20,2/40/20/6 % → 847,44 €/m²", () => {
    const typ = nhkTyp("1.11")!;
    const erg = gewichteterKennwert(typ, KOSTENGRUPPEN_WOHNHAUS, AUSSTATTUNG_BURSCHEID_HAUS);
    expect(erg.anteileProStufe[0]).toBeCloseTo(13.8, 10);
    expect(erg.anteileProStufe[1]).toBeCloseTo(20.2, 10);
    expect(erg.anteileProStufe[2]).toBeCloseTo(40, 10);
    expect(erg.anteileProStufe[3]).toBeCloseTo(20, 10);
    expect(erg.anteileProStufe[4]).toBeCloseTo(6, 10);
    expect(erg.kennwert).toBe(847.44);
    expect(erg.ungueltigeGruppen).toEqual([]);
  });

  it("Garage Typ 14.1: Stufenverteilung 64/26/10 % → 360,90 €/m²", () => {
    const typ = nhkTyp("14.1")!;
    const erg = gewichteterKennwert(typ, KOSTENGRUPPEN_GARAGE, AUSSTATTUNG_BURSCHEID_GARAGE);
    expect(erg.anteileProStufe[2]).toBeCloseTo(64, 10);
    expect(erg.anteileProStufe[3]).toBeCloseTo(26, 10);
    expect(erg.anteileProStufe[4]).toBeCloseTo(10, 10);
    expect(erg.kennwert).toBe(360.9);
  });
});

describe("Beispiel Burscheid: Baupreisindex (S. 30)", () => {
  // Das Gutachten dividiert den Index (Basis 2021) direkt durch den
  // umbasierten 2010er-Wert 70,8. Das entspricht unserer Formel mit
  // index2010 = 70,8 und index2021 = 100.
  it("133,6 / 70,8 = 1,887", () => {
    const erg = baupreisindexFaktor({ indexWert: 133.6, index2010: 70.8, index2021: 100, override: null });
    expect(erg.berechneterFaktor).toBe(1.887);
    expect(erg.faktor).toBe(1.887);
  });
});

describe("Beispiel Burscheid: Herstellungskosten (S. 30–33)", () => {
  it("Haus: 847,44 × 1,887 = 1.599,12 €/m²; × 201,52 m² = 322.254,66 €", () => {
    const erg = herstellungskosten(847.44, 1, 1.887, 201.52);
    expect(erg.kennwertStichtag).toBe(1_599.12);
    expect(erg.herstellungskosten).toBe(322_254.66);
  });

  it("Garage: 360,90 × 1,887 = 681,02 €/m²; × 34,5 m² = 23.495,19 €", () => {
    const erg = herstellungskosten(360.9, 1, 1.887, 34.5);
    expect(erg.kennwertStichtag).toBe(681.02);
    expect(erg.herstellungskosten).toBe(23_495.19);
  });

  // Sonstige Bauteile (159.350 €) und Regionalfaktor 1,06 rechnet das
  // Gutachten NACH der Kennwert-Kette: (HK + sonstige Bauteile) × Regionalfaktor.
  it("(322.254,66 + 159.350) × 1,06 = 510.500,94 €", () => {
    expect(round2((322_254.66 + 159_350) * 1.06)).toBe(510_500.94);
  });
});

describe("Beispiel Burscheid: Restnutzungsdauer nach Anlage 2 (S. 34–36)", () => {
  it("Haus: GND 80, Alter 25, 10 Punkte → Formel, RND 58 Jahre", () => {
    const erg = restnutzungsdauer(80, 25, 10);
    expect(erg.relativesAlter).toBeCloseTo(0.3125, 10);
    expect(erg.schwellenwert).toBe(0.18);
    expect(erg.formelAngewendet).toBe(true);
    expect(erg.koeffizienten).toEqual({ a: 0.432, b: 0.954, c: 0.9811 });
    expect(erg.rndMathematisch).toBe(55);
    expect(erg.rnd).toBe(58);
  });

  it("Garage: GND 60, Alter 25, 5 Punkte → Formel, RND 36 Jahre", () => {
    const erg = restnutzungsdauer(60, 25, 5);
    expect(erg.relativesAlter).toBeCloseTo(25 / 60, 10);
    expect(erg.schwellenwert).toBe(0.35);
    expect(erg.formelAngewendet).toBe(true);
    expect(erg.rndMathematisch).toBe(35);
    expect(erg.rnd).toBe(36);
  });
});

describe("Beispiel Burscheid: Alterswertminderung (S. 35–37)", () => {
  it("Haus: 27,5 % von 510.500,94 € = 140.387,76 €", () => {
    const erg = alterswertminderung(510_500.94, 80, 58);
    expect(erg.prozent).toBeCloseTo(27.5, 10);
    expect(erg.betrag).toBe(140_387.76);
    expect(erg.restwert).toBe(370_113.18);
  });

  it("Garage: 40 % von 23.495,19 € = 9.398,08 €", () => {
    const erg = alterswertminderung(23_495.19, 60, 36);
    expect(erg.prozent).toBeCloseTo(40, 10);
    expect(erg.betrag).toBe(9_398.08);
    expect(erg.restwert).toBe(14_097.11);
  });
});

describe("Beispiel Burscheid: Gesamtkette bis Verkehrswert (S. 37–52)", () => {
  it("reproduziert 722.892,14 €, Nießbrauch-Abschlag und Verkehrswert 437.000 €", () => {
    const erg = sachwertKette({
      hausRestwert: 370_113.18,
      garageRestwert: 14_097.11,
      aussenanlagenProzent: 5,
      bodenwert: 259_783,
      sachwertfaktor: 1.09,
      besondereMerkmale: [
        { bezeichnung: "Nießbrauchrecht (Abschlag)", betrag: -285_864.57 },
      ],
    });
    expect(erg.bauwerkeNachAwm).toBe(384_210.29);
    expect(erg.aussenanlagenBetrag).toBe(19_210.51);
    expect(erg.bauwerkeInklAussenanlagen).toBe(403_420.8);
    expect(erg.vorlaeufigerSachwert).toBe(663_203.8);
    expect(erg.marktangepassterSachwert).toBe(722_892.14);
    expect(erg.marktanpassungBetrag).toBe(59_688.34);
    expect(erg.verkehrswertUngerundet).toBe(437_027.57);
    expect(erg.verkehrswert).toBe(437_000);
  });
});
