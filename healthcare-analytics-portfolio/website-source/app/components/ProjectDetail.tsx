import Image from "next/image";
import Link from "next/link";
import { InteractiveDashboard } from "@/app/components/InteractiveDashboard";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { projectOrder, projects, type ProjectKind } from "@/app/lib/projects";

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export function ProjectDetail({ kind }: { kind: ProjectKind }) {
  const project = projects[kind];
  const index = projectOrder.indexOf(kind);
  const previous = index > 0 ? projects[projectOrder[index - 1]] : null;
  const next = index < projectOrder.length - 1 ? projects[projectOrder[index + 1]] : null;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="project-hero">
          <div className="shell">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Portfolio</Link>
              <span aria-hidden="true">/</span>
              <span>{project.shortTitle}</span>
            </nav>

            <div className="project-hero-grid">
              <div>
                <span className="eyebrow">
                  Project {project.number} · {project.eyebrow}
                </span>
                <h1>{project.title}</h1>
                <p className="hero-lead">{project.lead}</p>
                <div className="tag-list" aria-label="Project skills">
                  {project.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
                <div className="hero-actions">
                  <a className="button button-primary" href="#interactive-dashboard">
                    Explore dashboard
                  </a>
                  <a
                    className="button button-secondary"
                    download
                    href={project.downloads[0].href}
                  >
                    Download snapshot
                  </a>
                </div>
              </div>

              <aside className="question-card">
                <span className="card-kicker">Business question</span>
                <p>{project.question}</p>
                <div className="question-proof">
                  <strong>What this case study proves</strong>
                  <ul className="check-list compact-list">
                    {project.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="section section-tight">
          <div className="shell">
            <div className="disclosure-banner">
              <strong>Portfolio disclosure</strong>
              <span>
                This project uses synthetic, PHI-free data created for skills
                demonstration. Findings are internally consistent with the supplied
                dataset and do not describe a real patient, payer, or organization.
              </span>
            </div>
          </div>
        </section>

        <section className="section section-snapshot">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <span className="section-label">Executive view</span>
                <h2>Decision-ready dashboard snapshot</h2>
              </div>
              <p>
                A static leadership view built in Excel. The live dashboard below
                exposes the underlying records and recalculates every KPI.
              </p>
            </div>
            <a
              className="dashboard-frame"
              href={project.preview}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open full-size ${project.title} image`}
            >
              <Image
                alt={`${project.title} executive dashboard`}
                height={1220}
                priority
                sizes="(max-width: 900px) 94vw, 1180px"
                src={project.preview}
                width={1800}
              />
              <span>Open full size <ArrowIcon /></span>
            </a>
          </div>
        </section>

        <section className="section section-interactive" id="interactive-dashboard">
          <div className="shell">
            <InteractiveDashboard kind={kind} dataPath={project.dataPath} />
          </div>
        </section>

        <section className="section case-study-section">
          <div className="shell">
            <div className="section-heading">
              <span className="section-label">Case-study narrative</span>
              <h2>From business question to operating action</h2>
              <p>
                The analysis is documented so a reviewer can evaluate the logic,
                not just the finished visual.
              </p>
            </div>

            <div className="case-study-grid">
              <article className="case-card">
                <span className="case-number">01</span>
                <h3>Methodology</h3>
                <ol>
                  {project.methodology.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </article>

              <article className="case-card case-card-accent">
                <span className="case-number">02</span>
                <h3>Key findings</h3>
                <ul>
                  {project.findings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="case-card">
                <span className="case-number">03</span>
                <h3>Recommendations</h3>
                <ul>
                  {project.recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="case-card case-card-muted">
                <span className="case-number">04</span>
                <h3>Limitations & production path</h3>
                <ul>
                  {project.limitations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="section downloads-section">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <span className="section-label">Technical evidence</span>
                <h2>Inspect or reuse the project files</h2>
              </div>
              <p>
                Every download is labeled, accessible, and tied to the analysis shown
                on this page.
              </p>
            </div>
            <div className="download-grid">
              {project.downloads.map((download, downloadIndex) => (
                <a
                  className="download-card"
                  download
                  href={download.href}
                  key={download.label}
                >
                  <span className="file-type">
                    {downloadIndex === 0
                      ? "PNG"
                      : downloadIndex === 1
                        ? "CSV"
                        : downloadIndex === 2
                          ? "SQL"
                          : "XLSX"}
                  </span>
                  <div>
                    <strong>{download.label}</strong>
                    <p>{download.description}</p>
                  </div>
                  <ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        </section>

        <nav className="shell project-pagination" aria-label="Project navigation">
          {previous ? (
            <Link href={`/projects/${previous.slug}`}>
              <span>← Previous case study</span>
              <strong>{previous.shortTitle}</strong>
            </Link>
          ) : (
            <Link href="/#projects">
              <span>← Back to</span>
              <strong>All projects</strong>
            </Link>
          )}
          {next ? (
            <Link className="pagination-next" href={`/projects/${next.slug}`}>
              <span>Next case study →</span>
              <strong>{next.shortTitle}</strong>
            </Link>
          ) : (
            <a className="pagination-next" href="mailto:ccreyn04@louisville.edu">
              <span>Have a role in mind?</span>
              <strong>Contact Cierra →</strong>
            </a>
          )}
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
