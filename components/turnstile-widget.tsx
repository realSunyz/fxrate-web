"use client";

import { useEffect, useRef, useState } from "react";

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
        }
      ) => string | undefined;
      reset?: (id?: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  onVerify: (token: string) => void;
  siteKey?: string;
  theme?: "auto" | "light" | "dark";
};

export function TurnstileWidget({
  onVerify,
  siteKey,
  theme = "auto",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | undefined>(undefined);
  const resolvedSiteKey =
    siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  useEffect(() => {
    let cancelled = false;

    const tryRender = () => {
      if (!containerRef.current) return;
      if (!window.turnstile || !resolvedSiteKey) {
        return;
      }
      const id = window.turnstile.render(containerRef.current, {
        sitekey: resolvedSiteKey,
        theme,
        callback: (token: string) => {
          if (!cancelled) onVerify(token);
        },
        "error-callback": () => {},
        "expired-callback": () => {
          window.turnstile?.reset?.(id);
        },
      });
      setWidgetId(typeof id === "string" ? id : undefined);
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
      if (widgetId && window.turnstile?.reset) {
        try {
          window.turnstile.reset(widgetId);
        } catch (_) {}
      }
    };
  }, [resolvedSiteKey, theme]);

  if (!resolvedSiteKey) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Invalid Turnstile Site Key
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex items-center justify-center" />
  );
}

export default TurnstileWidget;
