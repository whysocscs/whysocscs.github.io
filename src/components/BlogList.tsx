'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PostData } from '@/lib/posts';
import type { StandardCategory } from '@/lib/constants';

interface Props {
  posts: Omit<PostData, 'contentHtml'>[];
}

const CAT_META: Record<string, { name: string; color: string }> = {
  Development:             { name: 'Development',       color: 'oklch(0.78 0.14 210)' },
  'CTF/Wargame':           { name: 'CTF / Wargame',     color: 'oklch(0.72 0.12 35)'  },
  BugBounty:               { name: 'Bug Bounty',        color: 'oklch(0.65 0.10 150)' },
  'Technical Document':    { name: 'Technical Doc',     color: 'oklch(0.82 0.12 195)' },
  'Paper/Conference':      { name: 'Paper / Conference', color: 'oklch(0.75 0.10 280)' },
  'Contest/Certification': { name: 'Contest / Cert',    color: 'oklch(0.78 0.11 85)'  },
  Etc:                     { name: 'Etc',               color: 'oklch(0.60 0.03 230)' },
};

const HASH_TO_CAT: Record<string, StandardCategory> = {
  development: 'Development',
  ctf:         'CTF/Wargame',
  bugbounty:   'BugBounty',
  techdoc:     'Technical Document',
  paper:       'Paper/Conference',
  contest:     'Contest/Certification',
  etc:         'Etc',
};

export default function BlogList({ posts }: Props) {
  const [currentCat, setCurrentCat] = useState<StandardCategory | 'all'>('all');
  const [currentSubTag, setCurrentSubTag] = useState<string | null>(null);

  useEffect(() => {
    function applyHash() {
      const h = location.hash.replace('#', '');
      if (!h) return;
      const cat = HASH_TO_CAT[h];
      if (cat) { setCurrentCat(cat); setCurrentSubTag(null); }
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const filtered = currentCat === 'all'
    ? posts
    : posts.filter(p => p.normalizedCategories.includes(currentCat as StandardCategory));

  const subFiltered = currentSubTag
    ? filtered.filter(p => p.tags.includes(currentSubTag))
    : filtered;

  function selectCat(cat: StandardCategory | 'all') {
    setCurrentCat(cat);
    setCurrentSubTag(null);
  }

  const catName = currentCat === 'all' ? 'all' : (CAT_META[currentCat]?.name ?? currentCat);

  return (
    <div className="blog-layout">
      <aside className="blog-sidebar" id="sidebar">
        <div className="sidebar-header">
          <a href="/" className="back">← Home</a>
          <h2>Archive</h2>
          <div className="meta">{posts.length} entries · 2025 — 2026</div>
        </div>

        <button
          className={`cat-btn${currentCat === 'all' ? ' active' : ''}`}
          onClick={() => selectCat('all')}
        >
          All <span className="count">{posts.length}</span>
        </button>

        {(Object.keys(CAT_META) as StandardCategory[]).map(cat => {
          const meta = CAT_META[cat];
          const isActive = currentCat === cat;
          const count = posts.filter(p => p.normalizedCategories.includes(cat)).length;
          const catSubTags = Array.from(new Set(
            posts.filter(p => p.normalizedCategories.includes(cat)).flatMap(p => p.tags)
          ));
          return (
            <div key={cat}>
              <button
                className={`cat-btn${isActive ? ' active' : ''}`}
                onClick={() => selectCat(cat)}
              >
                {meta.name} <span className="count">{count}</span>
              </button>
              {isActive && catSubTags.length > 0 && (
                <div className="sub-tags visible">
                  {catSubTags.map(tag => (
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
        <div className="content-header">
          <div className="showing">
            Showing <em>{catName}</em>{currentSubTag ? ` · ${currentSubTag}` : ''}
          </div>
          <div className="result-count">{subFiltered.length} entries</div>
        </div>

        <div id="post-list">
          {subFiltered.length === 0 ? (
            <div className="empty-state">No entries yet in this category.</div>
          ) : (
            subFiltered.map(post => {
              const primaryCat = post.normalizedCategories[0] ?? 'Etc';
              const meta = CAT_META[primaryCat] ?? CAT_META['Etc'];
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="post-row"
                  style={{ '--cat-color': meta.color } as React.CSSProperties}
                >
                  <div className="post-date">{post.date}</div>
                  <div className="post-title">{post.title}</div>
                  <div className="post-tags">
                    <span className="cat-tag">{meta.name}</span>
                    {post.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
