// OGA PLASTIC — Delivery zone pricing (estimated, ex-factory from Ugep, Cross River State)

export interface DeliveryZone {
  id: "A" | "B" | "C" | "D";
  name: string;
  states: string[];
  baseRange: [number, number]; // [min, max] in Naira for smallest product
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "A",
    name: "Local",
    states: ["Cross River", "Akwa Ibom", "Rivers"],
    baseRange: [15_000, 25_000],
  },
  {
    id: "B",
    name: "South-South / South-East",
    states: ["Bayelsa", "Delta", "Edo", "Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
    baseRange: [25_000, 45_000],
  },
  {
    id: "C",
    name: "South-West / North-Central",
    states: ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti", "Kwara", "Kogi", "Benue", "Plateau", "Nassarawa", "Niger", "FCT"],
    baseRange: [45_000, 75_000],
  },
  {
    id: "D",
    name: "North / Far Regions",
    states: ["Kaduna", "Kano", "Katsina", "Bauchi", "Gombe", "Adamawa", "Taraba", "Borno", "Yobe", "Jigawa", "Zamfara", "Sokoto", "Kebbi"],
    baseRange: [75_000, 120_000],
  },
];

// Flat map: state name → zone ID
export const STATE_TO_ZONE: Record<string, string> = {};
for (const zone of DELIVERY_ZONES) {
  for (const state of zone.states) {
    STATE_TO_ZONE[state] = zone.id;
  }
}

// All states sorted alphabetically
export const ALL_STATES = Object.keys(STATE_TO_ZONE).sort();

/** Estimate delivery cost. Returns [min, max] range. Larger tanks and higher quantities cost more. */
export function estimateDelivery(
  zoneId: string,
  volumeL: number,
  quantity: number
): [number, number] {
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
  if (!zone) return [0, 0];
  const [baseMin, baseMax] = zone.baseRange;
  // Scale by product size (750L = 1x, 10000L = ~2.2x)
  const sizeMultiplier = 1 + (volumeL - 750) / 8000;
  // Scale by quantity (per-trip batching: every 5 units = 1 trip)
  const trips = Math.ceil(quantity / 5);
  return [
    Math.round(baseMin * sizeMultiplier * trips),
    Math.round(baseMax * sizeMultiplier * trips),
  ];
}
