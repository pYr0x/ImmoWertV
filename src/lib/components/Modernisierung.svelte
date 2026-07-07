<script lang="ts">
  import { MODERNISIERUNGSELEMENTE, MAX_MODERNISIERUNGSPUNKTE, modernisierungsgrad } from "$lib/data/modernisierung";
  import { Button } from "$lib/components/ui/button";
  import * as Collapsible from "$lib/components/ui/collapsible";
  import { ChevronDown, Minus, Plus } from "@lucide/svelte";

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
  <Collapsible.Root>
    <Collapsible.Trigger
      class="text-muted-foreground hover:text-foreground no-print inline-flex items-center gap-1 text-xs"
    >
      <ChevronDown class="size-3" /> Amtliche Hinweise zur Punktevergabe (Anlage 2 Abschnitt I)
    </Collapsible.Trigger>
    <Collapsible.Content>
      <ul class="text-muted-foreground mt-1 list-disc space-y-1 pl-4 text-xs">
        <li>
          Punkte sind für die zum Stichtag oder kurz vor dem Stichtag durchgeführten
          Modernisierungsmaßnahmen zu vergeben. Liegen die Maßnahmen weiter zurück, ist zu prüfen,
          ob nicht weniger als die maximal zu vergebenden Punkte anzusetzen sind.
        </li>
        <li>
          Wenn nicht modernisierte Bauelemente noch zeitgemäßen Ansprüchen genügen, sind mit einer
          Modernisierung vergleichbare Punkte zu vergeben.
        </li>
        <li>
          Alternativ kann die Punktzahl durch sachverständige Einschätzung des Modernisierungsgrades
          nach Tabelle 2 ermittelt werden (z. B. „überwiegend modernisiert" ≙ 11–17 Punkte).
        </li>
        <li>
          Kernsanierung: Das Gebäude wird in einen Zustand versetzt, der nahezu einem neuen Gebäude
          entspricht. Dann ist als Baujahr das Jahr der fachgerechten Sanierung anzusetzen (Restnutzungsdauer
          bis zu 90 % der Gesamtnutzungsdauer); verbliebene alte Bausubstanz ist durch einen Abschlag
          zu berücksichtigen.
        </li>
        <li>Das Punktemodell ersetzt nicht die sachverständige Würdigung des Einzelfalls.</li>
      </ul>
    </Collapsible.Content>
  </Collapsible.Root>
</div>
