"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "invisible";
          retry?: "auto" | "never";
          action?: string;
          cData?: string;
        }
      ) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  requireCaptcha?: boolean;
  turnstileSiteKey?: string;
  fetchDataAfterVerify?: () => Promise<TData[]>;
  loadingText?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  requireCaptcha = true,
  turnstileSiteKey = "3x00000000000000000000FF",
  fetchDataAfterVerify,
  loadingText = "数据获取中",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [verified, setVerified] = React.useState<boolean>(!requireCaptcha);
  const [internalData, setInternalData] = React.useState<TData[]>(
    requireCaptcha ? [] : data
  );
  const [captchaError, setCaptchaError] = React.useState<string | null>(null);
  const turnstileContainerRef = React.useRef<HTMLDivElement | null>(null);
  const widgetIdRef = React.useRef<string | null>(null);
  const table = useReactTable({
    data: internalData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  React.useEffect(() => {
    if (!requireCaptcha || verified) {
      setInternalData(data);
    }
  }, [data, requireCaptcha, verified]);

  React.useEffect(() => {
    if (!requireCaptcha || typeof window === "undefined") return;
    if (window.turnstile) {
      setCaptchaError(null);
      return;
    }

    setCaptchaError(null);

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;

    const onScriptError = () => {
      setCaptchaError("人机验证组件加载失败或网络超时，建议切换网络后重试。");
    };

    script.addEventListener("error", onScriptError);
    document.head.appendChild(script);

    const timeoutId = window.setTimeout(() => {
      if (!window.turnstile) {
        setCaptchaError("人机验证组件加载失败或网络超时，建议切换网络后重试。");
      }
    }, 10000);

    return () => {
      script.removeEventListener("error", onScriptError);
      window.clearTimeout(timeoutId);
    };
  }, [requireCaptcha]);

  React.useEffect(() => {
    if (!requireCaptcha || verified) return;
    if (!turnstileSiteKey) return;
    if (!turnstileContainerRef.current) return;

    setCaptchaError(null);

    const tryRender = () => {
      if (!window.turnstile) return;
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
      widgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current!,
        {
          sitekey: turnstileSiteKey,
          callback: async (token: string) => {
            setVerified(true);
            if (widgetIdRef.current) {
              try {
                window.turnstile?.remove(widgetIdRef.current);
              } catch {}
              widgetIdRef.current = null;
            }
            try {
              if (fetchDataAfterVerify) {
                const fresh = await fetchDataAfterVerify();
                setInternalData(fresh ?? []);
              } else {
                setInternalData(data);
              }
            } catch (e) {
              setInternalData([]);
              setVerified(true);
            }
          },
          "expired-callback": () => {
            setVerified(false);
          },
          "error-callback": () => {
            setVerified(false);
            setCaptchaError("人机验证未通过，请刷新页面后重试。");
          },
        }
      );
    };

    const id = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(id);
        tryRender();
      }
    }, 100);

    const renderTimeoutId = window.setTimeout(() => {
      if (!verified && !widgetIdRef.current) {
        setCaptchaError("人机验证组件加载失败或网络超时，建议切换网络后重试。");
      }
    }, 8000);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(renderTimeoutId);
      if (widgetIdRef.current) {
        try {
          window.turnstile?.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [requireCaptcha, verified, turnstileSiteKey, fetchDataAfterVerify, data]);

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table className="min-w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-left whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {requireCaptcha && !verified ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center align-middle"
              >
                <div className="flex flex-col items-center gap-3 py-6">
                  <div
                    ref={turnstileContainerRef}
                    aria-label="Cloudflare Turnstile"
                  />
                  {captchaError ? (
                    <p className="text-sm text-red-500">{captchaError}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      为避免滥用，请完成人机验证。
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    若多次失败，请尝试切换网络连接。
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : internalData && internalData.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {loadingText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
