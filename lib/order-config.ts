// OGA PLASTIC — Order configuration for URL sharing and state management

export interface OrderConfig {
  productType: "tank" | "bin" | "custom";
  volumeIndex: number;
  quantity: number;
  color: string;
  deliveryState: string;
  branding: boolean;
}

export const DEFAULT_ORDER: OrderConfig = {
  productType: "tank",
  volumeIndex: 0,
  quantity: 1,
  color: "grey",
  deliveryState: "",
  branding: false,
};

/** Encode order config to base64 for URL hash sharing */
export function encodeOrderConfig(config: OrderConfig): string {
  try {
    return btoa(JSON.stringify(config));
  } catch {
    return "";
  }
}

/** Decode order config from base64 hash */
export function decodeOrderConfig(hash: string): OrderConfig | null {
  try {
    const parsed = JSON.parse(atob(hash));
    if (parsed && typeof parsed.productType === "string") {
      return { ...DEFAULT_ORDER, ...parsed };
    }
    return null;
  } catch {
    return null;
  }
}

/** Generate a short reference number for order tracking */
export function generateRefNumber(): string {
  return "OGA-" + Date.now().toString(36).toUpperCase();
}
