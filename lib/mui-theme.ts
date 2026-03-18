import { createTheme, type ThemeOptions } from "@mui/material/styles";

// ── Palette augmentation for custom OGA tokens ──
declare module "@mui/material/styles" {
  interface Palette {
    oga: {
      tealDeep: string;
      surfaceAlt: string;
      gold: string;
      goldLight: string;
    };
  }
  interface PaletteOptions {
    oga?: {
      tealDeep?: string;
      surfaceAlt?: string;
      gold?: string;
      goldLight?: string;
    };
  }
}

const LIGHT = {
  teal: "#2B7A8C",
  tealDark: "#1D5A67",
  tealDeep: "#0F3D47",
  tealLight: "#3A9AAE",
  gold: "#D4A853",
  goldLight: "#E8C97A",
  surface: "#FDFBF6",
  surfaceCard: "#FFFFFF",
  surfaceAlt: "#F7F2E8",
  heading: "#0F3D47",
  body: "#3D4A4F",
  muted: "#6B7B82",
  border: "#E8EDEF",
  logoGreen: "#149850",
};

const DARK = {
  teal: "#3A9AAE",
  tealDark: "#1D5A67",
  tealDeep: "#0F3D47",
  tealLight: "#5AB8CC",
  gold: "#E8C97A",
  goldLight: "#F2DDA0",
  surface: "#0A1A1F",
  surfaceCard: "#122E38",
  surfaceAlt: "#0E252D",
  heading: "#F0F4F5",
  body: "#C0CDD2",
  muted: "#7A9DA6",
  border: "#1E4A55",
  logoGreen: "#149850",
};

export function createOgaTheme(mode: "light" | "dark") {
  const c = mode === "dark" ? DARK : LIGHT;

  const options: ThemeOptions = {
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: c.teal,
        dark: c.tealDark,
        light: c.tealLight,
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: c.gold,
        light: c.goldLight,
        contrastText: c.tealDeep,
      },
      success: { main: c.logoGreen },
      background: {
        default: c.surface,
        paper: c.surfaceCard,
      },
      text: {
        primary: c.heading,
        secondary: c.body,
        disabled: c.muted,
      },
      divider: c.border,
      oga: {
        tealDeep: c.tealDeep,
        surfaceAlt: c.surfaceAlt,
        gold: c.gold,
        goldLight: c.goldLight,
      },
    },
    typography: {
      fontFamily: "var(--font-body)",
      h1: { fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.2 },
      h2: { fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.2 },
      h3: { fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.2 },
      h4: { fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.2 },
      h5: { fontFamily: "var(--font-display)", fontWeight: 600, lineHeight: 1.3 },
      h6: { fontFamily: "var(--font-display)", fontWeight: 600, lineHeight: 1.3 },
      body1: { fontFamily: "var(--font-body)" },
      body2: { fontFamily: "var(--font-body)", fontSize: "0.875rem" },
      button: { fontFamily: "var(--font-body)", fontWeight: 600, textTransform: "none" },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiTextField: {
        defaultProps: { variant: "outlined", size: "medium" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            backgroundColor: theme.palette.background.paper,
            fontSize: "0.875rem",
            transition: "border-color 0.2s ease, background-color 0.3s ease",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.divider,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: theme.palette.text.secondary,
            "&.Mui-focused": {
              color: theme.palette.primary.main,
            },
          }),
        },
      },
      MuiSelect: {
        defaultProps: { variant: "outlined" },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "0.875rem 2rem",
            fontWeight: 600,
            textTransform: "none" as const,
          },
          containedPrimary: ({ theme }) => ({
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
            color: theme.palette.secondary.contrastText,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
              transform: "translateY(-2px) scale(1.02)",
              boxShadow: `0 8px 24px ${theme.palette.secondary.main}66`,
            },
            "&:active": {
              transform: "translateY(0) scale(0.97)",
              boxShadow: `0 2px 8px ${theme.palette.secondary.main}4D`,
            },
          }),
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { fontFamily: "var(--font-body)", fontSize: "0.75rem" },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            "&.Mui-selected": {
              backgroundColor: `${theme.palette.primary.main}14`,
            },
            "&.Mui-selected:hover": {
              backgroundColor: `${theme.palette.primary.main}24`,
            },
          }),
        },
      },
      // ── Accordion (FAQ) ──
      MuiAccordion: {
        defaultProps: { elevation: 0, disableGutters: true },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: "12px !important",
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : c.surfaceAlt,
            border: "1px solid transparent",
            transition: "border-color 0.2s ease, background-color 0.3s ease",
            "&::before": { display: "none" },
            "&.Mui-expanded": {
              borderColor: `${theme.palette.primary.main}33`,
              margin: 0,
            },
            "& + &": { marginTop: "8px" },
          }),
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: theme.palette.text.primary,
            padding: "0 24px",
            minHeight: 60,
            "&:hover": { color: theme.palette.primary.main },
            transition: "color 0.2s ease",
          }),
          expandIconWrapper: ({ theme }) => ({
            color: theme.palette.text.disabled,
          }),
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: "0 24px 20px",
            fontSize: "0.875rem",
            lineHeight: 1.7,
          },
        },
      },
      // ── Tabs (Products) ──
      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 44 },
          indicator: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            height: 3,
            borderRadius: "3px 3px 0 0",
          }),
          flexContainer: { gap: 8 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.9rem",
            textTransform: "none" as const,
            borderRadius: 8,
            padding: "10px 24px",
            minHeight: 44,
            color: theme.palette.text.secondary,
            transition: "all 0.2s ease",
            "&.Mui-selected": {
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
              boxShadow: `0 4px 16px ${theme.palette.primary.main}4D`,
            },
            "&:hover:not(.Mui-selected)": {
              color: theme.palette.primary.main,
              backgroundColor: `${theme.palette.primary.main}0A`,
            },
          }),
        },
      },
      // ── Drawer (Navbar mobile) ──
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: c.tealDeep,
            color: "#FFFFFF",
            width: 288,
            padding: "80px 24px 24px",
          },
        },
      },
      // ── Dialog (PortalModal) ──
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 16,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: { padding: "40px", textAlign: "center" as const },
        },
      },
      // ── Fab (WhatsApp) ──
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            },
          },
        },
      },
      // ── Card (Pricing, Industries) ──
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${theme.palette.divider}`,
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
              borderColor: theme.palette.primary.main,
            },
          }),
        },
      },
      // ── Chip (Industries metrics, Products badges) ──
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.75rem",
          },
        },
      },
      // ── LinearProgress (Navbar scroll) ──
      MuiLinearProgress: {
        styleOverrides: {
          root: ({ theme }) => ({
            height: 2,
            backgroundColor: "transparent",
            "& .MuiLinearProgress-bar": {
              backgroundColor: theme.palette.primary.main,
            },
          }),
        },
      },
      // ── IconButton ──
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "color 0.2s ease, background-color 0.2s ease",
          },
        },
      },
      // ── List (Pricing rows) ──
      MuiList: {
        styleOverrides: {
          root: { padding: 0 },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: { paddingLeft: 0, paddingRight: 0 },
        },
      },
    },
  };

  return createTheme(options);
}
