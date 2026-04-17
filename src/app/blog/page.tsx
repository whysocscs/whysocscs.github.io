import BlogList from '@/components/BlogList';
import { getAllPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogList posts={posts} />;
}
