import Image from "next/image";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--oga-teal-deep) 0%, var(--oga-teal) 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/10" />
      <div className="absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full border border-white/5" />
      <div className="absolute top-20 -left-24 w-[300px] h-[300px] rounded-full bg-white/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text column */}
          <div className="hero-stagger">
            {/* Badge */}
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-logo-green animate-pulse" />
                Proudly Nigerian Manufacturing
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-6 leading-tight">
              Building Africa&apos;s Future,{" "}
              <em className="font-normal italic text-gold-light">
                One Tank at a Time
              </em>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-white/70 mt-6 max-w-xl leading-relaxed">
              High-quality, durable plastic water tanks and waste bins engineered
              for Africa&apos;s toughest conditions. Trusted by government,
              institutions, and businesses across Nigeria.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a href="#products" className="btn-gold">
                Explore Products
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a href="#contact" className="btn-outline">
                Request a Quote
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/15">
              {[
                { value: "8–10yr", label: "UV Protection" },
                { value: "5000L", label: "Max Tank Capacity" },
                { value: "1000L", label: "Max Bin Size" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gold-light">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-teal/30 to-transparent rounded-3xl" />
              <Image
                src="/images/water-tank-main.png"
                alt="OGA PLASTIC Water Storage Tank — triple-layer rotomoulded"
                width={500}
                height={600}
                className="relative z-10 drop-shadow-2xl"
                priority
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-5 py-3 shadow-xl z-20">
                <div className="text-xs text-grey uppercase tracking-wider">
                  Made in
                </div>
                <div className="text-sm font-bold text-teal-deep">
                  Nigeria 🇳🇬
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
