"use client";

import { useEffect, useState } from "react";
import { LogoMonoWhite } from "@/components/ui/Logo";

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${hidden ? "hidden" : ""}`}>
      <div className="loading-logo">
        <LogoMonoWhite size={72} />
      </div>
      <div className="text-white/80 text-sm font-medium mt-4 tracking-widest uppercase">
        OGA PLASTIC
      </div>
      <div className="loading-bar">
        <div className="loading-bar-fill" />
      </div>
    </div>
  );
}
