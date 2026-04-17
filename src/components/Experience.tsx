'use client';

import { useEffect } from 'react';

export default function Experience() {
  useEffect(() => {
    const root = document.documentElement;

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty('--scroll-depth', progress.toFixed(3));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="experience-shell" aria-hidden="true">
      <div className="experience-gradient" />
      <div className="experience-rays" />
      <div className="experience-bloom" />
    </div>
  );
}
