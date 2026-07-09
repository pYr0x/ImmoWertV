// @vitest-environment jsdom
/**
 * Smoke-Test: Die komplette App muss sich mounten lassen und die Rechenkette
 * mit den Default-Eingaben rendern.
 */
import { describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import App from "./App.svelte";

describe("App", () => {
  it("mountet und zeigt die Rechenkette", () => {
    const app = mount(App, { target: document.body });
    flushSync();

    const text = document.body.textContent ?? "";
    expect(text).toContain("Verkehrswertermittlung nach dem Sachwertverfahren");
    expect(text).toContain("Bodenwert");
    expect(text).toContain("Ausstattungsgrad");
    expect(text).toContain("Baupreisindex");
    expect(text).toContain("Restnutzungsdauer");
    expect(text).toContain("Alterswertminderung");
    expect(text).toContain("Verkehrswert");
    // Default: DHH Typ 2.01 ist vorausgewählt
    const select = document.getElementById("haus-typ") as HTMLSelectElement;
    expect(select.value).toBe("2.01");
    expect(document.querySelector('[aria-label="Bezeichnung der Geschossebene 1"]')).not.toBeNull();
    expect(document.querySelector('[aria-label*="Anteil der Standardstufe 1"]')).not.toBeNull();
    expect(document.querySelector("button.h-6")).not.toBeNull();

    unmount(app);
  });
});
