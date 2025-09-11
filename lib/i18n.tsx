"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "zh" | "en";

type Dict = Record<string, string>;

type Dictionaries = {
  zh: Dict;
  en: Dict;
};

const dictionaries: Dictionaries = {
  zh: {
    // General
    "navbar.title": "fxRate Web",
    "common.toggleTheme": "切换主题",
    "common.language": "语言",
    "common.zh": "中文",
    "common.en": "English",
    "common.followSystem": "跟随系统",
    // Help Dialog
    "help.title": "帮助",
    "help.description": "你可能需要的信息和设置",
    "help.info.title": "信息",
    "help.info.line1": "“兴业寰宇”指由兴业银行发行的“寰宇人生卡”，持卡人可享受结汇购汇交易费率5折优惠。",
    "help.info.line2": "“银联国际”与“维萨VISA”均为卡组织汇率，仅适用于使用该卡组织所发行银行卡进行的外币交易，不可手动购汇购钞。",
    "help.info.line3": "由于各银行方可能不定期调整数据接口，如您发现某数据源连续多日出现异常，请发送邮件至 noc@sunyz.net 反馈，我们将及时核查与处理。",
    // Disclaimer
    "disclaimer.title": "免责声明",
    "disclaimer.description": "如您不同意以下内容，请关闭本网站。",
    "disclaimer.line1": "本页面所展示的汇率数据均采集自各银行官方网站。",
    "disclaimer.line2": "由于缓存机制、访问速率限制、网络状况及其他技术因素，页面所示数据可能存在一定延迟或与银行官网存在差异。请以各银行官方网站或 App 公布的数据为准。",
    "disclaimer.line3": "本页面所载全部内容仅供一般信息参考之用，不应视为对任何投资、交易或金融产品与服务的要约、招揽、建议或推荐。用户在进行相关决策前，应自行甄别并向专业机构咨询。",
    "disclaimer.line4": "因使用本页面内容或依赖本页面数据而产生的任何直接或间接损失、风险或不利后果，我们概不负责。用户须自行承担使用本页面的风险。",
    "disclaimer.line5": "我们保留随时修改、更新本免责声明的权利，恕不另行通知。",
    // Footer
    "footer.build": "fxRate Web (build {{id}})",
    "footer.copyright": "版权所有 © 2025 Yanzheng Sun。保留所有权利。",
    // Table
    "columns.bank": "银行",
    "columns.sellRemit": "购汇价",
    "columns.buyRemit": "结汇价",
    "columns.buyCash": "结钞价",
    "columns.middle": "中间价",
    "columns.updated": "更新时间",
    "table.loading": "数据获取中",
    "table.unavailable": "无法获取数据",
    "table.invalidToken": "Token 错误，请刷新页面",
    "select.source": "源货币",
    "select.target": "目标货币",
    "select.search": "搜索",
    "select.empty": "暂不支持该货币",
    // Consent
    "consent.agreePrefix": "使用本服务即视为同意我们的",
    "consent.policy": "服务政策",
    // Currency
    "currency.USD": "美元",
    "currency.CAD": "加元",
    "currency.HKD": "港元",
    "currency.EUR": "欧元",
    "currency.GBP": "英镑",
    "currency.JPY": "日元",
    "currency.KRW": "韩元",
    "currency.SGD": "新元",
    "currency.RUB": "卢布",
    "currency.CHF": "瑞郎",
    "currency.TWD": "新台币",
    "currency.AED": "迪拉姆",
    "currency.CNY": "人民币",
    // Bank
    "bank.cmb": "招商银行",
    "bank.boc": "中国银行",
    "bank.cib": "兴业银行",
    "bank.cibHuanyu": "兴业寰宇",
    "bank.bocom": "交通银行",
    "bank.icbc": "工商银行",
    "bank.ccb": "建设银行",
    "bank.pab": "平安银行",
    "bank.psbc": "邮政储蓄",
    "bank.citiccn": "中信银行",
    "bank.hsbccn": "汇丰中国",
    "bank.upi": "银联国际",
    "bank.visa": "维萨VISA",
  },
  en: {
    // General
    "navbar.title": "fxRate Web",
    "common.toggleTheme": "Toggle theme",
    "common.language": "Language",
    "common.zh": "中文",
    "common.en": "English",
    "common.followSystem": "Follow system",
    // Help Dialog
    "help.title": "Help",
    "help.description": "Information and Settings you may need",
    "help.info.title": "Info",
    "help.info.line1": "\"CIB HY\" refers to \"Huanyu Life Card\" issued by China Industrial Bank. Cardholders are entitled to a 50% discount on conversion fees for foreign exchange purchases and settlements.",
    "help.info.line2": "\"UnionPay\" and \"VISA\" refers to exchange rates published by the respective card associations. These rates apply only to foreign currency transactions conducted with cards issued by the corresponding card association.",
    "help.info.line3": "As banks may adjust their data interfaces from time to time, if you notice that a data source has been abnormal for serval days, please report it via email to noc@sunyz.net. We will verify and handle it promptly.",
    // Disclaimer
    "disclaimer.title": "Disclaimer",
    "disclaimer.description": "Close the website if you do not agree with the following terms.",
    "disclaimer.line1": "The exchange rates shown on this site are sourced directly from official bank websites.",
    "disclaimer.line2": "Because of caching, rate limits, network conditions, and other technical factors, the data displayed here may be delayed or differ from the rates shown on the banks\' official websites or apps. Please always refer to the official sources for the most accurate information.",
    "disclaimer.line3": "All information provided on this site is for general reference only. It should not be taken as an offer, solicitation, recommendation, or advice regarding any investment, transaction, financial product, or service. Please exercise your own judgment and consult qualified professionals before making decisions.",
    "disclaimer.line4": "We are not liable for any direct or indirect losses, risks, or consequences arising from the use of, or reliance on, the content or data presented on this site. Use of this site is at your own risk.",
    "disclaimer.line5": "We reserve the right to update or revise this disclaimer at any time without prior notice.",
    // Footer
    "footer.build": "fxRate Web (build {{id}})",
    "footer.copyright": "Copyright © 2025 Yanzheng Sun. All rights reserved.",
    // Table
    "columns.bank": "Bank",
    "columns.sellRemit": "Sell (Remit)",
    "columns.buyRemit": "Buy (Remit)",
    "columns.buyCash": "Buy (Cash)",
    "columns.middle": "Mid Market",
    "columns.updated": "Updated",
    "table.loading": "Loading",
    "table.unavailable": "Unavailable",
    "table.invalidToken": "Invalid Token, Please Refresh Page",
    "select.source": "Source",
    "select.target": "Target",
    "select.search": "Search",
    "select.empty": "Currency Not Supported Yet",
    // Consent
    "consent.agreePrefix": "By using this service, you agree to our",
    "consent.policy": "Terms of Service",
    // Currency
    "currency.USD": "USD",
    "currency.CAD": "CAD",
    "currency.HKD": "HKD",
    "currency.EUR": "EUR",
    "currency.GBP": "GBP",
    "currency.JPY": "JPY",
    "currency.KRW": "KRW",
    "currency.SGD": "SGD",
    "currency.RUB": "RUB",
    "currency.CHF": "CHF",
    "currency.TWD": "TWD",
    "currency.AED": "AED",
    "currency.CNY": "CNY",
    // Bank
    "bank.cmb": "CMB",
    "bank.boc": "BOC",
    "bank.cib": "CIB",
    "bank.cibHuanyu": "CIB HY",
    "bank.bocom": "BOCOM",
    "bank.icbc": "ICBC",
    "bank.ccb": "CCB",
    "bank.pab": "PAB",
    "bank.psbc": "PSBC",
    "bank.citiccn": "CITIC CN",
    "bank.hsbccn": "HSBC CN",
    "bank.upi": "UnionPay",
    "bank.visa": "VISA",
  },
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("locale") : null;
    if (saved === "zh" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("locale", l);
      document.documentElement.lang = l === "zh" ? "zh-Hans" : "en";
    }
  };

  const t = useMemo(() => {
    const dict = dictionaries[locale];
    return (key: string, params?: Record<string, string | number>) => {
      const template = dict[key] ?? key;
      if (!params) return template;
      return Object.keys(params).reduce((acc, k) => acc.replaceAll(`{{${k}}}`, String(params[k])), template);
    };
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function tCurrency(code: string, t: I18nContextValue["t"]) {
  return t(`currency.${code}`);
}

export function tBankName(nameInChinese: string, t: I18nContextValue["t"]) {
  return t(`bank.${nameInChinese}`);
}
