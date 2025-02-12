"use client"

import * as React from "react"
import { Check, ChevronsUpDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { US, CA, HK, EU, GB, JP, KR, SG, RU, CH, AE } from "country-flag-icons/react/3x2"

const currencies = [
  { value: "USD", label: "美元", flag: US },
  { value: "CAD", label: "加元", flag: CA },
  { value: "HKD", label: "港元", flag: HK },
  { value: "EUR", label: "欧元", flag: EU },
  { value: "GBP", label: "英镑", flag: GB },
  { value: "JPY", label: "日元", flag: JP },
  { value: "KRW", label: "韩元", flag: KR },
  { value: "SGD", label: "新元", flag: SG },
  { value: "RUB", label: "卢布", flag: RU },
  { value: "CHF", label: "瑞郎", flag: CH },
  { value: "AED", label: "迪拉姆", flag: AE },
]

export function Select() {
  const [open, setOpen] = React.useState(false)
  const [fromcurrency, setFromcurrency] = React.useState("")

  return (
    <div className="mb-4 flex w-full justify-start">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[150px] justify-between"
          >
            {fromcurrency
              ? currencies.find((currencies) => currencies.value === fromcurrency)?.label
              : "选择货币..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0">
          <Command>
            <CommandInput placeholder="搜索" />
            <CommandList>
              <CommandEmpty>暂不支持该货币</CommandEmpty>
              <CommandGroup>
                {currencies.map((currencies) => (
                  <CommandItem
                    key={currencies.value}
                    value={currencies.value}
                    onSelect={(currentValue) => {
                      setFromcurrency(currentValue === fromcurrency ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <currencies.flag />
                    {currencies.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        fromcurrency === currencies.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <ArrowRight className="h-6 w-6 text-muted-foreground" />
      <Button
          variant="outline"
          className="w-[150px] justify-between"
          disabled
      >
        人民币
        <ChevronsUpDown className="opacity-50" />
      </Button>
    </div>
  )
}
