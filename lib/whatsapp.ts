// WhatsApp conversion funnel — context-aware URL builder
// ──────────────────────────────────────────────────────
// Configure lines here. Each line has a name and number.
// The first line in the list is the default for sales.

export interface WhatsAppLine {
  name: string;
  number: string; // International format, digits only (e.g. "2348033585187")
}

export const WHATSAPP_LINES: WhatsAppLine[] = [
  { name: "sales", number: "2348033585187" },
  { name: "support", number: "2348089155234" },
];

function getLine(name: string): string {
  const line = WHATSAPP_LINES.find((l) => l.name === name);
  return line?.number ?? WHATSAPP_LINES[0].number;
}

export type WhatsAppContext =
  | { type: "general" }
  | { type: "product"; product: string; volume?: string }
  | { type: "quote"; name: string; product: string; quantity?: string; details?: string }
  | { type: "pricing"; product: string; volume: string; price: string }
  | { type: "order"; product: string; volume: string; quantity: number; unitPrice: number; total: number }
  | { type: "catalog-order"; ref: string; product: string; volume: string; quantity: number; unitPrice: number; subtotal: number; deliveryZone?: string; deliveryEstimate?: string; branding: boolean; total: string };

export function buildWhatsAppUrl(
  context: WhatsAppContext,
  line: string = "sales"
): string {
  const number = getLine(line);
  const text = buildMessage(context);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function formatPrice(amount: number): string {
  return "\u20A6" + amount.toLocaleString("en-NG");
}

function buildMessage(ctx: WhatsAppContext): string {
  switch (ctx.type) {
    case "general":
      return "Hello OGA PLASTIC! I found you on your website and I'd like to enquire about your products. What do you have available?";
    case "product":
      return `Hello! I'm interested in your ${ctx.product}${ctx.volume ? ` (${ctx.volume})` : ""}.\n\nPlease share:\n- Available sizes & prices\n- Delivery to my area\n- Current lead time`;
    case "quote":
      return [
        `Hello! I'd like a quote from OGA PLASTIC:`,
        ``,
        `Name: ${ctx.name}`,
        `Product: ${ctx.product}`,
        ctx.quantity ? `Quantity: ${ctx.quantity}` : "",
        ctx.details ? `Details: ${ctx.details}` : "",
        ``,
        `Please advise on pricing, delivery cost to my location, and lead time.`,
      ]
        .filter(Boolean)
        .join("\n");
    case "pricing":
      return `Hello! I'd like to order a ${ctx.product} ${ctx.volume} (listed at ${ctx.price}).\n\nPlease confirm:\n1. Availability\n2. Delivery cost to my area\n3. Lead time`;
    case "order":
      return [
        `Hello! I'd like to place an order:`,
        ``,
        `Product: ${ctx.product}`,
        `Size: ${ctx.volume}`,
        `Quantity: ${ctx.quantity}`,
        `Unit price: ${formatPrice(ctx.unitPrice)}`,
        `Total: ${formatPrice(ctx.total)}`,
        ``,
        `Please confirm availability and delivery cost to my location.`,
      ].join("\n");
    case "catalog-order":
      return [
        `ORDER ${ctx.ref}`,
        `========================`,
        `Product: ${ctx.product}`,
        `Size: ${ctx.volume}`,
        `Qty: ${ctx.quantity} x ${formatPrice(ctx.unitPrice)}`,
        `Subtotal: ${formatPrice(ctx.subtotal)}`,
        ``,
        ctx.deliveryZone ? `Delivery: ${ctx.deliveryZone}` : "",
        ctx.deliveryEstimate ? `Est. delivery: ${ctx.deliveryEstimate}` : "",
        ctx.branding ? `Branding: Yes (custom)` : "",
        ``,
        `ESTIMATED TOTAL: ${ctx.total}`,
        `========================`,
        `Prices are ex-factory. Delivery`,
        `estimate to be confirmed.`,
        ``,
        `Reply YES to confirm this order.`,
      ]
        .filter(Boolean)
        .join("\n");
  }
}

// Legacy aliases for backward compatibility
export const SALES_NUMBER = getLine("sales");
export const SUPPORT_NUMBER = getLine("support");
