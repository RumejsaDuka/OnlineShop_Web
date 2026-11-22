import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { formatPrice, type Product } from "@/lib/data";

/** Official wordmark — always the supplied image, never re-typeset. */
export function Logo({ tone = "black", className = "", priority = false }: { tone?: "white" | "black"; className?: string; priority?: boolean }) {
  return (
    <Image
      src={`/images/brand/samueli-fashion-${tone}.png`}
      alt="SAMUELI FASHION"
      width={1367}
      height={480}
      priority={priority}
      className={`w-auto select-none ${className}`}
      draggable={false}
    />
  );
}

export function CountBadge({ count, className = "" }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden
      className={`absolute -right-1.5 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red px-1 text-[10px] font-bold leading-none text-white tabular-nums ${className}`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function Price({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 tabular-nums ${big ? "text-[26px]" : "text-[15px]"}`}>
      <span className={`font-extrabold ${product.compareAt ? "text-red" : "text-ink"}`}>{formatPrice(product.price)}</span>
      {product.compareAt && (
        <>
          <span className="sr-only">çmimi i mëparshëm</span>
          <s className={`font-medium text-mute ${big ? "text-[17px]" : "text-[13px]"}`}>{formatPrice(product.compareAt)}</s>
        </>
      )}
    </p>
  );
}

export function SectionHead({
  title,
  href,
  linkLabel = "Shiko të gjitha",
  id,
  className = "",
}: {
  title: React.ReactNode;
  href?: string;
  linkLabel?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-6 ${className}`}>
      <h2 id={id} className="h-section" data-reveal="mask">
        <span className="mask-line">
          <span>{title}</span>
        </span>
      </h2>
      {href && (
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-[14px] font-semibold text-ink">
          <span className="link-line">{linkLabel}</span>
          <ArrowRight aria-hidden className="arrow-nudge size-4" strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Navigimi" className="text-[13px] text-mute">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={`${it.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden className="size-3.5 opacity-60" />}
            {it.href ? (
              <Link href={it.href} className="hover:text-ink">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Small banner that marks demo-only behaviour, so nothing reads as a real transaction. */
export function DemoNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`rounded-xl border border-dashed border-ink/20 bg-off px-4 py-3 text-[13px] leading-relaxed text-mute ${className}`}>
      {children}
    </p>
  );
}
