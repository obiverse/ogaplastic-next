"use client";

import Image from "next/image";
import { asset } from "@/lib/basepath";
import { SectionTag } from "@/components/ui/SectionTag";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { aboutScene } from "@/components/canvas/scenes/about-scene";
import { VALUES, COMPANY } from "@/lib/constants";

const VALUE_COLORS = ["#2B7A8C", "#D4A853", "#7AB648", "#3A9AAE", "#1D5A67"];

export function About() {
  return (
    <section id="about" className="relative py-24 bg-cream overflow-hidden">
      {/* Canvas background */}
      <AnimatedCanvas
        skin={aboutScene}
        className="absolute inset-0 z-0"
        tickRate={1}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual column */}
          <div className="reveal-left relative">
            <div
              className="rounded-3xl overflow-hidden relative aspect-square max-w-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--oga-teal) 0%, var(--oga-teal-dark) 100%)",
              }}
            >
              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <Image
                  src={asset("/images/water-tank-main.png")}
                  alt="OGA PLASTIC water storage tank"
                  width={400}
                  height={435}
                  sizes="(max-width: 1024px) 100vw, 400px"
                  loading="lazy"
                  className="drop-shadow-2xl object-contain w-auto h-auto"
                />
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-surface-card rounded-2xl px-6 py-4 shadow-xl border border-border-subtle">
              <div className="text-3xl font-bold text-heading font-display">
                Est.
              </div>
              <div className="text-sm text-grey">Ugep, Nigeria</div>
            </div>
          </div>

          {/* Text column */}
          <div className="reveal-right">
            <SectionTag>ABOUT US</SectionTag>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-heading mb-6">
              Nigeria&apos;s Trusted{" "}
              <em className="italic font-normal text-teal">
                Plastic Manufacturer
              </em>
            </h2>
            <p className="text-slate-brand leading-relaxed mb-8">
              {COMPANY.description}
            </p>

            {/* Values grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {VALUES.map((value, i) => (
                <div
                  key={value.title}
                  className="card-hover bg-surface-card rounded-xl p-5 border border-light-grey"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: VALUE_COLORS[i % VALUE_COLORS.length] }}
                    />
                    <div>
                      <h3 className="font-semibold text-heading text-sm">
                        {value.title}
                      </h3>
                      <p className="text-grey text-xs mt-1">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mission & Vision */}
            <div className="space-y-4">
              <div className="border-l-4 border-teal pl-5 py-2">
                <h3 className="text-sm font-semibold text-heading mb-1">
                  Our Mission
                </h3>
                <p className="text-grey text-sm leading-relaxed">
                  {COMPANY.mission}
                </p>
              </div>
              <div className="border-l-4 border-gold pl-5 py-2">
                <h3 className="text-sm font-semibold text-heading mb-1">
                  Our Vision
                </h3>
                <p className="text-grey text-sm leading-relaxed">
                  {COMPANY.vision}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
