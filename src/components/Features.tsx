const audiences = [
  {
    title: "Figures",
    body: "Pops, statues, limiteds. Category scan, rarity tells, and a vault that knows what you already own.",
  },
  {
    title: "Cards",
    body: "Sports, TCG, slabs. Sold ranges and deal scores before you drop cash at the case.",
  },
  {
    title: "Sneakers",
    body: "Shelf price in, buy/pass out. Hunter Mode is built for the aisle, not a desk later.",
  },
  {
    title: "Games & more",
    body: "Same garage for LEGO, Loungefly, comics, Hot Wheels. Category-first — not a single-brand catalog.",
  },
];

const pillars = [
  {
    num: "01",
    title: "Category scan",
    body: "Pick the category, snap a photo or barcode, then review rarity, packaging, sold ranges, and deal score before it hits the vault.",
  },
  {
    num: "02",
    title: "Portfolio home",
    body: "Low / avg / high ranges, unrealized P/L, 7-day movers, health, grails, goals. A book for the collection — not a photo dump.",
  },
  {
    num: "03",
    title: "Hunter Mode",
    body: "Set a shelf price, snap the peg, get Strong Buy / Buy / Hold / Pass. Hunt sessions and a walk-away ledger close the loop.",
  },
  {
    num: "04",
    title: "Honest comps",
    body: "Sold comps you can re-check, confidence bands, fee-aware flip math. Research helpers. Not an appraisal. Not a guarantee.",
  },
  {
    num: "05",
    title: "Sell & trade",
    body: "Mark sold with fees, list drafts, tax-friendly CSV. Trade board with chat, matches, and fair equity. Peer-to-peer — we don’t insure deals.",
  },
  {
    num: "06",
    title: "Tools hub",
    body: "Search, smart collections, compare, series tracker, show mode, insurance inventory, exports. One menu for the vault.",
  },
];

/**
 * Who it's for + six permanent pillars.
 */
export default function Features() {
  return (
    <>
      <section className="section" id="who">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Who it’s for</p>
            <h2 className="display">Built for the aisle, not the mall.</h2>
            <p className="lede muted">
              Serious collectors share the same vault. The category changes.
              The loop does not: snap, review, hunt, hold, sell, trade.
            </p>
          </div>
          <div className="audience">
            {audiences.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="features" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Permanent pillars</p>
            <h2 className="display">Six things that do not ship as vapor.</h2>
          </div>
          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article className="pillar" key={pillar.num}>
                <div className="num">{pillar.num}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
