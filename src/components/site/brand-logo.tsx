import Link from "next/link";

export const LOGO_SRC = "/images/yesly-logo.png";

type BrandLogoProps = {
  className?: string;
  href?: string | null;
};

/**
 * The Yesly wordmark supplied by the client
 * (public/yesly_wedding_marketplace_design_system/logo.png/screen.png).
 */
export function BrandLogo({ className = "h-9 w-auto", href = "/" }: BrandLogoProps) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Yesly — Wedding Marketplace"
      width={480}
      height={128}
      className={`block shrink-0 ${className}`}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} className="flex items-center" aria-label="Yesly home">
      {image}
    </Link>
  );
}
