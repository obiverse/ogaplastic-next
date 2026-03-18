"use client";

import Image from "next/image";
import { asset } from "@/lib/basepath";
import { SectionTag } from "@/components/ui/SectionTag";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { specsScene } from "@/components/canvas/scenes/specs-scene";
import { SPECIFICATIONS } from "@/lib/constants";

const SPEC_ICONS = [
  // Tank config
  <path key="0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  // Material
  <path key="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
  // Colour
  <path key="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />,
  // Markings
  <path key="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
  // Fittings
  <path key="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />,
  // Quality
  <path key="5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  // Packaging
  <path key="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  // Custom
  <path key="7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />,
];

export function Specifications() {
  return (
    <section id="specifications" className="relative py-24 bg-sand-light overflow-hidden">
      {/* Canvas background */}
      <AnimatedCanvas
        skin={specsScene}
        className="absolute inset-0 z-0"
        tickRate={1}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <SectionTag>TECHNICAL DETAIL</SectionTag>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-heading">
            Custom Water Tank{" "}
            <em className="italic font-normal text-teal">Specifications</em>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SPECIFICATIONS.map((spec, i) => (
            <div
              key={spec.title}
              className="reveal card-hover bg-surface-card rounded-2xl p-6 border border-light-grey"
            >
              <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {SPEC_ICONS[i]}
                  {i === 4 && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  )}
                </svg>
              </div>
              <h3 className="font-semibold text-heading text-sm mb-2">
                {spec.title}
              </h3>
              <p className="text-grey text-xs leading-relaxed">
                {spec.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mould reference image */}
        <div className="reveal-scale flex justify-center">
          <div className="bg-surface-card rounded-2xl p-6 border border-light-grey inline-flex items-center gap-6 max-w-2xl">
            <Image
              src={asset("/images/tank-top-cover.png")}
              alt="OGA PLASTIC tank threaded lid close-up"
              width={180}
              height={135}
              sizes="180px"
              loading="lazy"
              className="rounded-xl object-cover"
            />
            <div>
              <h3 className="font-display text-lg font-bold text-heading mb-2">
                Precision Fittings
              </h3>
              <p className="text-grey text-sm leading-relaxed">
                Every tank features a threaded manhole cover with tight seal,
                precision-moulded outlet ports, and overflow protection — all
                engineered for decades of reliable service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
