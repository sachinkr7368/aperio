import { clsx } from "clsx";
import { methodColor } from "@/lib/openapi/parse";

export function MethodBadge({
  method,
  className,
  size = "md",
}: {
  method: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-md border font-bold uppercase tracking-wide",
        size === "sm" && "min-w-[2.5rem] px-1.5 py-0.5 text-[10px]",
        size === "md" && "min-w-[3.25rem] px-2 py-0.5 text-[11px]",
        size === "lg" && "min-w-[3.75rem] px-2.5 py-1 text-xs",
        methodColor(method),
        className
      )}
    >
      {method}
    </span>
  );
}
