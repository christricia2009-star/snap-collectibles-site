import {
  Header,
  Hero,
  Features,
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
 * 2. Hero (platform switcher, multi-item scanning, request access)
 * 3. Features grid
 * 4. Screenshot gallery (platform-aware)
 * 5. How it works
 * 6. Stats / social proof
 * 7. FAQ accordion
 * 8. Final CTA
 * 9. Footer
 */
export default function HomePage() {
  return (
    <PlatformProvider>
      <Header />
      <main>
        <Hero />
        <Features />
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
