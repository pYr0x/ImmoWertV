const eurFmt = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const eurGanzFmt = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numFmt = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });
const num3Fmt = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export const eur = (x: number): string => eurFmt.format(x);
export const eurGanz = (x: number): string => eurGanzFmt.format(x);
export const num = (x: number): string => numFmt.format(x);
export const num3 = (x: number): string => num3Fmt.format(x);
export const pct = (x: number): string => `${numFmt.format(x)} %`;
