"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { DataTable } from "@/components/data-table";
import { SelectCurrency } from "@/components/select-currency";
import useFetchRates, { CurrencyData } from "@/components/fetch";
import { useI18n, tBankName } from "@/lib/i18n";
import TurnstileWidget from "@/components/turnstile-widget";

export const columnsFactory = (t: ReturnType<typeof useI18n>["t"]): ColumnDef<CurrencyData>[] => [
  {
    accessorKey: "bank",
    header: t("columns.bank"),
    cell: ({ cell }) => tBankName(String(cell.getValue() ?? ""), t),
  },
  {
    accessorKey: "sellRemit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("columns.sellRemit")}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as number | null;
      return value === null ? <Skeleton className="h-4 w-[80px] rounded-full" /> : value;
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
  //     return value === null ? <Skeleton className="h-4 w-[80px] rounded-full" /> : value;
  //   },
  // },
  {
    accessorKey: "buyRemit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("columns.buyRemit")}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as number | null;
      return value === null ? <Skeleton className="h-4 w-[80px] rounded-full" /> : value;
    },
  },
  {
    accessorKey: "buyCash",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("columns.buyCash")}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as number | null;
      return value === null ? <Skeleton className="h-4 w-[80px] rounded-full" /> : value;
    },
  },
  {
    accessorKey: "middle",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("columns.middle")}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as number | null;
      return value === null ? <Skeleton className="h-4 w-[80px] rounded-full" /> : value;
    },
  },
  {
    accessorKey: "updated",
    header: t("columns.updated"),
    cell: ({ cell }) => {
      const value = cell.getValue() as string | null;
      if (value === null) return <Skeleton className="h-4 w-[150px] rounded-full" />;
      return value;
    },
  },
];

export function CurrencyTable() {
  const { t } = useI18n();
  const [fromcurrency, setFromcurrency] = useState("USD");
  const [token, setToken] = useState<string | null>(null);
  const { rates, error, loading } = useFetchRates(fromcurrency, "CNY", token);

  const handleCurrencySelect = (currency: string) => {
    setFromcurrency(currency);
  };

  const columns = columnsFactory(t);

  return (
    <>
      <SelectCurrency onSelect={handleCurrencySelect} disabled={!token} />
      {token ? (
        <DataTable columns={columns} data={rates} />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <div className="flex items-center justify-center p-6 min-h-[180px]">
            <TurnstileWidget onVerify={(tk) => setToken(tk)} />
          </div>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </>
  );
}
