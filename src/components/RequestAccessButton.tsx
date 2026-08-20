type RequestAccessButtonProps = {
  label?: string;
  className?: string;
};

/**
 * Primary CTA — jumps to the on-page beta form.
 */
export default function RequestAccessButton({
  label = "Request beta access",
  className = "",
}: RequestAccessButtonProps) {
  return (
    <a className={`btn btn-primary ${className}`.trim()} href="#download">
      {label}
    </a>
  );
}
