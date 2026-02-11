import { SectionTag } from "@/components/ui/SectionTag";

const FEATURES = [
  {
    title: "Recyclable Materials",
    description: "All products manufactured with recyclable plastic, using virgin food-grade polyethylene for safety and sustainability.",
  },
  {
    title: "Waste Management Support",
    description: "Our bins enable effective collection and recycling programs for municipalities, institutions, and commercial facilities.",
  },
  {
    title: "Long-Life Products",
    description: "Engineered to last 8–10+ years, reducing replacement waste and the environmental impact of plastic manufacturing.",
  },
];

export function Sustainability() {
  return (
    <section
      id="sustainability"
      className="py-24"
      style={{
        background: "linear-gradient(135deg, var(--oga-teal) 0%, var(--oga-teal-dark) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <span className="section-tag !text-green-accent before:!bg-green-accent">
            OUR COMMITMENT
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Building{" "}
            <em className="italic font-normal text-gold-light">Responsibly</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => (
            <div key={feature.title} className="reveal text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
                  {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />}
                  {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
