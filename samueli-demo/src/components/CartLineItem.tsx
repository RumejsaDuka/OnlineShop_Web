"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { productOf, useStore, type CartLine } from "@/lib/store";

export default function CartLineItem({ line, compact = false, onNavigate }: { line: CartLine; compact?: boolean; onNavigate?: () => void }) {
  const { setQty, removeLine } = useStore();
  const p = productOf(line.slug);
  const thumb = compact ? "size-[88px]" : "size-[104px] md:size-[128px]";
  return (
    <li className="flex gap-4 py-4">
      <Link href={`/produkt/${p.slug}`} onClick={onNavigate} className={`relative shrink-0 overflow-hidden rounded-xl bg-card ${thumb}`}>
        <Image src={p.images[0]} alt={p.alt} fill sizes="128px" className={p.light ? "object-contain p-1.5 mix-blend-darken" : "object-cover"} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/produkt/${p.slug}`} onClick={onNavigate} className="block truncate text-[15px] font-bold hover:text-red">
              {p.name}
            </Link>
            <p className="mt-0.5 text-[13px] text-mute">
              Masa: <span className="font-semibold text-ink">{line.size}</span> · {p.color.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeLine(line.key)}
            aria-label={`Hiq ${p.name} (${line.size}) nga shporta`}
            className="-mr-2 -mt-2 grid size-10 shrink-0 place-items-center rounded-full text-mute hover:bg-surface hover:text-red"
          >
            <Trash2 aria-hidden className="size-[18px]" strokeWidth={1.75} />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="inline-flex items-center rounded-full border border-line" role="group" aria-label={`Sasia për ${p.name}`}>
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty - 1)}
              aria-label="Zvogëlo sasinë"
              className="grid size-10 place-items-center rounded-full hover:bg-surface"
            >
              <Minus aria-hidden className="size-4" />
            </button>
            <span className="w-7 text-center text-[14px] font-bold tabular-nums" aria-live="polite">
              {line.qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty + 1)}
              disabled={line.qty >= 9}
              aria-label="Rrit sasinë"
              className="grid size-10 place-items-center rounded-full hover:bg-surface disabled:opacity-35"
            >
              <Plus aria-hidden className="size-4" />
            </button>
          </div>
          <div className="text-right tabular-nums">
            <p className="text-[15px] font-extrabold">{formatPrice(p.price * line.qty)}</p>
            {line.qty > 1 && <p className="text-[12px] text-mute">{formatPrice(p.price)} / copë</p>}
          </div>
        </div>
      </div>
    </li>
  );
}
