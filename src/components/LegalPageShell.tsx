import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

type LegalPageShellProps = {
  title: string;
  description?: string;
  lastUpdated?: string;
  current?: "privacy" | "support" | "terms";
  children: React.ReactNode;
};

/**
 * Shared chrome for Privacy / Support / Terms — BassheadOS prose page.
 */
export default function LegalPageShell({
  title,
  description,
  lastUpdated,
  current,
  children,
}: LegalPageShellProps) {
  return (
    <>
      <Header current={current} />
      <main id="main" className="section page-hero">
        <article className="wrap prose">
          <p className="kicker">Snap Collectibles</p>
          <h1 className="display display-long">{title}</h1>
          {description ? <p className="lede">{description}</p> : null}
          {lastUpdated ? (
            <p className="muted">Last updated: {lastUpdated}</p>
          ) : null}
          {children}
          <div className="legal-card">
            <p className="kicker" style={{ marginBottom: 8 }}>
              Need something else?
            </p>
            <p>
              <Link href="/">Home</Link>
              {" · "}
              <Link href="/privacy">Privacy</Link>
              {" · "}
              <Link href="/support">Support</Link>
              {" · "}
              <Link href="/terms">Terms</Link>
              {" · "}
              <Link href="/#download">Request beta</Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
