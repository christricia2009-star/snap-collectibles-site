import {
  Header,
  Hero,
  Features,
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
 * Snap Collectibles — Marketing landing page (single page)
 * Copy aligned to Collection Vault B15 / app v2.3 (portfolio, Hunter Mode, tools).
 *
 * Section order:
 * 1. Sticky header (platform switcher + early access)
 * 2. Hero (vault OS: scan / hunt / value / trade + soft App Store CTA)
 * 3. Features grid (B15 capabilities)
 * 4. Why Snap Collectibles (comparison)
 * 5. Screenshot gallery (platform-aware)
 * 6. How it works (Snap → Review → Vault → Hunt)
 * 7. Capability highlights
 * 8. FAQ accordion
 * 9. Final CTA
 * 10. Footer
 */
export default function HomePage() {
  return (
    <PlatformProvider>
      <Header />
      <main>
        <Hero />
        <Features />
        <WhyUs />
        <Gallery />
        <HowItWorks />
        <Stats />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </PlatformProvider>
  );
}
