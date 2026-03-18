"use client";

import { useState, useEffect, type SyntheticEvent } from "react";
import Image from "next/image";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { SectionTag } from "@/components/ui/SectionTag";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { productsScene } from "@/components/canvas/scenes/products-scene";
import {
  TANK_FEATURES,
  BIN_FEATURES,
  CUSTOM_FEATURES,
} from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { asset } from "@/lib/basepath";

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
      "Double-layer construction engineered for Nigeria's climate. Inner white food-grade layer for content monitoring and UV-stabilised outer shell for weather resistance. Available from 750L to 10,000L.",
    features: TANK_FEATURES,
    image: "/images/water-tank-main.png",
    imageAlt: "OGA PLASTIC vertical water storage tank",
    badge: "Double Layer",
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
    image: "/images/tank-inner-layer.png",
    imageAlt: "OGA PLASTIC custom manufacturing",
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

  function handleTabChange(_: SyntheticEvent, value: TabId) {
    setActiveTab(value);
  }

  return (
    <section id="products" className="relative py-24 bg-surface overflow-hidden">
      {/* Canvas background */}
      <AnimatedCanvas
        skin={productsScene}
        className="absolute inset-0 z-0"
        tickRate={1}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <SectionTag>OUR PRODUCTS</SectionTag>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-heading">
            Built to Last,{" "}
            <em className="italic font-normal text-teal">
              Across Nigeria &amp; Africa
            </em>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Product categories"
            centered
            slotProps={{ indicator: { sx: { display: "none" } } }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.id} value={tab.id} label={tab.label} />
            ))}
          </Tabs>
        </div>

        {/* Tab content — crossfade on tab switch */}
        <div
          key={activeTab}
          className="grid lg:grid-cols-2 gap-12 items-center animate-fadeIn"
        >
          {/* Image area */}
          <div>
            <div className="product-image-container relative bg-sand-light rounded-3xl p-8 flex items-center justify-center min-h-[400px] transition-all duration-500">
              <Image
                src={asset(data.image)}
                alt={data.imageAlt}
                width={400}
                height={435}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain drop-shadow-lg max-h-[400px] max-w-full transition-transform duration-500"
                style={data.imageRotate ? { transform: `rotate(${data.imageRotate}deg)` } : undefined}
              />
              <Chip
                label={data.badge}
                size="small"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: "primary.main",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          </div>

          {/* Info area */}
          <div>
            <h3 className="font-display text-2xl font-bold text-heading mb-4">
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
                  <h4 className="font-semibold text-heading text-sm mb-1">
                    {f.title}
                  </h4>
                  <p className="text-grey text-xs leading-relaxed">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Button
                variant="contained"
                color="primary"
                href="#pricing"
                size="large"
              >
                {data.cta}
              </Button>
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
              <a
                href={buildWhatsAppUrl({ type: "product", product: data.title })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: "#25D366" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                </svg>
                Chat about this
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
