import TextareaField from "@/components/fieldForm/TextareaField";

export default function ModalSendNotification({ form }) {
  return (
    <div className="px-5">
      <TextareaField
        control={form.control}
        name={`notification`}
        placeholder="Nội dung thông báo"
        id={`notification`}
        htmlFor={`notification`}
      />
    </div>
  );
}
