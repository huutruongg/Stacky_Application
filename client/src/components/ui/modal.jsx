import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import IconTick from "../icons/IconTick";

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  const onChange = (open) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={className}>
        <DialogHeader className="flex items-center gap-5">
          <DialogTitle className="w-fit text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#48038C] to-[#00F0FF]">
            {title}
          </DialogTitle>
          <div className="flex items-center gap-5 leading-6 w-96">
            <IconTick color={"#48038C"} className={"w-10 h-10"} />
            <DialogDescription className="w-fit text-primary">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
