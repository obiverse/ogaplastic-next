"use client";

import { useState, type FormEvent } from "react";
import { SectionTag } from "@/components/ui/SectionTag";
import { COMPANY } from "@/lib/constants";

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
    if (Object.keys(errs).length === 0) setSubmitted(true);
  }

  return (
    <section id="contact" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <SectionTag>GET IN TOUCH</SectionTag>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-teal-deep">
            Request a{" "}
            <em className="italic font-normal text-teal">Quote</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="reveal space-y-8">
            <div>
              <h3 className="font-display text-xl font-bold text-teal-deep mb-4">
                {COMPANY.name}
              </h3>
              <div className="space-y-4 text-slate-brand text-sm">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{COMPANY.address}</span>
                </div>
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    {COMPANY.phones.map((p) => (
                      <div key={p}>{p}</div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{COMPANY.email}</span>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-teal-deep/5 rounded-2xl p-8 border border-light-grey text-center">
              <div className="text-grey text-sm mb-2">
                Ugep, Cross River State, Nigeria
              </div>
              <div className="text-xs text-grey/60">
                Interactive map will be added in production build
              </div>
            </div>
          </div>

          {/* Quote form */}
          <div className="reveal">
            {submitted ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-light-grey">
                <div className="w-16 h-16 rounded-full bg-logo-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-logo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-teal-deep mb-2">
                  Enquiry Sent!
                </h3>
                <p className="text-grey">
                  Thank you for your interest. Our team will respond within 24
                  hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-8 border border-light-grey space-y-5"
                noValidate
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-teal-deep mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal transition-colors"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-teal-deep mb-1.5">
                    Company / Organisation
                  </label>
                  <input
                    name="company"
                    type="text"
                    className="w-full border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal transition-colors"
                    placeholder="Your company name"
                  />
                </div>

                {/* Email & Phone row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-teal-deep mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="w-full border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal transition-colors"
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal-deep mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal transition-colors"
                      placeholder="+234..."
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Product & Capacity row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-teal-deep mb-1.5">
                      Product Interest
                    </label>
                    <select
                      name="product"
                      className="w-full border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal transition-colors bg-white"
                    >
                      <option value="">Select product</option>
                      <option>Water Tank</option>
                      <option>Waste Bin</option>
                      <option>Custom Product</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal-deep mb-1.5">
                      Quantity
                    </label>
                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      className="w-full border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal transition-colors"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-teal-deep mb-1.5">
                    Message / Special Requirements
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full justify-center text-base cursor-pointer"
                >
                  Send Enquiry
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
