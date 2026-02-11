"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SectionTag } from "@/components/ui/SectionTag";
import {
  TANK_FEATURES,
  BIN_FEATURES,
  CUSTOM_FEATURES,
} from "@/lib/constants";

const TABS = [
  { id: "tanks", label: "Water Tanks" },
  { id: "bins", label: "Waste Bins" },
  { id: "custom", label: "Custom Products" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_DATA: Record<
  TabId,
  {
    title: string;
    description: string;
    features: readonly { title: string; description: string }[];
    image: string;
    imageAlt: string;
    imageRotate?: number;
    badge: string;
    cta: string;
  }
> = {
  tanks: {
    title: "Branded Vertical Water Storage Tank",
    description:
      "Triple-layer construction engineered for Nigeria's climate. Inner white layer for content monitoring, UV-stabilised core, and weather-resistant outer shell. Available from 750L to 5000L.",
    features: TANK_FEATURES,
    image: "/images/water-tank-main.png",
    imageAlt: "OGA PLASTIC vertical water storage tank",
    badge: "Triple Layer",
    cta: "View Pricing",
  },
  bins: {
    title: "Branded Outdoor & Indoor Waste Bin",
    description:
      "Rotary-moulded for maximum durability and extended lifespan. Built for municipal waste collection, residential estates, commercial facilities, and recycling programs.",
    features: BIN_FEATURES,
    image: "/images/waste-bin-drawing.png",
    imageAlt: "OGA PLASTIC waste management bin",
    badge: "Heavy Duty",
    cta: "View Pricing",
  },
  custom: {
    title: "Custom Manufacturing Solutions",
    description:
      "Bespoke plastic products manufactured to your exact specifications. In-mould branding, custom colours, government tagging, and special sizing available.",
    features: CUSTOM_FEATURES,
    image: "/images/tank-mould-drawing.png",
    imageAlt: "OGA PLASTIC custom mould engineering drawing",
    imageRotate: 270,
    badge: "Bespoke",
    cta: "Request Quote",
  },
};

export function Products() {
  const [activeTab, setActiveTab] = useState<TabId>("tanks");
  const data = TAB_DATA[activeTab];

  // Listen for tab-switch events dispatched from the navbar dropdown
  useEffect(() => {
    const handler = (e: Event) => {
      const tabId = (e as CustomEvent).detail;
      if (tabId === "tanks" || tabId === "bins" || tabId === "custom") {
        setActiveTab(tabId);
      }
    };
    window.addEventListener("oga-switch-tab", handler);
    return () => window.removeEventListener("oga-switch-tab", handler);
  }, []);

  return (
    <section id="products" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <SectionTag>OUR PRODUCTS</SectionTag>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-teal-deep">
            Built to Last,{" "}
            <em className="italic font-normal text-teal">
              Engineered for Africa
            </em>
          </h2>
        </div>

        {/* Tabs */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-12"
          role="tablist"
          aria-label="Product categories"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className="tab-btn cursor-pointer"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content — crossfade on tab switch */}
        <div
          key={activeTab}
          className="grid lg:grid-cols-2 gap-12 items-center animate-fadeIn"
        >
          {/* Image area */}
          <div className="reveal">
            <div className="product-image-container relative bg-sand-light rounded-3xl p-8 flex items-center justify-center min-h-[400px] transition-all duration-500">
              <Image
                src={data.image}
                alt={data.imageAlt}
                width={400}
                height={450}
                className="object-contain drop-shadow-lg max-h-[400px] w-auto transition-transform duration-500"
                style={data.imageRotate ? { transform: `rotate(${data.imageRotate}deg)` } : undefined}
              />
              <span className="absolute top-4 right-4 bg-teal text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                {data.badge}
              </span>
            </div>
          </div>

          {/* Info area */}
          <div className="reveal">
            <h3 className="font-display text-2xl font-bold text-teal-deep mb-4">
              {data.title}
            </h3>
            <p className="text-slate-brand leading-relaxed mb-8">
              {data.description}
            </p>

            {/* Feature cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {data.features.map((f, i) => (
                <div
                  key={f.title}
                  className="card-hover bg-sand-light rounded-xl p-5"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <h4 className="font-semibold text-teal-deep text-sm mb-1">
                    {f.title}
                  </h4>
                  <p className="text-grey text-xs leading-relaxed">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <a href="#pricing" className="btn-gold text-sm">
                {data.cta}
              </a>
              <a
                href="#contact"
                className="text-sm font-semibold text-teal hover:text-teal-dark transition-colors flex items-center gap-1"
              >
                Request Quote
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
