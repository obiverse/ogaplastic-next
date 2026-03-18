"use client";

import { useState, type FormEvent } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { SectionTag } from "@/components/ui/SectionTag";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { contactScene } from "@/components/canvas/scenes/contact-scene";
import { COMPANY } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const PRODUCT_OPTIONS = [
  { value: "", label: "Select product" },
  { value: "Water Tank", label: "Water Tank" },
  { value: "Waste Bin", label: "Waste Bin" },
  { value: "Custom Product", label: "Custom Product" },
  { value: "Other", label: "Other" },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(form: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.get("name")) errs.name = "Full name is required";
    const email = form.get("email") as string;
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email";
    if (!form.get("phone")) errs.phone = "Phone number is required";
    return errs;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const name = data.get("name") as string;
    const company = data.get("company") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const product = data.get("product") as string;
    const quantity = data.get("quantity") as string;
    const message = data.get("message") as string;

    const subject = encodeURIComponent(
      `Quote Request from ${name}${product ? ` — ${product}` : ""}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        company && `Company: ${company}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        product && `Product Interest: ${product}`,
        quantity && `Quantity: ${quantity}`,
        message && `\nMessage:\n${message}`,
      ]
        .filter(Boolean)
        .join("\n")
    );

    window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <section id="contact" className="relative py-24 bg-cream overflow-hidden">
      {/* Canvas background */}
      <AnimatedCanvas
        skin={contactScene}
        className="absolute inset-0 z-0"
        tickRate={1}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <SectionTag>GET IN TOUCH</SectionTag>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-heading">
            Request a{" "}
            <em className="italic font-normal text-teal">Quote</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="reveal space-y-8">
            <div>
              <h3 className="font-display text-xl font-bold text-heading mb-4">
                {COMPANY.name}
              </h3>
              <div className="space-y-4 text-slate-brand text-sm">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{COMPANY.address}</span>
                </div>
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    {COMPANY.phones.map((p) => (
                      <div key={p}>
                        <a href={`tel:${p.replace(/[() ]/g, "")}`} className="hover:text-teal transition-colors">
                          {p}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-teal transition-colors">
                    {COMPANY.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="rounded-2xl overflow-hidden border border-light-grey h-[220px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63513.76!2d8.05!3d5.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x105d65a0b54dce1d%3A0x6e8aa5b8a42f1d!2sUgep%2C%20Cross%20River%20State%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                title="OGA PLASTIC location — Ugep, Cross River State"
              />
            </div>
          </div>

          {/* Quote form */}
          <div className="reveal">
            {submitted ? (
              <div className="bg-surface-card rounded-2xl p-10 text-center border border-light-grey">
                <div className="w-16 h-16 rounded-full bg-logo-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-logo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-heading mb-2">
                  Enquiry Sent!
                </h3>
                <p className="text-grey">
                  Your email client should open with the enquiry details.
                  If it doesn&apos;t, email us directly at{" "}
                  <a href={`mailto:${COMPANY.email}`} className="text-teal font-medium hover:underline">
                    {COMPANY.email}
                  </a>
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-surface-card rounded-2xl p-8 border border-light-grey space-y-5"
                noValidate
              >
                <TextField
                  name="name"
                  label="Full Name"
                  required
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name}
                />

                <TextField
                  name="company"
                  label="Company / Organisation"
                  fullWidth
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    required
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    name="phone"
                    label="Phone"
                    type="tel"
                    required
                    fullWidth
                    placeholder="+234..."
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <TextField
                    name="product"
                    label="Product Interest"
                    select
                    fullWidth
                    defaultValue=""
                  >
                    {PRODUCT_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    name="quantity"
                    label="Quantity"
                    type="number"
                    fullWidth
                    slotProps={{ htmlInput: { min: 1 } }}
                  />
                </div>

                <TextField
                  name="message"
                  label="Message / Special Requirements"
                  multiline
                  rows={4}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  endIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  }
                  sx={{ py: 1.75, fontSize: "1rem" }}
                >
                  Send Enquiry
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => {
                    const form = document.querySelector<HTMLFormElement>("#contact form");
                    if (!form) return;
                    const data = new FormData(form);
                    const errs = validate(data);
                    setErrors(errs);
                    if (Object.keys(errs).length > 0) return;
                    const name = data.get("name") as string;
                    const product = (data.get("product") as string) || "General Enquiry";
                    const quantity = data.get("quantity") as string;
                    const message = data.get("message") as string;
                    window.open(
                      buildWhatsAppUrl({
                        type: "quote",
                        name,
                        product,
                        quantity: quantity || undefined,
                        details: message || undefined,
                      }),
                      "_blank"
                    );
                    setSubmitted(true);
                  }}
                  startIcon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.116 1.52 5.853L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.98 0-3.867-.528-5.527-1.53l-.396-.235-3.762.982.998-3.648-.26-.413A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                    </svg>
                  }
                  sx={{
                    py: 1.75,
                    fontSize: "1rem",
                    borderColor: "#25D366",
                    color: "#25D366",
                    "&:hover": { borderColor: "#20BD5A", bgcolor: "rgba(37,211,102,0.05)" },
                  }}
                >
                  Or send via WhatsApp
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
