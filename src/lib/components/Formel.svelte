<script lang="ts">
  let {
    beschriftung = "Formel",
    zeilen,
  }: {
    beschriftung?: string;
    zeilen: string[];
  } = $props();
</script>

<div class="bg-muted/50 rounded-md border px-3 py-2 print:bg-transparent">
  <div class="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
    {beschriftung}
  </div>
  <div class="overflow-x-auto">
    {#each zeilen as zeile (zeile)}
      <div class="font-mono text-sm whitespace-nowrap">{zeile}</div>
    {/each}
  </div>
</div>
