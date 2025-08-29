"use client";

import * as React from "react";
import { CircleQuestionMark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";

export function SettingsDialog() {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 px-0"
          aria-label={t("common.language")}
          title={t("common.language")}
        >
          <CircleQuestionMark className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("help.title")}</DialogTitle>
          <DialogDescription>{t("help.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">
              {t("help.info.title")}
            </div>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>{t("help.info.line1")}</li>
              <li>{t("help.info.line2")}</li>
              <li>{t("help.info.line3")}</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">
              {t("common.language")}
            </div>
            <div className="flex gap-2">
              <Button
                variant={locale === "zh" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full px-3"
                onClick={() => setLocale("zh")}
              >
                {t("common.zh")}
              </Button>
              <Button
                variant={locale === "en" ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full px-3"
                onClick={() => setLocale("en")}
              >
                {t("common.en")}
              </Button>
            </div>
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
