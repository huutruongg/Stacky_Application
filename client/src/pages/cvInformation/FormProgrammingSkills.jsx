import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TitleField from "@/components/titleField/TitleField";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const FormProgrammingSkills = ({ form }) => {
  return (
    <div className="bg-secondary p-5 rounded-xl">
      {/* Section Title */}
      <TitleField children={"Kỹ năng lập trình"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="grid col-start-1 col-end-10 w-full gap-5">
          <FormField
            control={form.control}
            name="programmingSkills"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="programmingSkills"
                      className="flex items-center justify-between min-w-44 max-w-44 pr-3"
                    >
                      Các kỹ năng lập trình
                    </Label>
                    <Input
                      placeholder="Vui lòng nhập tên kỹ năng. VD: Java, Python,…"
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

export default FormProgrammingSkills;
