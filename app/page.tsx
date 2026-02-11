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
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Products />
        <Technology />
        <Industries />
        <Sustainability />
        <Pricing />
        <Specifications />
        <Contact />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
