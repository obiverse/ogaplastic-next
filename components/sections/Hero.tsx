"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { heroScene } from "@/components/canvas/scenes/hero-scene";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { asset } from "@/lib/basepath";

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
      <div className="text-xs text-white/70 mt-1 uppercase tracking-wider">
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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text column */}
          <div className="hero-stagger">
            {/* Badge */}
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                <span className="w-2 h-2 rounded-full bg-logo-green animate-pulse" />
                Trusted by 500+ Businesses Across Nigeria
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
            <p className="text-lg text-white/80 mt-6 max-w-xl leading-relaxed">
              High-quality, durable plastic water tanks and waste bins engineered
              for Africa&apos;s toughest conditions. Trusted by government,
              institutions, and businesses across Nigeria and Africa.
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
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("oga-open-order-builder", { detail: {} }))}
                className="btn-outline"
              >
                Order Now
              </button>
              <a
                href={buildWhatsAppUrl({ type: "general" })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                </svg>
                Chat with Sales
              </a>
            </div>

            {/* Animated Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
              <AnimatedStat value={25} suffix="+" label="Years Experience" delay={0} />
              <AnimatedStat value={50000} suffix="+" label="Tanks Delivered" delay={200} />
              <AnimatedStat value={36} suffix="" label="States Covered" delay={400} />
            </div>
          </div>

          {/* Image column — dramatic entrance */}
          <div className="hidden md:flex justify-center">
            <div className="relative hero-tank-entrance">
              {/* Glow behind tank */}
              <div className="absolute inset-0 -m-8 bg-gradient-radial from-gold/20 via-teal/10 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-b from-teal/20 to-transparent rounded-3xl" />
              <Image
                src={asset("/images/water-tank-main.png")}
                alt="OGA PLASTIC Water Storage Tank — double-layer rotomoulded"
                width={500}
                height={544}
                sizes="(max-width: 768px) 0px, (max-width: 1024px) 40vw, 50vw"
                className="relative z-10 drop-shadow-2xl hero-tank-float max-w-full h-auto"
                priority
              />
              {/* "Made in Nigeria" badge */}
              <div className="absolute -bottom-4 -left-4 bg-surface-card/95 backdrop-blur-sm rounded-xl px-5 py-3 shadow-xl z-20 hero-badge-pop border border-border-subtle">
                <div className="text-xs text-muted uppercase tracking-wider">
                  Made in
                </div>
                <div className="text-sm font-bold text-heading">
                  Nigeria
                </div>
              </div>
              {/* Quality badge */}
              <div className="absolute top-8 -right-2 bg-gold text-teal-deep rounded-lg px-4 py-2 shadow-lg z-20 hero-badge-pop" style={{ animationDelay: "0.3s" }}>
                <div className="text-xs font-bold uppercase tracking-wider">
                  Double Layer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
