import { getAllPosts } from '@/lib/posts';
import BlogList from '@/components/BlogList';
import BlogEffects from '@/components/BlogEffects';

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <>
      <BlogEffects />
      <main>
        <BlogList posts={posts} />
      </main>
    </>
  );
}
