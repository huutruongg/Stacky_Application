import React from "react";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TitleField from "@/components/titleField/TitleField";
import { Textarea } from "@/components/ui/textarea";

const FormIntroduceYourself = ({ form }) => {
  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Giới thiệu bản thân"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="w-full grid col-start-1 col-end-10 gap-5 mt-5">
          <FormField
            control={form.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex">
                    <Label
                      htmlFor="introduction"
                      className="flex justify-between ant-form-item-required min-w-44 max-w-44 pr-3 py-3 leading-5"
                    >
                      Giới thiệu bản thân
                    </Label>
                    <Textarea
                      id="introduction"
                      placeholder="Giới thiệu bản thân ở đây."
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FormIntroduceYourself;
