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

const provinces = [
  {
    value: "ha_noi",
    label: "Hà Nội",
  },
  {
    value: "ho_chi_minh",
    label: "Thành phố Hồ Chí Minh",
  },
  {
    value: "da_nang",
    label: "Đà Nẵng",
  },
  {
    value: "hai_phong",
    label: "Hải Phòng",
  },
  {
    value: "nha_trang",
    label: "Nha Trang",
  },
  {
    value: "can_tho",
    label: "Cần Thơ",
  },
  {
    value: "vinh",
    label: "Vinh",
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] pl-8 justify-between"
        >
          {value
            ? provinces.find((province) => province.value === value)?.label
            : "Tất cả tỉnh thành"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] bg-white">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No province found.</CommandEmpty>
            <CommandGroup>
              {provinces.map((province) => (
                <CommandItem
                  key={province.value}
                  value={province.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="hover:bg-secondary"
                >
                  {province.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === province.value ? "opacity-100" : "opacity-0"
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
