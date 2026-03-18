"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { createOrderTankScene, type OrderVizConfig } from "@/components/canvas/scenes/order-tank-scene";
import { TANK_PRICES, BIN_PRICES, formatNaira } from "@/lib/constants";
import { ALL_STATES, STATE_TO_ZONE, DELIVERY_ZONES, estimateDelivery } from "@/lib/delivery-zones";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { generateRefNumber, encodeOrderConfig, decodeOrderConfig, type OrderConfig, DEFAULT_ORDER } from "@/lib/order-config";
import { saveOrder, type SavedOrder } from "@/lib/order-store";
import { openPrintableQuote, type QuoteData } from "./PrintableQuote";
import { generateQRDataUrl } from "@/lib/qr";

type ProductType = "tank" | "bin" | "custom";

const PRODUCT_TABS: { id: ProductType; label: string }[] = [
  { id: "tank", label: "Water Tank" },
  { id: "bin", label: "Waste Bin" },
  { id: "custom", label: "Custom" },
];

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
  </svg>
);

export function OrderBuilder() {
  const [open, setOpen] = useState(false);
  const [productType, setProductType] = useState<ProductType>("tank");
  const [volumeIndex, setVolumeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deliveryState, setDeliveryState] = useState("");
  const [branding, setBranding] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMobile = useMediaQuery("(max-width:640px)");

  const prices = productType === "tank" ? TANK_PRICES : BIN_PRICES;
  const item = prices[volumeIndex] || prices[0];
  const unitPrice = item?.price ?? 0;
  const subtotal = unitPrice * quantity;

  // Delivery estimate
  const zoneId = STATE_TO_ZONE[deliveryState] || "";
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
  const volumeL = parseInt(item?.volume) || 750;
  const [delMin, delMax] = zoneId ? estimateDelivery(zoneId, volumeL, quantity) : [0, 0];
  const deliveryEstimate = zoneId ? `${formatNaira(delMin)}–${formatNaira(delMax)}` : "";
  const totalMin = subtotal + delMin;
  const totalMax = subtotal + delMax;
  const totalDisplay = zoneId
    ? `${formatNaira(totalMin)}–${formatNaira(totalMax)}`
    : formatNaira(subtotal);

  // Canvas config ref
  const configRef = useRef<OrderVizConfig>({
    productType: "tank",
    volumeIndex: 0,
    maxIndex: TANK_PRICES.length - 1,
  });

  useEffect(() => {
    configRef.current = {
      productType,
      volumeIndex,
      maxIndex: prices.length - 1,
    };
  }, [productType, volumeIndex, prices.length]);

  const scene = useMemo(() => createOrderTankScene(configRef), []);

  // Listen for open events from other sections
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
      if (detail?.volumeIndex != null) setVolumeIndex(detail.volumeIndex);
      if (detail?.quantity) setQuantity(detail.quantity);
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
        setVolumeIndex(config.volumeIndex);
        setQuantity(config.quantity);
        setDeliveryState(config.deliveryState);
        setBranding(config.branding);
        setOpen(true);
      }
    }
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  function handleProductChange(type: ProductType) {
    setProductType(type);
    setVolumeIndex(0);
  }

  function buildOrderDetails() {
    const ref = generateRefNumber();
    const productName = productType === "tank" ? "Water Tank" : productType === "bin" ? "Waste Bin" : "Custom Product";
    const orderHash = encodeOrderConfig({
      productType,
      volumeIndex,
      quantity,
      color: "grey",
      deliveryState,
      branding,
    });
    return { ref, productName, orderHash };
  }

  function handleOrder() {
    const { ref, productName, orderHash } = buildOrderDetails();
    const url = buildWhatsAppUrl({
      type: "catalog-order",
      ref,
      product: productName,
      volume: item.volume,
      quantity,
      unitPrice,
      subtotal,
      deliveryZone: zone ? `Zone ${zone.id} — ${zone.name}` : undefined,
      deliveryEstimate: deliveryEstimate || undefined,
      branding,
      total: totalDisplay,
    });

    // Save to IndexedDB
    const saved: SavedOrder = {
      ref,
      timestamp: Date.now(),
      productType,
      productName,
      volume: item.volume,
      quantity,
      unitPrice,
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
    const { ref, productName, orderHash } = buildOrderDetails();
    const orderUrl = `${window.location.origin}${window.location.pathname}#order=${orderHash}`;
    const qrDataUrl = generateQRDataUrl(orderUrl, 160);

    const quoteData: QuoteData = {
      ref,
      date: new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }),
      productName,
      volume: item.volume,
      quantity,
      unitPrice: formatNaira(unitPrice),
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
    const config: OrderConfig = {
      productType,
      volumeIndex,
      quantity,
      color: "grey",
      deliveryState,
      branding,
    };
    const url = `${window.location.origin}${window.location.pathname}#order=${encodeOrderConfig(config)}`;
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
      {/* Close button */}
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

      <div className={`${isMobile ? "" : "grid grid-cols-2"} overflow-y-auto`} style={{ maxHeight: isMobile ? "100vh" : "90vh" }}>
        {/* Canvas viz column */}
        <div
          className="relative bg-teal-deep"
          style={{ minHeight: isMobile ? 200 : 400 }}
        >
          <AnimatedCanvas
            skin={scene}
            className="absolute inset-0"
            tickRate={2}
            pauseOffscreen={false}
          />
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="text-white/60 text-xs">
              {productType === "custom" ? "Custom Product" : `${item.volume} ${productType === "tank" ? "Water Tank" : "Waste Bin"}`}
            </span>
          </div>
        </div>

        {/* Form column */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold text-heading">
              Build Your Order
            </h2>
            <p className="text-muted text-sm mt-1">
              Configure and order directly via WhatsApp
            </p>
          </div>

          {/* Product type tabs */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Product</label>
            <div className="flex gap-2 mt-2">
              {PRODUCT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleProductChange(tab.id)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    productType === tab.id
                      ? "bg-teal text-white shadow-md"
                      : "bg-surface-alt text-muted hover:text-heading"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          {productType !== "custom" && (
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Size</label>
              <div className="mt-2 space-y-1">
                {prices.map((p, i) => (
                  <button
                    key={p.volume}
                    type="button"
                    onClick={() => setVolumeIndex(i)}
                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm transition-all cursor-pointer ${
                      volumeIndex === i
                        ? "bg-teal/10 ring-1 ring-teal text-heading font-medium"
                        : "hover:bg-surface-alt text-body"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                        volumeIndex === i ? "border-teal bg-teal" : "border-light-grey"
                      }`} />
                      {p.volume} {"type" in p ? (p as { type: string }).type : ""}
                    </span>
                    <span className={`font-bold ${volumeIndex === i ? "text-teal" : "text-muted"}`}>
                      {formatNaira(p.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {productType === "custom" && (
            <div className="bg-surface-alt rounded-xl p-4 text-sm text-muted">
              Custom products are manufactured to your specifications. Describe your requirements in the WhatsApp message and our team will provide a detailed quote.
            </div>
          )}

          {/* Quantity */}
          {productType !== "custom" && (
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Quantity</label>
              <div className="flex items-center gap-0 mt-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center rounded-l-lg bg-surface-alt text-heading hover:bg-light-grey transition-colors text-lg font-bold cursor-pointer"
                >
                  &minus;
                </button>
                <span className="w-14 h-11 flex items-center justify-center bg-surface-alt/50 text-heading font-bold tabular-nums border-x border-light-grey">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center rounded-r-lg bg-surface-alt text-heading hover:bg-light-grey transition-colors text-lg font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
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
          {productType !== "custom" && (
            <div className="bg-surface-alt rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{item.volume} x {quantity}</span>
                <span className="text-heading font-bold">{formatNaira(subtotal)}</span>
              </div>
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
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] cursor-pointer"
              style={{ backgroundColor: "#25D366" }}
            >
              {WA_ICON}
              {productType === "custom" ? "Request Quote on WhatsApp" : "Order via WhatsApp"}
            </button>

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
          </div>
        </div>
      </div>
    </Dialog>
  );
}
