'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { PostData } from '@/lib/posts';
import type { StandardCategory } from '@/lib/constants';

interface Props {
  posts: Omit<PostData, 'contentHtml'>[];
}

const CAT_META: Record<string, { name: string; color: string }> = {
  Development: { name: 'Development', color: 'oklch(0.78 0.14 210)' },
  'CTF/Wargame': { name: 'CTF / Wargame', color: 'oklch(0.72 0.12 35)' },
  BugBounty: { name: 'Bug Bounty', color: 'oklch(0.65 0.10 150)' },
  'Technical Document': { name: 'Technical Doc', color: 'oklch(0.82 0.12 195)' },
  'Paper/Conference': { name: 'Paper / Conference', color: 'oklch(0.75 0.10 280)' },
  'Contest/Certification': { name: 'Contest / Cert', color: 'oklch(0.78 0.11 85)' },
  Etc: { name: 'Etc', color: 'oklch(0.60 0.03 230)' },
};

const HASH_TO_CAT: Record<string, StandardCategory> = {
  development: 'Development',
  ctf: 'CTF/Wargame',
  bugbounty: 'BugBounty',
  techdoc: 'Technical Document',
  paper: 'Paper/Conference',
  contest: 'Contest/Certification',
  etc: 'Etc',
};

function getPostYear(post: Omit<PostData, 'contentHtml'>) {
  const matched =
    (typeof post.sortDate === 'string' ? post.sortDate : '').match(/\d{4}/)?.[0] ??
    post.date.match(/\d{4}/)?.[0];

  return matched ?? 'Archive';
}

function getPostSummary(post: Omit<PostData, 'contentHtml'>) {
  const title = post.title.trim().toLowerCase();
  const desc = post.desc.trim();

  if (desc && desc.toLowerCase() !== title) {
    return desc;
  }

  const filteredKeywords = post.keywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .filter((keyword) => keyword.toLowerCase() !== title)
    .filter((keyword) => !post.normalizedCategories.includes(keyword as StandardCategory))
    .slice(0, 3);

  if (filteredKeywords.length > 0) {
    return filteredKeywords.join(' / ');
  }

  if (post.tags.length > 0) {
    return post.tags.join(' / ');
  }

  return 'Field note entry from the archive.';
}

function getCompactSummary(post: Omit<PostData, 'contentHtml'>) {
  const summary = getPostSummary(post).replace(/\s+/g, ' ').trim();
  return summary.length > 120 ? `${summary.slice(0, 117).trimEnd()}...` : summary;
}

