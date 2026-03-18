"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { SectionTag } from "@/components/ui/SectionTag";
import { FAQS, COMMERCIAL_FAQS } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

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

const WA_ICON_TINY = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
  </svg>
);

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

        {/* Product FAQs */}
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

        {/* Commercial FAQs */}
        <div className="mt-10 reveal">
          <h3 className="font-display text-lg font-bold text-heading mb-4 pl-1">
            Ordering &amp; Delivery
          </h3>
          {COMMERCIAL_FAQS.map((faq, i) => (
            <Accordion key={`c${i}`}>
              <AccordionSummary expandIcon={<ExpandIcon />}>
                {faq.question}
              </AccordionSummary>
              <AccordionDetails>
                <span className="text-slate-brand leading-relaxed">
                  {faq.answer}
                </span>
                {"cta" in faq && faq.cta && (
                  <a
                    href={buildWhatsAppUrl({ type: "general" })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold transition-colors hover:brightness-110"
                    style={{ color: "#25D366" }}
                  >
                    {WA_ICON_TINY}
                    {faq.cta.label}
                  </a>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
