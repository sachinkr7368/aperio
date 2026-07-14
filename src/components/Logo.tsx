import Link from "next/link";
import { clsx } from "clsx";

/** Simple geometric mark — no letter paths that break at small sizes */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill="#2563eb" />
      <path
        d="M8 22 L16 8 L24 22"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11.5 16.5 H20.5"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
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
        "inline-flex items-center gap-2.5 font-semibold tracking-tight text-zinc-100",
        className
      )}
    >
      <LogoMark className="h-7 w-7" />
      {showWordmark && <span className="text-[15px]">Aperio</span>}
    </Link>
  );
}
