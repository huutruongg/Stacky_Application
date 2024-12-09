import { Modal } from "../ui/modal";
import Buttonchild from "../button/Buttonchild";

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title = "Bạn có chắc không?",
  description = "Bạn có chắn chắn muốn tiếp tục không?",
}) => {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      description={description}
      className={"bg-white"}
    >
      <div className="flex w-full items-center justify-center gap-5 py-5">
        <Buttonchild
          className="text-center py-1 px-5 disabled:opacity-50"
          kind="secondary"
          disabled={isLoading}
          onClick={onClose}
        >
          Hủy
        </Buttonchild>
        <Buttonchild
          className="text-center py-1 px-5 disabled:opacity-50"
          kind="primary"
          disabled={isLoading}
          onClick={onConfirm}
        >
          Tiếp tục
        </Buttonchild>
      </div>
    </Modal>
  );
};
