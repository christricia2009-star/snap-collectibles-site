type DeviceProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
};

/**
 * BassheadOS-style device frame for app screenshots.
 */
export default function Device({ src, alt, caption, className = "" }: DeviceProps) {
  return (
    <figure className={`device ${className}`.trim()}>
      {/* Screenshots are already device captures; native img keeps object-fit cover sharp. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={804} height={1748} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
