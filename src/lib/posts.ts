import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { CATEGORY_ORDER, STANDARD_CATEGORIES, type StandardCategory } from '@/lib/constants';

const POSTS_DIR = path.join(process.cwd(), '_posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  sortDate: string;
  desc: string;
  keywords: string;
  categories: string[];
  normalizedCategories: StandardCategory[];
  tags: string[];
  icon?: string;
  content: string;
  contentHtml: string;
}

export interface PostHeading {
  id: string;
  level: number;
  text: string;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeCategory(raw: string): StandardCategory {
  const lower = raw.trim().toLowerCase();

  for (const [canonical, aliases] of Object.entries(STANDARD_CATEGORIES)) {
    if (canonical.toLowerCase() === lower || aliases.includes(lower)) {
      return canonical as StandardCategory;
    }
  }

  return 'Etc';
}

function normalizeDate(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  return '';
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ');
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function slugifyHeading(value: string) {
  const normalized = decodeEntities(stripHtml(value))
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return normalized || 'section';
}

function isRealPost(title: string, rawCategories: string[], sortDate: string) {
  if (!sortDate.startsWith('2025') && !sortDate.startsWith('2026')) {
    return false;
  }

  if (title.includes('Jalpc') || title.includes('code snippet test')) {
    return false;
  }

  if (rawCategories.some((category) => category.toLowerCase() === 'html')) {
    return false;
  }

  return true;
}

function parsePost(fileName: string): Omit<PostData, 'contentHtml'> | null {
  const fullPath = path.join(POSTS_DIR, fileName);
  const file = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(file);
  const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  const title = String(data.title ?? slug);
  const sortDate = normalizeDate(data.date);
  const categories = toArray(data.categories);

  if (!isRealPost(title, categories, sortDate)) {
    return null;
  }

  const normalizedCategories = Array.from(new Set(categories.map(normalizeCategory)));

  return {
    slug,
    title,
    date: sortDate ? new Date(sortDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) : '',
    sortDate,
    desc: String(data.desc ?? ''),
    keywords: String(data.keywords ?? ''),
    categories,
    normalizedCategories: normalizedCategories.length > 0 ? normalizedCategories : ['Etc'],
    tags: toArray(data.tags),
    icon: typeof data.icon === 'string' ? data.icon : undefined,
    content,
  };
}

export function getAllPosts(): Omit<PostData, 'contentHtml'>[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(POSTS_DIR)
    .filter((fileName) => fileName.endsWith('.md'))
    .map(parsePost)
    .filter((post): post is Omit<PostData, 'contentHtml'> => post !== null)
    .sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostData> {
  const post = getAllPosts().find((item) => item.slug === slug);

  if (!post) {
    throw new Error(`Post not found for slug: ${slug}`);
  }

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(post.content);

  return {
    ...post,
    contentHtml: String(processed),
  };
}

export function getPostSummary(post: Omit<PostData, 'contentHtml'> | PostData) {
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

export function decoratePostHtml(contentHtml: string) {
  const seenIds = new Map<string, number>();
  const headings: PostHeading[] = [];
  const withoutSourceBlock = contentHtml.replace(
    /^\s*<blockquote>\s*<p>\s*Source:\s*<a[\s\S]*?<\/a>\s*<\/p>\s*<\/blockquote>\s*/i,
    '',
  );

  const nextHtml = withoutSourceBlock.replace(
    /<h([1-4])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (full, levelText, attrs, inner) => {
      const level = Number(levelText);
      const text = decodeEntities(stripHtml(inner)).replace(/\s+/g, ' ').trim();

      if (!text) {
        return full;
      }

      const existingId = /id=(["'])(.*?)\1/i.exec(attrs)?.[2];
      let id = existingId;

      if (!id) {
        const baseId = slugifyHeading(text);
        const count = (seenIds.get(baseId) ?? 0) + 1;
        seenIds.set(baseId, count);
        id = count === 1 ? baseId : `${baseId}-${count}`;
      }

      headings.push({ id, level, text });

      if (existingId) {
        return full;
      }

      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return {
    contentHtml: nextHtml,
    headings,
  };
}

export function estimateReadingMinutes(content: string) {
  const plain = decodeEntities(stripHtml(content)).replace(/\s+/g, ' ').trim();
  const words = plain ? plain.split(' ').length : 0;
  return Math.max(1, Math.round(words / 220));
}

export function getAdjacentPosts(slug: string) {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { newer: null, older: null };
  }

  return {
    newer: posts[index - 1] ?? null,
    older: posts[index + 1] ?? null,
  };
}

export function getRelatedPosts(slug: string, limit = 3) {
  const posts = getAllPosts();
  const current = posts.find((post) => post.slug === slug);

  if (!current) {
    return [];
  }

  const currentTags = new Set(current.tags);
  const currentCategories = new Set(current.normalizedCategories);

  const scored = posts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      let score = 0;

      for (const tag of post.tags) {
        if (currentTags.has(tag)) score += 3;
      }

      for (const category of post.normalizedCategories) {
        if (currentCategories.has(category)) score += 2;
      }

      if ((post.normalizedCategories[0] ?? 'Etc') === (current.normalizedCategories[0] ?? 'Etc')) {
        score += 1;
      }

      return { post, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.post.sortDate < b.post.sortDate ? 1 : -1;
    });

  const meaningful = scored.filter((entry) => entry.score > 0).slice(0, limit);

  if (meaningful.length >= limit) {
    return meaningful.map((entry) => entry.post);
  }

  const fallback = scored.slice(0, limit).map((entry) => entry.post);
  return meaningful.length > 0 ? meaningful.map((entry) => entry.post) : fallback;
}

export function getCategoryCounts(posts: Omit<PostData, 'contentHtml'>[]) {
  const counts = Object.fromEntries(CATEGORY_ORDER.map((category) => [category, 0])) as Record<StandardCategory, number>;

  for (const post of posts) {
    for (const category of post.normalizedCategories) {
      counts[category] += 1;
    }
  }

  return counts;
}
