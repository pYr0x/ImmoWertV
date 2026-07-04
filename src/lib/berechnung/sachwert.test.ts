/**
 * Regressionstests gegen das Muster-Gutachten
 * (docs/Muster-Wertermittlung_geschwaerzt.pdf, Buchholz i. d. Nordheide,
 * Stichtag 08.02.2024, Verkehrswert 652.000 €).
 *
 * Jeder Test prüft einen Rechenschritt exakt gegen die im Gutachten
 * ausgewiesenen Werte.
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
  sachwertKette,
  type Ausstattung,
} from "./sachwert";
import { KOSTENGRUPPEN_GARAGE, KOSTENGRUPPEN_WOHNHAUS, nhkTyp } from "$lib/data/nhk2010";

/** Ausstattung: alle Kostengruppen zu 100 % auf einer Stufe */
function allesStufe(kostengruppenIds: string[], stufe: 1 | 2 | 3 | 4 | 5): Ausstattung {
  const a: Ausstattung = {};
  for (const id of kostengruppenIds) {
    const v: [number, number, number, number, number] = [0, 0, 0, 0, 0];
    v[stufe - 1] = 100;
    a[id] = v;
  }
  return a;
}

describe("Bodenwert (Muster S. 13/14)", () => {
  it("1.040 m² × 370 €/m² = 384.800,00 €", () => {
    expect(bodenwert(1040, 370)).toBe(384_800);
  });
});

describe("BGF (Muster S. 15/16)", () => {
  it("Haus: Keller + EG + DG je 78 m² = 234 m²", () => {
    expect(
      bgfSumme([
        { name: "Dachgeschoss", flaeche: 78 },
        { name: "Erdgeschoss", flaeche: 78 },
        { name: "Keller", flaeche: 78 },
      ])
    ).toBe(234);
  });
});

describe("Gewichteter Kostenkennwert (Muster S. 17: Typ 1.01, alles Stufe 4)", () => {
  it("ergibt 1.005,00 €/m²", () => {
    const typ = nhkTyp("1.01")!;
    const ids = KOSTENGRUPPEN_WOHNHAUS.map((k) => k.id);
    const erg = gewichteterKennwert(typ, KOSTENGRUPPEN_WOHNHAUS, allesStufe(ids, 4));
    expect(erg.kennwert).toBe(1005);
    expect(erg.gewichtSumme).toBe(100);
    expect(erg.ungueltigeGruppen).toEqual([]);
  });

  it("Mischung 50 % Stufe 3 / 50 % Stufe 4 liegt zwischen den Stufenwerten", () => {
    const typ = nhkTyp("1.01")!;
    const a: Ausstattung = {};
    for (const k of KOSTENGRUPPEN_WOHNHAUS) a[k.id] = [0, 0, 50, 50, 0];
    const erg = gewichteterKennwert(typ, KOSTENGRUPPEN_WOHNHAUS, a);
    expect(erg.kennwert).toBe((835 + 1005) / 2);
  });

  it("Garage: alles Stufe 3 ergibt 245,00 €/m² (Muster S. 20)", () => {
    const typ = nhkTyp("14.1")!;
    const ids = KOSTENGRUPPEN_GARAGE.map((k) => k.id);
    const erg = gewichteterKennwert(typ, KOSTENGRUPPEN_GARAGE, allesStufe(ids, 3));
    expect(erg.kennwert).toBe(245);
  });

  it("meldet Kostengruppen, deren Anteile nicht 100 % ergeben", () => {
    const typ = nhkTyp("1.01")!;
    const ids = KOSTENGRUPPEN_WOHNHAUS.map((k) => k.id);
    const a = allesStufe(ids, 4);
    a["dach"] = [0, 0, 40, 40, 0]; // nur 80 %
    const erg = gewichteterKennwert(typ, KOSTENGRUPPEN_WOHNHAUS, a);
    expect(erg.ungueltigeGruppen).toContain("dach");
  });
});

describe("Baupreisindex (Muster S. 18)", () => {
  it("130,8 × 127,0 / (90,1 × 100) = 1,844", () => {
    const erg = baupreisindexFaktor({ indexWert: 130.8, index2010: 90.1, index2021: 127, override: null });
    expect(erg.berechneterFaktor).toBe(1.844);
    expect(erg.faktor).toBe(1.844);
    expect(erg.overrideAktiv).toBe(false);
  });

  it("Override 1,812 wird verwendet, berechneter Faktor bleibt sichtbar", () => {
    const erg = baupreisindexFaktor({ indexWert: 130.8, index2010: 90.1, index2021: 127, override: 1.812 });
    expect(erg.berechneterFaktor).toBe(1.844);
    expect(erg.faktor).toBe(1.812);
    expect(erg.overrideAktiv).toBe(true);
  });
});

