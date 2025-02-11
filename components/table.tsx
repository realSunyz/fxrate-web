"use client";

import { useState } from "react";
import {
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Spinner,
} from "flowbite-react";
import useFetchRates from "@/components/fetch";
import { bankMap } from "@/components/fetch";

const banks = Object.keys(bankMap);

export default function Component() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CNY");
  const { rates, error } = useFetchRates(fromCurrency, toCurrency);
  return (
    <div className="flex w-full px-4 pt-6">
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
                      {rate === undefined ? (
                        <Spinner size="sm" />
                      ) : rate.error ? (
                        "不适用"
                      ) : (
                        rate.remit
                      )}
                    </TableCell>
                    <TableCell className="text-sm md:text-base">
                      {rate === undefined ? (
                        <Spinner size="sm" />
                      ) : rate.error ? (
                        "不适用"
                      ) : (
                        rate.cash
                      )}
                    </TableCell>
                    <TableCell className="text-sm md:text-base">
                      {rate === undefined ? (
                        <Spinner size="sm" />
                      ) : rate.error ? (
                        "不适用"
                      ) : (
                        rate.middle
                      )}
                    </TableCell>
                    <TableCell className="text-sm md:text-base">
                      {rate === undefined ? (
                        <Spinner size="sm" />
                      ) : rate.error ? (
                        "不适用"
                      ) : (
                        rate.updated
                      )}
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
          required
        >
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="HKD">HKD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="KRW">KRW</option>
          <option value="CHF">CHF</option>
          <option value="AUD">AUD</option>
          <option value="SGD">SGD</option>
          <option value="NZD">NZD</option>
          <option value="MOP">MOP</option>
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
          disabled
        >
          <option value="CNY">CNY</option>
        </Select>
      </div>
    </div>
  );
}
