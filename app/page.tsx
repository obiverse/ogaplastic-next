import { Navbar } from "@/components/nav/Navbar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Products } from "@/components/sections/Products";
import { Technology } from "@/components/sections/Technology";
import { Industries } from "@/components/sections/Industries";
import { Sustainability } from "@/components/sections/Sustainability";
import { Pricing } from "@/components/sections/Pricing";
import { Specifications } from "@/components/sections/Specifications";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { OrderBuilder } from "@/components/order/OrderBuilder";
import { PWAInstallPrompt } from "@/components/ui/PWAInstallPrompt";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-teal-deep focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <LoadingScreen />
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Products />
        <Technology />
        <Industries />
        <Sustainability />
        <Pricing />
        <Specifications />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <OrderBuilder />
      <PWAInstallPrompt />
      <OfflineIndicator />
      <ScrollReveal />
    </>
  );
}
