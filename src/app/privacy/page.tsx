import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Snap Collectibles",
  description: "Privacy policy for the Snap Collectibles iOS app and website.",
};

/**
 * Placeholder privacy page.
 * Replace body copy with your full legal privacy policy before launch.
 */
export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-16 sm:px-6">
      <Link
        href="/"
        className="text-sm font-medium text-text-muted transition-colors hover:text-text"
      >
        ← Back to home
      </Link>
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-text">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-text-dim">Last updated: placeholder</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-text-muted">
        <p>
          This is a placeholder privacy policy for{" "}
          <strong className="text-text">Snap Collectibles</strong>. Replace this
          content with your full legal privacy policy before public launch.
        </p>
        <p>
          We take your privacy seriously. Collection data you add in the app is
          used to provide identification, valuation, and organization features.
          For questions, contact{" "}
          <a
            href="mailto:support@snapcollectibles.com"
            className="text-purple-bright underline-offset-2 hover:underline"
          >
            support@snapcollectibles.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
