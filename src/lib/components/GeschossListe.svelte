<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Plus, Trash2 } from "@lucide/svelte";
  import { num } from "$lib/format";
  import { bgfSumme } from "$lib/berechnung/sachwert";

  let {
    geschosse = $bindable(),
  }: {
    geschosse: { name: string; flaeche: number }[];
  } = $props();

  const summe = $derived(bgfSumme(geschosse));

  function hinzufuegen() {
    geschosse.push({ name: "", flaeche: 0 });
  }

  function entfernen(index: number) {
    geschosse.splice(index, 1);
  }
</script>

<div class="space-y-2">
  {#each geschosse as geschoss, i (i)}
    <div class="flex items-center gap-2">
      <Input type="text" bind:value={geschoss.name} placeholder="Geschossebene" class="max-w-56" />
      <Input type="number" step="any" min={0} bind:value={geschoss.flaeche} class="max-w-32 text-right" />
      <span class="text-muted-foreground text-sm">m²</span>
      <Button variant="ghost" size="icon" class="no-print" onclick={() => entfernen(i)} aria-label="Ebene entfernen">
        <Trash2 class="size-4" />
      </Button>
    </div>
  {/each}
  <div class="flex items-center justify-between">
    <Button variant="outline" size="sm" class="no-print" onclick={hinzufuegen}>
      <Plus class="size-4" /> Ebene hinzufügen
    </Button>
    <div class="text-sm font-semibold">BGF gesamt: {num(summe)} m²</div>
  </div>
  <p class="text-muted-foreground text-xs">
    Anzurechnen sind die Bereiche a und b nach DIN 277 (Außenmaße einschließlich Bekleidung).
    Nicht zur BGF gehören z.&nbsp;B. Spitzböden, Kriechkeller und Balkone (Anlage 4 Abschnitt I Nr.&nbsp;2 ImmoWertV).
  </p>
</div>
