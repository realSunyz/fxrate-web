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

const currencies = [
  { value: "USD", label: "USD" },
  { value: "CAD", label: "CAD" },
  { value: "HKD", label: "HKD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "JPY", label: "JPY" },
  { value: "KRW", label: "KRW" },
  { value: "CHF", label: "CHF" },
  { value: "AUD", label: "AUD" },
  { value: "SGD", label: "SGD" },
  { value: "NZD", label: "NZD" },
  { value: "MOP", label: "MOP" },
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
        CNY
        <ChevronsUpDown className="opacity-50" />
      </Button>
    </div>
  )
}
