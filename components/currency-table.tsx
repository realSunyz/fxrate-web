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
import { AUTH_SIGNED_PATH } from "@/lib/api";

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
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { rates, error, loading } = useFetchRates(fromcurrency, "CNY", authenticated, {
    onAuthExpired: () => {
      setAuthenticated(false);
      setAuthError("Token Expired (ERR-C102)");
    },
  });

  const handleCurrencySelect = (currency: string) => {
    setFromcurrency(currency);
  };

  const columns = columnsFactory(t);

  const onVerifyTurnstile = async (tk: string) => {
    setAuthError(null);
    try {
      const resp = await fetch(`${AUTH_SIGNED_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tk }),
        credentials: "include",
      });
      if (!resp.ok) {
        let detail = "";
        try {
          const data = await resp.json();
          detail = typeof data?.error === "string" ? data.error : "";
        } catch (_) {}
        if (resp.status === 400) {
          setAuthError(detail || "Missing Token (ERR-C400)");
        } else if (resp.status === 403) {
          setAuthError(detail || "Turnstile Verification Failed (ERR-C403)");
        } else if (resp.status === 500) {
          setAuthError(detail || "Server Misconfigured (ERR-C500)");
        } else {
          setAuthError(detail || `Auth Failed (ERR-C${resp.status})`);
        }
        setAuthenticated(false);
        return;
      }
      setAuthenticated(true);
    } catch (e) {
      setAuthError("Network Error (ERR-C101)");
      setAuthenticated(false);
    }
  };

  return (
    <>
      <SelectCurrency onSelect={handleCurrencySelect} disabled={!authenticated} />
      {authenticated ? (
        <DataTable columns={columns} data={rates} />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <div className="flex items-center justify-center p-6 min-h-[180px]">
            <div className="flex flex-col items-center gap-2">
              <TurnstileWidget onVerify={onVerifyTurnstile} />
              {authError && (
                <div className="text-red-500 text-xs">
                  {authError}
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center">
                {t("consent.agreePrefix")}
                {" "}
                <a
                  href="https://sunyz.net/docs/zh-cn/fxrate/tos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {t("consent.policy")}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </>
  );
}
