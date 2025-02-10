"use client";

import { useState } from "react";
import { Select } from "flowbite-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import useFetchRates from "@/components/fetch";

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

const banks = Object.keys(bankMap);

export default function Component() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CNY");
  const { rates, loading, error } = useFetchRates(fromCurrency, toCurrency);
  return (
    <div className="w-full px-4">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex w-full justify-start">
          <SelectInput
            fromCurrency={fromCurrency}
            setFromCurrency={setFromCurrency}
            toCurrency={toCurrency}
            setToCurrency={setToCurrency}
          />
        </div>

        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
          当前汇率选择: {fromCurrency} → {toCurrency}
        </p>

        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <Table hoverable className="w-full min-w-max">
            <TableHead>
              <TableHeadCell className="text-sm md:text-base">
                银行
              </TableHeadCell>
              <TableHeadCell className="text-sm md:text-base">
                购汇/钞价
              </TableHeadCell>
              <TableHeadCell className="text-sm md:text-base">
                结汇/钞价
              </TableHeadCell>
              <TableHeadCell className="text-sm md:text-base">
                中间价
              </TableHeadCell>
              <TableHeadCell className="text-sm md:text-base">
                获取时间
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {banks.map((bank) => {
                const rate = rates.get(bank);
                return (
                  <TableRow
                    key={bank}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white md:text-base">
                      {bank}
                    </TableCell>
                    <TableCell className="text-sm md:text-base">
                      {loading ? "加载中..." : rate?.remit || "数据加载失败"}
                    </TableCell>
                    <TableCell className="text-sm md:text-base">
                      {loading ? "加载中..." : rate?.cash || "数据加载失败"}
                    </TableCell>
                    <TableCell className="text-sm md:text-base">
                      {loading ? "加载中..." : rate?.middle || "数据加载失败"}
                    </TableCell>
                    <TableCell className="text-sm md:text-base">
                      {loading ? "加载中..." : rate?.updated || "数据加载失败"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

interface SelectInputProps {
  fromCurrency: string;
  setFromCurrency: React.Dispatch<React.SetStateAction<string>>;
  toCurrency: string;
  setToCurrency: React.Dispatch<React.SetStateAction<string>>;
}

export function SelectInput({
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
}: SelectInputProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-col">
        <Select
          id="fromCurrency"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="min-w-[120px] md:min-w-[150px]"
        >
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="HKD">HKD</option>
          <option value="MOP">MOP</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="CNY">CNY</option>
        </Select>
      </div>

      <span className="mx-2 text-lg font-bold text-gray-600 dark:text-white">
        →
      </span>

      <div className="flex flex-col">
        <Select
          id="toCurrency"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="min-w-[120px] md:min-w-[150px]"
        >
          <option value="CNY">CNY</option>
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="HKD">HKD</option>
          <option value="MOP">MOP</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </Select>
      </div>
    </div>
  );
}
