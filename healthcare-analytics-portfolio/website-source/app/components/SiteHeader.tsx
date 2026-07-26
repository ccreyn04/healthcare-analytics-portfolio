import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Cierra Reynolds portfolio home">
          <span className="brand-mark">CR</span>
          <span>
            <strong>Cierra Reynolds</strong>
            <small>CPhT · CRCR · CSPR</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/#about">About</Link>
          <Link href="/#projects">Projects</Link>
          <Link href="/#credentials">Credentials</Link>
          <Link href="/#contact">Contact</Link>
          <a
            href="https://www.linkedin.com/in/cierrareynolds20"
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <a className="nav-cta" href="/downloads/Cierra_Reynolds_Resume.pdf" download>
            Résumé
          </a>
        </nav>

        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <Link href="/#about">About</Link>
            <Link href="/#projects">Projects</Link>
            <Link href="/#credentials">Credentials</Link>
            <Link href="/#contact">Contact</Link>
            <a
              href="https://www.linkedin.com/in/cierrareynolds20"
              rel="noreferrer"
              target="_blank"
            >
              View LinkedIn
            </a>
            <a href="/downloads/Cierra_Reynolds_Resume.pdf" download>
              Download résumé
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
