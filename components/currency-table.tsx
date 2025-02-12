"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { SelectCurrency } from "@/components/select-currency";
import useFetchRates, { CurrencyData } from "@/components/fetch";

export const columns: ColumnDef<CurrencyData>[] = [
  { accessorKey: "bank", header: "银行" },
  { accessorKey: "cash", header: "购汇价" },
  { accessorKey: "remit", header: "结汇价" },
  { accessorKey: "middle", header: "中间价" },
  { accessorKey: "updated", header: "获取时间" },
];

export function CurrencyTable() {
  const [fromcurrency, setFromcurrency] = useState("USD");
  const { rates, error } = useFetchRates(fromcurrency, "CNY");

  const handleCurrencySelect = (currency: string) => {
    setFromcurrency(currency);
  };

  return (
    <div>
      <SelectCurrency onSelect={handleCurrencySelect} />
      <DataTable columns={columns} data={rates} />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
