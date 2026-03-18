"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/basepath";
import { SectionTag } from "@/components/ui/SectionTag";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { techScene } from "@/components/canvas/scenes/tech-scene";

const TECH_FEATURES = [
  {
    title: "Rotational Moulding",
    description:
      "Our primary process delivers uniform wall thickness, seamless construction with no weld points, high impact resistance, and the ability to produce complex shapes in various sizes.",
  },
  {
    title: "Double-Layer Architecture",
    description:
      "Inner white food-grade layer for content visibility and monitoring, and a UV-stabilised outer shell engineered for decades of weather resistance.",
  },
  {
    title: "Climate Engineering",
    description:
      "Every product is specifically designed and tested for high heat exposure, intense UV radiation, and year-round outdoor installation in Nigeria's tropical climate.",
  },
];

const STATS = [
  { value: 99.8, suffix: "%", label: "Wall Uniformity" },
  { value: 25, suffix: "yr", label: "UV Rating" },
  { value: 0, suffix: "", label: "Weld Points", display: "Zero" },
  { value: 100, suffix: "%", label: "Food-Grade" },
];

/** Animated counter that counts up from 0 to target */
function AnimatedStat({
  value,
  suffix,
  label,
  display,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  display?: string;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (display) {
          const timer = setTimeout(() => setDone(true), delay);
          return () => clearTimeout(timer);
        }
        const start = performance.now();
        const duration = 2000;
        const animate = (now: number) => {
          const elapsed = now - start - delay;
          if (elapsed < 0) {
            requestAnimationFrame(animate);
            return;
          }
          const t = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setCount(
            value % 1 !== 0
              ? parseFloat((eased * value).toFixed(1))
              : Math.round(eased * value)
          );
          if (t < 1) requestAnimationFrame(animate);
          else setDone(true);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, delay, display]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl sm:text-3xl font-bold text-gold-light tabular-nums">
        {display && done ? display : display ? "\u2014" : count}
        {!display && suffix}
      </div>
      <div className="text-xs text-white/70 mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export function Technology() {
  return (
    <section id="technology" className="relative py-24 bg-surface-alt overflow-hidden">
      {/* Canvas background */}
      <AnimatedCanvas
        skin={techScene}
        className="absolute inset-0 z-0"
        tickRate={1}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <SectionTag>HOW WE BUILD</SectionTag>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-heading">
            Engineering for{" "}
            <em className="italic font-normal text-teal">Africa&apos;s Climate</em>
          </h2>
        </div>

        {/* Three-column features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 reveal">
          {TECH_FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="stagger-child card-hover bg-surface-card rounded-2xl p-8 border border-border-subtle text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {i === 0 && (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  )}
                  {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                  {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />}
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-heading mb-3">
                {feature.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Double-layer diagram */}
        <div className="reveal bg-surface-card rounded-2xl p-8 border border-border-subtle mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-xl font-bold text-heading mb-4">
                Double-Layer Cross-Section
              </h3>
              <div className="space-y-4">
                {[
                  { layer: "Inner Layer", color: "#FFFFFF", border: "#E8EDEF", desc: "White food-grade — content visibility, easy monitoring" },
                  { layer: "Outer Layer", color: "#3D4A4F", border: "#3D4A4F", desc: "UV-stabilised shell — weather resistance for 25 years" },
                ].map((l) => (
                  <div key={l.layer} className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 border-2 relative overflow-hidden"
                      style={{ background: l.color, borderColor: l.border }}
                    >
                      <span className="absolute inset-0 rounded-lg animate-pulse opacity-20" style={{ background: l.border }} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-heading">{l.layer}</div>
                      <div className="text-xs text-muted">{l.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src={asset("/images/tank-inner-layer.png")}
                alt="Double-layer tank cross-section showing inner white layer"
                width={300}
                height={300}
                sizes="(max-width: 768px) 100vw, 300px"
                loading="lazy"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Animated stats band */}
        <div
          className="rounded-2xl p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{
            background: "linear-gradient(135deg, var(--oga-teal-deep) 0%, var(--oga-teal-dark) 100%)",
          }}
        >
          {STATS.map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              display={stat.display}
              delay={i * 150}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 reveal">
          <a href="#products" className="btn-gold group">
            Explore Our Products
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
