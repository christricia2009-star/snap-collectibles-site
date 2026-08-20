"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/#scan", label: "Scan" },
  { href: "/#vault", label: "Vault" },
  { href: "/#hunt", label: "Hunt" },
  { href: "/#trade", label: "Trade" },
  { href: "/privacy", label: "Privacy" },
];

type HeaderProps = {
  current?: "privacy" | "support" | "terms";
};

/**
 * Sticky site header — BassheadOS chrome: frosted bar, display wordmark, mobile drawer.
 */
export default function Header({ current }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap">
          <Link className="brand" href="/#top" aria-label="Snap Collectibles home">
            <Image
              src="/icon.jpg"
              alt=""
              width={28}
              height={28}
              priority
            />
            <span className="brand-name">Snap Collectibles</span>
          </Link>
          <nav className="nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  current && item.href.endsWith(`/${current}`) ? "page" : undefined
                }
              >
                {item.label}
              </Link>
            ))}
            <Link className="btn btn-primary nav-cta" href="/#download">
              Request beta
            </Link>
          </nav>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="bars" aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} onClick={close}>
            {item.label}
          </Link>
        ))}
        <Link href="/#download" onClick={close}>
          Request beta
        </Link>
      </nav>
    </>
  );
}
