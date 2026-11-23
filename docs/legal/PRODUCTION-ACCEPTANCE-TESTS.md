# Production verification — executable acceptance scenarios

Do not publish the draft legal branch solely because this file exists.

## Withdrawal endpoint (must pass in preview)
1. GET /api/withdrawal -> 405, Allow: POST, no-store.
2. POST non-JSON -> 415; malformed, missing or excessive fields -> 400; payload > 4096 bytes -> 413.
3. POST with unrelated Origin -> 403; supported domain -> accepted.
4. Valid POST with test Resend credentials: verify owner receives exact declaration and UTC receipt time; verify customer gets identical content and timestamp.
5. Simulate owner email failure: customer sees clear failure, no false success.
6. Simulate customer email failure: owner receives declaration, customer gets explicit warning, manual acknowledgment escalation is documented and carried out promptly.
7. Verify provider-accepted IDs correspond to actual delivery status. API acceptance alone is not evidence of inbox delivery.
8. Test repeated submissions, rate limits, provider outage, network timeouts, browser refresh, mobile and screen-reader flows.
9. Verify origin restrictions do not break the real www/non-www production configuration or preview URLs.
10. Record redacted test evidence and a named reviewer.

## Checkout
For every B2C checkout, record actual final purchase screen and test §312j BGB information and payment button. Verify cancellation/withdrawal link availability, contract confirmation and versioned terms. No assumptions from marketing pages.

## Privacy
Document actual data flows and processor contracts (Vercel, Resend, Neon, payment services, analytics, AI services). Check Art. 9 special category data and children. Do not publish invented retention periods or processor details.

## Final release decision
The following must be signed off separately:
- Technical owner: actual end-to-end evidence, no critical vulnerabilities.
- Business owner: offers, price, terms, provider identity and operational processes verified.
- German legal adviser: consumer law, GDPR notices, health/wellness boundaries, course regulation and insurance.
- Deployment: protected branch merged only after approvals; confirm live URLs, rollback and monitoring.

Known limitation: the current withdrawal implementation has no durable independent event queue or retry mechanism for customer acknowledgment. This remains a blocking issue until resolved and verified.
