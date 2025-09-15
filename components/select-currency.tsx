"use client";

import * as React from "react";
import { Check, ChevronsUpDown, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Currencies } from "@/components/fetch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useI18n, tCurrency } from "@/lib/i18n";

type SelectProps = {
  onSelect: (currency: string) => void;
  disabled?: boolean;
  onRefresh?: () => void;
};

export function SelectCurrency({ onSelect, disabled = false, onRefresh }: SelectProps) {
  const { t, locale } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleSelect = (currency: string) => {
    setValue(currency);
    onSelect(currency);
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center mb-4 mt-4">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[150px] justify-between"
              aria-label={t("select.source")}
              disabled={disabled}
            >
              {value ? tCurrency(value, t) : t("currency.USD")}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandInput placeholder={t("select.search")} />
              <CommandList>
                <CommandEmpty>{t("select.empty")}</CommandEmpty>
                <CommandGroup>
                  {Currencies.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => handleSelect(currentValue)}
                    >
                      <item.flag className="mr-2 h-4 w-4" />
                      {tCurrency(item.value, t)}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <ArrowRight className="mx-2 text-lg" />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="w-[150px] justify-between"
          aria-label={t("select.target")}
          disabled
        >
          {t("currency.CNY")}
          <ChevronsUpDown className="opacity-50" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Refresh rates"
          onClick={() => onRefresh?.()}
          disabled={disabled}
        >
          <RefreshCw />
        </Button>
      </div>
    </div>
  );
}
