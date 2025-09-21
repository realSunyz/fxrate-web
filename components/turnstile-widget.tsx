"use client";

import { useEffect, useRef } from "react";
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
  const idRef = useRef<string | number | undefined>(undefined);
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

  useEffect(() => {
    if (provider !== "recaptcha") return;

    let cancelled = false;

    const renderRecaptcha = () => {
      if (!containerRef.current || !window.grecaptcha || !resolvedSiteKey) {
        return;
      }
      try {
        containerRef.current.innerHTML = "";
      } catch (_) {}
      const render = () => {
        if (!containerRef.current || cancelled) return;
        const id = window.grecaptcha!.render(containerRef.current, {
          sitekey: resolvedSiteKey,
          theme: theme === "dark" ? "dark" : "light",
          callback: (token: string) => {
            if (!cancelled) onVerify(token);
          },
          "expired-callback": () => {
            if (typeof idRef.current === "number") {
              window.grecaptcha?.reset?.(idRef.current);
            } else {
              window.grecaptcha?.reset?.();
            }
          },
          "error-callback": () => {},
        });
        const realId = typeof id === "number" ? id : undefined;
        idRef.current = realId;
      };

      if (typeof window.grecaptcha.ready === "function") {
        window.grecaptcha.ready(render);
      } else {
        render();
      }
    };

    const start = Date.now();
    const interval = setInterval(() => {
      if (window.grecaptcha) {
        clearInterval(interval);
        renderRecaptcha();
      } else if (Date.now() - start > 5000) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      cancelled = true;
      clearInterval(interval);
      try {
        if (typeof idRef.current === "number") {
          window.grecaptcha?.reset?.(idRef.current);
        } else {
          window.grecaptcha?.reset?.();
        }
      } catch (_) {}
      try {
        if (containerRef.current) containerRef.current.innerHTML = "";
      } catch (_) {}
    };
  }, [provider, resolvedSiteKey, theme, onVerify]);

  if (!resolvedSiteKey) {
    const label = provider === "recaptcha" ? "reCAPTCHA" : "Turnstile";
    return (
      <div className="text-red-500 text-center text-sm text-muted-foreground">
        {`Invalid ${label} Site Key (ERR-C999)`}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex items-center justify-center" />
  );
}

export default CaptchaWidget;
