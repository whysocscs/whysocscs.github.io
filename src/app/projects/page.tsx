import type { Metadata } from 'next';
import BlogEffects from '@/components/BlogEffects';
import { PORTFOLIO_PROJECTS } from '@/lib/projects';

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

        <section className="project-records" aria-label="Project records">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <article
              className="project-record"
              key={project.title}
              id={project.title.toLowerCase().replaceAll(' ', '-')}
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

                {project.media ? (
                  <section className="project-visuals" aria-label={`${project.title} visual references`}>
                    <h3>Visual References</h3>
                    <div className="project-media-grid">
                      {project.media.map((item) => (
                        <figure className="project-media" key={item.src}>
                          <img src={item.src} alt={item.alt} loading="lazy" />
                          <figcaption>{item.caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
