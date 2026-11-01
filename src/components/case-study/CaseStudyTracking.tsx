"use client";

// Client leaves for the server-rendered case study page: a view event on mount, and links that
// report which call to action was used before navigating.
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export function CaseStudyView({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent("Viewed Case Study", { slug });
  }, [slug]);
  return null;
}

type Cta = "prototype" | "back" | "source";

export function TrackedLink({
  slug,
  cta,
  href,
  className,
  external,
  children,
  ariaLabel,
}: {
  slug: string;
  cta: Cta;
  href: string;
  className?: string;
  external?: boolean;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const onClick = () => trackEvent("Clicked Case Study CTA", { slug, cta });
  if (external) {
    return (
      <a href={href} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function TrackedCite({
  slug,
  sourceId,
  n,
  className,
}: {
  slug: string;
  sourceId: string;
  n: number;
  className?: string;
}) {
  return (
    <a
      href={`#source-${n}`}
      className={className}
      aria-label={`Source ${n}`}
      onClick={() => trackEvent("Clicked Case Study Footnote", { slug, source_id: sourceId })}
    >
      {n}
    </a>
  );
}
