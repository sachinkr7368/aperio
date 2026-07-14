import { clsx } from "clsx";
import { methodColor } from "@/lib/openapi/parse";

export function MethodBadge({
  method,
  className,
  size = "md",
}: {
  method: string;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded border font-bold uppercase tracking-wide",
        size === "sm"
          ? "min-w-[2.6rem] px-1.5 py-0.5 text-[10px]"
          : "min-w-[3.25rem] px-2 py-0.5 text-[11px]",
        methodColor(method),
        className
      )}
    >
      {method}
    </span>
  );
}
