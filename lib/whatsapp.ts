// WhatsApp conversion funnel — context-aware URL builder

const SALES_NUMBER = "2348089155234";
const SUPPORT_NUMBER = "2347070201435";

export type WhatsAppContext =
  | { type: "general" }
  | { type: "product"; product: string; volume?: string }
  | { type: "quote"; name: string; product: string; quantity?: string; details?: string }
  | { type: "pricing"; product: string; volume: string; price: string };

export function buildWhatsAppUrl(
  context: WhatsAppContext,
  line: "sales" | "support" = "sales"
): string {
  const number = line === "sales" ? SALES_NUMBER : SUPPORT_NUMBER;
  const text = buildMessage(context);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function buildMessage(ctx: WhatsAppContext): string {
  switch (ctx.type) {
    case "general":
      return "Hello, I'd like to enquire about OGA PLASTIC products.";
    case "product":
      return `Hello, I'm interested in your ${ctx.product}${ctx.volume ? ` (${ctx.volume})` : ""}. Please share details on availability and pricing.`;
    case "quote":
      return [
        "Hello, I'd like to request a quote:",
        "",
        `Product: ${ctx.product}`,
        ctx.quantity ? `Quantity: ${ctx.quantity}` : "",
        ctx.details ? `Details: ${ctx.details}` : "",
        "",
        "Please advise on pricing and delivery.",
      ]
        .filter(Boolean)
        .join("\n");
    case "pricing":
      return `Hello, I'd like to order a ${ctx.product} ${ctx.volume} (listed at ${ctx.price}). Please confirm availability and delivery options.`;
  }
}

// Re-export for use in WhatsAppButton
export { SALES_NUMBER, SUPPORT_NUMBER };
