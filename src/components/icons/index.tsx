import { clsx } from "clsx";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function base(props: IconProps, paths: React.ReactNode) {
  const { size = 20, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {paths}
    </svg>
  );
}

export function IconPlay(p: IconProps) {
  return base(p, <path d="M7.5 5.5v13l11-6.5-11-6.5z" fill="currentColor" stroke="none" />);
}

export function IconSearch(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5L21 21" />
    </>
  );
}

export function IconDownload(p: IconProps) {
  return base(
    p,
    <>
      <path d="M12 4v11" />
      <path d="M7.5 11.5 12 16l4.5-4.5" />
      <path d="M5 20h14" />
    </>
  );
}

export function IconUpload(p: IconProps) {
  return base(
    p,
    <>
      <path d="M12 16V5" />
      <path d="M7.5 9.5 12 5l4.5 4.5" />
      <path d="M5 20h14" />
    </>
  );
}

export function IconCopy(p: IconProps) {
  return base(
    p,
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M6 16H5a2 2 0 01-2-2V5a2 2 0 012-2h9a2 2 0 012 2v1" />
    </>
  );
}

export function IconCheck(p: IconProps) {
  return base(p, <path d="M5 12.5l4.5 4.5L19 7" />);
}

export function IconKey(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="8" cy="15" r="3.5" />
      <path d="M11 13.5 20 4.5" />
      <path d="M16.5 5.5 18.5 7.5" />
      <path d="M14.5 7.5 16.5 9.5" />
    </>
  );
}

export function IconCode(p: IconProps) {
  return base(
    p,
    <>
      <path d="M9 8 5 12l4 4" />
      <path d="M15 8l4 4-4 4" />
      <path d="M13 5l-2 14" />
    </>
  );
}

export function IconTerminal(p: IconProps) {
  return base(
    p,
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3" />
      <path d="M12 15h5" />
    </>
  );
}

export function IconBook(p: IconProps) {
  return base(
    p,
    <>
      <path d="M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 004 16.5v-11z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </>
  );
}

export function IconGlobe(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 3 3.8 6 3.8 9s-1.3 6-3.8 9c-2.5-3-3.8-6-3.8-9s1.3-6 3.8-9z" />
    </>
  );
}

export function IconLink(p: IconProps) {
  return base(
    p,
    <>
      <path d="M10 13a4 4 0 005.7.3l2-2a4 4 0 00-5.6-5.7l-1.1 1.1" />
      <path d="M14 11a4 4 0 00-5.7-.3l-2 2a4 4 0 005.6 5.7l1.1-1.1" />
    </>
  );
}

export function IconBox(p: IconProps) {
  return base(
    p,
    <>
      <path d="M12 3 21 7.5v9L12 21 3 16.5v-9L12 3z" />
      <path d="M12 12 21 7.5" />
      <path d="M12 12v9" />
      <path d="M12 12 3 7.5" />
    </>
  );
}

export function IconMenu(p: IconProps) {
  return base(
    p,
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  );
}

export function IconX(p: IconProps) {
  return base(
    p,
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  );
}

export function IconChevronDown(p: IconProps) {
  return base(p, <path d="M6 9l6 6 6-6" />);
}

export function IconChevronRight(p: IconProps) {
  return base(p, <path d="M9 6l6 6-6 6" />);
}

export function IconSun(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2" />
      <path d="M12 19.5v2" />
      <path d="M2.5 12h2" />
      <path d="M19.5 12h2" />
      <path d="M5.2 5.2l1.4 1.4" />
      <path d="M17.4 17.4l1.4 1.4" />
      <path d="M5.2 18.8l1.4-1.4" />
      <path d="M17.4 6.6l1.4-1.4" />
    </>
  );
}

export function IconMoon(p: IconProps) {
  return base(p, <path d="M20 14.5A7.5 7.5 0 019.5 4 7.5 7.5 0 1019.5 19 7.4 7.4 0 0020 14.5z" />);
}

export function IconHistory(p: IconProps) {
  return base(
    p,
    <>
      <path d="M4 12a8 8 0 108-8" />
      <path d="M4 4v4h4" />
      <path d="M12 8v5l3 2" />
    </>
  );
}

export function IconSpark(p: IconProps) {
  return base(
    p,
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </>
  );
}

export function IconShield(p: IconProps) {
  return base(
    p,
    <>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" />
      <path d="M9.5 12.5l1.8 1.8 3.7-3.8" />
    </>
  );
}

export function IconZap(p: IconProps) {
  return base(p, <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" stroke="none" />);
}

export function IconFileJson(p: IconProps) {
  return base(
    p,
    <>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
      <path d="M14 3v5h5" />
      <path d="M9 13c0 1.5-1 2-1 3s.5 1.5 1.5 1.5" />
      <path d="M15 13c0 1.5 1 2 1 3s-.5 1.5-1.5 1.5" />
    </>
  );
}

export function IconUnlock(p: IconProps) {
  return base(
    p,
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 017.5-2" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </>
  );
}

export function IconServer(p: IconProps) {
  return base(
    p,
    <>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01" />
      <path d="M7 17h.01" />
      <path d="M11 7h4" />
      <path d="M11 17h4" />
    </>
  );
}

export function IconFilter(p: IconProps) {
  return base(p, <path d="M4 6h16l-6 7v5l-4 2v-7L4 6z" />);
}

export function IconBraces(p: IconProps) {
  return base(
    p,
    <>
      <path d="M9 5H7.5A2.5 2.5 0 005 7.5v2A2 2 0 013 11.5 2 2 0 005 13.5v2A2.5 2.5 0 007.5 18H9" />
      <path d="M15 5h1.5A2.5 2.5 0 0119 7.5v2a2 2 0 002 2 2 2 0 00-2 2v2a2.5 2.5 0 01-2.5 2.5H15" />
    </>
  );
}

export function IconAlert(p: IconProps) {
  return base(
    p,
    <>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 4.2 2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 4.2a2 2 0 00-3.4 0z" />
    </>
  );
}

export function IconExternal(p: IconProps) {
  return base(
    p,
    <>
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 13v5a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h5" />
    </>
  );
}

export function IconTrash(p: IconProps) {
  return base(
    p,
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" />
      <path d="M7 7l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13" />
    </>
  );
}

export function IconSettings(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </>
  );
}

export function IconGithub(p: IconProps) {
  return (
    <svg
      width={p.size ?? 20}
      height={p.size ?? 20}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx("shrink-0", p.className)}
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export function IconLayers(p: IconProps) {
  return base(
    p,
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </>
  );
}

export function IconShare(p: IconProps) {
  return base(
    p,
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.3 13.2 15.7 17.3" />
      <path d="M15.7 6.7 8.3 10.8" />
    </>
  );
}

export function IconEdit(p: IconProps) {
  return base(
    p,
    <>
      <path d="M4 20h4l11-11a2.1 2.1 0 00-3-3L5 17v3z" />
      <path d="M13.5 6.5l3 3" />
    </>
  );
}

export function IconRefresh(p: IconProps) {
  return base(
    p,
    <>
      <path d="M20 12a8 8 0 10-2.3 5.5" />
      <path d="M20 5v5h-5" />
    </>
  );
}
