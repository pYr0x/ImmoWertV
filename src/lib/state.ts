/**
 * Eingabezustand der App. Der gesamte Zustand ist als JSON serialisierbar
 * (localStorage-Autosave und Export/Import).
 */

import type { Ausstattung } from "$lib/berechnung/sachwert";
import {
  KOSTENGRUPPEN_GARAGE,
  KOSTENGRUPPEN_WOHNHAUS,
  nhkTyp,
  type Kostengruppe,
  type NhkTyp,
} from "$lib/data/nhk2010";
import { MODERNISIERUNGSELEMENTE } from "$lib/data/modernisierung";

export interface GebaeudeState {
  nhkCode: string;
  baujahr: number;
  gnd: number;
  /** Objektspezifischer Anpassungsfaktor auf den Kostenkennwert */
  anpassungsfaktor: number;
  geschosse: { name: string; flaeche: number }[];
  ausstattung: Ausstattung;
  /** Editierbare Wägungsanteile je Kostengruppen-ID (Prozent) */
  gewichte: Record<string, number>;
  /** Modernisierungspunkte je Element-ID (nur Haus) */
  modPunkte: Record<string, number>;
}

export interface AppState {
  version: 1;
  objekt: { bezeichnung: string };
  stichtag: string; // ISO-Datum
  bodenwert: { flaeche: number; richtwert: number };
  bpi: { indexWert: number; indexQuartal: string; index2010: number; index2021: number; override: number | null };
  haus: GebaeudeState;
  garage: GebaeudeState & { aktiv: boolean };
  aussenanlagenProzent: number;
  sachwertfaktor: number;
  merkmale: { bezeichnung: string; betrag: number }[];
}

/** Kostengruppen für einen NHK-Typ; Gewichte ggf. durch Nutzereingaben ersetzt */
export function kostengruppenFuer(typ: NhkTyp, gewichte: Record<string, number>): Kostengruppe[] {
  const basis: Kostengruppe[] =
    typ.gruppe === "wohnhaus"
      ? KOSTENGRUPPEN_WOHNHAUS
      : typ.gruppe === "garage"
        ? KOSTENGRUPPEN_GARAGE
        : [
            {
              id: "gesamt",
              name: "Gesamtstandard",
              gewicht: 100,
              beschreibungen: [null, null, null, null, null],
            },
          ];
  return basis.map((kg) => ({ ...kg, gewicht: gewichte[kg.id] ?? kg.gewicht }));
}

/** Fehlende Ausstattungs-/Gewichtseinträge für den aktuellen Typ ergänzen (Default: 100 % Stufe 3) */
export function ausstattungErgaenzen(g: GebaeudeState): void {
  const typ = nhkTyp(g.nhkCode);
  if (!typ) return;
  for (const kg of kostengruppenFuer(typ, g.gewichte)) {
    if (!g.ausstattung[kg.id]) g.ausstattung[kg.id] = [0, 0, 100, 0, 0];
    if (g.gewichte[kg.id] == null) g.gewichte[kg.id] = kg.gewicht;
  }
}

function leereModPunkte(): Record<string, number> {
  return Object.fromEntries(MODERNISIERUNGSELEMENTE.map((e) => [e.id, 0]));
}

export function defaultState(): AppState {
  const s: AppState = {
    version: 1,
    objekt: { bezeichnung: "Mein Haus" },
    stichtag: new Date().toISOString().slice(0, 10),
    bodenwert: { flaeche: 0, richtwert: 0 },
    bpi: {
      indexWert: 130.8,
      indexQuartal: "IV. Quartal 2024",
      index2010: 90.1,
      index2021: 127.0,
      override: null,
    },
    haus: {
      nhkCode: "2.01",
      baujahr: 1985,
      gnd: 80,
      anpassungsfaktor: 1,
      geschosse: [
        { name: "Keller", flaeche: 0 },
        { name: "Erdgeschoss", flaeche: 0 },
        { name: "Dachgeschoss", flaeche: 0 },
      ],
      ausstattung: {},
      gewichte: {},
      modPunkte: leereModPunkte(),
    },
    garage: {
      aktiv: true,
      nhkCode: "14.1",
      baujahr: 1985,
      gnd: 60,
      anpassungsfaktor: 1,
      geschosse: [{ name: "Garage", flaeche: 0 }],
      ausstattung: {},
      gewichte: {},
      modPunkte: {},
    },
    aussenanlagenProzent: 3,
    sachwertfaktor: 1,
    merkmale: [],
  };
  ausstattungErgaenzen(s.haus);
  ausstattungErgaenzen(s.garage);
  return s;
}

const STORAGE_KEY = "immowert-state-v1";

export function ladeState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return stateAusJson(raw);
  } catch {
    return defaultState();
  }
}

export function speichereState(s: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // localStorage nicht verfügbar (z. B. Privatmodus) — Eingaben bleiben nur in der Sitzung
  }
}

/** JSON einlesen und defensiv mit den Defaults zusammenführen */
export function stateAusJson(json: string): AppState {
  const parsed = JSON.parse(json) as Partial<AppState>;
  if (typeof parsed !== "object" || parsed === null) throw new Error("Kein gültiger Zustand");
  const basis = defaultState();
  const s: AppState = {
    ...basis,
    ...parsed,
    objekt: { ...basis.objekt, ...parsed.objekt },
    bodenwert: { ...basis.bodenwert, ...parsed.bodenwert },
    bpi: { ...basis.bpi, ...parsed.bpi },
    haus: { ...basis.haus, ...parsed.haus },
    garage: { ...basis.garage, ...parsed.garage },
    version: 1,
  };
  if (!nhkTyp(s.haus.nhkCode)) s.haus.nhkCode = basis.haus.nhkCode;
  if (!nhkTyp(s.garage.nhkCode)) s.garage.nhkCode = basis.garage.nhkCode;
  ausstattungErgaenzen(s.haus);
  ausstattungErgaenzen(s.garage);
  return s;
}
