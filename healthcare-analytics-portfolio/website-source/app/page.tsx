import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { projectOrder, projects } from "@/app/lib/projects";

const projectStats = {
  "revenue-cycle": ["2,000 claims", "$531K denied allowed"],
  "claims-denials": ["349 denials", "169 claims >90 days"],
  "pharmacy-operations": ["1,200 orders", "92.1% on time"],
  "prior-authorization": ["700 cases", "$2.36M simulated value"],
} as const;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero">
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />
          <div className="shell home-hero-grid">
            <div className="home-hero-copy">
              <span className="eyebrow">Healthcare analytics portfolio</span>
              <h1>
                Healthcare operations experience.
                <em> Analyst-ready execution.</em>
              </h1>
              <p className="hero-lead">
                I translate frontline pharmacy and revenue-cycle knowledge into
                clear metrics, auditable analysis, and practical recommendations
                leaders can act on.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects">
                  Explore the case studies
                </a>
                <a
                  className="button button-secondary button-on-dark"
                  download
                  href="/downloads/Cierra_Reynolds_Resume.pdf"
                >
                  Download résumé
                </a>
              </div>
              <div className="credential-line" aria-label="Professional credentials">
                <strong>Cierra Reynolds</strong>
                <span>CPhT</span>
                <span>CRCR</span>
                <span>CSPR</span>
              </div>
            </div>

            <aside className="hero-proof-card">
              <div className="proof-card-top">
                <span>Portfolio proof</span>
                <span className="status-dot">Ready to review</span>
              </div>
              <div className="proof-metric proof-metric-main">
                <strong>4</strong>
                <span>complete healthcare case studies</span>
              </div>
              <div className="proof-grid">
                <div className="proof-metric">
                  <strong>3,900</strong>
                  <span>PHI-free records analyzed</span>
                </div>
                <div className="proof-metric">
                  <strong>100%</strong>
                  <span>downloadable evidence</span>
                </div>
              </div>
              <ul>
                <li>Interactive filters and recalculated KPIs</li>
                <li>Searchable row-level source evidence</li>
                <li>Excel dashboards, CSV data, and SQL</li>
                <li>Executive findings and recommendations</li>
              </ul>
            </aside>
          </div>
          <div className="shell hero-marquee" aria-label="Core capabilities">
            <span>Revenue cycle</span>
            <i />
            <span>Pharmacy operations</span>
            <i />
            <span>Prior authorization</span>
            <i />
            <span>SQL & Excel</span>
            <i />
            <span>KPI storytelling</span>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="shell about-grid">
            <div>
              <span className="section-label">About Cierra</span>
              <h2>Domain knowledge is the foundation. Analytics makes it visible.</h2>
            </div>
            <div className="about-copy">
              <p>
                With more than four years in hospital pharmacy operations, I
                understand the workflows behind the numbers: medication access,
                documentation, payer requirements, handoffs, turnaround pressure,
                and the revenue impact of preventable friction.
              </p>
              <p>
                This portfolio shows how I approach an analyst assignment from end
                to end—define the business question, validate the source data, build
                decision-ready measures, identify what matters, and recommend an
                accountable next step.
              </p>
              <div className="about-actions">
                <a href="mailto:ccreyn04@louisville.edu">Email Cierra ↗</a>
                <a
                  href="https://www.linkedin.com/in/cierrareynolds20"
                  rel="noreferrer"
                  target="_blank"
                >
                  View LinkedIn ↗
                </a>
                <a href="https://github.com/ccreyn04" rel="noreferrer" target="_blank">
                  View GitHub ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <span className="section-label">Selected work</span>
                <h2>Four complete healthcare analytics case studies</h2>
              </div>
              <p>
                Each project includes a live dashboard, methodology, verified
                findings, operational recommendations, SQL, raw data, and Excel
                evidence.
              </p>
            </div>

            <div className="project-list">
              {projectOrder.map((kind) => {
                const project = projects[kind];
                return (
                  <article className="project-card" key={kind}>
                    <Link
                      className="project-image"
                      href={`/projects/${project.slug}`}
                      aria-label={`View ${project.title}`}
                    >
                      <Image
                        alt={`${project.title} preview`}
                        height={1220}
                        sizes="(max-width: 800px) 94vw, 46vw"
                        src={project.preview}
                        width={1800}
                      />
                      <span>Open case study ↗</span>
                    </Link>
                    <div className="project-card-copy">
                      <div className="project-card-meta">
                        <span>{project.number}</span>
                        <span>{project.eyebrow}</span>
                      </div>
                      <h3>
                        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                      </h3>
                      <p>{project.lead}</p>
                      <div className="project-stat-row">
                        {projectStats[kind].map((stat) => (
                          <span key={stat}>{stat}</span>
                        ))}
                      </div>
                      <div className="tag-list">
                        {project.tools.slice(0, 4).map((tool) => (
                          <span key={tool}>{tool}</span>
                        ))}
                      </div>
                      <Link className="text-link" href={`/projects/${project.slug}`}>
                        View the full analysis <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section method-section">
          <div className="shell">
            <div className="section-heading">
              <span className="section-label">How I work</span>
              <h2>A repeatable analytical process</h2>
              <p>
                The goal is not a prettier chart. It is a reliable path from messy
                operational detail to a clearer decision.
              </p>
            </div>
            <div className="method-grid">
              {[
                ["01", "Define", "Clarify the decision, denominator, grain, and KPI logic before analysis."],
                ["02", "Validate", "Check record counts, dates, categories, numeric fields, and reconciliation totals."],
                ["03", "Analyze", "Segment volume, rate, value, variation, and aging to find material patterns."],
                ["04", "Recommend", "Translate evidence into specific actions, owners, and measurable follow-through."],
              ].map(([number, title, description]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section credentials-section" id="credentials">
          <div className="shell credentials-grid">
            <div>
              <span className="section-label section-label-light">Credentials</span>
              <h2>
                Certified across pharmacy operations, revenue cycle, and
                healthcare payment and reimbursement.
              </h2>
              <p>
                I pair current healthcare credentials with hands-on analytics work
                and an active commitment to strengthening business intelligence
                skills.
              </p>
            </div>
            <div className="credential-cards">
              <article>
                <strong>CPhT</strong>
                <span>Certified Pharmacy Technician</span>
              </article>
              <article>
                <strong>CRCR</strong>
                <span>Certified Revenue Cycle Representative</span>
              </article>
              <article>
                <strong>CSPR</strong>
                <span>
                  HFMA Certified Specialist — Payment &amp; Reimbursement
                </span>
              </article>
              <article className="credential-progress">
                <strong>CSBI</strong>
                <span>Certified Specialist Business Intelligence · In progress</span>
              </article>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="shell contact-card">
            <div>
              <span className="section-label">Let&apos;s connect</span>
              <h2>Looking for a healthcare analyst who understands the workflow behind the data?</h2>
              <p>
                I&apos;m pursuing opportunities in healthcare analytics, revenue
                cycle, pharmacy operations, patient access, and business
                intelligence.
              </p>
            </div>
            <div className="contact-actions">
              <a className="button button-primary" href="mailto:ccreyn04@louisville.edu">
                Email Cierra
              </a>
              <a
                className="button button-secondary"
                href="https://www.linkedin.com/in/cierrareynolds20"
                rel="noreferrer"
                target="_blank"
              >
                View LinkedIn
              </a>
              <a
                className="button button-secondary"
                href="https://github.com/ccreyn04"
                rel="noreferrer"
                target="_blank"
              >
                View GitHub
              </a>
              <a
                className="button button-secondary"
                download
                href="/downloads/Cierra_Reynolds_Resume.pdf"
              >
                Download résumé
              </a>
              <a
                className="button button-secondary"
                download
                href="/downloads/Cierra_Healthcare_Analytics_Portfolio_Workbook.xlsx"
              >
                Download workbook
              </a>
            </div>
          </div>
        </section>

        <section className="disclosure-section">
          <div className="shell">
            <strong>Data ethics & transparency</strong>
            <p>
              All portfolio datasets are synthetic and contain no PHI. Results are
              calculated from the downloadable data and demonstrate analytical
              method; they do not represent a real organization or guaranteed
              financial outcome.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
