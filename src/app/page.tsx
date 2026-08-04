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
 * 1. Sticky header (platform switcher + request access)
 * 2. Hero (portfolio-first headline, platform switcher, request access)
 * 3. Features grid
 * 4. Why Snap Collectibles (comparison)
 * 5. Screenshot gallery (platform-aware)
 * 6. How it works
 * 7. Stats / social proof
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
