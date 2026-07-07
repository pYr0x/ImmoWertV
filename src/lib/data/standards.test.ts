/**
 * Konsistenztests für die amtlichen Standardbeschreibungen
 * (Anlage 4 Abschnitt III ImmoWertV) in standards.ts.
 */

import { describe, expect, it } from "vitest";
import { STANDARD_BESCHREIBUNGEN, standardsFuer } from "./standards";
import { NHK_TYPEN } from "./nhk2010";

describe("Standardbeschreibungen (Anlage 4 Abschnitt III)", () => {
  it("alle referenzierten NHK-Codes existieren", () => {
    const codes = new Set(NHK_TYPEN.map((t) => t.code));
    for (const g of STANDARD_BESCHREIBUNGEN) {
      for (const code of g.codes) {
        expect(codes.has(code), `${g.id}: unbekannter Code ${code}`).toBe(true);
      }
    }
  });

  it("jeder Code ist höchstens einer Gruppe zugeordnet", () => {
    const gesehen = new Map<string, string>();
    for (const g of STANDARD_BESCHREIBUNGEN) {
      for (const code of g.codes) {
        expect(gesehen.has(code), `${code} doppelt (${gesehen.get(code)} und ${g.id})`).toBe(false);
        gesehen.set(code, g.id);
      }
    }
  });

  it("alle Gebäudearten außer Wohnhaus, Garagen und 17.x haben Beschreibungen", () => {
    for (const typ of NHK_TYPEN) {
      const erwartet = typ.gruppe === "sonstig" || typ.gruppe === "landwirtschaft";
      // Nr. 17 (Museen, Theater, Sakralbauten, Friedhofsgebäude): Anlage 4 enthält
      // keine Standardbeschreibungen — bewusst ohne Referenz.
      const ausnahme = typ.code.startsWith("17.");
      if (erwartet && !ausnahme) {
        expect(standardsFuer(typ.code), `fehlende Beschreibungen für ${typ.code}`).not.toBeNull();
      }
      if (typ.gruppe === "wohnhaus" || typ.gruppe === "garage" || ausnahme) {
        // Wohnhaus/Garage tragen ihre amtlichen Beschreibungen in den Kostengruppen selbst
        expect(standardsFuer(typ.code)).toBeNull();
      }
    }
  });

  it("jedes Merkmal hat drei nicht-leere Stufenbeschreibungen", () => {
    for (const g of STANDARD_BESCHREIBUNGEN) {
      expect(g.merkmale.length).toBeGreaterThanOrEqual(9);
      for (const m of g.merkmale) {
        expect(m.merkmal.length).toBeGreaterThan(2);
        expect(m.stufen).toHaveLength(3);
        for (const s of m.stufen) expect(s.length).toBeGreaterThan(3);
      }
    }
  });

  it("Stichprobe: amtlicher Wortlaut ist erhalten", () => {
    const mfh = standardsFuer("4.1")!;
    const aw = mfh.merkmale.find((m) => m.merkmal === "Außenwände")!;
    expect(aw.stufen[0]).toContain("Wärmedämmverbundsystem");
    expect(aw.stufen[2]).toContain("mehrgeschossige Glasfassaden");

    const betrieb = standardsFuer("16.1")!;
    expect(betrieb.titel).toContain("Lagergebäude");
    expect(betrieb.merkmale.some((m) => m.merkmal === "Konstruktion")).toBe(true);

    const reithalle = standardsFuer("18.1.1")!;
    expect(reithalle.merkmale[0]!.stufen[0]).toContain("Holzfachwerkwand");
  });
});
