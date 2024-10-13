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
import { Label } from "@/components/ui/label";

const SelectField = ({
  control,
  name,
  placeholder,
  options,
  labelName,
  className,
  classNameLabel,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={className}>
              <Label htmlFor={name} className={classNameLabel}>
                {labelName}
              </Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="flex items-center w-full h-12 mt-1 border border-border rounded-xl shadow-none hover:bg-secondary">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
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
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
