"use client";

import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const toggle = () => setLocale(locale === "zh" ? "en" : "zh");

  return (
    <Button
      variant="ghost"
      className="h-8 w-8 px-0 font-semibold"
      onClick={toggle}
      aria-label={t("common.language")}
      title={t("common.language")}
    >
      <span aria-hidden="true">{locale === "zh" ? "EN" : "中"}</span>
      <span className="sr-only">{t("common.language")}</span>
    </Button>
  );
}
