"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Platform } from "./types";

export type { Platform };

type PlatformContextValue = {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
  isIos: boolean;
  isAndroid: boolean;
  label: string;
  shortLabel: string;
};

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatformState] = useState<Platform>("ios");

  const setPlatform = useCallback((next: Platform) => {
    setPlatformState(next);
  }, []);

  const value = useMemo<PlatformContextValue>(
    () => ({
      platform,
      setPlatform,
      isIos: platform === "ios",
      isAndroid: platform === "android",
      label: platform === "ios" ? "iOS" : "Android",
      shortLabel: platform === "ios" ? "iPhone" : "Android",
    }),
    [platform, setPlatform],
  );

  return (
    <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return ctx;
}
