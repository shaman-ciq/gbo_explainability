import * as React from "react";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  tone = "brand",
  children,
  ...props
}: React.ComponentProps<"div"> & { tone?: "brand" | "slate" }) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        tone === "brand" ? "bg-brand-500 text-white" : "bg-slate-200 text-slate-700",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Avatar };
