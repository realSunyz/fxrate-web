import { useState, useEffect } from "react";
import { US, CA, HK, EU, GB, JP, KR, SG, RU, CH, AE } from "country-flag-icons/react/3x2"

const API_BASE_URL = "https://fxrate-api.sunyz.net/v1";

export const bankMap: { [key: string]: string } = {
    招商银行: "cmb",
    中国银行: "boc",
    兴业银行: "cib",
    兴业寰宇: "cibHuanyu",
    交通银行: "bocom",
    工商银行: "icbc",
    建设银行: "ccb",
    浦发银行: "spdb",
    平安银行: "pab",
    邮储银行: "psbc",
    中信银行: "citic.cn",
    汇丰中国: "hsbc.cn",
}

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
  { value: "AED", label: "迪拉姆", flag: AE },
]

export type CurrencyData = {
    bank: string
    cash: number
    remit: number
    middle: number
    updated: string
}

const useFetchRates = (fromCurrency: string, toCurrency: string) => {
    const [rates, setRates] = useState<CurrencyData[]>([])
    const [error, setError] = useState<string>("")
  
    useEffect(() => {
      const fetchRates = async () => {
        const tempRates: CurrencyData[] = []
        try {
          for (const [bankName, bankCode] of Object.entries(bankMap)) {
            try {
                    const response = await fetch(
                        `${API_BASE_URL}/${bankCode}/${fromCurrency}/${toCurrency}`
                    );
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json()
                    tempRates.push({
                        bank: bankName,
                        cash: data.cash,
                        remit: data.remit,
                        middle: data.middle,
                        updated: data.updated,
                    })
                } catch (err) {
                    tempRates.push({
                        bank: bankName,
                        cash: 0,
                        remit: 0,
                        middle: 0,
                        updated: "无法获取数据",
                    })
                }
            }
            setRates(tempRates)
        } catch (error) {
            setError("获取失败");
        }
      };
  
      fetchRates();
    }, [fromCurrency, toCurrency]);
  
    return { rates, error };
};

export default useFetchRates;
