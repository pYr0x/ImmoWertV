<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Card from "$lib/components/ui/card";

  let {
    titel,
    paragraf = "",
    warnung = "",
    children,
  }: {
    titel: string;
    paragraf?: string;
    warnung?: string;
    children: Snippet;
  } = $props();
</script>

<Card.Root class="app-section print:break-inside-avoid print:border-0 print:shadow-none">
  <Card.Header>
    <Card.Title class="flex items-baseline justify-between gap-2">
      <span>{titel}</span>
      {#if paragraf}
        <span class="text-muted-foreground text-xs font-normal whitespace-nowrap">{paragraf}</span>
      {/if}
    </Card.Title>
    {#if warnung}
      <p class="text-destructive text-sm font-medium">{warnung}</p>
    {/if}
  </Card.Header>
  <Card.Content class="space-y-4">
    {@render children()}
  </Card.Content>
</Card.Root>
