# Security and legal release gate — 18 November 2026

This repository is NOT certified legally compliant. Do not merge the legal branch until every applicable item is tested and signed off.

## Critical: withdrawal workflow
- [ ] Confirm POST /api/withdrawal works in Vercel production and all preview deployments with correct Origin handling.
- [ ] Verify an immediate acknowledgment email contains declaration, date and time in a durable medium under BGB §356a(4).
- [ ] Replace email-only evidence with reliable, access-controlled durable receipt storage or an independently verified transactional email evidence process; test partial provider outages. Owner-email success without customer acknowledgment is a known failure mode.
- [ ] Implement server-side rate limiting, abuse protection and monitoring without blocking legitimate withdrawals.
- [ ] Confirm withdrawal link is continuously visible and prominently accessible on every covered checkout surface.
- [ ] Test keyboard access, mobile, screen readers, no-JavaScript fallback and plain email alternative.
- [ ] Verify retention, DSAR deletion exceptions and processor DPA.
- [ ] Do not require justification, login, order number exclusively, or additional irrelevant information.

## Critical: orders and contracts
- [ ] Map all payment entrypoints, booking links, PayPal/Stripe/other hosted checkouts, invoices and email flows.
- [ ] Show required total price, core features, duration and statutory information immediately before purchase; comply with §312j BGB where applicable.
- [ ] Publish reviewed terms, withdrawal instructions, model form and service-specific scope, with versioned acceptance records.
- [ ] Check subscription cancellation function under §312k BGB if applicable.
- [ ] Verify actual event dates and registration closure; do not permit payment for expired sessions.

## Critical: privacy/security
- [ ] Verify all production environment variables, remove unused secrets, rotate exposed keys and restrict Vercel/GitHub access with MFA.
- [ ] Inventory API endpoints and apply authorization, validation, rate limits and safe logging. Do not log birth/health data.
- [ ] Audit Neon database permissions, access logs, retention, backups and deletion.
- [ ] Audit Resend, Vercel and all payment/analytics/AI processors: AVV/DPA, international transfer basis, privacy notices.
- [ ] Test HTTPS, HSTS, CSP in report-only first, frame protections, MIME protections and referrer policy without breaking embeds.
- [ ] Verify cookies and third-party scripts at runtime; add consent controls if legally required.
- [ ] Minimize sensitive and children's data; ensure lawful parental/guardian arrangements where applicable.
- [ ] Test incident response, recovery and privacy request workflows.

## Regulated service and operational review
- [ ] German lawyer assesses wellness/bodywork descriptions and Heilpraktikergesetz boundaries.
- [ ] Check FernUSG/ZFU status for each online course/mentoring program.
- [ ] Confirm appropriate business and professional liability coverage.
- [ ] Review B2B terms, AI tools and third-party dependencies.
- [ ] Verify DDG, consumer dispute disclosures, BFSG applicability and accessibility.

## Release evidence
- Date, reviewer, test environment, screenshots, request/response traces with personal data redacted, contract versions, legal counsel approval and explicit owner sign-off must be recorded.
