"use client";

import { useState, useEffect, useCallback } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { getOrders, type SavedOrder } from "@/lib/order-store";
import { formatNaira } from "@/lib/constants";

export function OrderHistory() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<SavedOrder[]>([]);

  const loadOrders = useCallback(async () => {
    const all = await getOrders();
    setOrders(all);
  }, []);

  // Listen for open event
  useEffect(() => {
    const handler = () => {
      loadOrders();
      setOpen(true);
    };
    window.addEventListener("oga-open-order-history", handler);
    // Also reload when a new order is saved
    window.addEventListener("oga-order-saved", () => loadOrders());
    return () => {
      window.removeEventListener("oga-open-order-history", handler);
      window.removeEventListener("oga-order-saved", () => loadOrders());
    };
  }, [loadOrders]);

  function handleReorder(order: SavedOrder) {
    setOpen(false);
    // Small delay so drawer closes first
    setTimeout(() => {
      window.location.hash = `order=${order.orderHash}`;
      window.dispatchEvent(
        new CustomEvent("oga-open-order-builder", {
          detail: {
            product: order.productType,
            volumeIndex: undefined, // will be restored from hash
            fromHistory: true,
          },
        })
      );
      // Force hash-based restoration
      window.location.reload();
    }, 300);
  }

  function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: {
          sx: { width: { xs: "100%", sm: 380 }, p: 0 },
        },
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-heading">
            My Orders
          </h2>
          <IconButton onClick={() => setOpen(false)} aria-label="Close" size="small">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-muted text-sm">No orders yet</p>
            <p className="text-muted text-xs mt-1">Orders placed via the Order Builder will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.ref}
                className="border border-light-grey rounded-xl p-4 hover:border-teal transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono text-muted">{order.ref}</span>
                    <h3 className="text-sm font-semibold text-heading mt-0.5">
                      {order.quantity}x {order.volume} {order.productName}
                    </h3>
                  </div>
                  <span className="text-teal font-bold text-sm">{order.total}</span>
                </div>

                <div className="text-xs text-muted space-y-0.5">
                  <p>{formatDate(order.timestamp)}</p>
                  {order.deliveryState && (
                    <p>Delivery: {order.deliveryState} ({order.deliveryZone})</p>
                  )}
                  {order.branding && <p>+ Custom branding</p>}
                </div>

                <button
                  type="button"
                  onClick={() => handleReorder(order)}
                  className="mt-3 w-full py-2 rounded-lg text-xs font-semibold text-teal border border-teal/30 hover:bg-teal/5 transition-colors cursor-pointer"
                >
                  Reorder
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}
