"use client";

import { useEffect, useRef } from "react";
import { LogoIcon } from "./Logo";

export function PortalModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-transparent p-0 m-auto rounded-2xl"
      onClose={onClose}
    >
      <div className="bg-white rounded-2xl p-10 max-w-md text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-grey hover:text-charcoal text-2xl leading-none cursor-pointer"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="flex justify-center mb-6">
          <LogoIcon size={64} />
        </div>
        <h3 className="font-display text-2xl font-bold text-teal-deep mb-2">
          Distributor &amp; Admin Portal
        </h3>
        <p className="text-lg font-semibold text-gold mb-3">Coming Soon</p>
        <p className="text-grey text-sm leading-relaxed mb-6">
          We&apos;re building a dedicated portal for distributors and
          administrators. Features will include leads management, quote
          generation, inventory tracking, and more.
        </p>
        <div className="flex gap-3">
          <input
            type="email"
            placeholder="Your email for updates"
            className="flex-1 border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal"
          />
          <button className="btn-gold text-sm !px-5 !py-3 cursor-pointer">Notify Me</button>
        </div>
      </div>
    </dialog>
  );
}
