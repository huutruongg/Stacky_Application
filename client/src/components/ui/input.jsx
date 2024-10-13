import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-6 h-12 text-sm border border-[#424242] rounded-xl placeholder:text-text3 dark:placeholder:text-text3 dark:text-white bg-transparent outline-none outline-input",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