describe("Herstellungskosten (Muster S. 18/21)", () => {
  it("Haus: 1.005 × 1,812 = 1.821,06 €/m²; × 234 m² = 426.128,04 €", () => {
    const erg = herstellungskosten(1005, 1, 1.812, 234);
    expect(erg.kennwertStichtag).toBe(1821.06);
    expect(erg.herstellungskosten).toBe(426_128.04);
  });

  it("Garage: 245 × 1,812 = 443,94 €/m²; × 27 m² = 11.986,38 €", () => {
    const erg = herstellungskosten(245, 1, 1.812, 27);
    expect(erg.kennwertStichtag).toBe(443.94);
    expect(erg.herstellungskosten).toBe(11_986.38);
  });
});

describe("Restnutzungsdauer (Muster S. 22/23)", () => {
  it("Haus: GND 80, Alter 39, 5 Punkte → Formel, RND 43 Jahre", () => {
    const erg = restnutzungsdauer(80, 39, 5);
    expect(erg.relativesAlter).toBeCloseTo(0.4875, 4);
    expect(erg.schwellenwert).toBe(0.35);
    expect(erg.formelAngewendet).toBe(true);
    expect(erg.koeffizienten).toEqual({ a: 0.6725, b: 1.4578, c: 1.085 });
    expect(erg.rndMathematisch).toBe(41);
    expect(erg.rnd).toBe(43);
  });

  it("unterhalb des Schwellenwerts gilt RND = GND − Alter", () => {
    // 5 Punkte, Schwelle 35 %: Alter 20 von GND 80 = 25 % → keine Formel
    const erg = restnutzungsdauer(80, 20, 5);
    expect(erg.formelAngewendet).toBe(false);
    expect(erg.rnd).toBe(60);
  });

  it("Kappung bei 70 % der GND", () => {
    // 20 Punkte, hohes Alter: Formel würde RND über 56 Jahre (70 % von 80) ergeben
    const erg = restnutzungsdauer(80, 79, 20);
    expect(erg.rnd).toBeLessThanOrEqual(56);
  });

  it("Garage: RND = GND − Alter = 80 − 39 = 41 Jahre", () => {
    expect(restnutzungsdauerEinfach(80, 39)).toBe(41);
  });
});

describe("Alterswertminderung (Muster S. 22–24)", () => {
  it("Haus: 46,25 % von 426.128,04 € = 197.084,22 € Abzug", () => {
    const erg = alterswertminderung(426_128.04, 80, 43);
    expect(erg.prozent).toBeCloseTo(46.25, 10);
    expect(erg.betrag).toBe(197_084.22);
    expect(erg.restwert).toBe(229_043.82);
  });

  it("Garage: 48,75 % von 11.986,38 € = 5.843,36 € Abzug", () => {
    const erg = alterswertminderung(11_986.38, 80, 41);
    expect(erg.prozent).toBeCloseTo(48.75, 10);
    expect(erg.betrag).toBe(5_843.36);
    expect(erg.restwert).toBe(6_143.02);
  });
});

describe("Gesamtkette bis Verkehrswert (Muster S. 24–28)", () => {
  it("reproduziert 652.124,15 € und gerundet 652.000 €", () => {
    const erg = sachwertKette({
      hausRestwert: 229_043.82,
      garageRestwert: 6_143.02,
      aussenanlagenProzent: 3,
      bodenwert: 384_800,
      sachwertfaktor: 1.04,
      besondereMerkmale: [],
    });
    expect(erg.bauwerkeNachAwm).toBe(235_186.84);
    expect(erg.aussenanlagenBetrag).toBe(7_055.61);
    expect(erg.bauwerkeInklAussenanlagen).toBe(242_242.45);
    expect(erg.vorlaeufigerSachwert).toBe(627_042.45);
    expect(erg.marktangepassterSachwert).toBe(652_124.15);
    expect(erg.marktanpassungBetrag).toBe(25_081.7);
    expect(erg.verkehrswertUngerundet).toBe(652_124.15);
    expect(erg.verkehrswert).toBe(652_000);
  });

  it("besondere Merkmale wirken nach der Marktanpassung", () => {
    const erg = sachwertKette({
      hausRestwert: 229_043.82,
      garageRestwert: 6_143.02,
      aussenanlagenProzent: 3,
      bodenwert: 384_800,
      sachwertfaktor: 1.04,
      besondereMerkmale: [
        { bezeichnung: "Reparaturstau Dach", betrag: -15_000 },
        { bezeichnung: "PV-Anlage", betrag: 8_000 },
      ],
    });
    expect(erg.besondereMerkmaleSumme).toBe(-7_000);
    expect(erg.verkehrswertUngerundet).toBe(645_124.15);
    expect(erg.verkehrswert).toBe(645_000);
  });
});
