/**
 * App Store badge — currently disabled (app is in private TestFlight testing).
 * Flip `disabled` to false and set APP_STORE_URL when publicly launched.
 */

const APP_STORE_URL = "https://apps.apple.com/app/snap-collectibles"; // TODO: real URL when live

type AppStoreButtonProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** When true (default), shows a non-interactive “Coming soon” badge */
  disabled?: boolean;
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm gap-2",
  md: "px-5 py-2.5 text-sm gap-2.5",
  lg: "px-7 py-3.5 text-base gap-3",
};

export default function AppStoreButton({
  size = "md",
  className = "",
  disabled = true,
}: AppStoreButtonProps) {
  const content = (
    <>
      {/* Apple logo */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={size === "lg" ? "h-6 w-6" : "h-5 w-5"}
        aria-hidden="true"
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-normal opacity-70 -mb-0.5">
          {disabled ? "Coming soon on the" : "Download on the"}
        </span>
        <span className={size === "lg" ? "text-base" : "text-sm"}>
          App Store
        </span>
      </span>
    </>
  );

  if (disabled) {
    return (
      <span
        className={`
          inline-flex items-center justify-center rounded-xl
          border border-border bg-bg-card text-text-dim font-semibold
          cursor-not-allowed opacity-60 select-none
          ${sizeClasses[size]}
          ${className}
        `}
        title="Not yet available on the App Store — join the beta instead"
        aria-disabled="true"
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group inline-flex items-center justify-center rounded-xl
        bg-white text-black font-semibold
        transition-all duration-300
        hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(168,85,247,0.45)]
        active:scale-[0.98]
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label="Download Snap Collectibles on the App Store"
    >
      {content}
    </a>
  );
}
