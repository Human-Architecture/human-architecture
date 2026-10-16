# Payment release checklist

Use this checklist before announcing that every Human Architecture booking can be paid for directly online. Do not place secret values in this file, in GitHub, or in a chat.

## What is already wired

| Offer | Visitor journey | Payment route |
| --- | --- | --- |
| BODY LANGUAGE | Booking form → choose ticket and payment method | Hosted PayPal/card checkout or cash at Clever Fit |
| The Codex introductory readings | Offer page → secure booking → private intake after payment | PayPal order checkout |
| Codex 2027 entry offer | 2027 offer page → secure booking → private intake after payment | PayPal order checkout; `MELMIHIRA27` changes €222 to €111 through 31 October 2026 |
| RETURN public session | Registration form → secure payment opens for regular tickets | DALI tickets are paid in cash at the evening |
| Advent of Astrology | Registration form → secure payment opens | Hosted URL selected by solo or pair booking |

The five BODY LANGUAGE hosted PayPal URLs were checked for reachability on 15 October 2026. They returned a successful response. That check did not create an order or a payment.

## Vercel production settings

In Vercel, open the Human Architecture project, then **Settings → Environment Variables**. Add or verify the entries below for the **Production** environment. Keep their values private.

### Required for every form that emails a confirmation

- `RESEND_API_KEY`

### Required for direct Codex booking

- `CODEX_BOOKING_ENABLED` set to `true`
- `CODEX_INTAKE_ENCRYPTION_KEY` set to a secure, Base64-encoded 32-byte key
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_ENVIRONMENT` set to `live`
- One database connection: `HA_POSTGRES_URL`, `POSTGRES_URL`, or `DATABASE_URL`

Do not enable `CODEX_BOOKING_ENABLED` until all six items above are present. The Codex flow encrypts personal contact and intake information before it is stored.

### Required for RETURN

- `RETURN_PAYMENT_URL_REGULAR`
- `RETURN_PAYMENT_URL_FRIEND_RR`

### Advent of Astrology

No Vercel payment variable is needed. The verified solo and pair PayPal checkout URLs are already connected to the course booking flow. Replace them in the site code only if PayPal issues new final checkout URLs.

## Safe release check

1. Save the production settings in Vercel and redeploy the current production branch.
2. In Vercel, confirm the required production variables are present for the relevant offer. Then complete one controlled test booking per enabled payment route before announcing direct checkout.
3. Open each offer page and confirm the primary booking button reaches its own form:
   - `/body-language/`
   - `/codex/current-sky/`
   - `/codex/personal-pattern/`
   - `/codex/astrological-foundations/`
   - `/codex/2027/`
   - `/mihira-ceremonia/return/`
   - `/kurse/westliche-astrologie/`
4. On each form, complete only the non-submitting navigation and confirm the price, language, privacy notice, and payment wording are correct.
5. For a real end-to-end test, use PayPal Sandbox first. Confirm that the return page, confirmation email, and—only for Codex—the private intake email arrive correctly.
6. After sandbox is correct, switch only the verified production PayPal credentials and URLs to live. Keep one internal test booking available for a final real-money check and refund it immediately if appropriate.

## Stop and fix if any of these happen

- Codex status remains `false`.
- A form confirms a place before payment is completed.
- A ticket choice opens a different price or an unrelated PayPal page.
- The confirmation email does not arrive.
- A Codex intake link is sent before payment confirmation.
