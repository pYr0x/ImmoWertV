<script lang="ts">
  import {
    alterInJahren,
    alterswertminderung,
    baupreisindexFaktor,
    bgfSumme,
    bodenwert as bodenwertFn,
    gewichteterKennwert,
    herstellungskosten,
    restnutzungsdauer,
    restnutzungsdauerEinfach,
    sachwertKette,
  } from "$lib/berechnung/sachwert";
  import { NHK_TYPEN, nhkTyp } from "$lib/data/nhk2010";
  import { standardsFuer } from "$lib/data/standards";
  import { BGF_HINWEIS, GARAGEN_STUFEN_HINWEIS, hinweiseFuer } from "$lib/data/hinweise";
  import { MODERNISIERUNGSELEMENTE } from "$lib/data/modernisierung";
  import { ausstattungErgaenzen, kostengruppenFuer, ladeState, speichereState, stateAusJson } from "$lib/state";
  import { eur, num, num3, pct } from "$lib/format";

  import Abschnitt from "$lib/components/Abschnitt.svelte";
  import AmtlicherHinweis from "$lib/components/AmtlicherHinweis.svelte";
  import AusstattungMatrix from "$lib/components/AusstattungMatrix.svelte";
  import Feld from "$lib/components/Feld.svelte";
  import Formel from "$lib/components/Formel.svelte";
  import GeschossListe from "$lib/components/GeschossListe.svelte";
  import Modernisierung from "$lib/components/Modernisierung.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Separator } from "$lib/components/ui/separator";
  import { Switch } from "$lib/components/ui/switch";
  import { Download, Printer, RotateCcw, Upload } from "@lucide/svelte";
  import { defaultState } from "$lib/state";

  let s = $state(ladeState());

  // Autosave: jede Änderung sofort in localStorage
  $effect(() => {
    speichereState(s);
  });

  // Beim Wechsel des NHK-Typs: GND-Vorbelegung aus Anlage 1 und fehlende
  // Ausstattungszeilen ergänzen
  let letzterHausCode: string | undefined;
  let letzterGarageCode: string | undefined;
  $effect(() => {
    const code = s.haus.nhkCode;
    if (letzterHausCode !== undefined && code !== letzterHausCode) {
      const t = nhkTyp(code);
      if (t?.gndDefault) s.haus.gnd = t.gndDefault;
    }
    letzterHausCode = code;
    ausstattungErgaenzen(s.haus);
  });
  $effect(() => {
    const code = s.garage.nhkCode;
    if (letzterGarageCode !== undefined && code !== letzterGarageCode) {
      const t = nhkTyp(code);
      if (t?.gndDefault) s.garage.gnd = t.gndDefault;
    }
    letzterGarageCode = code;
    ausstattungErgaenzen(s.garage);
  });

  // ------------------------------------------------------------------
  // Rechenkette (reaktiv): jede Eingabeänderung aktualisiert alles
  // ------------------------------------------------------------------

  const stichtagDate = $derived(new Date(s.stichtag));
  const bw = $derived(bodenwertFn(s.bodenwert.flaeche, s.bodenwert.richtwert));
  const bpi = $derived(baupreisindexFaktor(s.bpi));

  // Haus
  const hausTyp = $derived(nhkTyp(s.haus.nhkCode)!);
  const hausKgs = $derived(kostengruppenFuer(hausTyp, s.haus.gewichte));
  const hausBgf = $derived(bgfSumme(s.haus.geschosse));
  const hausAusstattung = $derived(gewichteterKennwert(hausTyp, hausKgs, s.haus.ausstattung));
  const hausHk = $derived(
    herstellungskosten(hausAusstattung.kennwert, s.haus.anpassungsfaktor, bpi.faktor, hausBgf)
  );
  const hausAlter = $derived(alterInJahren(s.haus.baujahr, stichtagDate));
  const hausPunkte = $derived(
    MODERNISIERUNGSELEMENTE.reduce((summe, e) => summe + (s.haus.modPunkte[e.id] ?? 0), 0)
  );
  const hausRnd = $derived(restnutzungsdauer(s.haus.gnd, hausAlter, hausPunkte));
  const hausAwm = $derived(alterswertminderung(hausHk.herstellungskosten, s.haus.gnd, hausRnd.rnd));

  // Garage
  const garageTyp = $derived(nhkTyp(s.garage.nhkCode)!);
  const garageKgs = $derived(kostengruppenFuer(garageTyp, s.garage.gewichte));
  const garageBgf = $derived(bgfSumme(s.garage.geschosse));
  const garageAusstattung = $derived(gewichteterKennwert(garageTyp, garageKgs, s.garage.ausstattung));
  const garageHk = $derived(
    herstellungskosten(garageAusstattung.kennwert, s.garage.anpassungsfaktor, bpi.faktor, garageBgf)
  );
  const garageAlter = $derived(alterInJahren(s.garage.baujahr, stichtagDate));
  const garageRnd = $derived(restnutzungsdauerEinfach(s.garage.gnd, garageAlter));
  const garageAwm = $derived(
    alterswertminderung(garageHk.herstellungskosten, s.garage.gnd, garageRnd)
  );

  // Gesamtkette
  const kette = $derived(
    sachwertKette({
      hausRestwert: hausAwm.restwert,
      garageRestwert: s.garage.aktiv ? garageAwm.restwert : 0,
      aussenanlagenProzent: s.aussenanlagenProzent,
      bodenwert: bw,
      sachwertfaktor: s.sachwertfaktor,
      besondereMerkmale: s.merkmale,
    })
  );

  const eingabenGueltig = $derived(
    hausAusstattung.ungueltigeGruppen.length === 0 &&
      (!s.garage.aktiv || garageAusstattung.ungueltigeGruppen.length === 0)
  );

  // ------------------------------------------------------------------
  // Export / Import / Reset / Druck
  // ------------------------------------------------------------------

  let importInput: HTMLInputElement | undefined = $state();
  let importFehler = $state("");

  function exportieren() {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `immowert-${s.stichtag}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importieren(ev: Event) {
    importFehler = "";
    const datei = (ev.target as HTMLInputElement).files?.[0];
    if (!datei) return;
    try {
      s = stateAusJson(await datei.text());
      letzterHausCode = s.haus.nhkCode;
      letzterGarageCode = s.garage.nhkCode;
    } catch (e) {
      importFehler = `Import fehlgeschlagen: ${e instanceof Error ? e.message : String(e)}`;
    }
    if (importInput) importInput.value = "";
  }

  function zuruecksetzen() {
    if (confirm("Alle Eingaben zurücksetzen?")) {
      s = defaultState();
      letzterHausCode = s.haus.nhkCode;
      letzterGarageCode = s.garage.nhkCode;
    }
  }

  const wohnhausTypen = NHK_TYPEN.filter((t) => t.gruppe === "wohnhaus");
  const sonstigeTypen = NHK_TYPEN.filter((t) => t.gruppe !== "wohnhaus" && t.gruppe !== "garage" && t.gruppe !== "landwirtschaft");
  const garagenTypen = NHK_TYPEN.filter((t) => t.gruppe === "garage");
  const landwirtschaftTypen = NHK_TYPEN.filter((t) => t.gruppe === "landwirtschaft");
</script>

<div class="mx-auto max-w-7xl px-4 py-6">
  <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 class="text-2xl font-bold">ImmoWertV</h1>
      <p class="text-muted-foreground text-sm">
        Verkehrswertermittlung nach dem Sachwertverfahren (§§ 35–39 ImmoWertV)
      </p>
    </div>
    <div class="no-print flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onclick={exportieren}><Download class="size-4" /> Export</Button>
      <Button variant="outline" size="sm" onclick={() => importInput?.click()}>
        <Upload class="size-4" /> Import
      </Button>
      <input
        type="file"
        accept=".json,application/json"
        class="hidden"
        aria-label="Bewertung aus JSON-Datei importieren"
        bind:this={importInput}
        onchange={importieren}
      />
      <Button variant="outline" size="sm" onclick={() => window.print()}><Printer class="size-4" /> Drucken</Button>
      <Button variant="ghost" size="sm" onclick={zuruecksetzen}><RotateCcw class="size-4" /> Zurücksetzen</Button>
    </div>
  </header>

  {#if importFehler}
    <p class="text-destructive mb-4 text-sm">{importFehler}</p>
  {/if}

  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
    <main class="space-y-6">
      <!-- 1. Objektdaten -->
      <Abschnitt titel="1. Objekt und Stichtag" paragraf="§ 3 ImmoWertV">
        <div class="grid gap-4 sm:grid-cols-2">
          <Feld label="Bezeichnung" typ="text" bind:value={s.objekt.bezeichnung} />
          <Feld label="Wertermittlungsstichtag" typ="date" bind:value={s.stichtag} />
        </div>
      </Abschnitt>

      <!-- 2. Bodenwert -->
      <Abschnitt titel="2. Bodenwert" paragraf="§ 40 ImmoWertV">
        <div class="grid gap-4 sm:grid-cols-2">
          <Feld label="Grundstücksfläche" einheit="m²" min={0} bind:value={s.bodenwert.flaeche} />
          <Feld
            label="Bodenrichtwert"
            einheit="€/m²"
            min={0}
            bind:value={s.bodenwert.richtwert}
            hinweis="Quelle: BORIS bzw. Gutachterausschuss, ggf. objektspezifisch angepasst (§ 26 Abs. 2 ImmoWertV)"
          />
        </div>
        <Formel
          zeilen={[
            `Bodenwert = Grundstücksfläche × Bodenrichtwert`,
            `Bodenwert = ${num(s.bodenwert.flaeche)} m² × ${num(s.bodenwert.richtwert)} €/m² = ${eur(bw)}`,
          ]}
        />
      </Abschnitt>

      <!-- 3. Haus: Gebäudedaten -->
      <Abschnitt titel="3. Hauptgebäude – Gebäudeart und BGF" paragraf="Anlage 4 Abschnitt I/II ImmoWertV">
        <div class="grid gap-1.5">
          <Label for="haus-typ">Gebäudeart (NHK 2010)</Label>
          <select
            id="haus-typ"
            bind:value={s.haus.nhkCode}
            class="border-input bg-background h-9 w-full max-w-2xl rounded-md border px-2 text-sm"
          >
            <optgroup label="Ein-/Zweifamilienhäuser, Doppel-/Reihenhäuser (Stufen 1–5)">
              {#each wohnhausTypen as t (t.code)}
                <option value={t.code}>{t.code} – {t.name}</option>
              {/each}
            </optgroup>
            <optgroup label="Weitere Gebäudearten (Stufen 3–5)">
              {#each sonstigeTypen as t (t.code)}
                <option value={t.code}>{t.code} – {t.name}</option>
              {/each}
            </optgroup>
            <optgroup label="Garagen (Stufen 3–5)">
              {#each garagenTypen as t (t.code)}
                <option value={t.code}>{t.code} – {t.name}</option>
              {/each}
            </optgroup>
            <optgroup label="Landwirtschaftliche Betriebsgebäude (Stufen 3–5)">
              {#each landwirtschaftTypen as t (t.code)}
                <option value={t.code}>{t.code} – {t.name}</option>
              {/each}
            </optgroup>
          </select>
          {#if hausTyp.hinweis}
            <p class="text-muted-foreground text-xs">{hausTyp.hinweis}</p>
          {/if}
          {#each hinweiseFuer(hausTyp.code) as h (h.quelle + h.punkte[0])}
            <AmtlicherHinweis hinweis={h} titel="Amtlicher Hinweis zur Gebäudeart" />
          {/each}
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <Feld label="Baujahr" min={1800} bind:value={s.haus.baujahr} />
          <Feld
            label="Gesamtnutzungsdauer (GND)"
            einheit="Jahre"
            min={1}
            bind:value={s.haus.gnd}
            hinweis={hausTyp.gndDefault
              ? `Modellansatz Anlage 1: ${hausTyp.gndDefault} Jahre`
              : "In Anlage 1 nicht aufgeführt — aus vergleichbaren Anlagen ableiten"}
          />
          <Feld
            label="Objektspez. Anpassungsfaktor"
            step="0.01"
            min={0}
            bind:value={s.haus.anpassungsfaktor}
            hinweis="z. B. Zuschlag für ausgebauten Spitzboden, Korrekturfaktoren der Anlage 4"
          />
        </div>
        <Separator />
        <GeschossListe bind:geschosse={s.haus.geschosse} />
        <AmtlicherHinweis hinweis={BGF_HINWEIS} titel="Was zählt zur Brutto-Grundfläche?" />
      </Abschnitt>

      <!-- 4. Haus: Ausstattungsgrad -->
      <Abschnitt
        titel="4. Hauptgebäude – Ausstattungsgrad (Standardstufen)"
        paragraf="Anlage 4 Abschnitt III ImmoWertV"
        warnung={hausAusstattung.ungueltigeGruppen.length
          ? "Anteile je Kostengruppe müssen in Summe 100 % ergeben."
          : ""}
      >
        <AusstattungMatrix
          typ={hausTyp}
          kostengruppen={hausKgs}
          bind:ausstattung={s.haus.ausstattung}
          bind:gewichte={s.haus.gewichte}
          gewichteAmtlich={hausTyp.gruppe === "wohnhaus"}
          referenz={standardsFuer(hausTyp.code)}
        />
        <Formel
          beschriftung="Gewichteter Kostenkennwert (Basis 2010)"
          zeilen={[
            `Kennwert = Σ (Wägungsanteil × Σ (Stufenanteil × Kostenkennwert der Stufe))`,
            ...([0, 1, 2, 3, 4] as const)
              .filter((i) => hausAusstattung.anteileProStufe[i] > 0.001 && hausTyp.kennwerte[i] != null)
              .map(
                (i) =>
                  `Stufe ${i + 1}: ${num(hausAusstattung.anteileProStufe[i])} % × ${num(hausTyp.kennwerte[i]!)} €/m² = ${eur((hausAusstattung.anteileProStufe[i] / 100) * hausTyp.kennwerte[i]!)}/m²`
              ),
            `Kennwert = ${eur(hausAusstattung.kennwert)}/m² BGF`,
          ]}
        />
      </Abschnitt>

      <!-- 5. Baupreisindex -->
      <Abschnitt titel="5. Baupreisindex (Anpassung an den Stichtag)" paragraf="§ 9 Abs. 2, § 36 Abs. 2 ImmoWertV">
        <div class="grid gap-4 sm:grid-cols-2">
          <Feld
            label="Baupreisindex Wohngebäude (Basis 2021 = 100)"
            step="0.1"
            min={0}
            bind:value={s.bpi.indexWert}
            hinweis="Destatis, Preisindizes für die Bauwirtschaft — Quartal des Stichtags wählen"
          />
          <Feld label="Bezeichnung des Quartals" typ="text" bind:value={s.bpi.indexQuartal} />
          <Feld
            label="Index 2010 (Jahreswert auf Basis 2021 = 100)"
            step="0.1"
            min={0}
            bind:value={s.bpi.index2010}
            hinweis="Destatis, amtlich umbasierter Jahreswert 2010 = 70,8 (Basis 2021 = 100)"
          />
          <Feld label="Index 2021 (Bezugsjahr = 100)" step="0.1" min={0} bind:value={s.bpi.index2021} />
        </div>
        <Formel
          beschriftung="Umbasierung auf NHK-Basisjahr 2010"
          zeilen={[
            `Faktor = Index × Index2021 / (Index2010 × 100)`,
            `Faktor = ${num(s.bpi.indexWert)} × ${num(s.bpi.index2021)} / (${num(s.bpi.index2010)} × 100) = ${num3(bpi.berechneterFaktor)}`,
          ]}
        />
        <div class="grid gap-1.5">
          <Label for="bpi-override">Abweichender Baupreisindex-Faktor (optional, sachverständig)</Label>
          <div class="flex items-center gap-2">
            <Input
              id="bpi-override"
              type="number"
              step="0.001"
              min={0}
              class="max-w-40 text-right"
              placeholder={num3(bpi.berechneterFaktor)}
              bind:value={s.bpi.override}
            />
            {#if bpi.overrideAktiv}
              <span class="text-sm font-medium text-amber-600 dark:text-amber-500">
                Override aktiv: es wird {num3(bpi.faktor)} statt {num3(bpi.berechneterFaktor)} verwendet
              </span>
            {:else}
              <span class="text-muted-foreground text-sm">leer = berechneter Faktor {num3(bpi.faktor)}</span>
            {/if}
          </div>
        </div>
      </Abschnitt>

      <!-- 6. Haus: Herstellungskosten -->
      <Abschnitt titel="6. Hauptgebäude – Herstellungskosten" paragraf="§ 36 ImmoWertV">
        <Formel
          zeilen={[
            `Kennwert (2010, angepasst) = Kennwert (2010) × objektspez. Anpassungsfaktor = ${eur(hausAusstattung.kennwert)}/m² × ${num(s.haus.anpassungsfaktor)} = ${eur(hausHk.kennwertAngepasst)}/m²`,
            `Kennwert (Stichtag) = Kennwert (2010, angepasst) × BPI-Faktor = ${eur(hausHk.kennwertAngepasst)}/m² × ${num3(bpi.faktor)} = ${eur(hausHk.kennwertStichtag)}/m²`,
            `Herstellungskosten = Kennwert (Stichtag) × BGF = ${eur(hausHk.kennwertStichtag)}/m² × ${num(hausBgf)} m² = ${eur(hausHk.herstellungskosten)}`,
          ]}
        />
      </Abschnitt>

      <!-- 7. Haus: Modernisierung und RND -->
      <Abschnitt titel="7. Hauptgebäude – Modernisierungspunkte und Restnutzungsdauer" paragraf="§ 12, Anlage 2 ImmoWertV">
        <Modernisierung bind:punkte={s.haus.modPunkte} />
        <Separator />
        <Formel
          beschriftung="Restnutzungsdauer (Anlage 2 Abschnitt II)"
          zeilen={[
            `Alter = ${stichtagDate.getFullYear()} − ${s.haus.baujahr} = ${hausRnd.alter} Jahre; relatives Alter = ${hausRnd.alter} / ${s.haus.gnd} = ${pct(hausRnd.relativesAlter * 100)}`,
            `Schwellenwert bei ${hausPunkte} Punkten: ${pct(hausRnd.schwellenwert * 100)} → ${hausRnd.formelAngewendet ? "Formel anwendbar" : "RND = GND − Alter"}`,
            ...(hausRnd.formelAngewendet
              ? [
                  `RND = a·Alter²/GND − b·Alter + c·GND   (a=${hausRnd.koeffizienten.a}; b=${hausRnd.koeffizienten.b}; c=${hausRnd.koeffizienten.c})`,
                  `RND = ${hausRnd.koeffizienten.a}·${hausRnd.alter}²/${s.haus.gnd} − ${hausRnd.koeffizienten.b}·${hausRnd.alter} + ${hausRnd.koeffizienten.c}·${s.haus.gnd} = ${hausRnd.rnd} Jahre`,
                ]
              : [`RND = ${s.haus.gnd} − ${hausRnd.alter} = ${hausRnd.rnd} Jahre`]),
            `Zum Vergleich ohne Modernisierung: RND = ${hausRnd.rndMathematisch} Jahre`,
          ]}
        />
      </Abschnitt>

      <!-- 8. Haus: Alterswertminderung -->
      <Abschnitt titel="8. Hauptgebäude – Alterswertminderung" paragraf="§ 38 ImmoWertV">
        <Formel
          zeilen={[
            `AWM = (GND − RND) × 100 / GND = (${s.haus.gnd} − ${hausRnd.rnd}) × 100 / ${s.haus.gnd} = ${pct(hausAwm.prozent)}`,
            `Abzug = Herstellungskosten × AWM = ${eur(hausHk.herstellungskosten)} × ${pct(hausAwm.prozent)} = ${eur(hausAwm.betrag)}`,
            `Sachwert Hauptgebäude = Herstellungskosten − Abzug = ${eur(hausHk.herstellungskosten)} − ${eur(hausAwm.betrag)} = ${eur(hausAwm.restwert)}`,
          ]}
        />
      </Abschnitt>

      <!-- 9. Garage -->
      <Abschnitt titel="9. Garage" paragraf="Anlage 4 Nr. 12 ImmoWertV">
        <div class="flex items-center gap-2">
          <Switch id="garage-aktiv" bind:checked={s.garage.aktiv} />
          <Label for="garage-aktiv">Garage in die Bewertung einbeziehen</Label>
        </div>
        {#if s.garage.aktiv}
          <div class="grid gap-1.5">
            <Label for="garage-typ">Garagentyp</Label>
            <select
              id="garage-typ"
              bind:value={s.garage.nhkCode}
              class="border-input bg-background h-9 w-full max-w-md rounded-md border px-2 text-sm"
            >
              {#each garagenTypen as t (t.code)}
                <option value={t.code}>{t.code} – {t.name}</option>
              {/each}
            </select>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <Feld label="Baujahr" min={1800} bind:value={s.garage.baujahr} />
            <Feld
              label="GND"
              einheit="Jahre"
              min={1}
              bind:value={s.garage.gnd}
              hinweis={garageTyp.gndDefault ? `Modellansatz Anlage 1: ${garageTyp.gndDefault} Jahre` : ""}
            />
            <Feld label="Objektspez. Anpassungsfaktor" step="0.01" min={0} bind:value={s.garage.anpassungsfaktor} />
          </div>
          <GeschossListe bind:geschosse={s.garage.geschosse} />
          <Separator />
          {#if s.garage.nhkCode === "14.1"}
            <AmtlicherHinweis
              hinweis={GARAGEN_STUFEN_HINWEIS}
              titel="Bedeutung der Standardstufen bei Garagen"
              offen
            />
          {/if}
          {#if garageAusstattung.ungueltigeGruppen.length}
            <p class="text-destructive text-sm font-medium">Anteile je Kostengruppe müssen in Summe 100 % ergeben.</p>
          {/if}
          <AusstattungMatrix
            typ={garageTyp}
            kostengruppen={garageKgs}
            bind:ausstattung={s.garage.ausstattung}
            bind:gewichte={s.garage.gewichte}
            gewichteAmtlich={false}
            referenz={standardsFuer(garageTyp.code)}
          />
          <Formel
            zeilen={[
              `Kennwert (Stichtag) = Kennwert (2010) × objektspez. Anpassungsfaktor × BPI-Faktor = ${eur(garageAusstattung.kennwert)}/m² × ${num(s.garage.anpassungsfaktor)} × ${num3(bpi.faktor)} = ${eur(garageHk.kennwertStichtag)}/m²`,
              `Herstellungskosten = Kennwert (Stichtag) × BGF = ${eur(garageHk.kennwertStichtag)}/m² × ${num(garageBgf)} m² = ${eur(garageHk.herstellungskosten)}`,
              `RND = GND − Alter = ${s.garage.gnd} − ${garageAlter} = ${garageRnd} Jahre (ohne Modernisierungsmodell)`,
              `AWM = (GND − RND) × 100 / GND = (${s.garage.gnd} − ${garageRnd}) × 100 / ${s.garage.gnd} = ${pct(garageAwm.prozent)} → Abzug ${eur(garageAwm.betrag)}`,
              `Sachwert Garage = Herstellungskosten − Abzug = ${eur(garageHk.herstellungskosten)} − ${eur(garageAwm.betrag)} = ${eur(garageAwm.restwert)}`,
            ]}
          />
        {/if}
      </Abschnitt>

      <!-- 10. Außenanlagen und vorläufiger Sachwert -->
      <Abschnitt titel="10. Außenanlagen und vorläufiger Sachwert" paragraf="§§ 35–37 ImmoWertV">
        <Feld
          label="Außenanlagen (Pauschale vom Sachwert der baulichen Anlagen)"
          einheit="%"
          step="0.5"
          min={0}
          bind:value={s.aussenanlagenProzent}
          hinweis="Befestigte Wege/Hofflächen, Einfriedungen, Ver- und Entsorgungsanlagen"
        />
        <Formel
          zeilen={[
            `Sachwert bauliche Anlagen = Hauptgebäude${s.garage.aktiv ? " + Garage" : ""} = ${eur(hausAwm.restwert)}${s.garage.aktiv ? ` + ${eur(garageAwm.restwert)}` : ""} = ${eur(kette.bauwerkeNachAwm)}`,
            `Außenanlagen = Sachwert bauliche Anlagen × Pauschale = ${eur(kette.bauwerkeNachAwm)} × ${pct(s.aussenanlagenProzent)} = ${eur(kette.aussenanlagenBetrag)}`,
            `Bauliche Anlagen inkl. Außenanlagen = ${eur(kette.bauwerkeNachAwm)} + ${eur(kette.aussenanlagenBetrag)} = ${eur(kette.bauwerkeInklAussenanlagen)}`,
            `Vorläufiger Sachwert = bauliche Anlagen inkl. Außenanlagen + Bodenwert = ${eur(kette.bauwerkeInklAussenanlagen)} + ${eur(bw)} = ${eur(kette.vorlaeufigerSachwert)}`,
          ]}
        />
      </Abschnitt>

      <!-- 11. Marktanpassung -->
      <Abschnitt titel="11. Marktanpassung (Sachwertfaktor)" paragraf="§ 39 ImmoWertV">
        <Feld
          label="Sachwertfaktor"
          step="0.01"
          min={0}
          bind:value={s.sachwertfaktor}
          hinweis="Quelle: Grundstücksmarktbericht / Gutachterausschuss, objektspezifisch angepasst"
        />
        <Formel
          zeilen={[
            `Marktangepasster Sachwert = vorläufiger Sachwert × Sachwertfaktor = ${eur(kette.vorlaeufigerSachwert)} × ${num(s.sachwertfaktor)} = ${eur(kette.marktangepassterSachwert)}`,
            `Marktanpassung = marktangepasster − vorläufiger Sachwert = ${eur(kette.marktanpassungBetrag)}`,
          ]}
        />
      </Abschnitt>

      <!-- 12. Besondere objektspezifische Grundstücksmerkmale -->
      <Abschnitt titel="12. Besondere objektspezifische Grundstücksmerkmale" paragraf="§ 8 Abs. 3 ImmoWertV">
        <div class="space-y-2">
          {#each s.merkmale as merkmal, i (i)}
            <div class="flex items-center gap-2">
              <Input
                id={`merkmal-${i}-bezeichnung`}
                type="text"
                bind:value={merkmal.bezeichnung}
                placeholder="z. B. Reparaturstau Dach"
                aria-label={`Bezeichnung des besonderen Merkmals ${i + 1}`}
                class="max-w-72"
              />
              <Input
                id={`merkmal-${i}-betrag`}
                type="number"
                step="any"
                bind:value={merkmal.betrag}
                aria-label={`Betrag des besonderen Merkmals ${i + 1} in Euro`}
                class="max-w-36 text-right"
              />
              <span class="text-muted-foreground text-sm">€</span>
              <Button variant="ghost" size="sm" class="no-print" onclick={() => s.merkmale.splice(i, 1)}>Entfernen</Button>
            </div>
          {/each}
          <Button variant="outline" size="sm" class="no-print" onclick={() => s.merkmale.push({ bezeichnung: "", betrag: 0 })}>
            Zu-/Abschlag hinzufügen
          </Button>
          <p class="text-muted-foreground text-xs">
            Zuschläge positiv, Abschläge negativ eintragen. Wirken nach der Marktanpassung.
          </p>
        </div>
        {#if s.merkmale.length}
          <Formel zeilen={[`Summe besondere Merkmale = ${eur(kette.besondereMerkmaleSumme)}`]} />
        {/if}
      </Abschnitt>

      <!-- 13. Verkehrswert -->
      <Abschnitt titel="13. Verkehrswert" paragraf="§ 194 BauGB">
        <Formel
          zeilen={[
            `Verkehrswert = marktangepasster Sachwert ${eur(kette.marktangepassterSachwert)} + besondere Merkmale ${eur(kette.besondereMerkmaleSumme)} = ${eur(kette.verkehrswertUngerundet)}`,
            `Gerundet auf volle 1.000 €: ${eur(kette.verkehrswert)}`,
          ]}
        />
      </Abschnitt>
    </main>

    <!-- Ergebnis-Panel -->
    <aside class="print:hidden">
      <div class="sticky top-4 space-y-3 rounded-lg border p-4 shadow-sm">
        <h2 class="text-sm font-semibold uppercase tracking-wide">Ergebnis</h2>
        {#if !eingabenGueltig}
          <p class="text-destructive text-xs font-medium">
            Eingaben unvollständig: Ausstattungsanteile müssen je Kostengruppe 100 % ergeben.
          </p>
        {/if}
        <dl class="space-y-1.5 text-sm">
          <div class="flex justify-between gap-2"><dt class="text-muted-foreground">Bodenwert</dt><dd class="text-right font-mono">{eur(bw)}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-muted-foreground">Hauptgebäude (nach AWM)</dt><dd class="text-right font-mono">{eur(hausAwm.restwert)}</dd></div>
          {#if s.garage.aktiv}
            <div class="flex justify-between gap-2"><dt class="text-muted-foreground">Garage (nach AWM)</dt><dd class="text-right font-mono">{eur(garageAwm.restwert)}</dd></div>
          {/if}
          <div class="flex justify-between gap-2"><dt class="text-muted-foreground">Außenanlagen</dt><dd class="text-right font-mono">{eur(kette.aussenanlagenBetrag)}</dd></div>
          <div class="flex justify-between gap-2 border-t pt-1.5"><dt class="text-muted-foreground">Vorläufiger Sachwert</dt><dd class="text-right font-mono">{eur(kette.vorlaeufigerSachwert)}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-muted-foreground">Marktanpassung ×{num(s.sachwertfaktor)}</dt><dd class="text-right font-mono">{eur(kette.marktanpassungBetrag)}</dd></div>
          {#if s.merkmale.length}
            <div class="flex justify-between gap-2"><dt class="text-muted-foreground">Besondere Merkmale</dt><dd class="text-right font-mono">{eur(kette.besondereMerkmaleSumme)}</dd></div>
          {/if}
        </dl>
        <div class="border-t pt-2">
          <div class="text-muted-foreground text-xs">Verkehrswert (gerundet)</div>
          <div class="text-2xl font-bold tabular-nums">{eur(kette.verkehrswert)}</div>
          <div class="text-muted-foreground text-xs">ungerundet {eur(kette.verkehrswertUngerundet)}</div>
        </div>
        <p class="text-muted-foreground text-[11px] leading-snug">
          Baupreisindex-Faktor {num3(bpi.faktor)}{bpi.overrideAktiv ? " (Override)" : ""} ·
          RND Haus {hausRnd.rnd} J. · AWM {pct(hausAwm.prozent)}
        </p>
      </div>
    </aside>
  </div>

  <footer class="text-muted-foreground mt-8 text-xs">
    Eigennutzung, keine Rechtsberatung. Datenbasis: ImmoWertV vom 14.07.2021 (Anlagen 1, 2 und 4 —
    NHK 2010), gesetze-im-internet.de. Alle Eingaben werden nur lokal im Browser gespeichert.
  </footer>
</div>
