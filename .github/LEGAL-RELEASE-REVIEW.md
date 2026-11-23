# Legal website release checklist — INTERNAL DRAFT (23 November 2026)

**Not legal approval. Do not publish contractual templates or merge without review.**

## Verified
- Provider name: Melina Martina Basha.
- Brand names: Human Architecture and Mihira Ceremonia.
- Business calls: +49 155 60284760 (tel:+4915560284760).
- Business WhatsApp messages: +49 1520 3131871 (https://wa.me/4915203131871).
- Email currently used: hello@human-architecture.info.
- Physical positioning: wellness; existing bookings require individual review.
- No Berufshaftpflichtversicherung currently confirmed.

## Critical blocker: business address
The current `impressum/index.html` and `datenschutz/index.html` contain an address in Sulzbach-Rosenberg. The provider has NOT verified that this is still a current ladungsfähige Geschäftsanschrift. Obtain express confirmation and correct BOTH pages before release.

## Legal content / data processing audit
- Verify DDG §5 details, Wirtschafts-Identifikationsnummer/USt-ID if assigned, professional authorization and supervisory authority if applicable, editorial responsibility if applicable.
- Verify all deployed third-party services, forms, cookies, embeds, analytics, fonts, hosting, Resend, WhatsApp, AI processing and international transfers against the privacy notice and consent setup.
- Confirm Article 9 GDPR handling and secure storage for sensitive intake information.
- Review consumer withdrawal instructions by offer and ensure §356a BGB online withdrawal workflow works for eligible contracts; current page existence alone does not prove functionality.
- Verify B2C and B2B AGB separately; contract annexes, digital delivery, cancellation, data use, minors and parental consent, refund rules, mandatory liability rights.
- Review online course FernUSG/ZFU applicability.
- Hold physical service release until qualification, legal scope, method-specific risks and insurance are verified.
- Review accessibility/BFSG applicability, VSBG, taxes, voucher terms, pricing and booking disclosures.
- Confirm no public PDF contracts are served from this draft library; noindex is NOT access control.
- Implement authenticated private storage for signed agreements and internal versions outside the public static website.
- Fix/verify Vercel deployment; test mobile/desktop and every contact and legal link.
- Obtain independent German legal review and explicit owner signoff before merge/publish.

## Public-facing contact labels
**Telefon (Anrufe):** +49 155 60284760
**Business-WhatsApp (Nachrichten):** +49 1520 3131871

The numbers must never be swapped. WhatsApp is not a default channel for sensitive health data.

## Code-level audit findings (23 Nov 2026; not a production test)
- `widerruf/index.html` contains a two-stage UI and POSTs to `/api/withdrawal`.
- `api/withdrawal.js` sends owner and customer acknowledgement through Resend. If owner delivery succeeds but customer acknowledgement fails, it returns 202 with `ok:true` and a manual follow-up message. No persistent queue, retry, alerting or auditable durable storage is evident in this file. Test failures and implement operational fallback before declaring compliant.
- The acknowledgement text includes the ISO UTC timestamp and submitted details; verify actual email content, sender configuration, deliverability and whether the consumer can retain it.
- The browser UI requires name, contract and email. Check whether the selected email is a suitable electronic confirmation channel; do not require additional reasons.
- `vercel.json` defines security headers and a daily cron; this alone does not verify security or that every API endpoint is access-controlled. Audit all endpoints, secrets, and production deployment.
- `package.json` lists Neon, Resend and Vercel Analytics. Verify deployed uses, privacy disclosure, processing agreements, transfer mechanisms and consent requirements; dependencies alone do not prove processing.
- `impressum/index.html` and `datenschutz/index.html` contain confirmed provider address and correct separate numbers. Still verify W-IdNr and other mandatory details, and processing accuracy.
- No complete `agb/index.html` was found at the inspected path; this does NOT prove no terms exist elsewhere. Search all routes and booking funnels before release.
- Production build status, forms, accessibility, checkout and security have NOT been independently tested.

## Page-by-page spot audit (23 Nov 2026; source inspection only)
Inspected: /angebote/, /organizations/, /gutscheine/, /babymesse/, /body-language/, /mihira-ceremonia/return/, /kurse/westliche-astrologie/, /kooperationen/familie/, /what-is-human-architecture/, /mensch-und-tier/, /impressum/, /datenschutz/, /widerruf/, /rechtliches/, /vertraege/, and /api/withdrawal. This is NOT an exhaustive crawl of every repository route or external checkout.
- Astrology course page currently advertises FOUR ADVENT SUNDAYS: 29 Nov, 6 Dec, 13 Dec, 20 Dec 2026, including Course JSON-LD dates. Prior business planning referenced FOUR SATURDAYS in December. **Owner must confirm actual scheduled days before marketing, payment or launch.** Do not silently change dates.
- Voucher page references event offers and direct payments including BODY LANGUAGE 28 Nov 2026, Advent of Astrology, DEEP REST 11 Dec 2026 and a Codex 2027 "Oktober-Angebot". Confirm current inventory, event status, checkout destinations, pricing, voucher terms, tax display and outdated promotion. Avoid stale sales links.
- RETURN and astrology course pages contain forms. Audit consent, validation, server endpoints, anti-abuse, confirmation, retention and any health/birth information actually collected.
- Organization, family cooperation, animal and other landing pages have legal links; audit every language variant, internal navigation, CTA destination, service-scope claims and accessibility.
- The privacy page describes OpenAI API orientation and Custom GPT links. Verify actual deployment and data flows; do not assume privacy statements match live code.
- Source-level page inspection cannot establish external payment success, browser accessibility, legal compliance or conversion rates. Carry out a browser journey audit and professional legal review before release.

## Additional routes and conversion review (23 Nov 2026)
Source-inspected /, /sessions/, /codex/, /mihira-ceremonia/, /body-language/book/ and /body-language/en/book/ (alongside previously inspected pages). No live browser or payment tests performed.
- Both BODY LANGUAGE booking review screens now display direct withdrawal-information and email-contact links, including English. This improves visibility but does not replace mandatory pre-contract disclosures, correct right-of-withdrawal instruction, checkout terms or § 356a backend testing.
- /codex/ source contains a privacy link but no obvious impressum/withdrawal link in the extracted href audit. Review full navigation and any purchase path; ensure globally accessible legal links.
- /sessions/ and /mihira-ceremonia/ link Impressum and Datenschutz, but scope-of-practice, claims, booking conditions and prices require professional review.
- /body-language/book/ and /body-language/en/book/ each contain forms and a shared booking script. Verify translated disclosures, explicit consents, safety intake, payment handoff, accessibility and mobile behavior.
- Never present the site as legally bulletproof, promise all visitors will convert, or imply that source-level review equals deployment validation.
