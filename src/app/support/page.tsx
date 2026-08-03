import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Support & Contact — Snap Collectibles",
  description:
    "Get help with Snap Collectibles. Contact Testing@snapcollectibles.com for beta access, support, and general questions.",
};

const TESTING_EMAIL = "Testing@snapcollectibles.com";
const SUPPORT_EMAIL = "support@snapcollectibles.com";

export default function SupportPage() {
  return (
    <LegalPageShell
      title="Support & Contact"
      description="We’re here to help with beta access, app questions, and feedback for Snap Collectibles on iOS and Android."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Contact email</h2>
        <p>
          For beta access requests, testing questions, and general support,
          email:
        </p>
        <p>
          <a
            href={`mailto:${TESTING_EMAIL}`}
            className="text-base font-semibold text-purple-bright underline-offset-2 hover:underline"
          >
            {TESTING_EMAIL}
          </a>
        </p>
        <p className="text-sm text-text-dim">
          You can also reach us at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-purple-bright underline-offset-2 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          Request access to test
        </h2>
        <p>
          Snap Collectibles is in private testing on iOS and Android and is not
          yet available on the App Store or Google Play. To request access,
          email{" "}
          <a
            href={`mailto:${TESTING_EMAIL}`}
            className="text-purple-bright underline-offset-2 hover:underline"
          >
            {TESTING_EMAIL}
          </a>{" "}
          and include:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-text">Name</strong>
          </li>
          <li>
            <strong className="text-text">Email</strong>
          </li>
          <li>
            <strong className="text-text">Platform</strong> (iOS or Android)
          </li>
          <li>
            <strong className="text-text">What you collect</strong> (e.g. Funko,
            sports cards, sneakers)
          </li>
        </ul>
        <p>
          <Link
            href="/#download"
            className="font-medium text-purple-bright underline-offset-2 hover:underline"
          >
            Request access from the home page →
          </Link>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Common topics</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Beta invite status and TestFlight / Android tester setup</li>
          <li>Multi-item scanning and camera permissions</li>
          <li>Collection organization, valuations, and wishlist features</li>
          <li>Bug reports and product feedback</li>
          <li>Privacy or data requests (see our{" "}
            <Link
              href="/privacy"
              className="text-purple-bright underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            )
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Response time</h2>
        <p>
          We aim to reply as quickly as we can during the beta. If you don’t
          hear back within a few business days, feel free to send a short
          follow-up to the same email.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Website</h2>
        <p>
          <a
            href="https://snapcollectibles.com"
            className="text-purple-bright underline-offset-2 hover:underline"
          >
            snapcollectibles.com
          </a>
        </p>
      </section>
    </LegalPageShell>
  );
}
