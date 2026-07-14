import Link from "next/link";
import { clsx } from "clsx";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
      aria-hidden
    >
      <rect width="40" height="40" rx="11" fill="#1d4ed8" />
      <rect x="1" y="1" width="38" height="38" rx="10" fill="#2563eb" />
      {/* Stylized open aperture / document mark */}
      <path
        d="M12 26.5V13.5h6.1c2.85 0 4.55 1.45 4.55 3.65 0 1.55-.85 2.7-2.25 3.25L24.2 26.5h-3.35l-3.35-5.55H15.2v5.55H12zm3.2-8h1.95c1.25 0 2-.65 2-1.7s-.75-1.65-2-1.65H15.2v3.35z"
        fill="white"
      />
      <circle cx="28.5" cy="14" r="3" fill="#93c5fd" />
      <path
        d="M27 14h3M28.5 12.5v3"
        stroke="#1d4ed8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  showWordmark = true,
  size = "md",
}: {
  className?: string;
  href?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const mark = size === "lg" ? "h-9 w-9" : size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const text =
    size === "lg" ? "text-xl" : size === "sm" ? "text-sm" : "text-[15px]";

  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight text-[var(--text)]",
        className
      )}
    >
      <LogoMark className={mark} />
      {showWordmark && (
        <span className={clsx(text, "tracking-[-0.02em]")}>
          Aperio
        </span>
      )}
    </Link>
  );
}
