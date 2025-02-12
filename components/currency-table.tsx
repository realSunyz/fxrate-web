"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { SelectCurrency } from "@/components/select-currency";
import useFetchRates, { CurrencyData } from "@/components/fetch";

export const columns: ColumnDef<CurrencyData>[] = [
  { accessorKey: "bank", header: "银行" },
  {
    accessorKey: "cash",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          购汇价
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "remit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          结汇价
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "middle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          中间价
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
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
