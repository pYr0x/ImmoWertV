/**
 * Sachwertverfahren nach §§ 35–39 ImmoWertV.
 *
 * Alle Funktionen sind pur (Eingaben → Zahlen) und bilden die Rechenschritte
 * des Verfahrens einzeln ab, damit die UI jeden Schritt mit Formel und
 * eingesetzten Werten anzeigen kann. Zwischenergebnisse werden wie im
 * Gutachten kaufmännisch auf Cent gerundet, bevor sie weiterverwendet werden.
 */

import type { Kostengruppe, NhkTyp } from "$lib/data/nhk2010";
import { RND_TABELLE3 } from "$lib/data/modernisierung";

export const round2 = (x: number): number => Math.round(x * 100) / 100;
export const round3 = (x: number): number => Math.round(x * 1000) / 1000;

// ---------------------------------------------------------------------------
// Bodenwert (§ 40 ImmoWertV): Grundstücksfläche × Bodenrichtwert
// ---------------------------------------------------------------------------

export function bodenwert(grundstuecksflaeche: number, bodenrichtwert: number): number {
  return round2(grundstuecksflaeche * bodenrichtwert);
}

// ---------------------------------------------------------------------------
// Brutto-Grundfläche: Summe der erfassten Geschossebenen
// ---------------------------------------------------------------------------

export interface Geschoss {
  name: string;
  flaeche: number;
}

export function bgfSumme(geschosse: Geschoss[]): number {
  return round2(geschosse.reduce((s, g) => s + (g.flaeche || 0), 0));
}

// ---------------------------------------------------------------------------
// Gewichteter Kostenkennwert aus Ausstattungsgrad
// ---------------------------------------------------------------------------

/** Anteile in Prozent je Standardstufe (Index 0 = Stufe 1 … 4 = Stufe 5), je Kostengruppe. */
export type Ausstattung = Record<string, [number, number, number, number, number]>;

export interface AusstattungsErgebnis {
  /** Aggregierter Anteil je Stufe in Prozent (über alle Kostengruppen gewichtet) */
  anteileProStufe: [number, number, number, number, number];
  /** Gewichteter Kostenkennwert €/m² BGF (Basis 2010) */
  kennwert: number;
  /** Summe der Gewichte (soll 100) */
  gewichtSumme: number;
  /** Kostengruppen-IDs, deren Stufen-Anteile nicht 100 % ergeben */
  ungueltigeGruppen: string[];
}

export function gewichteterKennwert(
  typ: NhkTyp,
  kostengruppen: Kostengruppe[],
  ausstattung: Ausstattung
): AusstattungsErgebnis {
  const anteileProStufe: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  const ungueltigeGruppen: string[] = [];
  let gewichtSumme = 0;

  for (const kg of kostengruppen) {
    gewichtSumme += kg.gewicht;
    const anteile = ausstattung[kg.id] ?? [0, 0, 0, 0, 0];
    const summe = anteile.reduce((s, a) => s + a, 0);
    if (Math.abs(summe - 100) > 0.001) ungueltigeGruppen.push(kg.id);
    for (let stufe = 0; stufe < 5; stufe++) {
      anteileProStufe[stufe]! += (kg.gewicht / 100) * (anteile[stufe] ?? 0);
    }
  }

  let kennwert = 0;
  for (let stufe = 0; stufe < 5; stufe++) {
    const anteil = anteileProStufe[stufe]!;
    if (anteil <= 0) continue;
    const wert = typ.kennwerte[stufe];
    if (wert == null) {
      // Anteil auf nicht definierter Stufe → ungültig, wird nicht eingerechnet
      if (!ungueltigeGruppen.includes("__stufe_undefiniert__")) {
        ungueltigeGruppen.push("__stufe_undefiniert__");
      }
      continue;
    }
    kennwert += (anteil / 100) * wert;
  }

  return { anteileProStufe, kennwert: round2(kennwert), gewichtSumme, ungueltigeGruppen };
}

