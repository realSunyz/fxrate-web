import { useState, useEffect } from "react";

const bankMap: { [key: string]: string } = {
  招商银行: "cmb",
  工商银行: "icbc",
  中国银行: "boc",
  兴业银行: "cib",
  兴业寰宇: "cibHuanyu",
  浦发银行: "spdb",
  建设银行: "ccb",
  中信银行: "citic.cn",
};

const API_BASE_URL = "https://fxrate-api.sunyz.net/v1"; // API 基础 URL

const useFetchRates = (fromCurrency: string, toCurrency: string) => {
  const [rates, setRates] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const updatedRates = new Map<string, any>();

        for (const [bankName, bankCode] of Object.entries(bankMap)) {
          const response = await fetch(
            `${API_BASE_URL}/${bankCode}/${fromCurrency}/${toCurrency}`,
          );
          const data = await response.json();

          updatedRates.set(bankName, {
            cash: data.cash,
            middle: data.middle,
            remit: data.remit,
            updated: data.updated,
          });

          // await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        setRates(updatedRates);
      } catch (error) {
        setError("无法获取汇率数据");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, toCurrency]);

  return { rates, loading, error };
};

export default useFetchRates;
