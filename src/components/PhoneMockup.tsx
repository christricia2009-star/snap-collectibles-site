/**
 * Stylized iPhone frame used as a placeholder for app screenshots.
 * Swap the inner content / image when real assets are ready.
 */

type PhoneMockupProps = {
  /** Label shown inside the screen (placeholder) */
  label?: string;
  /** Optional accent gradient for the screen interior */
  accent?: "purple" | "pink" | "gold" | "mixed";
  className?: string;
  /** Optional image URL to place inside the phone */
  imageSrc?: string;
  imageAlt?: string;
};

const accentGradients: Record<NonNullable<PhoneMockupProps["accent"]>, string> = {
  purple: "from-purple/30 via-bg-elevated to-bg",
  pink: "from-pink/30 via-bg-elevated to-bg",
  gold: "from-gold/20 via-bg-elevated to-bg",
  mixed: "from-purple/25 via-pink/15 to-bg",
};

export default function PhoneMockup({
  label = "App Screenshot",
  accent = "mixed",
  className = "",
  imageSrc,
  imageAlt = "Snap Collectibles app screenshot",
}: PhoneMockupProps) {
  return (
    <div
      className={`relative mx-auto w-[220px] sm:w-[260px] md:w-[280px] ${className}`}
      aria-hidden={imageSrc ? undefined : true}
    >
      {/* Outer bezel */}
      <div className="relative rounded-[2.5rem] border-[3px] border-border bg-bg-elevated p-2 shadow-2xl ring-1 ring-white/5">
        {/* Side button accents */}
        <div className="absolute -left-[5px] top-24 h-8 w-[3px] rounded-l bg-border" />
        <div className="absolute -left-[5px] top-36 h-12 w-[3px] rounded-l bg-border" />
        <div className="absolute -left-[5px] top-52 h-12 w-[3px] rounded-l bg-border" />
        <div className="absolute -right-[5px] top-40 h-16 w-[3px] rounded-r bg-border" />

        {/* Screen */}
        <div
          className={`relative aspect-[9/19.5] overflow-hidden rounded-[2rem] bg-gradient-to-b ${accentGradients[accent]}`}
        >
          {imageSrc ? (
            // Real screenshot — no extra Dynamic Island (device chrome is in the frame)
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            /* Placeholder content when no screenshot is provided */
            <>
              <div className="absolute left-1/2 top-3 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 pt-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple to-pink shadow-lg glow-purple">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="h-7 w-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-center text-xs font-medium text-text-muted">
                  {label}
                </p>
                <div className="mt-4 w-full space-y-2">
                  <div className="h-2.5 w-3/4 rounded-full bg-white/10" />
                  <div className="h-2.5 w-full rounded-full bg-white/5" />
                  <div className="h-2.5 w-5/6 rounded-full bg-white/5" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="h-16 rounded-xl bg-white/5 ring-1 ring-white/5" />
                    <div className="h-16 rounded-xl bg-white/5 ring-1 ring-white/5" />
                    <div className="h-16 rounded-xl bg-white/5 ring-1 ring-white/5" />
                    <div className="h-16 rounded-xl bg-white/5 ring-1 ring-white/5" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
