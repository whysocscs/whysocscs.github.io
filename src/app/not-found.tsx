import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="content">
        <p className="eyebrow">Lost Signal</p>
        <h1>404</h1>
        <p>No page was recovered at this depth.</p>
        <Link href="/" className="blog-link">
          Return to surface
        </Link>
      </div>
    </div>
  );
}
