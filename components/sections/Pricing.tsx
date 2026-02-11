"use client";

import { useEffect, useRef, useState } from "react";
import { SectionTag } from "@/components/ui/SectionTag";
import { TANK_PRICES, BIN_PRICES, formatNaira } from "@/lib/constants";

function AnimatedPrice({ amount }: { amount: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;
          if (prefersReduced) {
            setDisplay(amount);
            return;
          }
          const duration = 1200;
          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(eased * amount));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [amount]);

  return <span ref={ref}>{formatNaira(display)}</span>;
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24"
      style={{
        background:
          "linear-gradient(135deg, var(--oga-teal-deep) 0%, var(--oga-teal-dark) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <span className="section-tag !text-gold before:!bg-gold">
            PRICING
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Transparent{" "}
            <em className="italic font-normal text-gold-light">
              Factory Pricing
            </em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Water Tanks */}
          <div className="reveal card-hover bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Water Tanks
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {TANK_PRICES.map((item) => (
                <div
                  key={item.volume}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-white/70 text-sm">
                    {item.volume} {item.type}
                  </span>
                  <span className="text-gold-light font-bold">
                    <AnimatedPrice amount={item.price} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Waste Bins */}
          <div className="reveal card-hover bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-accent/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Waste Bins
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {BIN_PRICES.map((item) => (
                <div
                  key={item.volume}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-white/70 text-sm">{item.volume}</span>
                  <span className="text-gold-light font-bold">
                    <AnimatedPrice amount={item.price} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          Prices are ex-factory. Custom branding, colours, and delivery
          available on request.
        </p>
      </div>
    </section>
  );
}
