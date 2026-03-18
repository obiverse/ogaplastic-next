"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { SectionTag } from "@/components/ui/SectionTag";
import { FAQS } from "@/lib/constants";

function ExpandIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <SectionTag>FAQ</SectionTag>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-heading">
            Frequently Asked{" "}
            <em className="italic font-normal text-teal">Questions</em>
          </h2>
        </div>

        <div className="reveal">
          {FAQS.map((faq, i) => (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandIcon />}>
                {faq.question}
              </AccordionSummary>
              <AccordionDetails>
                <span className="text-slate-brand leading-relaxed">
                  {faq.answer}
                </span>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
