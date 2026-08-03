/**
 * Site footer with legal links and copyright.
 */

import Image from "next/image";
import Link from "next/link";

const SITE_URL = "https://snapcollectibles.com";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-bg-elevated">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icon.jpg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/10"
            />
            <p className="text-sm font-semibold text-text">
              Snap <span className="text-gradient">Collectibles</span>
            </p>
          </Link>
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
          <Link href="/privacy" className="transition-colors hover:text-text">
            Privacy
          </Link>
          <Link href="/support" className="transition-colors hover:text-text">
            Support
          </Link>
          <Link href="/terms" className="transition-colors hover:text-text">
            Terms
          </Link>
          <Link href="/#faq" className="transition-colors hover:text-text">
            FAQ
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-center text-xs text-text-dim sm:text-right">
          © {year} Snap Collectibles.
          <br className="sm:hidden" /> All rights reserved.
        </p>
      </div>
    </footer>
  );
}
