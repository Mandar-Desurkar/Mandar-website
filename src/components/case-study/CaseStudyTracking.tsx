"use client";

// Client leaves for the server-rendered case study page: a view event on mount, and links that
// report which call to action was used before navigating.
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Check, Link2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function CaseStudyView({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent("Viewed Case Study", { slug });
  }, [slug]);
  return null;
}

type Cta = "prototype" | "back" | "source" | "next_case_study" | "contact" | "copy_link";

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

// Copies this case study's address, for forwarding to a hiring panel
export function CopyLinkButton({ slug, className }: { slug: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        navigator.clipboard?.writeText(window.location.href.split("#")[0]).then(() => setCopied(true), () => {});
        trackEvent("Clicked Case Study CTA", { slug, cta: "copy_link" });
      }}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}
