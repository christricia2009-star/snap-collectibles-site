import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms & Copyright — Snap Collectibles",
  description:
    "Terms of use and copyright notice for Snap Collectibles apps and website.",
};

const CONTACT_EMAIL = "Testing@snapcollectibles.com";

export default function TermsPage() {
  const year = new Date().getFullYear();

  return (
    <LegalPageShell
      title="Terms of Use & Copyright"
      description="Simple terms covering use of the Snap Collectibles website, apps, and related early access services."
      lastUpdated="August 7, 2026"
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">1. Acceptance</h2>
        <p>
          By accessing snapcollectibles.com or using the Snap Collectibles iOS
          or Android applications (including private beta builds), you agree to
          these Terms. If you do not agree, do not use the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">2. Copyright notice</h2>
        <p>
          © {year} Snap Collectibles. All rights reserved. The Snap Collectibles
          name, logo, app icon, website design, software, screenshots, and other
          content are protected by copyright and other intellectual property
          laws. You may not copy, modify, distribute, sell, or reverse engineer
          our software or branding without prior written permission, except as
          allowed by applicable law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          3. License to use the app
        </h2>
        <p>
          Subject to these Terms, we grant you a limited, non-exclusive,
          non-transferable, revocable license to use Snap Collectibles for your
          personal, non-commercial use on devices you own or control. Beta
          access may be limited, time-bound, or withdrawn at any time.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          4. Early access &amp; software
        </h2>
        <p>
          During private testing or early access, the app may contain bugs or
          incomplete features. The service is provided “as is” without
          warranties of any kind. Sold comps, marketplace price helpers, and
          item identifications are research aids only — not professional
          appraisals, guarantees of value, or financial advice. Always verify
          important decisions independently.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          5. Trades between users
        </h2>
        <p>
          Trade features (offers, feed, chat, and optional contact helpers) are
          peer-to-peer between collectors. Snap Collectibles does not insure
          trades, guarantee delivery, authenticity, or outcomes between users,
          or act as a party to your agreements. You are responsible for how you
          trade and for any contact information you choose to share.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          6. Your content &amp; responsibilities
        </h2>
        <p>
          You retain rights to collection data and photos you submit. You grant
          us a license to process that content solely to provide and improve the
          service (for example, scanning and cataloging). You agree not to
          misuse the app, attempt unauthorized access, or upload unlawful or
          infringing material.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          7. Third-party services
        </h2>
        <p>
          The app may reference or link to third-party sites and marketplaces
          (such as eBay). We are not responsible for third-party content,
          policies, or transactions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          8. Disclaimer &amp; limitation of liability
        </h2>
        <p>
          To the fullest extent permitted by law, Snap Collectibles and its
          operators are not liable for indirect, incidental, special,
          consequential, or punitive damages, or for lost profits, data, or
          collection value, arising from your use of the service — including
          peer-to-peer trades between users. Our total liability for any claim
          relating to the service is limited to the greater of (a) amounts you
          paid us in the 12 months before the claim, or (b) zero if the service
          is free (including early access).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">9. Termination</h2>
        <p>
          We may suspend or end access to early access or the service at any
          time. You may stop using the app at any time and request deletion of
          your data as described in our{" "}
          <Link
            href="/privacy"
            className="text-purple-bright underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">10. Changes</h2>
        <p>
          We may update these Terms by posting a new version on this page. The
          “Last updated” date will change when we do. Continued use after
          changes constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">11. Contact</h2>
        <p>
          Questions about these Terms or copyright:{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-purple-bright underline-offset-2 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </LegalPageShell>
  );
}
