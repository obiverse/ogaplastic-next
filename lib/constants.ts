// OGA PLASTIC Manufacturing Nigeria Limited — Brand & Product Data

export const COMPANY = {
  name: "OGA PLASTIC Manufacturing Nigeria Limited",
  shortName: "OGA PLASTIC",
  rc: "8025085",
  tin: "32372196-0001",
  address: "№1, Lokpema Road, Along Ediba Road, Ugep, Cross River State, Nigeria",
  phones: ["+234(0)8033585187", "+234(0)8089155234"],
  email: "ogaplastic@gmail.com",
  mission:
    "To manufacture and supply high-quality, durable plastic products using advanced technology and skilled expertise, while maintaining affordability, reliability, and customer satisfaction.",
  vision:
    "To become a leading plastic manufacturing company in Africa, delivering world-class plastic solutions that support infrastructure development, environmental sustainability, and economic growth across the continent.",
  tagline: "Quality plastic solutions across Nigeria and Africa",
  description:
    "OGA PLASTIC is a Nigerian industrial plastic manufacturing company producing durable water storage tanks, waste bins, and custom plastic infrastructure products using rotational moulding technology. Products are engineered for Africa's climate conditions with UV-stabilised, food-grade materials and minimum 25-year lifespans.",
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
  { volume: "10000L", type: "Vertical", price: 680000 },
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
    title: "Double-Layer Build",
    description:
      "Inner white food-grade layer for visibility, UV-stabilised outer shell for weather resistance",
  },
  {
    title: "Food-Grade Material",
    description: "LLDPE/HDPE certified safe for potable water storage",
  },
  {
    title: "UV Protection",
    description:
      "Stabilised for 25 years under intense Nigerian tropical sun",
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
    metric: "36 States",
  },
  {
    title: "Construction Firms",
    description:
      "Site water storage, temporary and permanent installations",
    metric: "500+ Sites",
  },
  {
    title: "Agricultural Enterprises",
    description: "Water storage for farms and irrigation support",
    metric: "10,000+ Farms",
  },
  {
    title: "Commercial Developers",
    description: "Estate-wide water and waste solutions",
    metric: "200+ Estates",
  },
  {
    title: "Residential Estates",
    description: "Domestic water tanks and community bins",
    metric: "50,000+ Homes",
  },
  {
    title: "Institutions",
    description:
      "Schools, hospitals, churches, mosques — durable utility products",
    metric: "300+ Served",
  },
] as const;

export const SPECIFICATIONS = [
  {
    title: "Tank Configuration",
    description:
      "Vertical, up to 10,000L, integrated moulded support cradles (3–4 legs)",
  },
  {
    title: "Material & Build",
    description:
      "Food-grade LLDPE/HDPE, rotomoulding, industrial wall thickness, UV 25yr",
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
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Products", href: "#products" },
    { label: "Technology", href: "#technology" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
  products: [
    { label: "Water Tanks", href: "#products" },
    { label: "Waste Bins", href: "#products" },
    { label: "Custom Products", href: "#products" },
    { label: "Request Quote", href: "#contact" },
  ],
} as const;

export const FAQS = [
  {
    question: "What sizes of water tanks do you offer?",
    answer:
      "We manufacture vertical water storage tanks from 750 litres up to 10,000 litres. All sizes feature our double-layer construction with UV-stabilised, food-grade materials. Custom sizes are available on request.",
  },
  {
    question: "How long do your tanks last?",
    answer:
      "Our tanks are engineered for a minimum 25-year lifespan under Nigeria's intense tropical sun. The UV-stabilised outer shell protects against degradation, while the seamless rotomoulded construction prevents cracks and leaks.",
  },
  {
    question: "Are your products safe for drinking water?",
    answer:
      "Yes. Our water tanks use food-grade LLDPE/HDPE materials with an inner white layer certified safe for potable water storage. The white interior also makes it easy to monitor water levels and cleanliness.",
  },
  {
    question: "Can you add our company logo to the tanks?",
    answer:
      "Absolutely. We offer in-mould branding (permanent, moulded into the product) and UV-resistant screen printing. Government tagging, batch numbers, and 'Property of' markings are also available.",
  },
  {
    question: "Do you deliver nationwide?",
    answer:
      "We deliver across Nigeria and Africa from our factory in Ugep, Cross River State. Prices shown are ex-factory. Delivery costs depend on location and order size — contact us for a delivery quote.",
  },
  {
    question: "What is the minimum order quantity?",
    answer:
      "There is no minimum order for standard products — you can order a single tank or bin. For custom-branded or bespoke products, minimum quantities may apply depending on the specification. Contact us to discuss your needs.",
  },
  {
    question: "Do you offer waste bins for municipalities?",
    answer:
      "Yes. Our rotomoulded waste bins range from 50L residential bins to 1,000L industrial containers. They are built for outdoor use, UV-resistant, and available in custom colours for municipal branding and recycling programmes.",
  },
  {
    question: "How do I request a quote?",
    answer:
      "Use the contact form on this page, call us directly, or send us a WhatsApp message. We respond to all enquiries within 24 hours with detailed pricing and delivery information.",
  },
] as const;

export const SOCIALS = [
  { name: "WhatsApp", icon: "W", href: "https://wa.me/2348089155234" },
  { name: "Email", icon: "E", href: "mailto:ogaplastic@gmail.com" },
  { name: "Phone", icon: "P", href: "tel:+2348033585187" },
] as const;

export const COMMERCIAL_FAQS = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer (all Nigerian banks), cash on delivery for local orders, and government purchase orders for institutional buyers. Payment terms are available for bulk orders.",
    cta: { label: "Chat with sales about payment", type: "whatsapp" as const },
  },
  {
    question: "How much does delivery cost?",
    answer:
      "All listed prices are ex-factory (Ugep, Cross River State). Delivery cost depends on your location and order size. We deliver nationwide across Nigeria and can arrange transport to any African destination.",
    cta: { label: "Get a delivery quote", type: "whatsapp" as const },
  },
  {
    question: "Do you offer bulk discounts?",
    answer:
      "Yes. Orders of 10+ units receive volume pricing. Government and institutional buyers ordering 50+ units benefit from our partnership pricing. Contact our sales team for a custom quotation.",
    cta: { label: "Request bulk pricing", type: "whatsapp" as const },
  },
  {
    question: "What is the production lead time?",
    answer:
      "Standard products (tanks and bins in stock colours) ship within 3\u20137 working days. Custom-branded and bespoke products require 2\u20134 weeks depending on specification and quantity.",
    cta: { label: "Check current availability", type: "whatsapp" as const },
  },
  {
    question: "What warranty do your products carry?",
    answer:
      "Water tanks carry a 25-year UV and structural warranty. Waste bins carry a 10-year structural warranty. All products are guaranteed against manufacturing defects. Warranty covers normal outdoor use in Nigerian climate conditions.",
  },
] as const;

export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}
