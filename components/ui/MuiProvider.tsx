"use client";

import { useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTheme } from "@/components/ui/ThemeProvider";
import { createOgaTheme } from "@/lib/mui-theme";

export function MuiProvider({ children }: { children: React.ReactNode }) {
  const { theme: mode } = useTheme();
  const muiTheme = useMemo(() => createOgaTheme(mode), [mode]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      {children}
    </MuiThemeProvider>
  );
}
