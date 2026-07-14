"use client";

import { ClientStoreProvider } from "@/lib/client-store";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <ClientStoreProvider>{children}</ClientStoreProvider>;
}
