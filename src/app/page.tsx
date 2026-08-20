import {
  Header,
  Hero,
  Features,
  ProductSections,
  WhyUs,
  Gallery,
  HowItWorks,
  Stats,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components";
import { PlatformProvider } from "@/lib/platform";

/**
 * Snap Collectibles — marketing landing page.
 * Layout language ported from BassheadOS: dark bay, display type, device frames,
 * FormSubmit beta request. Copy aligned to Collection Vault B15 / app v2.3.
 */
export default function HomePage() {
  return (
    <PlatformProvider>
      <Header />
      <main id="main">
        <Hero />
        <Stats />
        <Features />
        <ProductSections />
        <HowItWorks />
        <WhyUs />
        <Gallery />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </PlatformProvider>
  );
}
