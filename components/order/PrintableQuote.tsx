"use client";

import { useEffect, useRef } from "react";
import { COMPANY } from "@/lib/constants";

export interface QuoteData {
  ref: string;
  date: string;
  productName: string;
  volume: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  deliveryState: string;
  deliveryZone: string;
  deliveryEstimate: string;
  branding: boolean;
  total: string;
  qrDataUrl?: string; // Base64 PNG from QR generator
}

/** Renders a print-optimized quote in a new window */
export function openPrintableQuote(data: QuoteData) {
  const w = window.open("", "_blank", "width=800,height=1100");
  if (!w) return;

  const html = buildQuoteHTML(data);
  w.document.write(html);
  w.document.close();
  // Auto-trigger print after a brief delay for rendering
  setTimeout(() => w.print(), 500);
}

function buildQuoteHTML(d: QuoteData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Quote ${d.ref} — OGA PLASTIC</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color: #1A1A1A; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0F3D47; padding-bottom: 20px; margin-bottom: 30px; }
  .brand { color: #0F3D47; }
  .brand h1 { font-size: 22px; font-weight: 800; letter-spacing: 1px; }
  .brand p { font-size: 10px; color: #6B7B82; margin-top: 2px; }
  .ref-block { text-align: right; }
  .ref-block .ref { font-size: 14px; font-weight: 700; color: #0F3D47; }
  .ref-block .date { font-size: 11px; color: #6B7B82; margin-top: 4px; }
  .section-title { font-size: 11px; font-weight: 700; color: #6B7B82; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { text-align: left; font-size: 10px; font-weight: 600; color: #6B7B82; text-transform: uppercase; letter-spacing: 1px; padding: 8px 12px; border-bottom: 1px solid #E8EDEF; }
  td { padding: 12px; font-size: 13px; border-bottom: 1px solid #F0F0F0; }
  .right { text-align: right; }
  .bold { font-weight: 700; }
  .total-row td { border-top: 2px solid #0F3D47; font-weight: 700; font-size: 15px; color: #0F3D47; }
  .notes { margin-top: 30px; padding: 16px; background: #F7F2E8; border-radius: 8px; font-size: 11px; color: #3D4A4F; line-height: 1.6; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E8EDEF; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-left { font-size: 10px; color: #6B7B82; line-height: 1.6; }
  .footer-right { text-align: right; }
  .qr { width: 80px; height: 80px; }
  .stamp { display: inline-block; padding: 6px 14px; border: 2px solid #D4A853; color: #D4A853; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px; transform: rotate(-3deg); margin-top: 8px; }
  @media print {
    body { padding: 20px; }
    @page { margin: 15mm; }
  }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>OGA PLASTIC</h1>
      <p>MANUFACTURING NIG. LTD</p>
      <p style="margin-top:8px; font-size:10px; color:#3D4A4F;">
        ${COMPANY.address}<br>
        ${COMPANY.phones.join(" | ")}<br>
        ${COMPANY.email}
      </p>
    </div>
    <div class="ref-block">
      <div class="ref">${d.ref}</div>
      <div class="date">${d.date}</div>
      <div class="stamp">QUOTATION</div>
    </div>
  </div>

  <p class="section-title">Order Details</p>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Size</th>
        <th class="right">Qty</th>
        <th class="right">Unit Price</th>
        <th class="right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${d.productName}</td>
        <td>${d.volume}</td>
        <td class="right">${d.quantity}</td>
        <td class="right">${d.unitPrice}</td>
        <td class="right bold">${d.subtotal}</td>
      </tr>
      ${d.branding ? `<tr><td colspan="4">Custom branding / logo</td><td class="right" style="color:#6B7B82;">On request</td></tr>` : ""}
      ${d.deliveryState ? `
      <tr>
        <td colspan="4">Estimated delivery to ${d.deliveryState} (${d.deliveryZone})</td>
        <td class="right">${d.deliveryEstimate}</td>
      </tr>` : ""}
      <tr class="total-row">
        <td colspan="4">${d.deliveryState ? "Estimated Total" : "Subtotal"}</td>
        <td class="right">${d.total}</td>
      </tr>
    </tbody>
  </table>

  <div class="notes">
    <strong>Terms &amp; Conditions</strong><br>
    &bull; All prices are in Nigerian Naira (₦) and ex-factory unless delivery is specified.<br>
    &bull; Delivery estimates are approximate and will be confirmed upon order placement.<br>
    &bull; Payment: Bank transfer. Payment terms available for bulk orders (10+ units).<br>
    &bull; Production lead time: 3–7 days standard, 2–4 weeks for custom-branded products.<br>
    &bull; This quotation is valid for 30 days from the date above.<br>
    &bull; RC: ${COMPANY.rc} | TIN: ${COMPANY.tin}
  </div>

  <div class="footer">
    <div class="footer-left">
      <strong>OGA PLASTIC Manufacturing Nig. Ltd</strong><br>
      ${COMPANY.address}<br>
      WhatsApp: ${COMPANY.phones[0]}<br>
      Email: ${COMPANY.email}
    </div>
    <div class="footer-right">
      ${d.qrDataUrl ? `<img src="${d.qrDataUrl}" class="qr" alt="Order QR code"><br>` : ""}
      <span style="font-size:9px;color:#6B7B82;">Scan to reorder</span>
    </div>
  </div>
</body>
</html>`;
}
