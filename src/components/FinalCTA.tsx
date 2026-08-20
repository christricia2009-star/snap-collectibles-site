import BetaForm from "./BetaForm";
import { BETA_INBOX } from "@/lib/testing";

/**
 * Conversion panel — BassheadOS beta form, not a mailto button.
 */
export default function FinalCTA() {
  return (
    <section className="section" id="download">
      <div className="wrap">
        <div className="cta-panel">
          <p className="kicker">Beta</p>
          <h2 className="display">iOS and Android. Both in beta.</h2>
          <p className="lede muted" style={{ maxWidth: "44ch" }}>
            Snap Collectibles is in closed beta on iPhone / iPad and on Android.
            Request a tester slot. We get App name, phone OS, and your email —
            nothing else.
          </p>
          <div className="btn-row" style={{ marginTop: 8 }}>
            <span className="store-btn" aria-disabled="true">
              <small>In beta</small>
              <b>iOS</b>
            </span>
            <span className="store-btn" aria-disabled="true">
              <small>In beta</small>
              <b>Android</b>
            </span>
          </div>
          <BetaForm />
          <p className="form-note" style={{ marginTop: 16 }}>
            Support: <span className="mono">{BETA_INBOX}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
