"use client";

import { useEffect, useRef, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "oga-pwa-dismissed";
const DISMISS_DAYS = 7;

function isDismissed(): boolean {
  if (typeof window === "undefined") return true;
  const ts = localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  return Date.now() - Number(ts) < DISMISS_DAYS * 86400000;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !("standalone" in navigator);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [iosPrompt, setIosPrompt] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    // Chromium: capture deferred prompt
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      // Show after 30s engagement
      setTimeout(() => setShow(true), 30000);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS: show instructions after 30s
    if (isIOS()) {
      setTimeout(() => setIosPrompt(true), 30000);
    }

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  function handleInstall() {
    deferredPrompt.current?.prompt();
    deferredPrompt.current?.userChoice.then(() => setShow(false));
  }

  function handleDismiss() {
    setShow(false);
    setIosPrompt(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }

  const closeBtn = (
    <IconButton size="small" color="inherit" onClick={handleDismiss} aria-label="Dismiss">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </IconButton>
  );

  // Chromium install
  if (show) {
    return (
      <Snackbar
        open
        onClose={handleDismiss}
        message="Install OGA PLASTIC for quick access"
        action={
          <>
            <Button size="small" color="secondary" onClick={handleInstall}>
              Install
            </Button>
            {closeBtn}
          </>
        }
        sx={{ "& .MuiSnackbarContent-root": { bgcolor: "#0F3D47" } }}
      />
    );
  }

  // iOS instructions
  if (iosPrompt) {
    return (
      <Snackbar
        open
        onClose={handleDismiss}
        message={
          <>
            Tap <strong>Share</strong> then <strong>Add to Home Screen</strong> to install
          </>
        }
        action={closeBtn}
        sx={{ "& .MuiSnackbarContent-root": { bgcolor: "#0F3D47" } }}
      />
    );
  }

  return null;
}
