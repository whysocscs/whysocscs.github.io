import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from '../blog.module.css';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import BlogEffects from '@/components/BlogEffects';

interface Props {
  params: Promise<{ slug: string }>;
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

    return (
      <>
        <BlogEffects />
        <main>
          <article className={styles.article}>
            <Link href="/blog" className={styles.backButton}>
              ← Archive
            </Link>

            <header className={styles.articleHeader}>
              <h1 className={styles.articleTitle}>{post.title}</h1>
              <div className={styles.articleMeta}>
                <time dateTime={post.sortDate}>{post.date}</time>
                {post.normalizedCategories.length > 0 ? (
                  <>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>{post.normalizedCategories.join(', ')}</span>
                  </>
                ) : null}
              </div>

              {post.tags.length > 0 ? (
                <div className={styles.tagContainer}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </article>
        </main>
      </>
    );
  } catch {
    notFound();
  }
}
