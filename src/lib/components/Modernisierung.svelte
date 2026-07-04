<script lang="ts">
  import { MODERNISIERUNGSELEMENTE, MAX_MODERNISIERUNGSPUNKTE, modernisierungsgrad } from "$lib/data/modernisierung";
  import { Button } from "$lib/components/ui/button";
  import { Minus, Plus } from "@lucide/svelte";

  let {
    punkte = $bindable(),
  }: {
    punkte: Record<string, number>;
  } = $props();

  const summe = $derived(
    MODERNISIERUNGSELEMENTE.reduce((s, e) => s + (punkte[e.id] ?? 0), 0)
  );

  function schritt(id: string, max: number, delta: number) {
    const aktuell = punkte[id] ?? 0;
    punkte[id] = Math.min(max, Math.max(0, aktuell + delta));
  }
</script>

<div class="space-y-2">
  {#each MODERNISIERUNGSELEMENTE as element (element.id)}
    {@const wert = punkte[element.id] ?? 0}
    <div class="flex items-center justify-between gap-2">
      <span class="text-sm">{element.bezeichnung}</span>
      <div class="flex shrink-0 items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          class="no-print size-7"
          disabled={wert <= 0}
          onclick={() => schritt(element.id, element.maxPunkte, -1)}
          aria-label="Punkt abziehen"
        >
          <Minus class="size-3" />
        </Button>
        <span class="w-14 text-center font-mono text-sm">{wert} / {element.maxPunkte}</span>
        <Button
          variant="outline"
          size="icon"
          class="no-print size-7"
          disabled={wert >= element.maxPunkte}
          onclick={() => schritt(element.id, element.maxPunkte, 1)}
          aria-label="Punkt vergeben"
        >
          <Plus class="size-3" />
        </Button>
      </div>
    </div>
  {/each}
  <div class="flex items-center justify-between border-t pt-2 text-sm font-semibold">
    <span>Modernisierungspunkte gesamt (Tabelle 1, Anlage 2)</span>
    <span class="font-mono">{summe} / {MAX_MODERNISIERUNGSPUNKTE}</span>
  </div>
  <p class="text-muted-foreground text-xs">
    Modernisierungsgrad nach Tabelle 2: <span class="font-medium">{modernisierungsgrad(summe)}</span>
  </p>
</div>