// ---------------------------------------------------------------------------
// Baupreisindex: Umbasierung von Basis 2021 = 100 auf Basis 2010
// ---------------------------------------------------------------------------

export interface BpiEingabe {
  /** Baupreisindex für Wohngebäude (Destatis, Basisjahr 2021 = 100) zum Stichtag */
  indexWert: number;
  /** Index des Jahres 2010 auf alter Basis (Modellkonstante, Muster: 90,1) */
  index2010: number;
  /** Index des Jahres 2021 auf alter Basis (Modellkonstante, Muster: 127,0) */
  index2021: number;
  /** Abweichender Faktor (sachverständig); null = berechneten Faktor verwenden */
  override: number | null;
}

export interface BpiErgebnis {
  berechneterFaktor: number;
  /** Tatsächlich verwendeter Faktor (Override, falls gesetzt) */
  faktor: number;
  overrideAktiv: boolean;
}

export function baupreisindexFaktor(e: BpiEingabe): BpiErgebnis {
  const berechnet = round3((e.indexWert * e.index2021) / (e.index2010 * 100));
  const overrideAktiv = e.override != null && e.override > 0;
  return {
    berechneterFaktor: berechnet,
    faktor: overrideAktiv ? e.override! : berechnet,
    overrideAktiv,
  };
}

// ---------------------------------------------------------------------------
// Herstellungskosten: Kennwert × Anpassungsfaktor × BPI-Faktor × BGF
// ---------------------------------------------------------------------------

export interface HerstellungskostenErgebnis {
  /** Kennwert nach objektspezifischem Anpassungsfaktor (Basis 2010) */
  kennwertAngepasst: number;
  /** Kennwert zum Wertermittlungsstichtag */
  kennwertStichtag: number;
  /** Herstellungskosten = Kennwert (Stichtag) × BGF */
  herstellungskosten: number;
}

export function herstellungskosten(
  kennwert2010: number,
  anpassungsfaktor: number,
  bpiFaktor: number,
  bgf: number
): HerstellungskostenErgebnis {
  const kennwertAngepasst = round2(kennwert2010 * anpassungsfaktor);
  const kennwertStichtag = round2(kennwertAngepasst * bpiFaktor);
  return {
    kennwertAngepasst,
    kennwertStichtag,
    herstellungskosten: round2(kennwertStichtag * bgf),
  };
}

// ---------------------------------------------------------------------------
// Restnutzungsdauer nach Anlage 2 ImmoWertV
// ---------------------------------------------------------------------------

export interface RndErgebnis {
  alter: number;
  relativesAlter: number;
  schwellenwert: number;
  formelAngewendet: boolean;
  koeffizienten: { a: number; b: number; c: number };
  /** RND ohne Modernisierungseinfluss: GND − Alter (min. 0) */
  rndMathematisch: number;
  /** Ergebnis in ganzen Jahren */
  rnd: number;
}

export function restnutzungsdauer(gnd: number, alter: number, punkte: number): RndErgebnis {
  const alterEff = Math.max(0, alter);
  const relativesAlter = gnd > 0 ? alterEff / gnd : 0;
  const zeile = RND_TABELLE3.find((z) => z.punkte === Math.min(20, Math.max(0, Math.round(punkte))))!;
  const rndMathematisch = Math.max(0, gnd - alterEff);

  if (relativesAlter < zeile.abRelativemAlter) {
    return {
      alter: alterEff,
      relativesAlter,
      schwellenwert: zeile.abRelativemAlter,
      formelAngewendet: false,
      koeffizienten: { a: zeile.a, b: zeile.b, c: zeile.c },
      rndMathematisch,
      rnd: Math.round(rndMathematisch),
    };
  }

  // Die "maximal 70 % der GND" in Anlage 2 beschreiben die Modellasymptote für
  // sehr alte Gebäude (Alter = GND, 20 Punkte → 0,702·GND), keine Kappung: die
  // Formel liefert für junge modernisierte Gebäude regulär mehr (max. 0,9·GND).
  const roh = (zeile.a * alterEff * alterEff) / gnd - zeile.b * alterEff + zeile.c * gnd;
  const rnd = Math.round(Math.max(0, roh));

  return {
    alter: alterEff,
    relativesAlter,
    schwellenwert: zeile.abRelativemAlter,
    formelAngewendet: true,
    koeffizienten: { a: zeile.a, b: zeile.b, c: zeile.c },
    rndMathematisch,
    rnd,
  };
}

