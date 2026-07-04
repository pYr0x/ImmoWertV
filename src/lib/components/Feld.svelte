<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  let {
    label,
    einheit = "",
    typ = "number",
    step = "any",
    min = undefined,
    max = undefined,
    hinweis = "",
    value = $bindable(),
  }: {
    label: string;
    einheit?: string;
    typ?: "number" | "date" | "text";
    step?: string | number;
    min?: number | undefined;
    max?: number | undefined;
    hinweis?: string;
    value: number | string | null;
  } = $props();

  const id = `feld-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="grid gap-1.5">
  <Label for={id}>{label}</Label>
  <div class="flex items-center gap-2">
    {#if typ === "number"}
      <Input {id} type="number" {step} {min} {max} bind:value class="max-w-40 text-right" />
    {:else if typ === "date"}
      <Input {id} type="date" bind:value class="max-w-44" />
    {:else}
      <Input {id} type="text" bind:value class="max-w-72" />
    {/if}
    {#if einheit}<span class="text-muted-foreground text-sm">{einheit}</span>{/if}
  </div>
  {#if hinweis}
    <p class="text-muted-foreground text-xs">{hinweis}</p>
  {/if}
</div>
