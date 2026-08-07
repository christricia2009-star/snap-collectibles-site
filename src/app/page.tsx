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
 *
 * Section order:
 * 1. Sticky header (platform switcher + early access)
 * 2. Hero (scan / track / value / trade + soft App Store CTA)
 * 3. Features grid (aligned to shipping iOS capabilities)
 * 4. Why Snap Collectibles (comparison)
 * 5. Screenshot gallery (platform-aware)
 * 6. How it works (Scan → Save → Value → Trade)
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
