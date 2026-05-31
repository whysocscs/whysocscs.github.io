import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogEffects from '@/components/BlogEffects';
import { getProjectBySlug, PORTFOLIO_PROJECTS } from '@/lib/projects';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PORTFOLIO_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project not found | Lee Sangho',
    };
  }

  return {
    title: `${project.title} | Projects | Lee Sangho`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectIndex = PORTFOLIO_PROJECTS.findIndex((item) => item.slug === project.slug) + 1;

  return (
    <>
      <BlogEffects
        sectionLabel="Projects"
        frameMeta={`${project.title} / record`}
        navLinks={[
          { href: '/', label: 'Home' },
          { href: '/projects', label: 'Projects' },
          { href: '/blog', label: 'Blog' },
          { href: 'https://github.com/whysocscs', label: 'GitHub', external: true },
        ]}
      />
      <main className="projects-page project-detail-page">
        <section className="projects-hero project-detail-hero" data-reveal="">
          <div className="projects-kicker">Project Detail / {project.status}</div>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </section>

        <article className="project-record project-record-detail" data-reveal="" data-delay="1">
          <div className="project-index">
            {String(projectIndex).padStart(2, '0')}
            <span>{project.status}</span>
          </div>

          <div className="project-main">
            <div className="project-heading">
              <div>
                <p className="project-period">{project.period}</p>
                <h2>{project.title}</h2>
              </div>
              <p className="project-role">{project.role}</p>
            </div>

            <div className="project-body">
              <section>
                <h3>What it is</h3>
                <p>{project.summary}</p>
                {project.overview?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>

              <section>
                <h3>What I did</h3>
                <ul>
                  {project.contributions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>Stack / Keywords</h3>
                <div className="project-tags">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </section>

              <section>
                <h3>Result</h3>
                <p>{project.result}</p>
              </section>

              {project.achievements ? (
                <section>
                  <h3>Achievements</h3>
                  <ul>
                    {project.achievements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <a className="project-back-link" href="/projects">
              Back to projects
            </a>
          </div>
        </article>
      </main>
    </>
  );
}
