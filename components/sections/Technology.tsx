import Image from "next/image";
import { SectionTag } from "@/components/ui/SectionTag";

const TECH_FEATURES = [
  {
    title: "Rotational Moulding",
    description:
      "Our primary process delivers uniform wall thickness, seamless construction with no weld points, high impact resistance, and the ability to produce complex shapes in various sizes.",
  },
  {
    title: "Triple-Layer Architecture",
    description:
      "Inner white layer for content visibility, UV-stabilised middle core that blocks harmful sunlight, and a weather-resistant outer shell engineered for decades of service.",
  },
  {
    title: "Climate Engineering",
    description:
      "Every product is specifically designed and tested for high heat exposure, intense UV radiation, and year-round outdoor installation in Nigeria's tropical climate.",
  },
];

const STATS = [
  "Seamless Construction",
  "Uniform Wall Thickness",
  "8–10 Year Lifespan",
  "Food-Grade Certified",
];

export function Technology() {
  return (
    <section id="technology" className="py-24 bg-sand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <SectionTag>HOW WE BUILD</SectionTag>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-teal-deep">
            Engineering for{" "}
            <em className="italic font-normal text-teal">Africa&apos;s Climate</em>
          </h2>
        </div>

        {/* Three-column features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {TECH_FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="reveal card-hover bg-white rounded-2xl p-8 border border-light-grey text-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {i === 0 && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
                  )}
                  {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
                  {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                  {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />}
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-teal-deep mb-3">
                {feature.title}
              </h3>
              <p className="text-grey text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Triple-layer diagram */}
        <div className="reveal bg-white rounded-2xl p-8 border border-light-grey mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-xl font-bold text-teal-deep mb-4">
                Triple-Layer Cross-Section
              </h3>
              <div className="space-y-4">
                {[
                  { layer: "Inner Layer", color: "#FFFFFF", border: "#E8EDEF", desc: "White — content visibility, easy monitoring" },
                  { layer: "Middle Layer", color: "#1A1A1A", border: "#1A1A1A", desc: "UV core — blocks harmful sunlight" },
                  { layer: "Outer Layer", color: "#3D4A4F", border: "#3D4A4F", desc: "Weather shell — engineered for durability" },
                ].map((l) => (
                  <div key={l.layer} className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 border-2"
                      style={{ background: l.color, borderColor: l.border }}
                    />
                    <div>
                      <div className="font-semibold text-sm text-teal-deep">{l.layer}</div>
                      <div className="text-xs text-grey">{l.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/tank-inner-layer.png"
                alt="Triple-layer tank cross-section showing inner white layer"
                width={300}
                height={300}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Stats band */}
        <div
          className="rounded-2xl p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{
            background: "linear-gradient(135deg, var(--oga-teal-deep) 0%, var(--oga-teal-dark) 100%)",
          }}
        >
          {STATS.map((stat) => (
            <div key={stat} className="text-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-white font-semibold text-sm">{stat}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
