import React from "react";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this import
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const TextareaField = ({
  control,
  name,
  placeholder,
  id,
  className,
  classNameLabel,
  classNameTextarea,
  labelName,
  htmlFor,
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
            <div className={`flex items-center w-full mt-1 ${classNameTextarea}`}>
              <Textarea
                placeholder={`Nhập ${placeholder.toLowerCase()}`}
                {...field}
                id={id}
              />
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default TextareaField;
