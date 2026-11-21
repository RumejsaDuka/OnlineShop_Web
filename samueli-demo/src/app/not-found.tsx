import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[50vh] flex-col items-start justify-center py-16">
      <p className="kicker text-red">404</p>
      <h1 className="h-page mt-3">Faqja nuk u gjet</h1>
      <p className="mt-3 max-w-[44ch] text-[15px] text-mute">Faqja që kërkoni nuk ekziston ose është zhvendosur.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-dark">
          Kthehu në kryefaqe
        </Link>
        <Link href="/kategoria/te-gjitha" className="btn btn-outline">
          Shiko produktet
        </Link>
      </div>
    </div>
  );
}