/** RND ohne Modernisierungsmodell (z. B. Garage): GND − Alter, min. 0, ganze Jahre */
export function restnutzungsdauerEinfach(gnd: number, alter: number): number {
  return Math.round(Math.max(0, gnd - Math.max(0, alter)));
}

// ---------------------------------------------------------------------------
// Alterswertminderung (§ 38 ImmoWertV, linear)
// ---------------------------------------------------------------------------

export interface AwmErgebnis {
  /** Prozentsatz der Herstellungskosten */
  prozent: number;
  /** Abzugsbetrag in € */
  betrag: number;
  /** Verbleibender Wert in € */
  restwert: number;
}

export function alterswertminderung(hk: number, gnd: number, rnd: number): AwmErgebnis {
  const prozent = gnd > 0 ? ((gnd - rnd) * 100) / gnd : 0;
  const betrag = round2((hk * prozent) / 100);
  return { prozent, betrag, restwert: round2(hk - betrag) };
}

// ---------------------------------------------------------------------------
// Gesamtkette bis zum Verkehrswert
// ---------------------------------------------------------------------------

export interface BesonderesMerkmal {
  bezeichnung: string;
  /** Zu- (positiv) oder Abschlag (negativ) in € */
  betrag: number;
}

export interface SachwertSchritte {
  /** Vorläufiger Sachwert der baulichen Anlagen (Haus + Garage nach AWM) */
  bauwerkeNachAwm: number;
  aussenanlagenBetrag: number;
  bauwerkeInklAussenanlagen: number;
  bodenwert: number;
  vorlaeufigerSachwert: number;
  marktanpassungBetrag: number;
  marktangepassterSachwert: number;
  besondereMerkmaleSumme: number;
  verkehrswertUngerundet: number;
  verkehrswert: number;
}

export function sachwertKette(args: {
  hausRestwert: number;
  garageRestwert: number;
  aussenanlagenProzent: number;
  bodenwert: number;
  sachwertfaktor: number;
  besondereMerkmale: BesonderesMerkmal[];
}): SachwertSchritte {
  const bauwerkeNachAwm = round2(args.hausRestwert + args.garageRestwert);
  const aussenanlagenBetrag = round2((bauwerkeNachAwm * args.aussenanlagenProzent) / 100);
  const bauwerkeInklAussenanlagen = round2(bauwerkeNachAwm + aussenanlagenBetrag);
  const vorlaeufigerSachwert = round2(bauwerkeInklAussenanlagen + args.bodenwert);
  const marktangepassterSachwert = round2(vorlaeufigerSachwert * args.sachwertfaktor);
  const marktanpassungBetrag = round2(marktangepassterSachwert - vorlaeufigerSachwert);
  const besondereMerkmaleSumme = round2(
    args.besondereMerkmale.reduce((s, m) => s + (m.betrag || 0), 0)
  );
  const verkehrswertUngerundet = round2(marktangepassterSachwert + besondereMerkmaleSumme);
  const verkehrswert = Math.round(verkehrswertUngerundet / 1000) * 1000;

  return {
    bauwerkeNachAwm,
    aussenanlagenBetrag,
    bauwerkeInklAussenanlagen,
    bodenwert: args.bodenwert,
    vorlaeufigerSachwert,
    marktanpassungBetrag,
    marktangepassterSachwert,
    besondereMerkmaleSumme,
    verkehrswertUngerundet,
    verkehrswert,
  };
}

/** Alter in Jahren als Differenz der Kalenderjahre (wie im Gutachten üblich) */
export function alterInJahren(baujahr: number, stichtag: Date): number {
  return Math.max(0, stichtag.getFullYear() - baujahr);
}
