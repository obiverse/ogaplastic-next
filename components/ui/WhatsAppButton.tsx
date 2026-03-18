"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Fab from "@mui/material/Fab";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
  </svg>
);

const WA_ICON_SMALL = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
  </svg>
);

// Exported for reuse in Pricing and other sections
export { WA_ICON_SMALL };

type ActiveSection = "hero" | "about" | "products" | "pricing" | "faq" | "contact" | "other";

const SECTIONS_TO_WATCH: ActiveSection[] = ["hero", "about", "products", "pricing", "faq", "contact"];

function useActiveSection(): ActiveSection {
  const [section, setSection] = useState<ActiveSection>("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const id of SECTIONS_TO_WATCH) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return section;
}

function getMenuItems(section: ActiveSection) {
  switch (section) {
    case "pricing":
      return [
        { label: "Order Water Tank", url: buildWhatsAppUrl({ type: "product", product: "Water Tank" }) },
        { label: "Order Waste Bin", url: buildWhatsAppUrl({ type: "product", product: "Waste Bin" }) },
      ];
    case "products":
      return [
        { label: "Enquire about Products", url: buildWhatsAppUrl({ type: "product", product: "your products" }) },
        { label: "Support", url: buildWhatsAppUrl({ type: "general" }, "support") },
      ];
    case "faq":
      return [
        { label: "Ask about Pricing & Delivery", url: buildWhatsAppUrl({ type: "general" }) },
        { label: "Ask about Products", url: buildWhatsAppUrl({ type: "product", product: "your products" }) },
      ];
    case "contact":
      return [
        { label: "Chat on WhatsApp", url: buildWhatsAppUrl({ type: "general" }) },
      ];
    default:
      return [
        { label: "Sales", url: buildWhatsAppUrl({ type: "general" }) },
        { label: "Support", url: buildWhatsAppUrl({ type: "general" }, "support") },
      ];
  }
}

function getTooltip(section: ActiveSection): string | null {
  if (section === "pricing") return "Ready to order? Chat with us";
  if (section === "faq") return "Have more questions? Chat with us";
  if (section === "contact") return "Chat on WhatsApp instead";
  return null;
}

export function WhatsAppButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);
  const section = useActiveSection();
  const showTooltip = section === "pricing" || section === "faq" || section === "contact";

  function handleClick(e: MouseEvent<HTMLElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const items = getMenuItems(section);
  const tooltip = getTooltip(section);

  const fab = (
    <Fab
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      sx={{
        bgcolor: "#25D366",
        color: "#fff",
        width: 56,
        height: 56,
        animation: showTooltip ? "wa-pulse 1s ease-in-out 3" : undefined,
        "@keyframes wa-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        "&:hover": { bgcolor: "#20BD5A", transform: "scale(1.05)" },
      }}
    >
      {WA_ICON}
    </Fab>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[40]">
      {tooltip ? (
        <Tooltip title={tooltip} placement="left" arrow open={!menuOpen && showTooltip}>
          {fab}
        </Tooltip>
      ) : (
        fab
      )}

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { minWidth: 240, mb: 1, borderRadius: 3 },
          },
        }}
      >
        <p className="text-xs text-grey px-4 pt-1 pb-2">Chat with us on WhatsApp</p>
        {items.map((item) => (
          <MenuItem
            key={item.label}
            component="a"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            sx={{ borderRadius: 2, mx: 0.5 }}
          >
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar sx={{ bgcolor: "#25D366", width: 32, height: 32 }}>
                {WA_ICON_SMALL}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: { sx: { fontWeight: 600, fontSize: "0.875rem" } },
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
