"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { DataTable } from "@/components/data-table";
import { SelectCurrency } from "@/components/select-currency";
import useFetchRates, { CurrencyData } from "@/components/fetch";

export const columns: ColumnDef<CurrencyData>[] = [
  {
    accessorKey: "bank",
    header: "银行",
    cell: ({ cell }) => cell.getValue(),
  },
  {
    accessorKey: "sellRemit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        购汇价
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as number | null;
      return value === null ? <Skeleton className="h-4 w-full" /> : value;
    },
  },
  // {
  //   accessorKey: "sellCash",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       购钞价
  //       <ArrowUpDown className="h-4 w-4" />
  //     </Button>
  //   ),
  //   cell: ({ cell }) => {
  //     const value = cell.getValue() as number | null;
  //     return value === null ? <Skeleton className="h-4 w-full" /> : value;
  //   },
  // },
  {
    accessorKey: "buyRemit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        结汇价
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as number | null;
      return value === null ? <Skeleton className="h-4 w-full" /> : value;
    },
  },
  {
    accessorKey: "buyCash",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        结钞价
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as number | null;
      return value === null ? <Skeleton className="h-4 w-full" /> : value;
    },
  },
  {
    accessorKey: "middle",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        中间价
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as number | null;
      return value === null ? <Skeleton className="h-4 w-full" /> : value;
    },
  },
  {
    accessorKey: "updated",
    header: "更新时间",
    cell: ({ cell }) => {
      const value = cell.getValue() as string | null;
      return value === null ? <Skeleton className="h-4 w-full" /> : value;
    },
  },
];

export function CurrencyTable() {
  const [fromcurrency, setFromcurrency] = useState("USD");
  const { rates, error, loading } = useFetchRates(fromcurrency, "CNY");

  const handleCurrencySelect = (currency: string) => {
    setFromcurrency(currency);
  };

  return (
    <>
      <SelectCurrency onSelect={handleCurrencySelect} />
      <DataTable columns={columns} data={rates} />
      {error && <div className="text-red-500">{error}</div>}
    </>
  );
}
