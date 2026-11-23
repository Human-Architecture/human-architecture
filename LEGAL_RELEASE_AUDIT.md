# German-market release audit

Status: source-level review, 23 November 2026. This is a release-control document, not legal advice or a legal opinion.

## Verified in the source

| Area | Current result |
| --- | --- |
| Provider disclosure | `/impressum/` contains the named proprietor, physical address, email, and the dedicated business call number `+49 155 60284760`. |
| Privacy information | `/datenschutz/` identifies Vercel, Resend, PayPal, OpenAI (conditional), and the stated processing contexts. The business call number is listed separately from WhatsApp. |
| Withdrawal route | `/widerruf/` provides a two-step submission flow, email alternative, and a business contact number. The endpoint limits method, origin, payload size, and confirms receipt by email when the provider is available. |
| BODY LANGUAGE | The booking flow has explicit privacy and participation-terms acknowledgement, capacity enforcement, payment-link validation, and confirmation after payment matching. The booking close is enforced server-side at 28 November 2026, 15:00 Berlin time. |
| Current events | Only BODY LANGUAGE, Advent of Astrology, and DEEP REST are in the active event journey. The source tests verify their poster, information, payment, and voucher routes. |
| Baseline headers | Vercel configuration sets MIME-sniffing, referrer, framing, and selected permissions protections. |

## Release blockers requiring verified business facts and legal review

1. **Astrology course checkout** — add offer-specific contract information and confirmation: provider identity/contact, exact scope, total price, timing, delivery of workbook/recording/access, cancellation/withdrawal treatment, and final contractual confirmation. Do not publish a generic waiver.
2. **Codex digital offers** — for every offer, confirm the delivery deadline, scope, price/tax treatment, applicable withdrawal rules, and—when performance begins inside a withdrawal period—the legally required express consent and acknowledgement. Ensure these details appear before payment and on the durable confirmation.
3. **VAT and invoice model** — verify whether the business uses the small-business VAT exemption, charges VAT, has a VAT ID, and uses any trade-register entry. These facts must be consistent on every paid route and invoice/confirmation.
4. **Processor records** — confirm active accounts, signed DPAs, locations/transfers, and retention schedules for Vercel, Resend, PayPal, Neon/Postgres, OpenAI, and any video or course-delivery service.
5. **Sensitive data minimisation** — validate necessity and retention for health-related information and birth data. Do not collect special-category data unless the exact legal basis, explicit consent, access controls, and deletion process are operational.
6. **International selling** — define the countries actively targeted and obtain country-specific review before marketing consumer services outside Germany.
7. **Operational proof** — test live PayPal capture, Resend delivery, withdrawal acknowledgement, database retention/deletion, and incident handling after deployment. Source tests cannot prove production credentials or live service behaviour.

## Legal baseline checked

- BGB § 312j: clear pre-contract information and an unambiguous payment-obligation step.
- BGB § 312f and Art. 246a EGBGB: contract confirmation on a durable medium and pre-contract information.
- BGB § 312g: withdrawal rights and exceptions must be assessed per contract type.
- DDG § 5: readily available provider disclosure.

Official references: https://www.gesetze-im-internet.de/bgb/__312j.html, https://www.gesetze-im-internet.de/bgb/__312f.html, https://www.gesetze-im-internet.de/bgb/BJNR001950896.html, https://www.gesetze-im-internet.de/bgbeg/BJNR006049896.html, https://www.gesetze-im-internet.de/ddg/BJNR0950B0024.html.

## Release rule

Do not describe the website as legally certified, fully compliant, or bulletproof until every blocker above is resolved using verified business facts and a German-qualified legal review.
