import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Snap Collectibles",
  description:
    "Privacy policy for the Snap Collectibles iOS and Android apps and website. How we collect, use, and protect your data.",
};

const CONTACT_EMAIL = "Testing@snapcollectibles.com";
const SUPPORT_EMAIL = "support@snapcollectibles.com";

/**
 * Privacy Policy suitable for App Store / Google Play listings.
 * Not formal legal advice — review with counsel before public launch if needed.
 */
export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="This Privacy Policy explains how Snap Collectibles (“we,” “us,” or “our”) collects, uses, and shares information when you use our mobile applications and website."
      lastUpdated="August 3, 2026"
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">1. Who we are</h2>
        <p>
          Snap Collectibles is a collectibles cataloging and valuation app for
          iOS and Android. Our website is available at{" "}
          <a
            href="https://snapcollectibles.com"
            className="text-purple-bright underline-offset-2 hover:underline"
          >
            snapcollectibles.com
          </a>
          . For privacy questions, contact us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-purple-bright underline-offset-2 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          or{" "}
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
          2. Information we collect
        </h2>
        <p>Depending on how you use the app and site, we may collect:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-text">Account &amp; contact information</strong>{" "}
            — such as name and email address when you request beta access or
            contact support.
          </li>
          <li>
            <strong className="text-text">Collection data you provide</strong>{" "}
            — item names, notes, tags, wishlists, quantities, and other details
            you enter to organize your collection.
          </li>
          <li>
            <strong className="text-text">Photos and camera input</strong> — images
            you capture or select so we can identify items (including multi-item
            detection in a single photo) and barcode scanning where supported.
            Camera and photo library access is used only when you choose to scan
            or add an image.
          </li>
          <li>
            <strong className="text-text">Device &amp; usage information</strong>{" "}
            — device type, operating system, app version, crash logs, and basic
            analytics that help us improve reliability and performance.
          </li>
          <li>
            <strong className="text-text">Website data</strong> — standard server
            logs and cookies or similar technologies if used on our website for
            security, preferences, or analytics.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          3. How we use information
        </h2>
        <p>We use information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Provide core features: multi-item photo scanning, barcode scanning,
            item identification, collection organization, wishlists, and related
            tools.
          </li>
          <li>
            Estimate market values using publicly available market data (such as
            eBay sold comps) and show valuation information in the app.
          </li>
          <li>Respond to support and beta access requests.</li>
          <li>Maintain security, debug issues, and improve the product.</li>
          <li>
            Comply with legal obligations and enforce our terms when necessary.
          </li>
        </ul>
        <p>
          We do not sell your personal information. We do not use your collection
          photos for advertising without your consent.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          4. Camera, photos, and barcode scanning
        </h2>
        <p>
          Snap Collectibles requests camera and/or photo library permission so
          you can scan barcodes and photograph collectibles — including detecting
          multiple items in one photo. Images are processed to identify items and
          may be uploaded to our services (or trusted processors) solely to
          deliver identification and cataloging features. You can deny camera or
          photo access in system settings; some scan features will not work
          without it, but you may still be able to add items manually where
          available.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          5. Third-party services
        </h2>
        <p>
          We may use third-party services to operate the app and website,
          including:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-text">Cloud hosting &amp; storage</strong> —
            to run the service and store account or collection data securely.
          </li>
          <li>
            <strong className="text-text">Analytics &amp; crash reporting</strong>{" "}
            — to understand app stability and usage in aggregate.
          </li>
          <li>
            <strong className="text-text">Market data sources</strong> — such as
            publicly available eBay sold listings or similar sources used to
            estimate values. Those services have their own privacy policies.
          </li>
          <li>
            <strong className="text-text">Email &amp; communication tools</strong>{" "}
            — to handle beta invites and support messages.
          </li>
        </ul>
        <p>
          These providers process data only as needed to provide services to us
          and are expected to protect it appropriately. We do not control
          third-party websites or marketplaces you open from the app.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          6. Data retention &amp; security
        </h2>
        <p>
          We retain information only as long as needed to provide the service,
          comply with law, resolve disputes, and enforce agreements. We use
          reasonable administrative, technical, and organizational measures to
          protect data. No method of transmission or storage is 100% secure; we
          cannot guarantee absolute security.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          7. Sharing of information
        </h2>
        <p>We may share information:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>With service providers who help us operate Snap Collectibles.</li>
          <li>
            When you choose to export or share collection data yourself.
          </li>
          <li>
            If required by law, legal process, or to protect rights, safety, and
            security.
          </li>
          <li>
            In connection with a merger, acquisition, or sale of assets, with
            notice where required.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          8. Children&apos;s privacy
        </h2>
        <p>
          Snap Collectibles is not directed to children under 13 (or the minimum
          age required in your jurisdiction). We do not knowingly collect
          personal information from children. If you believe a child has provided
          us information, contact us and we will take appropriate steps to
          delete it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          9. Your choices &amp; rights
        </h2>
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, or export personal data, or to object to or restrict certain
          processing. You can manage camera and photo permissions in your device
          settings. To request access or deletion of your data, email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-purple-bright underline-offset-2 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          . We may need to verify your request before fulfilling it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          10. International users
        </h2>
        <p>
          If you use Snap Collectibles from outside the country where our
          servers or providers operate, your information may be transferred to
          and processed in other countries that may have different data
          protection laws. We take steps designed to protect your information
          consistent with this policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">
          11. Changes to this policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the
          revised version on this page and update the “Last updated” date. For
          material changes, we may provide additional notice in the app or by
          email when appropriate. Continued use of the service after changes
          means you accept the updated policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">12. Contact us</h2>
        <p>
          Questions about this Privacy Policy or our data practices:
        </p>
        <ul className="list-none space-y-1 pl-0">
          <li>
            Email:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-purple-bright underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>
            Support:{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-purple-bright underline-offset-2 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </li>
          <li>
            Website:{" "}
            <a
              href="https://snapcollectibles.com"
              className="text-purple-bright underline-offset-2 hover:underline"
            >
              snapcollectibles.com
            </a>
          </li>
        </ul>
      </section>
    </LegalPageShell>
  );
}
