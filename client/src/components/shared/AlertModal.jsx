import { Button } from "@/components/ui/button";
import { Modal } from "../ui/modal";

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Bạn có chắc không?",
  description = "Bạn có chắc chắn muốn tiếp tục không?",
}) => {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      description={description}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Tiếp tục
        </Button>
      </div>
    </Modal>
  );
};
