// WhatsApp conversion funnel — context-aware URL builder

const SALES_NUMBER = "2348089155234";
const SUPPORT_NUMBER = "2347070201435";

export type WhatsAppContext =
  | { type: "general" }
  | { type: "product"; product: string; volume?: string }
  | { type: "quote"; name: string; product: string; quantity?: string; details?: string }
  | { type: "pricing"; product: string; volume: string; price: string }
  | { type: "order"; product: string; volume: string; quantity: number; unitPrice: number; total: number };

export function buildWhatsAppUrl(
  context: WhatsAppContext,
  line: "sales" | "support" = "sales"
): string {
  const number = line === "sales" ? SALES_NUMBER : SUPPORT_NUMBER;
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
  }
}

// Re-export for use in WhatsAppButton
export { SALES_NUMBER, SUPPORT_NUMBER };
