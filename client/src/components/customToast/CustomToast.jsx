import toast from "react-hot-toast";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";

const customSuccessToast = (message) => {
  toast.success(message, {
    icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    style: {
      border: "1px solid #4CAF50",
      padding: "16px",
      color: "#4CAF50",
      background: "#f0fff4",
    },
    duration: 4000,
    position: "top-right",
  });
};

const customErrorToast = (message) => {
  toast.error(message, {
    icon: <ExclamationCircleIcon className="w-6 h-6 text-red-500" />,
    style: {
      border: "1px solid #f44336",
      padding: "16px",
      color: "#f44336",
      background: "#fff0f0",
    },
    duration: 4000,
    position: "top-right",
  });
};

export { customSuccessToast, customErrorToast };
