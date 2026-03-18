"use client";

import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

export function OfflineIndicator() {
  const [status, setStatus] = useState<"online" | "offline" | null>(null);

  useEffect(() => {
    function goOffline() { setStatus("offline"); }
    function goOnline() {
      setStatus("online");
      setTimeout(() => setStatus(null), 3000);
    }

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!status) return null;

  return (
    <Snackbar
      open
      onClose={status === "online" ? () => setStatus(null) : undefined}
      autoHideDuration={status === "online" ? 3000 : null}
      message={
        status === "offline"
          ? "You're offline — browsing cached content"
          : "Back online"
      }
      sx={{
        "& .MuiSnackbarContent-root": {
          bgcolor: status === "offline" ? "#B45309" : "#059669",
        },
      }}
    />
  );
}
