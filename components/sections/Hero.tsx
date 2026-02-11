"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { heroScene } from "@/components/canvas/scenes/hero-scene";

/** Animated counter that counts up from 0 to target */
function AnimatedStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 2000;
        const animate = (now: number) => {
          const elapsed = now - start - delay;
          if (elapsed < 0) {
            requestAnimationFrame(animate);
            return;
          }
          const t = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - t, 3);
          setCount(Math.round(eased * value));
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref}>
      <div className="text-2xl sm:text-3xl font-bold text-gold-light tabular-nums">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--oga-teal-deep) 0%, var(--oga-teal) 50%, var(--oga-teal-dark) 100%)",
      }}
    >
      {/* Canvas background */}
      <AnimatedCanvas
        skin={heroScene}
        className="absolute inset-0 z-0"
        tickRate={1}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text column */}
          <div className="hero-stagger">
            {/* Badge */}
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
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
              <a href="#products" className="btn-gold group">
                Explore Products
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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

            {/* Animated Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/15">
              <AnimatedStat value={10} suffix="yr" label="UV Protection" delay={0} />
              <AnimatedStat value={5000} suffix="L" label="Max Tank Capacity" delay={200} />
              <AnimatedStat value={1000} suffix="L" label="Max Bin Size" delay={400} />
            </div>
          </div>

          {/* Image column — dramatic entrance */}
          <div className="hidden lg:flex justify-center">
            <div className="relative hero-tank-entrance">
              {/* Glow behind tank */}
              <div className="absolute inset-0 -m-8 bg-gradient-radial from-gold/20 via-teal/10 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-b from-teal/20 to-transparent rounded-3xl" />
              <Image
                src="/images/water-tank-main.png"
                alt="OGA PLASTIC Water Storage Tank — triple-layer rotomoulded"
                width={500}
                height={600}
                className="relative z-10 drop-shadow-2xl hero-tank-float"
                priority
              />
              {/* "Made in Nigeria" badge */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-3 shadow-xl z-20 hero-badge-pop">
                <div className="text-xs text-grey uppercase tracking-wider">
                  Made in
                </div>
                <div className="text-sm font-bold text-teal-deep">
                  Nigeria
                </div>
              </div>
              {/* Quality badge */}
              <div className="absolute top-8 -right-2 bg-gold text-teal-deep rounded-lg px-4 py-2 shadow-lg z-20 hero-badge-pop" style={{ animationDelay: "0.3s" }}>
                <div className="text-xs font-bold uppercase tracking-wider">
                  Triple Layer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
