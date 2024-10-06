import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const InputField = ({ control, name, placeholder, type = "text", icon }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <>
            <Label htmlFor={name}>{placeholder}</Label>
            <div className="flex items-center w-full relative">
              <Input
                type={type}
                placeholder={`Nhập ${placeholder.toLowerCase()}`}
                {...field}
                className={icon && "pl-10 pr-4"}
              />
              {icon && <div className="absolute left-2">{icon}</div>}
            </div>
          </>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default InputField;
