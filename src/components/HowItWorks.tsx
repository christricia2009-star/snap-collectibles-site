const steps = [
  {
    title: "Snap with a category",
    description:
      "Open Scan, pick what you’re holding, capture a photo or barcode. Multi-item snaps and duplicate warnings keep the vault clean from the first add.",
  },
  {
    title: "Review before you save",
    description:
      "Rarity signals, packaging cues, sold ranges, deal score, coach Q&A. Research helpers — not a formal appraisal.",
  },
  {
    title: "Run the vault",
    description:
      "Portfolio home tracks ranges, P/L, grails, and goals. Organize with list, grid, My Shelf, smart collections, and the Tools hub.",
  },
  {
    title: "Hunt, sell, trade",
    description:
      "Hunter Mode at the pegs. Sell with fees and P/L. Trade with matches, chat, and fair equity — peer-to-peer, uninsured.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">How it works</p>
          <h2 className="display">Snap. Review. Vault. Hunt.</h2>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <article className="step" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
