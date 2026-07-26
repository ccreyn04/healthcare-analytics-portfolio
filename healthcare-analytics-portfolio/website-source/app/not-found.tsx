import Link from "next/link";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="not-found">
        <div className="shell">
          <span className="eyebrow">404 · Page not found</span>
          <h1>That page is not in this portfolio.</h1>
          <p>The case studies and downloads are still one click away.</p>
          <Link className="button button-primary" href="/">
            Return to portfolio
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
