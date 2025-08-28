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
  招商银行: "cmb",
  中国银行: "boc",
  兴业银行: "cib",
  兴业寰宇: "cibHuanyu",
  交通银行: "bocom",
  工商银行: "icbc",
  建设银行: "ccb",
  平安银行: "pab",
  邮储银行: "psbc",
  中信银行: "citic.cn",
  汇丰中国: "hsbc.cn",
  银联国际: "unionpay",
  维萨VISA: "visa",
};

export const Currencies = [
  { value: "USD", label: "美元", flag: US },
  { value: "CAD", label: "加元", flag: CA },
  { value: "HKD", label: "港元", flag: HK },
  { value: "EUR", label: "欧元", flag: EU },
  { value: "GBP", label: "英镑", flag: GB },
  { value: "JPY", label: "日元", flag: JP },
  { value: "KRW", label: "韩元", flag: KR },
  { value: "SGD", label: "新元", flag: SG },
  { value: "RUB", label: "卢布", flag: RU },
  { value: "CHF", label: "瑞郎", flag: CH },
  { value: "TWD", label: "新台币", flag: TW },
  { value: "AED", label: "迪拉姆", flag: AE },
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
            throw new Error(`HTTP 错误: ${response.status}`);
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
                    updated: "无法获取数据",
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
            throw new Error(`HTTP 错误: ${response.status}`);
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
