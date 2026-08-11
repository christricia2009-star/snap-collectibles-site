"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type SectionHeadingProps = {
  /** Small uppercase label above the title */
  eyebrow?: string;
  /** Main heading */
  title: ReactNode;
  /** Optional supporting copy */
  subtitle?: ReactNode;
  /** Center or left align */
  align?: "center" | "left";
  className?: string;
};

/**
 * Reusable section title with scroll-triggered fade-in.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-3xl ${alignClass} ${className}`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-purple-bright">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl md:text-[2.75rem] md:leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
