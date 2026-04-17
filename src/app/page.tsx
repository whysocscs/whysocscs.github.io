import Link from 'next/link';
import { CAREER_ITEMS, CATEGORY_ICONS, CATEGORY_ORDER, PROJECT_ITEMS } from '@/lib/constants';
import { getAllPosts, getCategoryCounts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();
  const counts = getCategoryCounts(posts);

  return (
    <div className="home-shell">
      <section className="home-hero">
        <div className="content">
          <p className="eyebrow">Security Researcher · AI Guardrail</p>
          <h1>Lee Sangho</h1>
          <p>
            Deep-sea portfolio structure restored on Next.js, with the blog now backed directly by the
            real post source in <code>_posts</code>.
          </p>
          <div className="hero-actions">
            <Link href="/blog" className="blog-link">
              Enter Archive
            </Link>
            <a href="https://github.com/whysocscs" className="ghost-link" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
          <p className="scroll-cue">Descend</p>
        </div>
      </section>

      <section>
        <div className="content">
          <p className="eyebrow">Career</p>
          <h2>Selected timeline</h2>
          <div className="career-timeline">
            {CAREER_ITEMS.map((item) => (
              <article key={item.title} className="career-item">
                <h3>{item.title}</h3>
                <div className="career-org">
                  {item.org} | {item.period}
                </div>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="content">
          <p className="eyebrow">Projects</p>
          <h2>Current work</h2>
          <div className="portfolio-grid">
            {PROJECT_ITEMS.map((project) => (
              <article key={project.title} className="portfolio-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="content">
          <p className="eyebrow">Archive Signal</p>
          <h2>Blog domains</h2>
          <div className="category-grid">
            {CATEGORY_ORDER.map((category) => (
              <div key={category} className="category-stat">
                <span className="category-icon">{CATEGORY_ICONS[category]}</span>
                <strong>{counts[category]}</strong>
                <span>{category}</span>
              </div>
            ))}
          </div>
          <p>Total transmissions recovered: {posts.length}</p>
          <Link href="/blog" className="blog-link">
            Open Full Archive
          </Link>
        </div>
      </section>
    </div>
  );
}
