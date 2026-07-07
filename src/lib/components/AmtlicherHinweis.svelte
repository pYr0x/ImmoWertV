<script lang="ts">
  import type { AmtlicherHinweis } from "$lib/data/hinweise";
  import * as Collapsible from "$lib/components/ui/collapsible";
  import { BookOpenText, ChevronDown } from "@lucide/svelte";

  let {
    hinweis,
    titel = "Amtlicher Hinweis",
    offen = false,
  }: {
    hinweis: AmtlicherHinweis;
    titel?: string;
    /** true = Inhalt sofort sichtbar (kein Aufklappen nötig) */
    offen?: boolean;
  } = $props();
</script>

<!--
  Amtliche Anwendungshinweise (Verordnungstext) — bewusst farblich abgesetzt
  von den übrigen UI-Texten und den Stufenbeschreibungen der Kostengruppen.
-->
<div
  class="no-print rounded-md border-l-4 border-sky-500 bg-sky-50 px-3 py-2 text-sky-900 dark:border-sky-400 dark:bg-sky-950/40 dark:text-sky-100"
>
  {#if offen}
    <div class="flex items-center gap-1.5 text-xs font-semibold">
      <BookOpenText class="size-3.5 shrink-0" />
      {titel}
      <span class="font-normal text-sky-700 dark:text-sky-300">— {hinweis.quelle}</span>
    </div>
    <ul class="mt-1 list-disc space-y-1 pl-4 text-xs">
      {#each hinweis.punkte as punkt (punkt)}
        <li>{punkt}</li>
      {/each}
    </ul>
  {:else}
    <Collapsible.Root>
      <Collapsible.Trigger class="flex w-full items-center gap-1.5 text-left text-xs font-semibold">
        <ChevronDown class="size-3 shrink-0" />
        <BookOpenText class="size-3.5 shrink-0" />
        {titel}
        <span class="font-normal text-sky-700 dark:text-sky-300">— {hinweis.quelle}</span>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <ul class="mt-1 list-disc space-y-1 pl-4 text-xs">
          {#each hinweis.punkte as punkt (punkt)}
            <li>{punkt}</li>
          {/each}
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  {/if}
</div>
