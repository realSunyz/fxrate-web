import { useState, useEffect } from "react";
import {
  US,
  CA,
  HK,
  EU,
  GB,
  JP,
  KR,
  SG,
  RU,
  CH,
  AE,
  TW,
} from "country-flag-icons/react/3x2";

const API_BASE_URL = "https://fxrate-api.sunyz.net/v1";

export const bankMap: { [key: string]: string } = {
  cmb: "cmb",
  boc: "boc",
  cib: "cib",
  cibHuanyu: "cibHuanyu",
  bocom: "bocom",
  icbc: "icbc",
  ccb: "ccb",
  pab: "pab",
  psbc: "psbc",
  citiccn: "citic.cn",
  hsbccn: "hsbc.cn",
  upi: "unionpay",
  visa: "visa",
};

export const Currencies = [
  { value: "USD", flag: US },
  { value: "CAD", flag: CA },
  { value: "HKD", flag: HK },
  { value: "EUR", flag: EU },
  { value: "GBP", flag: GB },
  { value: "JPY", flag: JP },
  { value: "KRW", flag: KR },
  { value: "SGD", flag: SG },
  { value: "RUB", flag: RU },
  { value: "CHF", flag: CH },
  { value: "TWD", flag: TW },
  { value: "AED", flag: AE },
];

export type CurrencyData = {
  bank: string;
  sellRemit: number | null;
  sellCash: number | null;
  buyRemit: number | null;
  buyCash: number | null;
  middle: number | null;
  updated: string | null;
};

const useFetchRates = (fromCurrency: string, toCurrency: string) => {
  const [rates, setRates] = useState<CurrencyData[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const bankNames = Object.keys(bankMap);
    const initialRates: CurrencyData[] = bankNames.map((bank) => ({
      bank,
      sellRemit: null,
      sellCash: null,
      buyRemit: null,
      buyCash: null,
      middle: null,
      updated: null,
    }));
    setRates(initialRates);

    let loadedCount = 0;
    bankNames.forEach((bankName) => {
      const bankCode = bankMap[bankName];
      fetch(`${API_BASE_URL}/${bankCode}/${fromCurrency}/${toCurrency}?precision=2&amount=100&fees=0`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ERROR: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setRates((prevRates) =>
            prevRates.map((item) =>
              item.bank === bankName
                ? {
                    ...item,
                    buyRemit: data.remit,
                    buyCash: data.cash,
                    middle: data.middle,
                    updated: data.updated,
                  }
                : item
            )
          );
        })
        .catch((err) => {
          setRates((prevRates) =>
            prevRates.map((item) =>
              item.bank === bankName
                ? {
                    ...item,
                    buyRemit: 0,
                    buyCash: 0,
                    middle: 0,
                    updated: "Unavailable",
                  }
                : item
            )
          );
        })
        .finally(() => {
          loadedCount++;
          if (loadedCount === bankNames.length) {
            setLoading(false);
          }
        });
      fetch(`${API_BASE_URL}/${bankCode}/${toCurrency}/${fromCurrency}?reverse=true&precision=2&amount=100&fees=0`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ERROR: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setRates((prevRates) =>
            prevRates.map((item) =>
              item.bank === bankName
                ? {
                    ...item,
                    sellRemit: data.remit,
                    sellCash: data.cash,
                  }
                : item
            )
          );
        })
        .catch((err) => {
          setRates((prevRates) =>
            prevRates.map((item) =>
              item.bank === bankName
                ? {
                    ...item,
                    sellRemit: 0,
                    sellCash: 0,
                  }
                : item
            )
          );
        });
    });
  }, [fromCurrency, toCurrency]);

  return { rates, error, loading };
};

export default useFetchRates;
