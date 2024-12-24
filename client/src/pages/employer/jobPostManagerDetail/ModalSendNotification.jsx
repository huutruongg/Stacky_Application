import TextareaField from "@/components/fieldForm/TextareaField";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ModalSendNotification({ form }) {
  return (
    <div className="px-5">
      {/* Notification Textarea */}
      <TextareaField
        control={form.control}
        name="notification"
        placeholder="Nội dung thông báo"
        id="notification"
        htmlFor="notification"
      />

      {/* Radio Group for Status */}
      <div className="flex justify-center items-center mt-5 gap-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  className="flex gap-10"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="ACCEPTED" id="r1" />
                    <Label className="text-sm text-primary" htmlFor="r1">
                      Chấp nhận
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="REJECTED" id="r2" />
                    <Label className="text-sm text-primary" htmlFor="r2">
                      Từ chối
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
