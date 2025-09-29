"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          appearance?: "always" | "execute" | "interaction-only";
          language?: string;
        }
      ) => string | undefined;
      reset?: (id?: string) => void;
    };
    grecaptcha?: {
      ready?: (cb: () => void) => void;
      execute?: (
        sitekey: string,
        options?: {
          action?: string;
        }
      ) => Promise<string>;
      render: (
        el: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark";
          size?: "compact" | "normal" | "invisible";
        }
      ) => number;
      reset?: (id?: number) => void;
    };
  }
}

type CaptchaWidgetProps = {
  onVerify: (token: string) => void;
  siteKey?: string;
  theme?: "auto" | "light" | "dark";
  language?: string;
};

export function CaptchaWidget({
  onVerify,
  siteKey,
  theme = "auto",
  language,
}: CaptchaWidgetProps) {
  const { locale } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | undefined>(undefined);
  const cancelledRef = useRef(false);
  const rawProvider = (process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER ?? "turnstile").toLowerCase();
  const provider: "turnstile" | "recaptcha" =
    rawProvider === "recaptcha" ? "recaptcha" : "turnstile";
  const resolvedSiteKey =
    siteKey ||
    (provider === "recaptcha"
      ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      : process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) ||
    "";
  const resolvedLanguage =
    provider === "turnstile"
      ? language || (locale === "zh" ? "zh-cn" : "en")
      : undefined;
  const recaptchaAction = process.env.NEXT_PUBLIC_RECAPTCHA_ACTION || "auth";
  const [executingRecaptcha, setExecutingRecaptcha] = useState(false);

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (provider !== "turnstile") return;

    let cancelled = false;

    const tryRender = () => {
      if (!containerRef.current) return;
      if (!window.turnstile || !resolvedSiteKey) {
        return;
      }
      try {
        containerRef.current.innerHTML = "";
      } catch (_) {}
      const id = window.turnstile.render(containerRef.current, {
        sitekey: resolvedSiteKey,
        theme,
        language: resolvedLanguage,
        callback: (token: string) => {
          if (!cancelled) onVerify(token);
        },
        "error-callback": () => {},
        "expired-callback": () => {
          window.turnstile?.reset?.(
            typeof id === "string" ? id : undefined
          );
        },
      });
      const realId = typeof id === "string" ? id : undefined;
      idRef.current = realId;
    };

    const start = Date.now();
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        tryRender();
      } else if (Date.now() - start > 5000) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      cancelled = true;
      clearInterval(interval);
      try {
        if (window.turnstile?.reset) {
          if (typeof idRef.current === "string") {
            window.turnstile.reset(idRef.current);
          } else {
            window.turnstile.reset();
          }
        }
      } catch (_) {}
      try {
        if (containerRef.current) containerRef.current.innerHTML = "";
      } catch (_) {}
    };
  }, [provider, resolvedSiteKey, theme, resolvedLanguage, onVerify]);

  const executeRecaptcha = useCallback(() => {
    if (provider !== "recaptcha") return;
    if (!resolvedSiteKey) return;
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) {
      return;
    }
    const execute = grecaptcha.execute;
    if (typeof execute !== "function") {
      return;
    }
    setExecutingRecaptcha(true);
    const run = () => {
      if (cancelledRef.current) return;
      Promise.resolve(execute.call(grecaptcha, resolvedSiteKey, { action: recaptchaAction }))
        .then((token) => {
          if (!cancelledRef.current && token) {
            onVerify(token);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelledRef.current) {
            setExecutingRecaptcha(false);
          }
        });
    };

    if (typeof grecaptcha.ready === "function") {
      grecaptcha.ready(run);
    } else {
      run();
    }
  }, [provider, resolvedSiteKey, recaptchaAction, onVerify]);

  useEffect(() => {
    if (provider !== "recaptcha") return;

    const start = Date.now();
    const interval = setInterval(() => {
      if (cancelledRef.current) {
        clearInterval(interval);
        return;
      }
      if (window.grecaptcha && typeof window.grecaptcha.execute === "function") {
        clearInterval(interval);
        executeRecaptcha();
      } else if (Date.now() - start > 5000) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [provider, executeRecaptcha]);

  if (!resolvedSiteKey) {
    const label = provider === "recaptcha" ? "reCAPTCHA" : "Turnstile";
    return (
      <div className="text-red-500 text-center text-sm text-muted-foreground">
        {`Invalid ${label} Site Key (ERR-C999)`}
      </div>
    );
  }

  if (provider === "recaptcha") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={executeRecaptcha}
          disabled={executingRecaptcha}
          className="rounded border px-3 py-1 text-xs font-medium transition disabled:opacity-60"
        >
          {executingRecaptcha ? "验证中..." : "重新验证"}
        </button>
        <span>系统会自动获取 reCAPTCHA 验证令牌。</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex items-center justify-center" />
  );
}

export default CaptchaWidget;
