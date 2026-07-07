export const BEEIJA_MAX_INPUT_LENGTH = 12;
export const BEEIJA_MAX_NUMBER = 999_999_999_999;
export const BEEIJA_VERY_HIGH_LIMIT = 999_000_000_000_000;

export function cleanBeeijaDecimalInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  const normalized =
    parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("")}` : parts[0];

  return normalized.slice(0, BEEIJA_MAX_INPUT_LENGTH);
}

export function parseBeeijaNumber(value: string | number) {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) return 0;
    return Math.min(value, BEEIJA_MAX_NUMBER);
  }

  if (!value.trim()) return 0;

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) return 0;

  return Math.min(parsed, BEEIJA_MAX_NUMBER);
}

export function hasBeeijaInputWarning(value: string) {
  return Number(value) > BEEIJA_MAX_NUMBER || value.length >= BEEIJA_MAX_INPUT_LENGTH;
}

export function formatBeeijaNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (value >= BEEIJA_VERY_HIGH_LIMIT) return "Very high value";

  return new Intl.NumberFormat("en-US", {
    notation: "standard",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatBeeijaCurrency(value: number, currency = "USD") {
  if (!Number.isFinite(value)) return "$0.00";
  if (value >= BEEIJA_VERY_HIGH_LIMIT) return "Very high estimate";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "standard",
    maximumFractionDigits: 2,
  }).format(value);
}
