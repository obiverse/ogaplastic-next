"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TANK_PRICES, BIN_PRICES, formatNaira } from "@/lib/constants";
import { ALL_STATES, STATE_TO_ZONE, DELIVERY_ZONES, estimateDelivery } from "@/lib/delivery-zones";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { generateRefNumber, encodeOrderConfig, decodeOrderConfig } from "@/lib/order-config";
import { saveOrder, type SavedOrder } from "@/lib/order-store";
import { openPrintableQuote, type QuoteData } from "./PrintableQuote";
import { generateQRDataUrl } from "@/lib/qr";
import { asset } from "@/lib/basepath";

type ProductType = "tank" | "bin" | "custom";

interface CartItem {
  volume: string;
  type?: string;
  price: number;
  quantity: number;
}

const PRODUCT_TABS: { id: ProductType; label: string; image: string }[] = [
  { id: "tank", label: "Water Tanks", image: "/images/water-tank-main.png" },
  { id: "bin", label: "Waste Bins", image: "/images/waste-bin-drawing.png" },
  { id: "custom", label: "Custom", image: "/images/tank-inner-layer.png" },
];

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
  </svg>
);

function initCart(prices: readonly { volume: string; price: number; type?: string }[]): CartItem[] {
  return prices.map((p) => ({
    volume: p.volume,
    type: "type" in p ? (p as { type: string }).type : undefined,
    price: p.price,
    quantity: 0,
  }));
}

