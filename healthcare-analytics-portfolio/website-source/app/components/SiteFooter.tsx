import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <strong>Cierra Reynolds, CPhT, CRCR, CSPR</strong>
          <p>Healthcare revenue cycle, pharmacy operations, and analytics.</p>
        </div>
        <div className="footer-links">
          <a href="mailto:ccreyn04@louisville.edu">Email</a>
          <a
            href="https://www.linkedin.com/in/cierrareynolds20"
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <a href="https://github.com/ccreyn04" rel="noreferrer" target="_blank">
            GitHub
          </a>
          <Link href="/#projects">Projects</Link>
          <a href="/downloads/Cierra_Reynolds_Resume.pdf" download>
            Résumé
          </a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Cierra Reynolds</span>
        <span>Synthetic, PHI-free portfolio data</span>
      </div>
    </footer>
  );
}
