import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import BlogEffects from '@/components/BlogEffects';
import { getProjectBySlug, PORTFOLIO_PROJECTS } from '@/lib/projects';

interface Props {
  params: Promise<{ slug: string }>;
}

function SlimeProjectDiagrams() {
  return (
    <section className="project-wide-section project-diagrams" aria-label="SLiMe diagrams">
      <h3>Architecture / Flow</h3>

      <div className="diagram-panel">
        <div className="diagram-caption">
          <span>01</span>
          <strong>System Architecture</strong>
        </div>
        <div className="architecture-grid">
          <div className="diagram-node">
            <span>OT Traffic</span>
            <strong>Modbus / XGT / S7comm</strong>
            <p>테스트베드와 OT 네트워크에서 산업 프로토콜 트래픽을 수집한다.</p>
          </div>
          <div className="diagram-arrow" aria-hidden="true">
            →
          </div>
          <div className="diagram-node">
            <span>Parser</span>
            <strong>Protocol Log Sequence</strong>
            <p>패킷 필드, 요청-응답 관계, timestamp를 PLS 형태로 정리한다.</p>
          </div>
          <div className="diagram-arrow" aria-hidden="true">
            →
          </div>
          <div className="diagram-node is-core">
            <span>Detection</span>
            <strong>ML/DL + SLM</strong>
            <p>통계·시계열 탐지 결과를 SLM 문맥 분석으로 보완한다.</p>
          </div>
          <div className="diagram-arrow" aria-hidden="true">
            →
          </div>
          <div className="diagram-node">
            <span>XAI Report</span>
            <strong>Evidence / Context</strong>
            <p>위협 유형, 물리적 영향, 판단 근거를 운영자용 보고서로 만든다.</p>
          </div>
          <div className="diagram-arrow" aria-hidden="true">
            →
          </div>
          <div className="diagram-node">
            <span>Dashboard</span>
            <strong>Monitoring UI</strong>
            <p>탐지 결과와 SLM 분석 내용을 관제 화면에서 확인한다.</p>
          </div>
        </div>
      </div>

      <div className="diagram-panel">
        <div className="diagram-caption">
          <span>02</span>
          <strong>Detection Flow</strong>
        </div>
        <div className="flow-chart">
          {[
            ['Capture', '트래픽 수집'],
            ['Parse', '필드 추출'],
            ['Window', '시퀀스 구성'],
            ['Detect', '이상 후보 탐지'],
            ['Reason', 'SLM 맥락 해석'],
            ['Explain', 'XAI 보고서 생성'],
          ].map(([label, detail], index, items) => (
            <div className="flow-step-wrap" key={label}>
              <div className="flow-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{label}</strong>
                <p>{detail}</p>
              </div>
              {index < items.length - 1 ? (
                <div className="flow-arrow" aria-hidden="true">
                  →
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
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

              {project.detailSections?.map((section) => (
                <Fragment key={section.title}>
                  <section className={section.wide ? 'project-wide-section' : undefined}>
                    <h3>{section.title}</h3>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.items ? (
                      <ul>
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                  {project.slug === 'slime' && section.title.startsWith('2.') ? (
                    <SlimeProjectDiagrams />
                  ) : null}
                </Fragment>
              ))}

              {project.showContributions !== false ? (
                <section>
                  <h3>What I did</h3>
                  <ul>
                    {project.contributions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

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
