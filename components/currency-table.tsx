"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { DataTable } from "@/components/data-table";
import { SelectCurrency } from "@/components/select-currency";
import useFetchRates, { CurrencyData, Currencies } from "@/components/fetch";
import { useI18n, tBankName } from "@/lib/i18n";
import TurnstileWidget from "@/components/turnstile-widget";
import { AUTH_SIGNED_PATH } from "@/lib/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const tocurrency = "CNY";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const validCodes = useMemo(() => new Set(Currencies.map((c) => c.value)), []);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { rates, error, loading, refresh } = useFetchRates(fromcurrency, "CNY", authenticated, {
    onAuthExpired: () => {
      setAuthenticated(false);
      setAuthError("Token Expired (ERR-T101)");
    },
  });

  const handleCurrencySelect = (currency: string) => {
    setFromcurrency(currency);
    try {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("from", currency);
      params.set("to", tocurrency);
      router.replace(`${pathname}?${params.toString()}`);
    } catch (_) {}
  };

  useEffect(() => {
    const from = searchParams?.get("from");
    if (from && validCodes.has(from) && from !== fromcurrency) {
      setFromcurrency(from);
    }
  }, [searchParams, validCodes]);

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
        const normalized = detail.toLowerCase();
        if (resp.status === 401 || normalized.includes("token invalid")) {
          setAuthError("Invalid Token (ERR-T100)");
        } else if (resp.status === 400) {
          setAuthError(detail || "Missing Token (ERR-T102)");
        } else if (resp.status === 403) {
          setAuthError(detail || "Turnstile Verification Failed (ERR-T103)");
        } else if (resp.status === 500) {
          setAuthError(detail || "Server Misconfigured (ERR-T104)");
        } else {
          setAuthError(detail || `Auth Failed (ERR-T-RESP${resp.status})`);
        }
        setAuthenticated(false);
        return;
      }
      setAuthenticated(true);
    } catch (e) {
      setAuthError("Network Error (ERR-N100)");
      setAuthenticated(false);
    }
  };

  return (
    <>
      <SelectCurrency
        value={fromcurrency}
        onSelect={handleCurrencySelect}
        disabled={!authenticated}
        onRefresh={refresh}
      />
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
