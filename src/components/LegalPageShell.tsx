import Link from "next/link";
import Image from "next/image";
import Footer from "./Footer";

type LegalPageShellProps = {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

/**
 * Shared chrome for Privacy / Support / Terms pages.
 * Matches the marketing site dark theme with home navigation.
 */
export default function LegalPageShell({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border-subtle bg-bg-elevated/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="Snap Collectibles home"
          >
            <Image
              src="/icon.jpg"
              alt="Snap Collectibles"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl object-cover shadow-md ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="text-[15px] font-bold tracking-tight text-text sm:text-base">
              Snap <span className="text-gradient">Collectibles</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="relative flex-1">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-purple/10 to-transparent"
          aria-hidden="true"
        />
        <article className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
            Snap Collectibles
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
              {description}
            </p>
          )}
          {lastUpdated && (
            <p className="mt-2 text-sm text-text-dim">
              Last updated: {lastUpdated}
            </p>
          )}
          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-text-muted">
            {children}
          </div>
          <div className="mt-12 rounded-2xl border border-border-subtle bg-bg-card p-5 sm:p-6">
            <p className="text-sm font-medium text-text">Need something else?</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href="/"
                className="font-medium text-purple-bright underline-offset-2 hover:underline"
              >
                Home
              </Link>
              <Link
                href="/privacy"
                className="text-text-muted transition-colors hover:text-text"
              >
                Privacy
              </Link>
              <Link
                href="/support"
                className="text-text-muted transition-colors hover:text-text"
              >
                Support
              </Link>
              <Link
                href="/terms"
                className="text-text-muted transition-colors hover:text-text"
              >
                Terms
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
