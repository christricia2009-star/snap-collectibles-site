import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Link className="brand" href="/#top">
            <Image src="/icon.jpg" alt="" width={28} height={28} />
            <span className="brand-name">Snap Collectibles</span>
          </Link>
          <p>
            The permanent digital home for serious collectors. Scan, catalog,
            trade — category-first on purpose.
          </p>
        </div>
        <div className="footer-col">
          <h2>Product</h2>
          <Link href="/#scan">Scan</Link>
          <Link href="/#vault">Vault</Link>
          <Link href="/#hunt">Hunt</Link>
          <Link href="/#trade">Trade</Link>
        </div>
        <div className="footer-col">
          <h2>Trust</h2>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/support">Support</Link>
        </div>
        <div className="footer-col">
          <h2>Get it</h2>
          <Link href="/#download">Request beta</Link>
          <span className="muted">iOS + Android beta</span>
        </div>
      </div>
      <div className="wrap footer-legal">
        <span>© {year} Snap Collectibles. All rights reserved.</span>
        <span>Category-first · Comps are research · iOS + Android beta</span>
      </div>
    </footer>
  );
}
