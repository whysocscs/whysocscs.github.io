import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import styles from '../blog.module.css';
import {
  decoratePostHtml,
  estimateReadingMinutes,
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  getPostSummary,
  getRelatedPosts,
} from '@/lib/posts';
import BlogEffects from '@/components/BlogEffects';

interface Props {
  params: Promise<{ slug: string }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  Development: '#4589ff',
  'CTF/Wargame': '#ee5396',
  BugBounty: '#009d9a',
  'Technical Document': '#33b1ff',
  'Paper/Conference': '#a56eff',
  'Contest/Certification': '#24a148',
  Etc: '#8d8d8d',
};

function getSourceLink(content: string) {
  const match = content.match(/^>\s*Source:\s*\[(.*?)\]\((.*?)\)/m);

  if (!match) {
    return null;
  }

  const label = match[1];
  const href = match[2];

  try {
    const parsed = new URL(href);
    const domain = parsed.hostname.replace(/^www\./, '');
    const cleanPath = parsed.pathname.replace(/\/$/, '') || '/';
    const readableLabel =
      label === href || label.includes(parsed.hostname) ? domain : label;
    const readableMeta =
      cleanPath === '/' ? 'Original article' : `${cleanPath}${parsed.search}`;

    return {
      label: readableLabel,
      href,
      meta: readableMeta,
    };
  } catch {
    return {
      label,
      href,
      meta: 'External source',
    };
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    const primaryCategory = post.normalizedCategories[0] ?? 'Etc';
    const readingMinutes = estimateReadingMinutes(post.content);
    const source = getSourceLink(post.content);
    const { contentHtml, headings } = decoratePostHtml(post.contentHtml);
    const { newer, older } = getAdjacentPosts(slug);
    const relatedPosts = getRelatedPosts(slug, 3);
    const showDescription = post.desc.trim() && post.desc.trim() !== post.title.trim();
    const getCardAccent = (category: string) => CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Etc;

    return (
      <>
        <BlogEffects />
        <main className={styles.page}>
          <article className={styles.articleShell}>
            <aside className={styles.metaRail}>
              <div className={styles.railCard}>
                <Link href="/blog" className={styles.backButton}>
                  Back to Archive
                </Link>
                <div className={styles.railLabel}>Filed</div>
                <time dateTime={post.sortDate} className={styles.railValue}>
                  {post.date}
                </time>
                <div className={styles.railLabel}>Category</div>
                <div className={styles.railValue}>{primaryCategory}</div>
                <div className={styles.railLabel}>Read</div>
                <div className={styles.railValue}>{readingMinutes} min</div>
                {source ? (
                  <>
                    <div className={styles.railLabel}>Source</div>
                    <div className={styles.sourceBlock}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener"
                        className={styles.railLink}
                      >
                        {source.label}
                      </a>
                      <span className={styles.railSubtle}>{source.meta}</span>
                    </div>
                  </>
                ) : null}
              </div>

              {post.tags.length > 0 ? (
                <div className={styles.railCard}>
                  <div className={styles.railLabel}>Tags</div>
                  <div className={styles.tagContainer}>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>

            <div className={styles.articleMain}>
              <header className={styles.articleHero}>
                <div className={styles.articleKicker}>Research Note / {primaryCategory}</div>
                <h1 className={styles.articleTitle}>{post.title}</h1>
                {showDescription ? <p className={styles.articleDek}>{post.desc}</p> : null}
                <div className={styles.articleMeta}>
                  <time dateTime={post.sortDate}>{post.date}</time>
                  <span className={styles.metaDivider}>/</span>
                  <span>{post.normalizedCategories.join(', ')}</span>
                  <span className={styles.metaDivider}>/</span>
                  <span>{readingMinutes} min read</span>
                </div>
              </header>

              <div
                className={styles.content}
                data-article-body=""
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              <footer className={styles.articleFooter}>
                {(newer || older) && (
                  <section className={styles.articleSection}>
                    <div className={styles.sectionLabel}>Continue Reading</div>
                    <div className={styles.articleNav}>
                      {newer ? (
                        <Link
                          href={`/blog/${newer.slug}`}
                          className={styles.navCard}
                          style={{ '--card-accent': getCardAccent(newer.normalizedCategories[0] ?? 'Etc') } as CSSProperties}
                        >
                          <span className={styles.navLabel}>Newer</span>
                          <strong>{newer.title}</strong>
                          <p>{getPostSummary(newer)}</p>
                        </Link>
                      ) : (
                        <div className={styles.navCardEmpty} />
                      )}

                      {older ? (
                        <Link
                          href={`/blog/${older.slug}`}
                          className={styles.navCard}
                          style={{ '--card-accent': getCardAccent(older.normalizedCategories[0] ?? 'Etc') } as CSSProperties}
                        >
                          <span className={styles.navLabel}>Older</span>
                          <strong>{older.title}</strong>
                          <p>{getPostSummary(older)}</p>
                        </Link>
                      ) : (
                        <div className={styles.navCardEmpty} />
                      )}
                    </div>
                  </section>
                )}

                {relatedPosts.length > 0 && (
                  <section className={styles.articleSection}>
                    <div className={styles.sectionLabel}>Related Notes</div>
                    <div className={styles.relatedGrid}>
                      {relatedPosts.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/blog/${related.slug}`}
                          className={styles.relatedCard}
                          style={{ '--card-accent': getCardAccent(related.normalizedCategories[0] ?? 'Etc') } as CSSProperties}
                        >
                          <span className={styles.relatedMeta}>
                            {related.date} / {related.normalizedCategories[0] ?? 'Etc'}
                          </span>
                          <strong>{related.title}</strong>
                          <p>{getPostSummary(related)}</p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </footer>
            </div>

            <aside className={styles.tocRail}>
              <div className={styles.railCard}>
                <div className={styles.railLabel}>Outline</div>
                {headings.length > 0 ? (
                  <nav className={styles.tocList}>
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={styles.tocItem}
                        data-level={heading.level}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                ) : (
                  <p className={styles.tocEmpty}>This note flows without section headings.</p>
                )}
              </div>
            </aside>
          </article>
        </main>
      </>
    );
  } catch {
    notFound();
  }
}
