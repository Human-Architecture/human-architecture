# Legal compliance implementation register — 17 November 2026

WORKING DRAFT — not a legal opinion or certification. Do not merge before owner verification and legal review.

## Verified in repository
- index.html links to /impressum/ and /datenschutz/ and contains a contact form posting to /api/contact.
- impressum/index.html and datenschutz/index.html exist.
- The legal pages currently display an address in Sulzbach-Rosenberg; verify the current serviceable business address before release.
- datenschutz/index.html describes Vercel hosting, Resend email delivery and voluntary health-related information.
- api/contact.js sends form data through Resend and has a collaboration flow collecting birth date, time and place.
- package.json includes Neon and Resend; production configuration and Neon usage remain unverified.
- vercel.json schedules a payment-reminder endpoint.
- agb/index.html was not found. Other terms may exist elsewhere.
- The home page did not visibly reference AGB or Widerruf in the retrieved HTML.

## Critical verification
1. Confirm legal name, current serviceable address, contact details, trade/tax classification and relationship between brands.
2. Inventory every offer: B2C/B2B, price, delivery, contract formation, payment, cancellation and withdrawal.
3. Verify consumer withdrawal information, digital-content/service exceptions, and applicability of the electronic withdrawal function effective June 2026.
4. Audit all forms/API endpoints, special-category data, children's data, lawful basis, minimization, retention, deletion, processors, DPAs and international transfers.
5. Verify actual analytics, cookies, embeds and TDDDG consent requirements.
6. Review bodywork/health claims, Heilpraktikergesetz boundaries, professional liability insurance and safety screening.
7. Check FernUSG/ZFU applicability for online teaching and BFSG accessibility obligations.
8. Review personalized AI tools: confidentiality, platform dependencies, third-party disclosure, access, retention and consumer remedies.
9. Verify all privacy disclosures against actual production data flows.

## Implementation after verification
- Master B2C terms and separate B2B terms; offer-specific agreements and deliverable definitions.
- Withdrawal notice, model form and online withdrawal function where legally required.
- Acceptance evidence: terms version, timestamp, order and affirmative consents, confirmation email.
- Booking/rescheduling/cancellation policies consistent with mandatory rights.
- Bodywork intake and informed consent without invalid liability waivers.
- AI data-use disclosure and controls; deletion workflow, breach plan, access controls and processor agreements.
- Cross-link legal pages in all forms, checkouts, offers, confirmation emails and vouchers.

## Release gates
- [ ] Operator identity and address verified
- [ ] All vendor data flows and DPAs checked
- [ ] German legal professional reviews consumer, privacy and regulated-service terms
- [ ] Form, checkout, withdrawal, mobile and accessibility tests pass
- [ ] Owner approves merge and deployment

No claim of guaranteed or complete legal compliance should be made without independent review.
