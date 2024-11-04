"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export function Combobox({
  items = [],
  onSelect,
  buttonPlaceholder = "Select an item",
  buttonClassName = "",
  popoverClassName = "",
  searchPlaceholder = "Search...",
  listHeight = "h-[300px]",
  listWidth = "w-[200px]",
  defaultSelected = "",
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultSelected);

  const handleSelect = (selectedValue) => {
    setValue(selectedValue === value ? "" : selectedValue);
    setOpen(false);
    if (onSelect) onSelect(selectedValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "pl-8 text-text5 font-medium justify-between hover:bg-[#f4ebfecc] rounded-full",
            buttonClassName
          )}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : buttonPlaceholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(listHeight, listWidth, popoverClassName, "bg-white")}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => handleSelect(item.value)}
                  className="hover:bg-[#f4ebfecc]"
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
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
  );
}
