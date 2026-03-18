"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { SectionTag } from "@/components/ui/SectionTag";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { pricingScene } from "@/components/canvas/scenes/pricing-scene";
import { TANK_PRICES, BIN_PRICES, formatNaira } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

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
      className="relative py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--oga-teal-deep) 0%, var(--oga-teal-dark) 100%)",
      }}
    >
      {/* Canvas background */}
      <AnimatedCanvas
        skin={pricingScene}
        className="absolute inset-0 z-0"
        tickRate={1}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="reveal">
            <Card
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
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
              <CardContent>
                <ul className="list-none p-0 m-0">
                  {TANK_PRICES.map((item, i) => (
                    <li
                      key={item.volume}
                      className="flex items-center justify-between py-3 px-4 group/row"
                      style={{ borderBottom: i < TANK_PRICES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                    >
                      <span className="text-white/70 text-sm">{item.volume} {item.type}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-gold-light font-bold">
                          <AnimatedPrice amount={item.price} />
                        </span>
                        <a
                          href={buildWhatsAppUrl({ type: "pricing", product: "Water Tank", volume: item.volume, price: formatNaira(item.price) })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover/row:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                          aria-label={`Order ${item.volume} Water Tank via WhatsApp`}
                        >
                          <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                          </svg>
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Waste Bins */}
          <div className="reveal">
            <Card
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
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
              <CardContent>
                <ul className="list-none p-0 m-0">
                  {BIN_PRICES.map((item, i) => (
                    <li
                      key={item.volume}
                      className="flex items-center justify-between py-3 px-4 group/row"
                      style={{ borderBottom: i < BIN_PRICES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                    >
                      <span className="text-white/70 text-sm">{item.volume}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-gold-light font-bold">
                          <AnimatedPrice amount={item.price} />
                        </span>
                        <a
                          href={buildWhatsAppUrl({ type: "pricing", product: "Waste Bin", volume: item.volume, price: formatNaira(item.price) })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover/row:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                          aria-label={`Order ${item.volume} Waste Bin via WhatsApp`}
                        >
                          <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                          </svg>
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-white/70 text-sm mt-8">
          Prices are ex-factory. Custom branding, colours, and delivery
          available on request.
        </p>
      </div>
    </section>
  );
}
