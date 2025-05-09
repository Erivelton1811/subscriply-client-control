
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { toast } from "sonner";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  
  // After mounting, we have access to the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const currentTheme = localStorage.getItem("subscriply-theme") || (prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", currentTheme === "dark");
    }
  }, [mounted]);

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}
