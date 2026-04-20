# The Sea We Breathe Interaction Notes

Source: https://www.bluemarinefoundation.com/the-sea-we-breathe/

This page was inspected with Chromium, screenshots, DOM extraction, network capture, click attempts, and scroll attempts. The live experience is a WebGL-heavy WordPress page, so the full underwater journey did not advance reliably in the headless browser after the second `LET'S BEGIN` click. Even so, the loaded DOM, visual states, class structure, and hidden modal content exposed enough design direction to guide this portfolio.

## Captured States

- Loader: dark ocean background, small technical labels, circular loading ring, `LOADING EXPERIENCE`, and minimal language/home controls.
- Title surface: bright ocean horizon with `THE SEA WE BREATHE`, audio notice, and a single `LET'S BEGIN` call-to-action.
- HUD language: `DETAIL: CONNECTED`, `LOCATION: ATLANTIC OCEAN`, and coordinates such as `15.599° S / 28.6731° W`.
- Page shell: custom cursor, audio toggle, menu/share controls, depth/progress/temperature HUD elements, fixed background, project modals, and carousel content.

## Visual Lessons To Reuse

- Treat entry as a physical event: the user should feel like they are crossing the water surface, not just opening a page.
- Keep the first frame sparse. One cinematic title or mark is stronger than multiple large text blocks competing for attention.
- Use HUD elements as atmosphere: coordinates, depth, status, and progress can frame the experience without becoming the main content.
- Make scroll feel like travel: layered currents, bubbles, plankton, silhouettes, and depth labels should move at different rates.
- Let brightness fall with depth: surface can be cyan and reflective, then slowly become colder, darker, and quieter.

## Structural Lessons

- The site uses a loader before the main title, then a second begin action to enter the WebGL journey.
- The important interaction model is staged: loading, surface title, descent, project discovery.
- Depth/progress UI appears to be persistent and independent from content sections.
- Project content is not just inline text; it opens in modal/carousel patterns, which keeps the journey cinematic.

## Content Found In DOM

- Project headings include `Project Spotlight`, `Blue marine foundation is working to revive ocean life`, `Blue marine foundation is Rethinking the way we fish`, and `Blue marine foundation is Protecting the Maldives`.
- Project examples include St Helena, Berwickshire Marine Reserve / Ocean Observatory, and Maldives Resilient Reefs.
- Stats include `444,916 km2 Marine Protected Area` and `100% of island youth engaged in marine conservation`.
- External references include YouTube/Vimeo media, St Helena project pages, Berwickshire Ocean Observatory, and Maldives conservation campaign links.

## Application To This Portfolio

- The portfolio intro should auto-descend after a short surface pause instead of requiring a button.
- The first visible UI should be trimmed down so it does not overlap with the central `Lee Sangho` title reveal.
- Home and blog should preserve the same deep-sea system, but home can feel more cinematic while blog stays more archive-like.
- Cursor behavior should feel like a creature or sensor moving through water, not a standard pointer skin.
- The README should remain the durable project memory for AI-assisted design decisions.
