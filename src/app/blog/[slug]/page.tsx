import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from '@/app/blog/blog.module.css';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);

    return (
      <div className={styles.blogLayout} style={{ justifyContent: 'center' }}>
        <article className={styles.article}>
          <Link href="/blog" className={styles.backButton}>
            ← Return to surface
          </Link>

          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{post.title}</h1>
            <div className={styles.articleMeta}>
              <time dateTime={post.sortDate}>{post.date}</time>
              {post.normalizedCategories.length > 0 ? (
                <>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{post.normalizedCategories.join(', ')}</span>
                </>
              ) : null}
            </div>

            {post.tags.length > 0 ? (
              <div className={styles.tagContainer} style={{ marginTop: '1.5rem' }}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    # {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
      </div>
    );
  } catch {
    notFound();
  }
}
