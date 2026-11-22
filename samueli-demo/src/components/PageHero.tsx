import Image from "next/image";

/** Dark title band used at the top of inner pages (as in the approved page maps). */
export default function PageHero({
  title,
  intro,
  image,
  position = "50% 40%",
  children,
}: {
  title: string;
  intro?: string;
  image?: string;
  position?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="studio-editorial relative isolate overflow-hidden text-white">
      {image && (
        <>
          <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[62%]">
            <Image src={image} alt="" fill priority sizes="(min-width: 768px) 62vw, 100vw" className="object-contain md:scale-[1.55]" style={{ objectPosition: position }} />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/10 md:via-ink/70" />
        </>
      )}
      <div className="wrap py-10 md:py-14 lg:py-16">
        <h1 className="h-page" data-reveal="mask">
          <span className="mask-line">
            <span>{title}</span>
          </span>
        </h1>
        {intro && (
          <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-white/80 md:text-[17px]" data-reveal="fade">
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
