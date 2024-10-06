import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SelectField = ({ control, name, placeholder, options }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <Label htmlFor={name}>{placeholder}</Label>
        <Select value={field.value} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger className="w-full px-6 h-12 text-sm font-medium border border-[#424242] rounded-xl">
              <SelectValue placeholder={`Chọn ${placeholder.toLowerCase()}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default SelectField;
