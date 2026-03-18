"use client";

import { useState, useEffect, useCallback, type MouseEvent } from "react";
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import { LogoFull } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/lib/constants";
import { PortalModal } from "@/components/ui/PortalModal";
import { useTheme } from "@/components/ui/ThemeProvider";

const SECTION_IDS = [
  "hero",
  "about",
  "products",
  "technology",
  "industries",
  "sustainability",
  "pricing",
  "specifications",
  "faq",
  "contact",
];

const DROPDOWN_ITEMS = [
  { label: "Water Tanks", tabId: "tanks" },
  { label: "Waste Bins", tabId: "bins" },
  { label: "Custom Products", tabId: "custom" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Desktop dropdown menu anchor
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const dropdownOpen = Boolean(menuAnchor);

  // Scroll → solid nav background + progress bar
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
          let best = "";
          let bestRatio = 0;
          visible.forEach((ratio, sid) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = sid;
            }
          });
          if (best) setActiveSection(best);
        },
        { threshold: [0, 0.2, 0.5, 0.8], rootMargin: "-80px 0px 0px 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  function isActive(href: string): boolean {
    const id = href.replace("#", "");
    if (id === activeSection) return true;
    if (id === "products" && activeSection === "specifications") return true;
    return false;
  }

  function handleDropdownClick(tabId: string) {
    setMenuAnchor(null);
    window.dispatchEvent(
      new CustomEvent("oga-switch-tab", { detail: tabId })
    );
  }

  function handleMenuOpen(e: MouseEvent<HTMLElement>) {
    setMenuAnchor(e.currentTarget);
  }

  function handleMenuClose() {
    setMenuAnchor(null);
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-teal-deep/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#hero" className="flex-shrink-0">
              <LogoFull variant="light" />
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) =>
                "children" in link ? (
                  <div key={link.label} className="relative">
                    <a
                      href={link.href}
                      onMouseEnter={handleMenuOpen}
                      aria-current={isActive(link.href) ? "true" : undefined}
                      className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-white"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {link.label}
                      <svg
                        className={`inline-block w-3.5 h-3.5 ml-1 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      {isActive(link.href) && (
                        <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gold rounded-full" />
                      )}
                    </a>
                    <Menu
                      anchorEl={menuAnchor}
                      open={dropdownOpen}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                      transformOrigin={{ vertical: "top", horizontal: "left" }}
                      slotProps={{
                        paper: {
                          sx: { minWidth: 200, mt: 0.5, borderRadius: 3 },
                          onMouseLeave: handleMenuClose,
                        },
                      }}
                      disableAutoFocusItem
                    >
                      {DROPDOWN_ITEMS.map((child) => (
                        <MenuItem
                          key={child.label}
                          component="a"
                          href="#products"
                          onClick={() => handleDropdownClick(child.tabId)}
                          sx={{ py: 1.5, px: 2.5 }}
                        >
                          {child.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-current={isActive(link.href) ? "true" : undefined}
                    className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gold rounded-full" />
                    )}
                  </a>
                )
              )}
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ ml: 2, py: 1.25, px: 2.5 }}
                onClick={() => window.dispatchEvent(new CustomEvent("oga-open-order-builder", { detail: {} }))}
              >
                Order Now
              </Button>
              <button
                onClick={() => window.dispatchEvent(new Event("oga-open-order-history"))}
                className="ml-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                My Orders
              </button>
              <button
                onClick={() => setPortalOpen(true)}
                className="ml-1 px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white/80 transition-colors cursor-pointer"
              >
                Portal
              </button>
              <IconButton
                onClick={toggleTheme}
                sx={{ ml: 1, color: "rgba(255,255,255,0.6)", "&:hover": { color: "#fff" } }}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </IconButton>
            </div>

            {/* Mobile hamburger */}
            <IconButton
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              sx={{ color: "#fff", display: { lg: "none" } }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Scroll progress bar */}
      <LinearProgress
        variant="determinate"
        value={scrollProgress}
        aria-label="Page scroll progress"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          transition: "none",
          "& .MuiLinearProgress-bar": { transition: "none" },
        }}
      />

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeDrawer}
        sx={{ display: { lg: "none" } }}
      >
        <IconButton
          onClick={closeDrawer}
          aria-label="Close menu"
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            color: "rgba(255,255,255,0.6)",
            "&:hover": { color: "#fff" },
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>

        <div className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeDrawer}
              className={`block py-3 px-4 rounded-lg transition-colors ${
                isActive(link.href)
                  ? "text-white bg-white/10 font-semibold"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold ml-2" />
              )}
            </a>
          ))}

          {/* Product sub-links in mobile */}
          <div className="pl-6 flex flex-col gap-0.5">
            {DROPDOWN_ITEMS.map((child) => (
              <a
                key={child.label}
                href="#products"
                onClick={() => {
                  closeDrawer();
                  handleDropdownClick(child.tabId);
                }}
                className="block py-2 px-4 text-sm text-white/70 hover:text-white transition-colors"
              >
                {child.label}
              </a>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                closeDrawer();
                window.dispatchEvent(new CustomEvent("oga-open-order-builder", { detail: {} }));
              }}
              fullWidth
            >
              Order Now
            </Button>
            <button
              onClick={() => {
                closeDrawer();
                window.dispatchEvent(new Event("oga-open-order-history"));
              }}
              className="text-sm text-white/70 hover:text-white py-2 cursor-pointer"
            >
              My Orders
            </button>
            <button
              onClick={() => {
                closeDrawer();
                setPortalOpen(true);
              }}
              className="text-sm text-white/50 hover:text-white/80 py-2 cursor-pointer"
            >
              Portal
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white py-2 cursor-pointer"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark Mode
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light Mode
                </>
              )}
            </button>
          </div>
        </div>
      </Drawer>

      <PortalModal open={portalOpen} onClose={() => setPortalOpen(false)} />
    </>
  );
}
