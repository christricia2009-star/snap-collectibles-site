"use client";

import { AnimatePresence, motion } from "motion/react";
import SectionHeading from "./SectionHeading";
import PhoneMockup from "./PhoneMockup";
import PlatformSwitcher from "./PlatformSwitcher";
import { usePlatform } from "@/lib/platform";
import { getGalleryShots } from "@/lib/screenshots";

/**
 * Visual / screenshot gallery — swaps assets when the platform switcher changes.
 */
export default function Gallery() {
  const { platform, label: platformLabel } = usePlatform();
  const shots = getGalleryShots(platform);

  return (
    <section id="gallery" className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple/5 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Product"
          title="A closer look at the experience"
          subtitle="Real screens from Snap Collectibles — multi-item scan, value, organize, wishlist, sell, and manage everything in one place. Switch platforms to preview iOS or Android."
        />

        <div className="mt-8 flex justify-center">
          <PlatformSwitcher size="sm" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8"
          >
            {shots.map((shot, i) => (
              <motion.div
                key={`${platform}-${shot.src}`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
              >
                <PhoneMockup
                  label={shot.label}
                  imageSrc={shot.src}
                  imageAlt={shot.alt}
                  accent={shot.accent}
                />
                <p className="mt-4 text-center text-sm font-medium text-text-muted">
                  {shot.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-center text-xs text-text-dim">
          Showing {platformLabel} screens · Multi-item scanning on both platforms
        </p>
      </div>
    </section>
  );
}
