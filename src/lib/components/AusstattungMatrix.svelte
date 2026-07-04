<script lang="ts">
  import type { Ausstattung } from "$lib/berechnung/sachwert";
  import type { Kostengruppe, NhkTyp } from "$lib/data/nhk2010";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import * as Collapsible from "$lib/components/ui/collapsible";
  import { ChevronDown } from "@lucide/svelte";

  let {
    typ,
    kostengruppen,
    ausstattung = $bindable(),
    gewichte = $bindable(),
    gewichteAmtlich,
  }: {
    typ: NhkTyp;
    kostengruppen: Kostengruppe[];
    ausstattung: Ausstattung;
    gewichte: Record<string, number>;
    /** true = Wägungsanteile amtlich (Anlage 4), false = Konvention/editierbar nötig */
    gewichteAmtlich: boolean;
  } = $props();

  const stufen = [0, 1, 2, 3, 4] as const;
  const verfuegbar = (stufe: number) => typ.kennwerte[stufe] != null;

  function zeilenSumme(id: string): number {
    return (ausstattung[id] ?? [0, 0, 0, 0, 0]).reduce((s, a) => s + (a || 0), 0);
  }

  function setzeVoll(id: string, stufe: number) {
    const v: [number, number, number, number, number] = [0, 0, 0, 0, 0];
    v[stufe] = 100;
    ausstattung[id] = v;
  }

  const gewichtSumme = $derived(kostengruppen.reduce((s, kg) => s + (gewichte[kg.id] ?? kg.gewicht), 0));
</script>

<div class="overflow-x-auto">
  <table class="w-full min-w-[640px] border-collapse text-sm">
    <thead>
      <tr class="border-b text-left">
        <th class="py-2 pr-2 font-medium">Kostengruppe</th>
        <th class="w-20 px-1 py-2 text-right font-medium">Wägung %</th>
        {#each stufen as stufe (stufe)}
          <th class="w-20 px-1 py-2 text-center font-medium" class:text-muted-foreground={!verfuegbar(stufe)}>
            Stufe {stufe + 1}
            {#if verfuegbar(stufe)}
              <div class="text-muted-foreground text-xs font-normal">{typ.kennwerte[stufe]} €</div>
            {:else}
              <div class="text-muted-foreground text-xs font-normal">–</div>
            {/if}
          </th>
        {/each}
        <th class="w-16 px-1 py-2 text-right font-medium">Σ</th>
      </tr>
    </thead>
    <tbody>
      {#each kostengruppen as kg (kg.id)}
        {@const summe = zeilenSumme(kg.id)}
        {@const gueltig = Math.abs(summe - 100) < 0.001}
        <tr class={`border-b align-top ${gueltig ? "" : "bg-destructive/10"}`}>
          <td class="py-2 pr-2">
            <div class="font-medium">{kg.name}</div>
            {#if kg.beschreibungen.some((b) => b)}
              <Collapsible.Root>
                <Collapsible.Trigger
                  class="text-muted-foreground hover:text-foreground no-print inline-flex items-center gap-1 text-xs"
                >
                  <ChevronDown class="size-3" /> Stufenbeschreibungen
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <dl class="text-muted-foreground mt-1 max-w-xl space-y-1 text-xs">
                    {#each kg.beschreibungen as beschreibung, stufe (stufe)}
                      {#if beschreibung}
                        <div>
                          <dt class="inline font-semibold">Stufe {stufe + 1}:</dt>
                          <dd class="inline">{beschreibung}</dd>
                        </div>
                      {/if}
                    {/each}
                  </dl>
                </Collapsible.Content>
              </Collapsible.Root>
            {/if}
          </td>
          <td class="px-1 py-2 text-right">
            <Input
              type="number"
              step="any"
              min={0}
              max={100}
              bind:value={gewichte[kg.id]}
              class="h-8 w-16 px-1 text-right text-xs"
            />
          </td>
          {#each stufen as stufe (stufe)}
            <td class="px-1 py-2 text-center">
              {#if verfuegbar(stufe)}
                <Input
                  type="number"
                  step="any"
                  min={0}
                  max={100}
                  bind:value={ausstattung[kg.id]![stufe]}
                  class="h-8 w-16 px-1 text-right text-xs"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  class="no-print text-muted-foreground h-5 px-1 text-[10px]"
                  onclick={() => setzeVoll(kg.id, stufe)}
                >
                  100 %
                </Button>
              {/if}
            </td>
          {/each}
          <td class="px-1 py-2 text-right font-mono text-xs" class:text-destructive={!gueltig}>
            {summe} %
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<div class="text-muted-foreground flex flex-wrap items-center gap-x-4 text-xs">
  <span class:text-destructive={Math.abs(gewichtSumme - 100) > 0.001}>
    Summe der Wägungsanteile: {gewichtSumme} % (soll 100 %)
  </span>
  {#if gewichteAmtlich}
    <span>Wägungsanteile amtlich nach Anlage 4 Abschnitt III Nr. 1 ImmoWertV.</span>
  {:else}
    <span>Keine amtlichen Wägungsanteile für diese Gebäudeart — Vorbelegung ist eine Software-Konvention, bitte prüfen.</span>
  {/if}
</div>
