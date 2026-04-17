'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/blog/blog.module.css';
import { CATEGORY_DEPTH, CATEGORY_ICONS, CATEGORY_ORDER } from '@/lib/constants';
import type { PostData } from '@/lib/posts';

interface BlogListProps {
  posts: Omit<PostData, 'contentHtml'>[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubTag, setSelectedSubTag] = useState<string | null>(null);

  const postsInCategory = selectedCategory
    ? posts.filter((post) => post.normalizedCategories.includes(selectedCategory as never))
    : posts;

  const availableSubTags = Array.from(
    new Set(postsInCategory.flatMap((post) => post.tags)),
  ).sort((a, b) => a.localeCompare(b));

  const filteredPosts = selectedSubTag
    ? postsInCategory.filter((post) => post.tags.includes(selectedSubTag))
    : postsInCategory;

  const currentDepth = selectedCategory ? CATEGORY_DEPTH[selectedCategory] ?? 50 : 50;

  return (
    <div className={styles.blogLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <h2>Archive</h2>
          <ul className={styles.categoryList}>
            <li className={styles.mainCategoryItem}>
              <button
                className={`${styles.categoryButton} ${!selectedCategory ? styles.activeCategory : ''}`}
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubTag(null);
                }}
                type="button"
              >
                All Posts
              </button>
            </li>
            {CATEGORY_ORDER.map((category) => (
              <li key={category} className={styles.mainCategoryItem}>
                <button
                  className={`${styles.categoryButton} ${selectedCategory === category ? styles.activeCategory : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubTag(null);
                  }}
                  type="button"
                >
                  <span style={{ marginRight: '0.6rem', opacity: 0.85, fontSize: '0.95rem' }}>
                    {CATEGORY_ICONS[category]}
                  </span>
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selectedCategory && availableSubTags.length > 0 && (
          <div className={styles.sidebarSection}>
            <h3>Sub-tags</h3>
            <ul className={styles.subCategoryList}>
              <li className={styles.mainCategoryItem}>
                <button
                  className={`${styles.subCategoryButton} ${!selectedSubTag ? styles.activeSubCategory : ''}`}
                  onClick={() => setSelectedSubTag(null)}
                  type="button"
                >
                  All in {selectedCategory}
                </button>
              </li>
              {availableSubTags.map((tag) => (
                <li key={tag} className={styles.mainCategoryItem}>
                  <button
                    className={`${styles.subCategoryButton} ${selectedSubTag === tag ? styles.activeSubCategory : ''}`}
                    onClick={() => setSelectedSubTag(tag)}
                    type="button"
                  >
                    # {tag}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.depthGauge}>
          Current depth
          <strong>— {currentDepth}m</strong>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <p style={{ marginBottom: '0.9rem' }}>
            {selectedSubTag ? 'Tag' : selectedCategory ? 'Domain' : 'Collection'} · {currentDepth}m
          </p>
          <h1>{selectedSubTag ? `#${selectedSubTag}` : selectedCategory ?? 'Archive'}</h1>
          <p style={{ marginTop: '0.75rem' }}>
            {filteredPosts.length} {filteredPosts.length === 1 ? 'transmission' : 'transmissions'} recovered
          </p>
        </header>

        <div className={styles.postGrid}>
          {filteredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postItem}>
              <article className={styles.postArticle}>
                <div className={styles.postHeader}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <time className={styles.postDate}>{post.date}</time>
                </div>
                {post.desc ? <p className={styles.postDesc}>{post.desc}</p> : null}
                <div className={styles.tagContainer}>
                  {post.normalizedCategories.map((category) => (
                    <span key={`${post.slug}-${category}`} className={styles.tag}>
                      {category}
                    </span>
                  ))}
                  {post.tags.map((tag) => (
                    <span key={`${post.slug}-${tag}`} className={styles.tag}>
                      # {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '8rem 0',
              color: 'var(--ink-faint)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            No signals at this depth.
          </div>
        ) : null}
      </main>
    </div>
  );
}
