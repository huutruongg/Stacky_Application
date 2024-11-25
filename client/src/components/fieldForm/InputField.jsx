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

const InputField = ({
  control,
  name,
  placeholder,
  type = "text",
  icon,
  id,
  className,
  classNameLabel,
  classNameInput,
  labelName,
  htmlFor,
  iconPassword,
  onClick = () => {},
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <div className={className}>
            <Label htmlFor={htmlFor} className={classNameLabel}>
              {labelName}
            </Label>
            <div className={`flex items-center w-full mt-1 ${classNameInput}`}>
              <Input
                type={type}
                placeholder={`Nhập ${placeholder.toLowerCase()}`}
                {...field}
                value={field.value ?? ""}
                className={icon || (icon && iconPassword) ? "pl-10 pr-14" : ""}
                id={id}
              />
              {icon && <div className="absolute left-2">{icon}</div>}
              {(name === "password" || name === "confirmPassword") &&
                field.value &&
                iconPassword && (
                  <div className="absolute right-5" onClick={onClick}>
                    {iconPassword}
                  </div>
                )}
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default InputField;
