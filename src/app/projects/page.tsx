import type { Metadata } from 'next';
import BlogEffects from '@/components/BlogEffects';
import { getProjectPath, PORTFOLIO_PROJECTS } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects | Lee Sangho',
  description: 'Portfolio project records: what each project is and what Lee Sangho worked on.',
};

export default function ProjectsPage() {
  return (
    <>
      <BlogEffects
        sectionLabel="Projects"
        frameMeta="Project record / 2026"
        navLinks={[
          { href: '/', label: 'Home' },
          { href: '/blog', label: 'Blog' },
          { href: 'https://github.com/whysocscs', label: 'GitHub', external: true },
        ]}
      />
      <main className="projects-page">
        <section className="projects-hero" data-reveal="">
          <div className="projects-kicker">Portfolio / Project Record</div>
          <h1>
            Project
            <br />
            <em>Archive</em>
          </h1>
          <p>
            내가 진행한 보안 프로젝트를 기록하기 위한 페이지. 각 항목은 프로젝트가
            무엇이었는지, 그리고 그 안에서 내가 직접 맡고 정리한 일을 중심으로 남긴다.
          </p>
        </section>

        <section className="project-records project-list" aria-label="Project records">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <article
              className="project-record project-summary-record"
              key={project.title}
              id={project.slug}
              data-reveal=""
              data-delay={String(Math.min(index + 1, 6))}
            >
              <div className="project-index">
                {String(index + 1).padStart(2, '0')}
                <span>{project.status}</span>
              </div>

              <div className="project-main">
                <div className="project-heading">
                  <div>
                    <p className="project-period">{project.period}</p>
                    <h2>
                      <a href={getProjectPath(project)}>{project.title}</a>
                    </h2>
                  </div>
                  <p className="project-role">{project.role}</p>
                </div>

                <div className="project-list-body">
                  <section className="project-list-summary">
                    <h3>Summary</h3>
                    <p>{project.summary}</p>
                  </section>

                  <section className="project-list-stack">
                    <h3>Keywords</h3>
                    <div className="project-tags">
                      {project.stack.slice(0, 7).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </section>

                  <a className="project-detail-link" href={getProjectPath(project)}>
                    Open detail
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
