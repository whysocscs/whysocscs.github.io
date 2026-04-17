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

export function getCategoryCounts(posts: Omit<PostData, 'contentHtml'>[]) {
  const counts = Object.fromEntries(CATEGORY_ORDER.map((category) => [category, 0])) as Record<StandardCategory, number>;

  for (const post of posts) {
    for (const category of post.normalizedCategories) {
      counts[category] += 1;
    }
  }

  return counts;
}
