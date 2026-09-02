# Add the Human Architecture reference page

These files update the existing GitHub/Vercel website. They are not a complete copy of the website. Keep all existing assets, API routes, Babymesse files and other pages.

## Files to upload to the existing repository

- `index.html`: replaces the current homepage. Adds The Method to both menus and links in Philosophy and About; identifies Mel in existing structured data. The hero text and existing sections are preserved.
- `styles.css`: replaces the current stylesheet. Keeps existing rules and appends reference-page styling. The existing mobile-menu breakpoint moves from 1180px to 1440px to give the extra navigation item room. Mobile navigation can scroll on short screens.
- `script.js`: replaces the current script. Its only change is the matching menu resize threshold (1180 to 1440). Contact, language switching, audio and other interactions are preserved.
- `what-is-human-architecture/index.html`: new folder and file. Contains the complete English reference page, all 12 sections, contents navigation, current site header/footer, canonical and structured data. It uses existing root assets and stylesheet.

## GitHub: step by step

1. Download and unzip this package.
2. Open the existing `Human-Architecture/human-architecture` repository, on its main file-list page.
3. Choose **Add file → Upload files**.
4. Drag `index.html`, `styles.css`, `script.js`, and the whole `what-is-human-architecture` folder into the upload area. Do not drag the outer `HA-Website-Update` folder. The resulting paths must be the four paths listed above.
5. Check that the homepage filename is `index.html`, not `index (1).html`. Commit the files together with the message **Add Human Architecture method reference page**. If you prefer reviewing a Vercel preview first, commit to a new branch and review its deployment before merging.
6. Wait for Vercel to report Ready. Open the homepage, click The Method, then check the new page and its return links. Check the homepage in both languages and at a narrow screen width.
7. The expected page address is `https://www.human-architecture.info/what-is-human-architecture/`. If Vercel redirects it to a different final form or serves the homepage there, inspect the project's existing rewrites before changing the canonical or sitemap. No Vercel configuration was supplied, so route handling is not live-verified.
8. Open the existing `sitemap.xml` and insert the XML in `SITEMAP-ENTRY.txt` before `</urlset>`. Preserve all other page entries. Commit this update after the new page is live.
9. Inspect the new page URL in Search Console, run the live test and request indexing once if eligible.

Do not upload this guide, SITEMAP-ENTRY.txt or VALIDATION.txt as website pages.

## Language and content

The reference is English. German homepage links identify it as English. The reference has no misleading partial German toggle. The homepage language switch remains intact. A fully translated reference can be added as a separate language URL later.

The supplied current homepage places Codex, Human Architecture Sessions and Mihira Ceremonia within the three-domain structure. The reference was aligned with that relationship. Origin and founder narrative come from the previously supplied PDF. No unprovided portrait was added.

## Scope of verification

Static structure, internal destinations, metadata, all 12 sections, JavaScript syntax and preservation of existing homepage content were checked. Browser rendering, missing asset files, the contact API and live Vercel routing could not be validated from the three supplied files alone. Existing assets and backend remain in the repository.

The website has not been published by this file preparation.
