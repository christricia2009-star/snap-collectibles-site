"use client";

import Device from "./Device";
import PlatformSwitcher from "./PlatformSwitcher";
import { usePlatform } from "@/lib/platform";
import { getGalleryShots } from "@/lib/screenshots";

/**
 * Horizontal device-row of real screens — BassheadOS gallery language.
 */
export default function Gallery() {
  const { platform, label: platformLabel } = usePlatform();
  const shots = getGalleryShots(platform);

  return (
    <section className="section" id="gallery">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Product</p>
          <h2 className="display">A closer look at the experience.</h2>
          <p className="lede muted">
            Real screens from Snap Collectibles. Switch platforms to preview
            available builds.
          </p>
          <PlatformSwitcher />
        </div>
      </div>
      <div className="wrap">
        <div className="device-row">
          {shots.map((shot) => (
            <Device
              key={`${platform}-${shot.src}`}
              src={shot.src}
              alt={shot.alt}
              caption={shot.label}
            />
          ))}
        </div>
        <p className="muted" style={{ fontSize: 13, textAlign: "center" }}>
          Showing {platformLabel} screens · Feature set evolves with each build
        </p>
      </div>
    </section>
  );
}
