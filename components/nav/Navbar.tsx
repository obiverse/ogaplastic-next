"use client";

import { useState, useEffect, useCallback } from "react";
import { LogoFull } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/lib/constants";
import { PortalModal } from "@/components/ui/PortalModal";

const SECTION_IDS = [
  "hero",
  "about",
  "products",
  "technology",
  "industries",
  "sustainability",
  "pricing",
  "specifications",
  "contact",
];

const DROPDOWN_ITEMS = [
  { label: "Water Tanks", tabId: "tanks" },
  { label: "Waste Bins", tabId: "bins" },
  { label: "Custom Products", tabId: "custom" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Scroll → solid nav background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
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

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  function isActive(href: string): boolean {
    const id = href.replace("#", "");
    if (id === activeSection) return true;
    // Products nav link also active for specifications section
    if (id === "products" && activeSection === "specifications") return true;
    return false;
  }

  function handleDropdownClick(tabId: string) {
    setDropdownOpen(false);
    window.dispatchEvent(
      new CustomEvent("oga-switch-tab", { detail: tabId })
    );
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
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <a
                      href={link.href}
                      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-white"
                          : "text-white/60 hover:text-white"
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
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl py-2 min-w-[200px] border border-light-grey">
                        {DROPDOWN_ITEMS.map((child) => (
                          <a
                            key={child.label}
                            href="#products"
                            onClick={() => handleDropdownClick(child.tabId)}
                            className="block px-5 py-3 text-sm text-slate-brand hover:bg-sand-light hover:text-teal transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gold rounded-full" />
                    )}
                  </a>
                )
              )}
              <a
                href="#contact"
                className="btn-gold ml-4 text-sm !py-2.5 !px-5"
              >
                Get a Quote
              </a>
              <button
                onClick={() => setPortalOpen(true)}
                className="ml-2 px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Portal
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white p-2 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={closeMenu}
            />
            <div className="fixed top-0 right-0 bottom-0 w-72 bg-teal-deep z-50 lg:hidden p-6 pt-20 flex flex-col gap-1 shadow-2xl">
              <button
                onClick={closeMenu}
                className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl cursor-pointer"
                aria-label="Close menu"
              >
                &times;
              </button>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block py-3 px-4 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "text-white bg-white/10 font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/5"
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
                      closeMenu();
                      handleDropdownClick(child.tabId);
                    }}
                    className="block py-2 px-4 text-sm text-white/50 hover:text-white/80 transition-colors"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="btn-gold text-center text-sm"
                >
                  Get a Quote
                </a>
                <button
                  onClick={() => {
                    closeMenu();
                    setPortalOpen(true);
                  }}
                  className="text-sm text-white/60 hover:text-white py-2 cursor-pointer"
                >
                  Portal Login
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      <PortalModal open={portalOpen} onClose={() => setPortalOpen(false)} />
    </>
  );
}
