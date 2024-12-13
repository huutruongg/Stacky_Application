import TextareaField from "@/components/fieldForm/TextareaField";
import { Checkbox } from "@/components/ui/Checkbox";

export default function ModalSendNotification({ form }) {
  const handleSelect = () => {
    console.log("select all");
  };

  return (
    <div className="px-5">
      <TextareaField
        control={form.control}
        name={`notification`}
        placeholder="Nội dung thông báo"
        id={`notification`}
        htmlFor={`notification`}
      />
      <div className="flex justify-center items-center mt-5 gap-4">
        <Checkbox id="terms" className="w-5 h-5" onClick={handleSelect} />
        <span className="text-sm text-primary">
          Chọn để thông báo cho ứng viên biết về công việc này đã được tuyển
        </span>
      </div>
    </div>
  );
}
