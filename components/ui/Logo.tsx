import Image from "next/image";

/** OGA PLASTIC logo — uses the actual brochure icon (hand holding gear). */
export function LogoIcon({
  className = "",
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/images/logo-icon.png"
      alt="OGA PLASTIC logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
      priority
    />
  );
}

/** White version for dark backgrounds — CSS filter inverts + adjusts hue to white. */
export function LogoMonoWhite({
  className = "",
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/images/logo-icon.png"
      alt="OGA PLASTIC logo"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: "contain",
        filter: "brightness(0) invert(1)",
      }}
      priority
    />
  );
}

/** Full logo lockup: icon + wordmark text. */
export function LogoFull({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const textColor =
    variant === "light" ? "white" : "var(--oga-teal-deep)";
  return (
    <div className="flex items-center gap-3">
      {variant === "light" ? (
        <LogoMonoWhite size={40} />
      ) : (
        <LogoIcon size={40} />
      )}
      <div className="leading-tight">
        <div
          className="text-sm font-bold tracking-wide"
          style={{ color: textColor, fontFamily: "var(--font-body)" }}
        >
          OGA PLASTIC
        </div>
        <div
          className="text-[0.6rem] tracking-widest opacity-70"
          style={{ color: textColor, fontFamily: "var(--font-body)" }}
        >
          MANUFACTURING NIG. LTD
        </div>
      </div>
    </div>
  );
}
