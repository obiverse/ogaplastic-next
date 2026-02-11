// OGA PLASTIC Manufacturing Nigeria Limited — Brand & Product Data

export const COMPANY = {
  name: "OGA PLASTIC Manufacturing Nigeria Limited",
  shortName: "OGA PLASTIC",
  rc: "8025085",
  tin: "32372196-0001",
  address: "№1, Lokpema Road, Along Ediba Road, Ugep, Cross River State, Nigeria",
  phones: ["+234(0)8089155234", "+234(0)7070201435"],
  email: "ogaplastic@gmail.com",
  mission:
    "To manufacture and supply high-quality, durable plastic products using advanced technology and skilled expertise, while maintaining affordability, reliability, and customer satisfaction.",
  vision:
    "To become a leading plastic manufacturing company in Africa, delivering world-class plastic solutions that support infrastructure development, environmental sustainability, and economic growth across the continent.",
  tagline: "Quality plastic solutions engineered for Africa",
  description:
    "OGA PLASTIC is a Nigerian industrial plastic manufacturing company producing durable water storage tanks, waste bins, and custom plastic infrastructure products using rotational moulding technology. Products are engineered for Africa's climate conditions with UV-stabilised, food-grade materials and minimum 8–10 year lifespans.",
} as const;

export const VALUES = [
  {
    title: "Quality Excellence",
    description: "Strict QC throughout every production run",
  },
  {
    title: "Innovation",
    description: "Advanced rotomoulding and climate-engineered design",
  },
  {
    title: "Reliability",
    description: "Consistent performance in Africa's toughest conditions",
  },
  {
    title: "Sustainability",
    description: "Recyclable materials, long-life products",
  },
  {
    title: "Customer Focus",
    description: "Custom solutions for every client need",
  },
] as const;

export const TANK_PRICES = [
  { volume: "750L", type: "Vertical", price: 75000 },
  { volume: "1000L", type: "Vertical", price: 85000 },
  { volume: "2000L", type: "Vertical", price: 165000 },
  { volume: "3000L", type: "Vertical", price: 220000 },
  { volume: "4000L", type: "Vertical", price: 290000 },
  { volume: "5000L", type: "Vertical", price: 375000 },
] as const;

export const BIN_PRICES = [
  { volume: "50L", price: 25000 },
  { volume: "120L", price: 45000 },
  { volume: "240L", price: 80000 },
  { volume: "600L", price: 145000 },
  { volume: "1000L", price: 220000 },
] as const;

export const TANK_FEATURES = [
  {
    title: "Triple-Layer Build",
    description:
      "Inner white layer for visibility, UV-stabilised core, weather-resistant outer shell",
  },
  {
    title: "Food-Grade Material",
    description: "LLDPE/HDPE certified safe for potable water storage",
  },
  {
    title: "UV Protection",
    description:
      "Stabilised for 8–10 years under intense Nigerian tropical sun",
  },
  {
    title: "Custom Branding",
    description: "In-mould or UV-resistant screen-printed client logos",
  },
] as const;

export const BIN_FEATURES = [
  {
    title: "Heavy Duty",
    description: "Rotomoulded seamless construction for maximum durability",
  },
  {
    title: "Up to 1000L",
    description: "From residential 50L to industrial 1000L capacity",
  },
  {
    title: "Weather Resistant",
    description: "Built for outdoor Nigerian conditions year-round",
  },
  {
    title: "Custom Colours",
    description: "Branded to institutional and municipal requirements",
  },
] as const;

export const CUSTOM_FEATURES = [
  {
    title: "In-Mould Branding",
    description: "Permanent brand identity moulded into the product",
  },
  {
    title: "Government Tagging",
    description: '"Property of" marking, batch numbers, date stamps',
  },
  {
    title: "Custom Colours",
    description: "Any RAL or Pantone colour match available",
  },
  {
    title: "Bespoke Sizing",
    description: "Engineered to your exact specification and requirements",
  },
] as const;

export const INDUSTRIES = [
  {
    title: "Government Agencies",
    description:
      "Bulk procurement for public infrastructure, water storage, waste management",
  },
  {
    title: "Construction Firms",
    description:
      "Site water storage, temporary and permanent installations",
  },
  {
    title: "Agricultural Enterprises",
    description: "Water storage for farms and irrigation support",
  },
  {
    title: "Commercial Developers",
    description: "Estate-wide water and waste solutions",
  },
  {
    title: "Residential Estates",
    description: "Domestic water tanks and community bins",
  },
  {
    title: "Institutions",
    description:
      "Schools, hospitals, churches, mosques — durable utility products",
  },
] as const;

export const SPECIFICATIONS = [
  {
    title: "Tank Configuration",
    description:
      "Vertical, up to 5000L, integrated moulded support cradles (3–4 legs)",
  },
  {
    title: "Material & Build",
    description:
      "Food-grade LLDPE/HDPE, rotomoulding, industrial wall thickness, UV 8–10yr",
  },
  {
    title: "Colour & Branding",
    description:
      "Ash/Grey matte, in-mould branding, 700–900mm logo, screen print option",
  },
  {
    title: "Markings & Labels",
    description:
      'Embossed capacity, batch number, mfg date, "Property of" option',
  },
  {
    title: "Fittings & Accessories",
    description:
      "Threaded manhole, 1.5″/2″ outlet, overflow port, optional drain",
  },
  {
    title: "Quality & Compliance",
    description:
      "Potable-safe, heat/algae/crack resistant, government & institutional grade",
  },
  {
    title: "Packaging & Delivery",
    description:
      "Protective wrapping, logo protection film during transport",
  },
  {
    title: "Custom Options",
    description:
      "Custom colours, sizes, shapes, fittings, branding to client spec",
  },
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  {
    label: "Products",
    href: "#products",
    children: [
      { label: "Water Tanks", href: "#products" },
      { label: "Waste Bins", href: "#products" },
      { label: "Custom Products", href: "#products" },
    ],
  },
  { label: "Technology", href: "#technology" },
  { label: "Industries", href: "#industries" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
] as const;

export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Products", href: "#products" },
    { label: "Technology", href: "#technology" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ],
  products: [
    { label: "Water Tanks", href: "#products" },
    { label: "Waste Bins", href: "#products" },
    { label: "Custom Products", href: "#products" },
    { label: "Request Quote", href: "#contact" },
  ],
} as const;

export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}
