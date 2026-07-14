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
      <rect width="40" height="40" rx="10" fill="url(#aperio-grad)" />
      <path
        d="M11 27V13h5.2c2.9 0 4.7 1.55 4.7 3.95 0 1.55-.8 2.75-2.15 3.35L22.3 27h-3.55l-3.2-5.7H14.2V27H11zm3.2-8.15h1.85c1.35 0 2.15-.7 2.15-1.8s-.8-1.75-2.15-1.75H14.2v3.55zM24.1 27l4.05-14h3.55L35.75 27h-3.45l-.7-2.55h-3.9L27.5 27h-3.4zm5.05-5.15h2.55l-1.25-4.55-1.3 4.55z"
        fill="white"
        fillOpacity="0.95"
      />
      <defs>
        <linearGradient
          id="aperio-grad"
          x1="4"
          y1="2"
          x2="36"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#22d3ee" />
          <stop offset="0.55" stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
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
        "inline-flex items-center gap-2.5 font-semibold tracking-tight text-white",
        className
      )}
    >
      <LogoMark className="h-8 w-8" />
      {showWordmark && (
        <span className="text-lg">
          Aperio
          <span className="text-cyan-400">.</span>
        </span>
      )}
    </Link>
  );
}
