"use client";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { LogoIcon } from "./Logo";

export function PortalModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <IconButton
          onClick={onClose}
          aria-label="Close modal"
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>

        <div className="flex justify-center mb-6">
          <LogoIcon size={64} />
        </div>

        <h3 className="font-display text-2xl font-bold text-heading mb-2">
          Distributor &amp; Admin Portal
        </h3>
        <p className="text-lg font-semibold text-gold mb-3">Coming Soon</p>
        <p className="text-grey text-sm leading-relaxed mb-6">
          We&apos;re building a dedicated portal for distributors and
          administrators. Features will include leads management, quote
          generation, inventory tracking, and more.
        </p>

        <div className="flex gap-3">
          <TextField
            type="email"
            label="Email for updates"
            size="small"
            fullWidth
          />
          <Button variant="contained" color="primary" sx={{ whiteSpace: "nowrap" }}>
            Notify Me
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
