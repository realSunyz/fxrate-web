"use client";

import { ShieldAlert } from "lucide-react";
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

export function DisclaimerDialog() {
  const { t } = useI18n();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 px-0"
          aria-label={t("disclaimer.title")}
          title={t("disclaimer.title")}
        >
          <ShieldAlert className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("disclaimer.title")}</DialogTitle>
          <DialogDescription>{t("disclaimer.description")}</DialogDescription>
        </DialogHeader>
        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>{t("disclaimer.line1")}</li>
          <li>{t("disclaimer.line2")}</li>
          <li>{t("disclaimer.line3")}</li>
          <li>{t("disclaimer.line4")}</li>
          <li>{t("disclaimer.line5")}</li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
