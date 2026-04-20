# Lee Sangho Portfolio

Security research portfolio and blog for <https://whysocscs.github.io/>.

The site started from a Jalpc/Jekyll theme, but the current deployment path is a Next.js static export published through GitHub Pages Actions. The visual direction is an underwater portfolio: a cinematic descent intro, depth-aware navigation, ocean particles, creature cursor, and an archive-style blog.

## Stack

- Next.js 16 static export
- React 19
- TypeScript
- GitHub Pages Actions
- Legacy Jekyll files are still present for compatibility and historical content

## Local Development

Install dependencies:

```powershell
npm ci
```

Run a development server:

```powershell
npm run dev
```

Build the static export:

```powershell
npm run build
```

The GitHub Pages workflow builds the site from `master` and uploads `./out`.

## Project Map

- `src/app/page.tsx`: home page content
- `src/components/HomeEffects.tsx`: intro animation, ocean background, cursor, bubbles, scroll effects
- `src/app/blog/page.tsx`: blog archive page
- `src/components/BlogEffects.tsx`: blog ocean background, creature cursor, bubble trail, depth counter
- `src/components/BlogList.tsx`: archive filtering UI
- `src/app/blog/[slug]/page.tsx`: post detail page
- `src/app/globals.css`: shared visual system and blog/home styling
- `_posts/`: imported blog posts
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment

## Design Direction

The site should avoid generic AI landing-page patterns. Keep the ocean concept strong and intentional:

- Use cinematic depth, not flat dark mode.
- Prefer big, expressive type with generous spacing.
- Make motion feel physical: slow ocean background, quick cursor response, subtle bubbles, scroll-triggered reveals.
- Keep visual language consistent across home and blog.
- When adding UI, preserve the underwater metaphor: surface, twilight, midnight, abyssal, hadal.

Current creature cursor behavior:

- Surface: bubbles
- Twilight: fish
- Midnight: whale
- Abyssal: jellyfish
- Hadal: glowing point

## GitHub Workflow

Useful lessons from the referenced videos:

- Keep durable project rules in the repo, not only in chat. This README is the project memory for future AI/coding sessions.
- For visual work, give the agent a concrete aesthetic direction and examples, then make it inspect the current code before editing.
- Use small, intentional commits instead of one large ambiguous change.
- Let GitHub Actions be the source of truth for deployability.
- Before pushing, run the most relevant local check, currently `npm run build`.

Recommended flow:

```powershell
git status --short
npm run build
git add -- <changed-files>
git commit -m "Short imperative summary"
git push origin master
```

For larger work:

1. Create or write down an issue-sized goal.
2. Use a feature branch when the change is risky.
3. Keep PR descriptions focused on what changed, why it changed, and how it was tested.
4. Check the GitHub Pages deploy result after pushing to `master`.

## Video Notes Used

- `2sNQ0Nvngdc`: design quality improves when the agent has explicit skills/rules and avoids "AI slop" defaults.
- `qi-tliqg25I`: frontend-specific context and consistent component knowledge matter for polished UI.
- `4DS9nLOk8To`: spatial/3D-feeling landing pages benefit from mouse-reactive motion, depth, and full-screen atmosphere.

These notes informed the current README, intro upgrade, bubble trail, and creature cursor work.

## Deployment

The repository deploys via GitHub Actions on pushes to `master`.

If the public site does not update after pushing:

- Check the `Deploy Pages` workflow in GitHub Actions.
- Confirm `npm run build` succeeds locally.
- Confirm `next.config.mjs` still has `output: 'export'`.