export default function BlogList({ posts }: Props) {
  const [currentCat, setCurrentCat] = useState<StandardCategory | 'all'>('all');
  const [currentSubTag, setCurrentSubTag] = useState<string | null>(null);

  useEffect(() => {
    function applyHash() {
      const hash = location.hash.replace('#', '');
      if (!hash) return;

      const category = HASH_TO_CAT[hash];
      if (category) {
        setCurrentCat(category);
        setCurrentSubTag(null);
      }
    }

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const filtered =
    currentCat === 'all'
      ? posts
      : posts.filter((post) => post.normalizedCategories.includes(currentCat as StandardCategory));

  const subFiltered = currentSubTag
    ? filtered.filter((post) => post.tags.includes(currentSubTag))
    : filtered;

  function selectCat(category: StandardCategory | 'all') {
    setCurrentCat(category);
    setCurrentSubTag(null);
  }

  const catName = currentCat === 'all' ? 'Full archive' : (CAT_META[currentCat]?.name ?? currentCat);
  const years = posts
    .map(getPostYear)
    .filter((year) => /^\d{4}$/.test(year))
    .sort((a, b) => Number(b) - Number(a));
  const yearRange = years.length > 0 ? `${years[years.length - 1]} - ${years[0]}` : 'Live archive';
  const groupedArchive = subFiltered.reduce<Record<string, Omit<PostData, 'contentHtml'>[]>>((acc, post) => {
    const year = getPostYear(post);
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});
  const archiveYears = Object.keys(groupedArchive).sort((a, b) => {
    if (/^\d{4}$/.test(a) && /^\d{4}$/.test(b)) {
      return Number(b) - Number(a);
    }

    return a.localeCompare(b);
  });
  const visibleTagCount = new Set(subFiltered.flatMap((post) => post.tags)).size;

  return (
    <div className="blog-layout">
      <aside className="blog-sidebar" id="sidebar">
        <div className="sidebar-header">
          <a href="/" className="back">
            Home
          </a>
          <h2>Archive</h2>
          <div className="meta">
            {posts.length} entries / {yearRange}
          </div>
        </div>

        <button
          className={`cat-btn${currentCat === 'all' ? ' active' : ''}`}
          onClick={() => selectCat('all')}
        >
          All <span className="count">{posts.length}</span>
        </button>

        {(Object.keys(CAT_META) as StandardCategory[]).map((category) => {
          const meta = CAT_META[category];
          const isActive = currentCat === category;
          const count = posts.filter((post) => post.normalizedCategories.includes(category)).length;
          const categoryTags = Array.from(
            new Set(
              posts
                .filter((post) => post.normalizedCategories.includes(category))
                .flatMap((post) => post.tags),
            ),
          );

          return (
            <div key={category}>
              <button
                className={`cat-btn${isActive ? ' active' : ''}`}
                onClick={() => selectCat(category)}
              >
                {meta.name} <span className="count">{count}</span>
              </button>

              {isActive && categoryTags.length > 0 && (
                <div className="sub-tags visible">
                  {categoryTags.map((tag) => (
                    <button
                      key={tag}
                      className={`sub-tag${currentSubTag === tag ? ' active' : ''}`}
                      onClick={() => setCurrentSubTag(currentSubTag === tag ? null : tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </aside>

      <div className="blog-content">
        <div className="archive-shell" id="post-list">
          <header className="archive-hero">
            <div className="archive-kicker">
              Showing <em>{catName}</em>
              {currentSubTag ? ` / ${currentSubTag}` : ''}
            </div>

            <div className="archive-intro">
              <h1>Signal Archive</h1>
              <p>
                Security notes, experiments, conference takeaways, and field records arranged as an
                editorial index instead of a promotional feed.
              </p>
            </div>

            <div className="archive-overview">
              <span>{subFiltered.length} visible notes</span>
              <span>{archiveYears.length} years indexed</span>
              <span>{visibleTagCount} active tags</span>
            </div>
          </header>

          {subFiltered.length === 0 ? (
            <div className="empty-state">No entries yet in this category.</div>
          ) : (
            <div className="archive-groups">
              {archiveYears.map((year) => (
                <section key={year} className="archive-year-block">
                  <div className="archive-year-header">
                    <span className="archive-year">{year}</span>
                    <span className="archive-year-count">{groupedArchive[year].length} entries</span>
                  </div>

                  <div className="archive-year-list">
                    {groupedArchive[year].map((post, index) => {
                      const primaryCategory = post.normalizedCategories[0] ?? 'Etc';
                      const meta = CAT_META[primaryCategory] ?? CAT_META.Etc;
                      const previewTags = post.tags.slice(0, 2);
                      const remainingTags = post.tags.length - previewTags.length;

                      return (
                        <Link
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          className="archive-entry"
                          style={{ '--cat-color': meta.color } as CSSProperties}
                        >
                          <div className="entry-date">
                            <span>{post.date}</span>
                            <span className="entry-index">{String(index + 1).padStart(2, '0')}</span>
                          </div>

                          <div className="entry-main">
                            <div className="entry-title">{post.title}</div>
                            <div className="entry-summary">{getCompactSummary(post)}</div>
                          </div>

                          <div className="entry-tags">
                            <span className="cat-tag">{meta.name}</span>
                            {previewTags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                            {remainingTags > 0 ? <span>+{remainingTags}</span> : null}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
