import { useState, useEffect } from "react";

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
};

const useFetchRates = (fromCurrency: string, toCurrency: string) => {
  const [rates, setRates] = useState<Map<string, any>>(new Map());
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setRates(new Map());
    const fetchRates = async () => {
      try {
        for (const [bankName, bankCode] of Object.entries(bankMap)) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/${bankCode}/${fromCurrency}/${toCurrency}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            setRates((prevRates) => {
              const updatedRates = new Map(prevRates);
              updatedRates.set(bankName, {
                cash: data.cash,
                middle: data.middle,
                remit: data.remit,
                updated: data.updated,
              });
              return updatedRates;
            });
          } catch (err) {
            setRates((prevRates) => {
              const updatedRates = new Map(prevRates);
              updatedRates.set(bankName, { error: true });
              return updatedRates;
            });
          }
        }
      } catch (error) {
        setError("获取失败");
      }
    };

    fetchRates();
  }, [fromCurrency, toCurrency]);

  return { rates, error };
};

export default useFetchRates;
