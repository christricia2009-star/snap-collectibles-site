"use client";

import PlatformSwitcher from "./PlatformSwitcher";
import Device from "./Device";
import { usePlatform } from "@/lib/platform";
import { getHeroScreenshot, getScreenshots } from "@/lib/screenshots";

/**
 * Hero — BassheadOS layout: giant display type, stacked devices, live chips.
 */
export default function Hero() {
  const { platform, label: platformLabel } = usePlatform();
  const heroShot = getHeroScreenshot(platform);
  const shots = getScreenshots(platform);
  const backShot = shots.scan;

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="kicker">iOS + Android · In beta</p>
          <h1 className="display display-long">
            Snap
            <br />
            Collectibles
          </h1>
          <p className="hero-promise">Scan. Catalog. Trade.</p>
          <p className="hero-pitch">
            The permanent digital home for serious collectors. Snap with
            category-first ID, review rarity and sold ranges before you save,
            run a live portfolio with deal scores and Hunter Mode at the pegs,
            then sell or trade with peers. Not another scan-and-forget tool.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href="#download">
              Request beta access
            </a>
            <a className="btn btn-ghost" href="#vault">
              See the vault
            </a>
          </div>
          <p className="hero-micro">
            {platformLabel} preview · Portfolio home · Hunter Mode · Deal scores
            · iCloud backup when signed in
          </p>
          <div style={{ marginTop: 16 }}>
            <PlatformSwitcher />
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-phones">
            <Device
              className="device-float device-back"
              src={backShot.src}
              alt={backShot.alt}
            />
            <Device
              className="device-float device-main"
              src={heroShot.src}
              alt={heroShot.alt}
            />
          </div>
          <div className="hero-chips">
            <div className="chip">
              <div className="label">Portfolio</div>
              <strong>Live ranges · P/L</strong>
              <span>Grails, movers, health</span>
            </div>
            <div className="chip">
              <div className="label">Hunter Mode</div>
              <strong>Shelf → buy / pass</strong>
              <span>Deal scores at the pegs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
