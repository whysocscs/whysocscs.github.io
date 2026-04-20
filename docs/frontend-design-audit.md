# Frontend Design Audit

## Scope
- Review current home, blog archive, and blog detail pages.
- Compare against strong editorial, product, and technical content sites.
- Distill patterns that fit a Next.js + CSS codebase without overbuilding.

## References Reviewed
1. [Awwwards / Inspiring Design Blogs](https://www.awwwards.com/awwwards/collections/inspiring-blog-design/)
2. [Stripe Blog](https://stripe.com/blog)
3. [Vercel Blog](https://vercel.com/blog)
4. [Linear Now](https://linear.app/now)
5. [Anthropic Newsroom](https://www.anthropic.com/news)
6. [Framer Blog](https://www.framer.com/blog/)
7. [Figma Blog](https://www.figma.com/blog/)
8. [Tailwind CSS Blog](https://tailwindcss.com/blog)
9. [Clerk Blog](https://clerk.com/blog)
10. [Smashing Magazine Articles](https://www.smashingmagazine.com/articles/)
11. [Josh W. Comeau Blog](https://www.joshwcomeau.com/blog/)
12. [GitHub Blog](https://github.blog/)
13. [Shopify Engineering](https://shopify.engineering/)
14. [Cursor Blog](https://cursor.com/blog)
15. [Cloudflare Blog](https://blog.cloudflare.com/)

## Frontend Resources Reviewed
- [MDN Responsive Design](https://developer.mozilla.org/ca/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [web.dev Typography](https://web.dev/learn/design/typography)
- [web.dev Fluid Typography](https://web.dev/articles/baseline-in-action-fluid-type)
- [Next.js Font Optimization](https://nextjs.org/docs/14/app/building-your-application/optimizing/fonts)
- [Next.js Font Component](https://nextjs.org/docs/pages/api-reference/components/font)

## Shared Patterns
- Strong sites do not start with effects. They start with clean type, believable spacing, and clear reading order.
- Archive pages are calmer than landing pages. Big hero once, then fast scanning.
- Metadata is present but subordinate. Title and summary lead; tags and pills trail.
- The best article pages reduce decision-making near the top. A reader should know where to start in under a second.
- Mobile layouts compress rhythm aggressively. Empty space is used carefully, not decoratively.

## Problems In The Current Site
- Home copy had corrupted strings and broken labels, which made the visual system feel less intentional.
- Home spacing leaned atmospheric but sometimes under-delivered information density.
- Blog archive used stat cards and full tag output where a lighter editorial overview works better.
- Article pages still benefit from simplifying the pre-reading UI so the body starts faster.

## Design Direction To Keep
- Preserve the underwater identity, but let typography and content hierarchy do more of the work.
- Use cyan/plankton accents as emphasis only.
- Keep animation ambient and secondary to content.
- Favor editorial lists over dashboard-like cards for the archive.

## Implementation Priorities
1. Clean copy and labels before adding new effects.
2. Tighten vertical rhythm across home sections.
3. Reduce archive chrome and tag noise.
4. Keep article rails useful but visually quieter than the body.
