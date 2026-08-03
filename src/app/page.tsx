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

/**
 * Snap Collectibles — Marketing landing page
 *
 * Section order:
 * 1. Sticky header
 * 2. Hero
 * 3. Features grid
 * 4. Screenshot / visual gallery
 * 5. How it works
 * 6. Stats / social proof
 * 7. FAQ accordion
 * 8. Final CTA
 * 9. Footer
 *
 * Client components ("use client") are isolated to sections that need
 * motion animations or interactivity. This page itself stays a Server Component.
 */
export default function HomePage() {
  return (
    <>
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
    </>
  );
}
