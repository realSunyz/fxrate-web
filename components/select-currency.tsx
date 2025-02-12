"use client"

import * as React from "react"
import { Check, ChevronsUpDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Currencies } from "@/components/fetch"
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

type SelectProps = {
  onSelect: (currency: string) => void
}

export function SelectCurrency({ onSelect }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const handleSelect = (currency: string) => {
    setValue(currency)
    onSelect(currency)
    setOpen(false)
  }

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
            {value
              ? Currencies.find((Currencies) => Currencies.value === value)?.label
              : "美元"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0">
          <Command>
            <CommandInput placeholder="搜索" />
            <CommandList>
              <CommandEmpty>暂不支持该货币</CommandEmpty>
              <CommandGroup>
                {Currencies.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => handleSelect(currentValue)}
                  >
                    <item.flag className="mr-2 h-4 w-4" />
                    {item.label}
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
