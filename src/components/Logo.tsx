import Link from "next/link";
import { clsx } from "clsx";

/** Premium A mark with depth + accent spark */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
      aria-hidden
    >
      <rect width="40" height="40" rx="10" fill="#1e3a8a" />
      <rect x="1.25" y="1.25" width="37.5" height="37.5" rx="8.75" fill="#2563eb" />
      <path
        d="M11 28 L20 10 L29 28"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 21 H25.5"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="30" cy="12" r="3.2" fill="#93c5fd" />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  showWordmark = true,
}: {
  className?: string;
  href?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight text-[var(--text)]",
        className
      )}
    >
      <LogoMark className="h-7 w-7" />
      {showWordmark && (
        <span className="text-[15px] tracking-tight">
          Aperio
        </span>
      )}
    </Link>
  );
}