export function OrderBuilder() {
  const [open, setOpen] = useState(false);
  const [productType, setProductType] = useState<ProductType>("tank");
  const [tankCart, setTankCart] = useState<CartItem[]>(() => initCart(TANK_PRICES));
  const [binCart, setBinCart] = useState<CartItem[]>(() => initCart(BIN_PRICES));
  const [deliveryState, setDeliveryState] = useState("");
  const [branding, setBranding] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMobile = useMediaQuery("(max-width:640px)");

  const cart = productType === "tank" ? tankCart : binCart;
  const setCart = productType === "tank" ? setTankCart : setBinCart;
  const activeItems = cart.filter((item) => item.quantity > 0);
  const hasItems = activeItems.length > 0;

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Delivery — use the largest item for estimate
  const zoneId = STATE_TO_ZONE[deliveryState] || "";
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
  const largestVolume = activeItems.length > 0
    ? Math.max(...activeItems.map((item) => parseInt(item.volume) || 750))
    : 750;
  const [delMin, delMax] = zoneId ? estimateDelivery(zoneId, largestVolume, totalQty) : [0, 0];
  const deliveryEstimate = zoneId ? `${formatNaira(delMin)}–${formatNaira(delMax)}` : "";
  const totalMin = subtotal + delMin;
  const totalMax = subtotal + delMax;
  const totalDisplay = zoneId
    ? `${formatNaira(totalMin)}–${formatNaira(totalMax)}`
    : formatNaira(subtotal);

  const tab = PRODUCT_TABS.find((t) => t.id === productType)!;

  // Update cart item quantity
  function updateQty(index: number, delta: number) {
    setCart((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: Math.max(0, next[index].quantity + delta) };
      return next;
    });
  }

  function setQty(index: number, qty: number) {
    setCart((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: Math.max(0, qty) };
      return next;
    });
  }

  // Listen for open events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.product === "tank" || detail?.product === "tanks") {
        setProductType("tank");
      } else if (detail?.product === "bin" || detail?.product === "bins") {
        setProductType("bin");
      } else if (detail?.product === "custom") {
        setProductType("custom");
      }
      // Pre-fill a specific item if index+quantity provided
      if (detail?.volumeIndex != null && detail?.quantity) {
        const targetCart = detail.product === "bin" || detail.product === "bins" ? initCart(BIN_PRICES) : initCart(TANK_PRICES);
        targetCart[detail.volumeIndex] = {
          ...targetCart[detail.volumeIndex],
          quantity: detail.quantity,
        };
        if (detail.product === "bin" || detail.product === "bins") {
          setBinCart(targetCart);
        } else {
          setTankCart(targetCart);
        }
      }
      setOpen(true);
    };
    window.addEventListener("oga-open-order-builder", handler);
    return () => window.removeEventListener("oga-open-order-builder", handler);
  }, []);

  // Hash restoration
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#order=")) {
      const config = decodeOrderConfig(hash.slice(7));
      if (config) {
        setProductType(config.productType);
        setDeliveryState(config.deliveryState);
        setBranding(config.branding);
        // Restore single-item for backward compat
        if (config.volumeIndex != null && config.quantity) {
          const targetCart = config.productType === "bin" ? initCart(BIN_PRICES) : initCart(TANK_PRICES);
          if (targetCart[config.volumeIndex]) {
            targetCart[config.volumeIndex].quantity = config.quantity;
          }
          if (config.productType === "bin") setBinCart(targetCart);
          else setTankCart(targetCart);
        }
        setOpen(true);
      }
    }
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  function handleProductChange(type: ProductType) {
    setProductType(type);
  }

  function buildCartSummary() {
    const ref = generateRefNumber();
    const productName = productType === "tank" ? "Water Tank" : productType === "bin" ? "Waste Bin" : "Custom Product";
    return { ref, productName };
  }

  function buildMultiLineMessage() {
    const { ref, productName } = buildCartSummary();
    const lines = [
      `ORDER ${ref}`,
      `========================`,
    ];
    for (const item of activeItems) {
      lines.push(`${item.quantity}x ${item.volume} ${productName} @ ${formatNaira(item.price)} = ${formatNaira(item.price * item.quantity)}`);
    }
    lines.push(``, `Subtotal: ${formatNaira(subtotal)}`);
    if (zone) {
      lines.push(`Delivery: Zone ${zone.id} — ${zone.name}`);
      lines.push(`Est. delivery: ${deliveryEstimate}`);
    }
    if (branding) lines.push(`Branding: Yes (custom logo)`);
    lines.push(``, `ESTIMATED TOTAL: ${totalDisplay}`, `========================`);
    lines.push(`Prices ex-factory. Delivery estimate`, `to be confirmed by our team.`);
    lines.push(``, `Reply YES to confirm this order.`);
    return { ref, message: lines.join("\n") };
  }

  function handleOrder() {
    const { ref, message } = buildMultiLineMessage();
    const { productName } = buildCartSummary();
    const number = "2348033585187"; // from WHATSAPP_LINES[0]
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    // Save to IndexedDB (save first active item as primary for history display)
    const primary = activeItems[0];
    const orderHash = encodeOrderConfig({
      productType,
      volumeIndex: cart.indexOf(primary),
      quantity: primary?.quantity ?? 1,
      color: "grey",
      deliveryState,
      branding,
    });

    const saved: SavedOrder = {
      ref,
      timestamp: Date.now(),
      productType,
      productName,
      volume: activeItems.map((i) => `${i.quantity}x ${i.volume}`).join(", "),
      quantity: totalQty,
      unitPrice: 0,
      subtotal,
      deliveryState,
      deliveryZone: zone ? `Zone ${zone.id}` : "",
      deliveryEstimate,
      branding,
      total: totalDisplay,
      orderHash,
    };
    saveOrder(saved).then(() => {
      window.dispatchEvent(new Event("oga-order-saved"));
    });

    window.open(url, "_blank");
  }

  function handlePrintQuote() {
    const { ref } = buildCartSummary();
    const productName = productType === "tank" ? "Water Tank" : "Waste Bin";
    const orderHash = encodeOrderConfig({
      productType,
      volumeIndex: 0,
      quantity: totalQty,
      color: "grey",
      deliveryState,
      branding,
    });
    const orderUrl = `${window.location.origin}${window.location.pathname}#order=${orderHash}`;
    const qrDataUrl = generateQRDataUrl(orderUrl, 160);

    const quoteData: QuoteData = {
      ref,
      date: new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }),
      productName,
      volume: activeItems.map((i) => `${i.quantity}x ${i.volume}`).join(", "),
      quantity: totalQty,
      unitPrice: activeItems.length === 1 ? formatNaira(activeItems[0].price) : "Multiple",
      subtotal: formatNaira(subtotal),
      deliveryState,
      deliveryZone: zone ? `Zone ${zone.id} — ${zone.name}` : "",
      deliveryEstimate,
      branding,
      total: totalDisplay,
      qrDataUrl,
    };
    openPrintableQuote(quoteData);
  }

  function handleShare() {
    const orderHash = encodeOrderConfig({
      productType,
      volumeIndex: 0,
      quantity: totalQty,
      color: "grey",
      deliveryState,
      branding,
    });
    const url = `${window.location.origin}${window.location.pathname}#order=${orderHash}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: isMobile ? "100%" : "90vh",
          },
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        aria-label="Close order builder"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          bgcolor: "rgba(0,0,0,0.05)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </IconButton>

      <div className={`${isMobile ? "" : "grid grid-cols-5"} overflow-y-auto`} style={{ maxHeight: isMobile ? "100vh" : "90vh" }}>
        {/* Product image column — 2/5 width */}
        <div
          className={`relative bg-teal-deep flex items-center justify-center ${isMobile ? "" : "col-span-2"}`}
          style={{ minHeight: isMobile ? 180 : "auto" }}
        >
          <div className="relative p-6">
            <Image
              src={asset(tab.image)}
              alt={tab.label}
              width={280}
              height={320}
              className="object-contain drop-shadow-2xl max-h-[280px]"
              style={{ maxWidth: "100%", height: "auto" }}
              priority
            />
          </div>
          {hasItems && (
            <div className="absolute bottom-3 left-3 right-3 text-center">
              <span className="inline-flex items-center gap-1.5 bg-gold/90 text-teal-deep px-3 py-1 rounded-full text-xs font-bold">
                {totalQty} item{totalQty !== 1 ? "s" : ""} in order
              </span>
            </div>
          )}
        </div>

        {/* Form column — 3/5 width */}
        <div className={`p-6 space-y-5 ${isMobile ? "" : "col-span-3"}`}>
          <div>
            <h2 className="font-display text-xl font-bold text-heading">
              Build Your Order
            </h2>
            <p className="text-muted text-sm mt-1">
              Select sizes and quantities, then order via WhatsApp
            </p>
          </div>

          {/* Product type tabs */}
          <div className="flex gap-2">
            {PRODUCT_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleProductChange(t.id)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  productType === t.id
                    ? "bg-teal text-white shadow-md"
                    : "bg-surface-alt text-muted hover:text-heading"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Multi-item size selector with per-row quantity */}
          {productType !== "custom" ? (
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                Select sizes &amp; quantities
              </label>
              <div className="mt-2 space-y-1.5">
                {cart.map((item, i) => (
                  <div
                    key={item.volume}
                    className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all ${
                      item.quantity > 0
                        ? "bg-teal/10 ring-1 ring-teal/40"
                        : "hover:bg-surface-alt"
                    }`}
                  >
                    {/* Volume + price */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm ${item.quantity > 0 ? "text-heading font-medium" : "text-body"}`}>
                        {item.volume} {item.type || ""}
                      </span>
                      <span className={`text-sm ml-2 ${item.quantity > 0 ? "text-teal font-bold" : "text-muted"}`}>
                        {formatNaira(item.price)}
                      </span>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-0 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQty(i, -1)}
                        disabled={item.quantity === 0}
                        className="w-9 h-9 flex items-center justify-center rounded-l-lg bg-surface-alt text-heading hover:bg-light-grey disabled:opacity-30 transition-colors text-sm font-bold cursor-pointer disabled:cursor-default"
                      >
                        &minus;
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) => setQty(i, parseInt(e.target.value) || 0)}
                        className="w-10 h-9 text-center bg-surface-alt/50 text-heading font-bold tabular-nums border-x border-light-grey text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateQty(i, 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-r-lg bg-surface-alt text-heading hover:bg-light-grey transition-colors text-sm font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    {item.quantity > 0 && (
                      <span className="text-xs font-bold text-teal w-20 text-right flex-shrink-0">
                        {formatNaira(item.price * item.quantity)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-surface-alt rounded-xl p-4 text-sm text-muted">
              Custom products are manufactured to your specifications. Describe your requirements in the WhatsApp message and our team will provide a detailed quote.
            </div>
          )}

          {/* Delivery zone */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Delivery State</label>
            <select
              value={deliveryState}
              onChange={(e) => setDeliveryState(e.target.value)}
              className="w-full mt-2 py-2.5 px-3 rounded-lg border border-light-grey bg-surface-card text-body text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none"
            >
              <option value="">Ex-factory (pick up)</option>
              {ALL_STATES.map((state) => (
                <option key={state} value={state}>
                  {state} — Zone {STATE_TO_ZONE[state]}
                </option>
              ))}
            </select>
            {zone && (
              <p className="text-xs text-muted mt-1.5">
                Est. delivery: {deliveryEstimate} ({zone.name})
              </p>
            )}
          </div>

          {/* Branding */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={branding}
              onChange={(e) => setBranding(e.target.checked)}
              className="w-5 h-5 rounded border-light-grey text-teal focus:ring-teal"
            />
            <span className="text-sm text-body">Add custom branding / logo</span>
          </label>

          {/* Order summary */}
          {hasItems && (
            <div className="bg-surface-alt rounded-xl p-4 space-y-2">
              {activeItems.map((item) => (
                <div key={item.volume} className="flex justify-between text-sm">
                  <span className="text-muted">
                    {item.quantity}x {item.volume} {item.type || ""}
                  </span>
                  <span className="text-heading font-bold">
                    {formatNaira(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              {zoneId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Est. delivery</span>
                  <span className="text-heading">{deliveryEstimate}</span>
                </div>
              )}
              <div className="border-t border-light-grey pt-2 flex justify-between">
                <span className="text-sm font-semibold text-heading">
                  {zoneId ? "Estimated Total" : "Subtotal"}
                </span>
                <span className="text-lg font-bold text-teal">{totalDisplay}</span>
              </div>
              {zoneId && (
                <p className="text-xs text-muted">Delivery estimate to be confirmed by our team</p>
              )}
            </div>
          )}

          {/* CTA buttons */}
          <div className="space-y-3 pb-4">
            <button
              type="button"
              onClick={handleOrder}
              disabled={!hasItems && productType !== "custom"}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#25D366" }}
            >
              {WA_ICON}
              {productType === "custom"
                ? "Request Quote on WhatsApp"
                : hasItems
                  ? `Order ${totalQty} item${totalQty !== 1 ? "s" : ""} via WhatsApp`
                  : "Select items to order"}
            </button>

            {hasItems && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrintQuote}
                  className="py-2.5 rounded-xl text-sm font-medium text-muted hover:text-heading border border-light-grey hover:border-teal transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Quote
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="py-2.5 rounded-xl text-sm font-medium text-muted hover:text-heading border border-light-grey hover:border-teal transition-all cursor-pointer"
                >
                  {copied ? "Copied!" : "Share Link"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
