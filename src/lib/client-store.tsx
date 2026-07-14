"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type AuthMode = "none" | "bearer" | "apikey" | "basic";

export interface ClientAuth {
  mode: AuthMode;
  bearer: string;
  apiKeyName: string;
  apiKeyValue: string;
  apiKeyIn: "header" | "query";
  basicUser: string;
  basicPass: string;
}

export interface RequestHistoryItem {
  id: string;
  at: number;
  method: string;
  url: string;
  status?: number;
  timeMs?: number;
  ok?: boolean;
  error?: string;
}

export interface EnvVar {
  key: string;
  value: string;
}

interface ClientStore {
  auth: ClientAuth;
  setAuth: (patch: Partial<ClientAuth>) => void;
  serverUrl: string;
  setServerUrl: Dispatch<SetStateAction<string>>;
  env: EnvVar[];
  setEnv: Dispatch<SetStateAction<EnvVar[]>>;
  history: RequestHistoryItem[];
  pushHistory: (item: Omit<RequestHistoryItem, "id" | "at">) => void;
  clearHistory: () => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  toggleTheme: () => void;
  applyEnv: (text: string) => string;
}

const defaultAuth: ClientAuth = {
  mode: "none",
  bearer: "",
  apiKeyName: "X-API-Key",
  apiKeyValue: "",
  apiKeyIn: "header",
  basicUser: "",
  basicPass: "",
};

const Ctx = createContext<ClientStore | null>(null);

export function ClientStoreProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<ClientAuth>(defaultAuth);
  const [serverUrl, setServerUrl] = useState("");
  const [env, setEnv] = useState<EnvVar[]>([
    { key: "BASE_URL", value: "" },
    { key: "TOKEN", value: "" },
  ]);
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aperio.client");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.auth) setAuthState({ ...defaultAuth, ...data.auth });
        if (data.env) setEnv(data.env);
        if (data.history) setHistory(data.history.slice(0, 50));
        if (data.theme === "light" || data.theme === "dark")
          setThemeState(data.theme);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        "aperio.client",
        JSON.stringify({ auth, env, history: history.slice(0, 50), theme })
      );
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.theme = theme;
  }, [auth, env, history, theme, hydrated]);

  const setAuth = useCallback((patch: Partial<ClientAuth>) => {
    setAuthState((a) => ({ ...a, ...patch }));
  }, []);

  const pushHistory = useCallback(
    (item: Omit<RequestHistoryItem, "id" | "at">) => {
      setHistory((h) =>
        [
          {
            ...item,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            at: Date.now(),
          },
          ...h,
        ].slice(0, 50)
      );
    },
    []
  );

  const clearHistory = useCallback(() => setHistory([]), []);
  const setTheme = useCallback((t: "dark" | "light") => setThemeState(t), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  const applyEnv = useCallback(
    (text: string) => {
      let out = text;
      for (const { key, value } of env) {
        if (!key) continue;
        out = out.split(`{{${key}}}`).join(value);
      }
      return out;
    },
    [env]
  );

  const value = useMemo(
    () => ({
      auth,
      setAuth,
      serverUrl,
      setServerUrl,
      env,
      setEnv,
      history,
      pushHistory,
      clearHistory,
      theme,
      setTheme,
      toggleTheme,
      applyEnv,
    }),
    [
      auth,
      setAuth,
      serverUrl,
      env,
      history,
      pushHistory,
      clearHistory,
      theme,
      setTheme,
      toggleTheme,
      applyEnv,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClientStore() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useClientStore must be used within ClientStoreProvider");
  }
  return ctx;
}
