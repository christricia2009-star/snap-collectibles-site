"use client";

import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Social-proof / stats band.
 * Update the stats array with real metrics when available.
 * Numbers animate when the section enters the viewport.
 */

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  /** If true, display value as-is with decimals handled simply */
  decimals?: number;
};

const stats: Stat[] = [
  { value: 5, suffix: "+", label: "Marketplaces priced" },
  { value: 100, suffix: "+", label: "Beta testers welcome" },
  { value: 5, suffix: "", label: "Listing draft platforms" },
  { value: 2, suffix: "", label: "Platforms: iOS & Android" },
];

function AnimatedNumber({
  value,
  decimals = 0,
}: {
  value: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 24 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsub = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent =
          decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toLocaleString();
      }
    });
    return unsub;
  }, [spring, decimals]);

  return <span ref={ref}>0</span>;
}

export default function Stats() {
  return (
    <section
      id="stats"
      className="relative border-y border-border-subtle bg-bg-elevated py-16 sm:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple/5 via-transparent to-pink/5"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl font-bold tracking-tight text-text sm:text-4xl md:text-5xl">
                {stat.prefix}
                <span className="text-gradient">
                  <AnimatedNumber
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                  />
                </span>
                {stat.suffix}
              </p>
              <p className="mt-2 text-sm font-medium text-text-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-[11px] text-text-dim">
          Private beta on iOS &amp; Android — the same portfolio, scan, and sell
          tools on both platforms.
        </p>
      </div>
    </section>
  );
}
