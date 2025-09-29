import type { CurrencyData } from "@/components/fetch";

type CachedBypassMeta = { countryEligible: boolean; uaEligible: boolean } | null;

export type CurrencyTableCache = {
  fromCurrency: string;
  authenticated: boolean;
  consentChecked: boolean;
  bypassEligible: boolean;
  bypassAttempted: boolean;
  bypassMeta: CachedBypassMeta;
  rates: CurrencyData[];
  loading: boolean;
  timestamp: number;
};

let cache: CurrencyTableCache | null = null;

export function loadCurrencyTableCache() {
  return cache;
}

export function saveCurrencyTableCache(next: CurrencyTableCache) {
  cache = next;
}
