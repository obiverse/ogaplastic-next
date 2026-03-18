"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { SectionTag } from "@/components/ui/SectionTag";
import { INDUSTRIES } from "@/lib/constants";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { industriesScene } from "@/components/canvas/scenes/industries-scene";

const ICONS = [
  // Government
  <path key="gov" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
  // Construction
  <path key="con" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  // Agriculture
  <path key="agr" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />,
  // Commercial
  <path key="com" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />,
  // Residential
  <path key="res" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  // Institutions
  <path key="ins" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />,
];

export function Industries() {
  const heroIndustries = INDUSTRIES.slice(0, 2);
  const standardIndustries = INDUSTRIES.slice(2);

  return (
    <section id="industries" className="relative py-24 bg-surface overflow-hidden">
      {/* Canvas background */}
      <AnimatedCanvas
        skin={industriesScene}
        className="absolute inset-0 z-0"
        tickRate={1}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <SectionTag>WHO WE SERVE</SectionTag>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-heading">
            Trusted Across{" "}
            <em className="italic font-normal text-teal">Every Sector</em>
          </h2>
        </div>

        {/* Hero cards — Government + Construction (2-col) */}
        <div className="grid md:grid-cols-2 gap-6 mb-6 reveal">
          {heroIndustries.map((industry, i) => (
            <Card
              key={industry.title}
              className="stagger-child"
              sx={{
                borderLeft: "4px solid",
                borderLeftColor: "primary.main",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-teal"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {ICONS[i]}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl font-bold text-heading">
                        {industry.title}
                      </h3>
                      <Chip
                        label={industry.metric}
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                    </div>
                    <p className="text-muted text-sm leading-relaxed mt-2">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Standard cards — 4-col grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          {standardIndustries.map((industry, i) => (
            <Card
              key={industry.title}
              className="stagger-child"
              style={{ animationDelay: `${(i + 2) * 0.08}s` }}
            >
              <CardContent sx={{ p: 3 }}>
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-teal"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {ICONS[i + 2]}
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-heading mb-1">
                  {industry.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-3">
                  {industry.description}
                </p>
                <Chip
                  label={industry.metric}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 reveal">
          <Button
            variant="contained"
            color="primary"
            href="#contact"
            size="large"
            endIcon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            }
          >
            Get Industry-Specific Quote
          </Button>
        </div>
      </div>
    </section>
  );
}
