type Row = {
  capability: string;
  others: string;
  snap: string;
};

const rows: Row[] = [
  {
    capability: "After you scan",
    others: "ID + a value estimate, then save",
    snap: "Full review: rarity, packaging, sold ranges, deal score, coach Q&A",
  },
  {
    capability: "Market data",
    others: "One estimated range (often opaque)",
    snap: "Sold comps you can re-check, confidence, fee-aware flip math",
  },
  {
    capability: "In-store hunting",
    others: "Scan later at home if you remember",
    snap: "Hunter Mode: shelf price → Strong Buy / Buy / Hold / Pass",
  },
  {
    capability: "Hunt memory",
    others: "Notes app or nothing",
    snap: "Hunt sessions + trip edge + walk-away ledger",
  },
  {
    capability: "Portfolio",
    others: "A list (maybe a sum)",
    snap: "Live ranges, unrealized P/L, movers, health, grails, widgets",
  },
  {
    capability: "Avoid rebuying",
    others: "Hope you remember what you own",
    snap: "Check My Collection + duplicate warnings on snap",
  },
  {
    capability: "Selling",
    others: "You’re on your own after the scan",
    snap: "Listed/sold with fees & P/L, list drafts, tax CSV",
  },
  {
    capability: "Trading",
    others: "Facebook groups and DMs",
    snap: "Trade board, chat, matches, fair equity & checklist",
  },
];

const extras = [
  "Sign in with Apple · iCloud backup & restore",
  "Check My Collection (photo, library, barcode, name)",
  "Duplicates & identity merge · quiet price refresh",
  "Home Screen portfolio widgets snapshot",
  "Events, messages, app lock, block / report",
  "Share shelf, print checklist, insurance inventory",
  "Vault DNA hunter style · Collector Academy playbooks",
  "Tools hub: search, smart collections, compare, series, show mode",
];

export default function WhyUs() {
  return (
    <section className="section" id="why-us">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Why we’re better</p>
          <h2 className="display">Scan-and-forget is table stakes.</h2>
          <p className="lede muted">
            ToyWorth-class apps excel at snap → estimate → save. Snap Collectibles
            does that loop, then keeps going: aisle-ready Hunter Mode, a
            portfolio that tracks P/L, full sell/trade rails, and tools so you
            never rebuy a duplicate at a con.
          </p>
        </div>

        <div className="desk-only">
          <div className="compare">
            <table>
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>ToyWorth &amp; typical apps</th>
                  <th className="snap">Snap Collectibles</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.capability}>
                    <td>{row.capability}</td>
                    <td className="muted">{row.others}</td>
                    <td>{row.snap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="compare-mobile mobile-only">
          {rows.map((row) => (
            <article key={row.capability}>
              <h4>{row.capability}</h4>
              <p>
                <span className="mono">Others · </span>
                {row.others}
              </p>
              <p>
                <span className="mono" style={{ color: "var(--yellow)" }}>
                  Snap ·{" "}
                </span>
                {row.snap}
              </p>
            </article>
          ))}
        </div>

        <p style={{ marginTop: 28 }} className="kicker">
          Also included
        </p>
        <ul className="feature-list">
          {extras.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
