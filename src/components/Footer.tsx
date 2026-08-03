/**
 * Simple site footer with legal links and copyright.
 * Update support email and privacy URL as needed.
 */

const SUPPORT_EMAIL = "support@snapcollectibles.com";
const PRIVACY_URL = "/privacy"; // TODO: replace with real privacy policy URL
const SITE_URL = "https://snapcollectibles.com";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-bg-elevated">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-sm font-semibold text-text">
            Snap <span className="text-gradient">Collectibles</span>
          </p>
          <a
            href={SITE_URL}
            className="text-xs text-text-dim transition-colors hover:text-text-muted"
            target="_blank"
            rel="noopener noreferrer"
          >
            snapcollectibles.com
          </a>
        </div>

        {/* Links */}
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-muted"
          aria-label="Footer"
        >
          <a
            href={PRIVACY_URL}
            className="transition-colors hover:text-text"
          >
            Privacy
          </a>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="transition-colors hover:text-text"
          >
            Support
          </a>
          <a
            href="#faq"
            className="transition-colors hover:text-text"
          >
            FAQ
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-text-dim">
          © {year} Snap Collectibles. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
