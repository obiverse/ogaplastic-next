import { LogoFull } from "@/components/ui/Logo";
import { COMPANY, FOOTER_LINKS, SOCIALS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-teal-deep pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <LogoFull variant="light" />
            <p className="text-white/70 text-sm mt-4 leading-relaxed">
              {COMPANY.tagline}
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  title={s.name}
                  aria-label={s.name}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors text-xs"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Products</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <div className="space-y-3 text-white/70 text-sm">
              <p>{COMPANY.address}</p>
              {COMPANY.phones.map((p) => (
                <p key={p}>
                  <a href={`tel:${p.replace(/[() ]/g, "")}`} className="hover:text-white transition-colors">
                    {p}
                  </a>
                </p>
              ))}
              <p>
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/70 text-xs">
          <span>
            &copy; 2026 {COMPANY.name}. All rights reserved.
          </span>
          <span>
            RC: {COMPANY.rc} &nbsp;|&nbsp; TIN: {COMPANY.tin}
          </span>
        </div>
      </div>
    </footer>
  );
}
