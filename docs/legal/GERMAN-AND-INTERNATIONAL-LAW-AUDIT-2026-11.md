# German and cross-border legal audit — 19 November 2026

Scope: inspected root, Impressum, Datenschutz, withdrawal UI/API, contact API, events, RETURN, BODY LANGUAGE booking, vouchers, Custom GPT terms and Vercel configuration. This is a targeted code review, not an exhaustive website crawl, penetration test or legal opinion.

## Verified code observations
- Business identity and contact appear in existing Impressum; owner confirmed the published Sulzbach-Rosenberg business address remains valid. Check any additional tax ID / regulated profession disclosures if applicable.
- Withdrawal link was absent on several reviewed pages; added links to six relevant pages on this branch. Need inspect visual placement and every actual checkout.
- Withdrawal API attempts to email both owner and customer. It has no independently durable receipt store, retry queue, rate limiting or tested failover. Do NOT claim §356a compliance until operational verification and resilience are completed.
- Contact endpoint collects birth date/time/place in coach-collaboration route; verify necessity, notice, consent where applicable, and data minimization.
- Event dates are manually embedded; ongoing scheduled expiry checks needed.
- Baseline response headers configured, but CSP, dependency audit, secret rotation, access controls and full API inventory not verified.
- No general AGB implementation or complete contract checkout audit has been verified.

## German law release checklist
- DDG §5: legal identity, service address, communication channel, tax identifiers if issued, professional supervisory details if applicable.
- GDPR Art 13/14, Art 6/9: actual processing purposes, lawful bases, processors, transfers, retention, rights, special category and minors' data. Verify real deployments against notice.
- TDDDG §25: consent for non-essential device access/storage where required; inventory cookies and scripts before selecting banner logic.
- BGB §§312i/312j and EGBGB Art 246a: checkout review, mandatory disclosures, payment obligation button, contract confirmation and records.
- BGB §356a: prominent continuous withdrawal link, two-step declaration, immediate acknowledgment on durable medium, operational availability.
- BGB §312k: cancellation button if eligible continuing consumer contracts are offered.
- BGB §§305-309: reviewed B2C/B2B terms; do not insert blanket liability exclusions.
- Consumer dispute resolution disclosures and mandatory model withdrawal notice/form where applicable.
- BFSG: assess whether service is within scope and whether microenterprise exemption applies.
- FernUSG: assess live online teaching/mentoring formats for ZFU approval requirements.
- Heilpraktikergesetz / HWG / UWG: review therapeutic claims, diagnosis/treatment boundaries, testimonials and professional insurance.

## International law: not a single global compliance certificate
- EU/EEA: GDPR, consumer directives, cross-border consumer protections and applicable local mandatory rules.
- UK: UK GDPR and UK consumer law may apply depending on active targeting and transactions.
- US, Canada, UAE, India, Sri Lanka and other destinations: assess specific customer targeting, local consumer/marketing/privacy/health-services restrictions and payment/tax obligations BEFORE advertising or selling into each market. Mere website accessibility does not automatically trigger every jurisdiction's rules.
- Cross-border data transfers: identify actual destinations and lawful safeguards, including subprocessors.
- Marketing email and messaging: opt-in and recordkeeping rules vary by destination; avoid unsolicited mass campaigns.
- No legal document can waive mandatory local consumer rights or eliminate liability.

## Release decision
BLOCKED pending: reviewed service terms and cancellation rules; verified payment paths; reliable withdrawal receipt + acknowledgment; GDPR processor map/agreements; regulated activity and international-target-market review; security testing; named legal reviewer sign-off. Do not merge solely based on this checklist.

Primary references: https://www.gesetze-im-internet.de/bgb/__356a.html ; https://www.gesetze-im-internet.de/ddg/__5.html ; GDPR Art. 13; applicable laws by target market.
