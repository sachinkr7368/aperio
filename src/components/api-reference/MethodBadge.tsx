import { clsx } from "clsx";
import { methodColor } from "@/lib/openapi/parse";

export function MethodBadge({
  method,
  className,
}: {
  method: string;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex min-w-[3.5rem] items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset",
        methodColor(method),
        className
      )}
    >
      {method}
    </span>
  );
}
