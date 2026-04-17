'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/blog/blog.module.css';
import { CATEGORY_ICONS, CATEGORY_ORDER } from '@/lib/constants';
import type { PostData } from '@/lib/posts';

interface BlogListProps {
  posts: Omit<PostData, 'contentHtml'>[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubTag, setSelectedSubTag] = useState<string | null>(null);

  const postsInCategory = useMemo(() => {
    if (!selectedCategory) {
      return posts;
    }

    return posts.filter((post) => post.normalizedCategories.includes(selectedCategory as never));
  }, [posts, selectedCategory]);

  const availableSubTags = useMemo(() => {
    return Array.from(new Set(postsInCategory.flatMap((post) => post.tags))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [postsInCategory]);

  const filteredPosts = useMemo(() => {
    if (!selectedSubTag) {
      return postsInCategory;
    }

    return postsInCategory.filter((post) => post.tags.includes(selectedSubTag));
  }, [postsInCategory, selectedSubTag]);

  const headerTitle = selectedSubTag ? selectedSubTag : selectedCategory || 'Archive';

  return (
    <div className={styles.blogLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <h2>Archive</h2>
          <ul className={styles.categoryList}>
            <li className={styles.mainCategoryItem}>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubTag(null);
                }}
                className={`${styles.categoryButton} ${!selectedCategory ? styles.activeCategory : ''}`}
                type="button"
              >
                All Posts
              </button>
            </li>
            {CATEGORY_ORDER.map((category) => (
              <li key={category} className={styles.mainCategoryItem}>
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubTag(null);
                  }}
                  className={`${styles.categoryButton} ${selectedCategory === category ? styles.activeCategory : ''}`}
                  type="button"
                >
                  <span style={{ marginRight: '0.55rem', opacity: 0.8 }}>{CATEGORY_ICONS[category]}</span>
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selectedCategory && availableSubTags.length > 0 ? (
          <div className={styles.sidebarSection}>
            <h3>Tags</h3>
            <ul className={styles.categoryList}>
              <li className={styles.mainCategoryItem}>
                <button
                  onClick={() => setSelectedSubTag(null)}
                  className={`${styles.subCategoryButton} ${!selectedSubTag ? styles.activeSubCategory : ''}`}
                  type="button"
                >
                  All
                </button>
              </li>
              {availableSubTags.map((tag) => (
                <li key={tag} className={styles.mainCategoryItem}>
                  <button
                    onClick={() => setSelectedSubTag(tag)}
                    className={`${styles.subCategoryButton} ${selectedSubTag === tag ? styles.activeSubCategory : ''}`}
                    type="button"
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{headerTitle}</h1>
          <p>
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
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
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div style={{ padding: '6rem 0', color: 'var(--fg-muted)', fontSize: '0.9rem' }}>No posts.</div>
        ) : null}
      </main>
    </div>
  );
}
