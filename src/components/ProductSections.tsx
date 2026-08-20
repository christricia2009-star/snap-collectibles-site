"use client";

import Device from "./Device";
import { usePlatform } from "@/lib/platform";
import { getScreenshots } from "@/lib/screenshots";

/**
 * Split product sections with device frames — Scan, Vault, Hunt, Trade.
 */
export default function ProductSections() {
  const { platform } = usePlatform();
  const shots = getScreenshots(platform);

  return (
    <>
      <section className="section" id="scan">
        <div className="wrap split">
          <div>
            <p className="kicker">
              Scan <span className="badge badge-live">Live</span>
            </p>
            <h2 className="display">If you skip the review, the vault is guessing.</h2>
            <p className="lede">
              Pick a category. Snap a photo or barcode. Then actually look at
              what came back — rarity, packaging, sold ranges, deal score —
              before you save.
            </p>
            <p className="muted">
              Multi-item snaps and duplicate warnings keep the vault clean from
              the first add. Collector Coach Q&amp;A sits on the same screen.
              Check My Collection by photo, library, barcode, or name so you
              don’t rebuy at a con.
            </p>
            <ul className="feature-list">
              <li>Category-first ID, not a generic “point at toy” blob.</li>
              <li>Rarity signals and packaging cues on the review screen.</li>
              <li>Live sold ranges and a deal score before save.</li>
              <li>Barcode, photo, or library. Duplicate warnings on snap.</li>
              <li>Research helpers — not a formal appraisal.</li>
            </ul>
          </div>
          <div className="device-pair">
            <Device src={shots.scan.src} alt={shots.scan.alt} caption="Category scan" />
            <Device
              src={(shots.filter ?? shots.scan).src}
              alt={(shots.filter ?? shots.scan).alt}
              caption={shots.filter?.label ?? "Review"}
            />
          </div>
        </div>
      </section>

      <section className="section" id="vault" style={{ paddingTop: 0 }}>
        <div className="wrap split reverse">
          <div>
            <p className="kicker">
              Vault <span className="badge badge-live">Live</span>
            </p>
            <h2 className="display">A real portfolio. Not a photo dump.</h2>
            <p className="lede">
              Home is a vault dashboard: low / avg / high ranges, what you paid
              vs market, short-window movers, grails, goals, and snapshots.
            </p>
            <p className="muted">
              List, grid, and My Shelf with category filters. Wishlist. Quiet
              price refresh when you open the app. Home Screen widgets when the
              widget target is installed. Sign in with Apple for iCloud backup
              and restore.
            </p>
            <ul className="feature-list">
              <li>Unrealized P/L versus what you paid.</li>
              <li>Health-style signals, grails, favorites, activity.</li>
              <li>Backup status on Home so a beta vault is less likely to vanish.</li>
              <li>JSON / CSV import and export. Insurance inventory export.</li>
            </ul>
          </div>
          <div className="device-pair">
            <Device
              src={shots.collection.src}
              alt={shots.collection.alt}
              caption="Collection"
            />
            <Device
              src={shots.marketValue.src}
              alt={shots.marketValue.alt}
              caption={shots.marketValue.label}
            />
          </div>
        </div>
      </section>

      <section className="ember-band">
        <div className="wrap">
          <p className="kicker">Aisle honesty</p>
          <h2 className="display">Scan apps answer “what is this?”</h2>
          <p className="lede" style={{ maxWidth: "46ch" }}>
            Snap Collectibles answers should I buy it, what is my vault worth,
            how do I sell or trade it, and did I already own this.
          </p>
        </div>
      </section>

      <section className="section" id="hunt">
        <div className="wrap split">
          <div>
            <p className="kicker">
              Hunter Mode <span className="badge badge-live">Live</span>
            </p>
            <h2 className="display">Shelf price in. Buy or pass out.</h2>
            <p className="lede">
              Built for the aisle. Set a shelf price, snap or scan the peg, get
              deal-score style edge in seconds.
            </p>
            <p className="muted">
              Track a whole store trip. Grade the passes you walked away from
              later against refreshed comps. Results are research helpers — not
              a guarantee you’ll profit.
            </p>
            <ul className="feature-list">
              <li>Strong Buy / Buy / Hold / Pass against sold comps.</li>
              <li>Hunt sessions with trip edge reports.</li>
              <li>Walk-away ledger that grades the ones you left.</li>
              <li>Offline hunt queue when the store has no bars.</li>
            </ul>
          </div>
          <Device
            className="device-solo"
            src={shots.scan.src}
            alt={shots.scan.alt}
            caption="Hunter loop"
          />
        </div>
      </section>

      <section className="section" id="trade" style={{ paddingTop: 0 }}>
        <div className="wrap split reverse">
          <div>
            <p className="kicker">
              Sell &amp; trade <span className="badge badge-live">Live</span>
            </p>
            <h2 className="display">Move product. Don’t just photograph it.</h2>
            <p className="lede">
              Mark sold with fees and P/L. Draft listings. Trade with matches,
              chat, and fair equity checks.
            </p>
            <p className="muted">
              Where-to-list helpers for eBay, Mercari, Whatnot, Depop.
              Tax-friendly CSV. Trades are peer-to-peer. We don’t insure deals
              or guarantee authenticity between collectors.
            </p>
            <ul className="feature-list">
              <li>Listed / sold with fees and P/L.</li>
              <li>Trade board, inventory pick, in-app chat.</li>
              <li>Fair equity and checklist before you commit.</li>
              <li>Optional contact helpers (username / Facebook).</li>
            </ul>
          </div>
          <div className="device-pair">
            <Device src={shots.selling.src} alt={shots.selling.alt} caption="Selling" />
            <Device
              src={(shots.sharing ?? shots.wishlist).src}
              alt={(shots.sharing ?? shots.wishlist).alt}
              caption={(shots.sharing ?? shots.wishlist).label}
            />
          </div>
        </div>
      </section>
    </>
  );
}
