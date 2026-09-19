import Image from "next/image";

type NotchFrameProps = {
  src: string;
  alt: string;
  /** Caption shown in the notched chip. Omit for an uncaptioned frame. */
  tag?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Rounded, notched image frame — the site's signature media treatment. */
export function NotchFrame({
  src,
  alt,
  tag,
  className = "",
  sizes = "(max-width: 980px) 100vw, 50vw",
  priority = false,
}: NotchFrameProps) {
  const classes = ["frame", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <Image
        className="real"
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
      />
      {tag ? (
        <span className="notch">
          <span className="tag">{tag}</span>
        </span>
      ) : null}
    </div>
  );
}
