"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";
import PhoneMockup from "./PhoneMockup";
import { screenshots } from "@/lib/screenshots";

/**
 * Visual / screenshot gallery using real app screenshots from /public/screenshots/.
 */

const shots = [
  { ...screenshots.scan, accent: "purple" as const },
  { ...screenshots.marketValue, accent: "gold" as const },
  { ...screenshots.collection, accent: "pink" as const },
  { ...screenshots.wishlist, accent: "mixed" as const },
  { ...screenshots.selling, accent: "gold" as const },
  { ...screenshots.settings, accent: "purple" as const },
];

export default function Gallery() {
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
          subtitle="Real screens from Snap Collectibles — scan, value, organize, wishlist, sell, and manage everything in one place."
        />

        <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {shots.map((shot, i) => (
            <motion.div
              key={shot.label}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
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
        </div>
      </div>
    </section>
  );
}
