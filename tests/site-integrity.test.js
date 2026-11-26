const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const skipDirs = new Set(['.git', 'node_modules']);
const htmlFiles = [];
const regexEscape = (value) => value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(root);

const eventsHtml = fs.readFileSync(path.join(root, 'events', 'index.html'), 'utf8');
const homepageHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const eventJourneys = fs.readFileSync(path.join(root, 'events', 'events-intro.js'), 'utf8');
const eventLanguage = fs.readFileSync(path.join(root, 'events', 'events-language.js'), 'utf8');
const eventVisuals = fs.readFileSync(path.join(root, 'events', 'events-visuals.js'), 'utf8');
const voucherHtml = fs.readFileSync(path.join(root, 'gutscheine', 'index.html'), 'utf8');
const voucherScript = fs.readFileSync(path.join(root, 'growth.js'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const bodyLanguageHtml = fs.readFileSync(path.join(root, 'body-language', 'index.html'), 'utf8');
const astrologyHtml = fs.readFileSync(path.join(root, 'kurse', 'westliche-astrologie', 'index.html'), 'utf8');
const deepRestHtml = fs.readFileSync(path.join(root, 'events', 'deep-rest', 'index.html'), 'utf8');
const returnHtml = fs.readFileSync(path.join(root, 'mihira-ceremonia', 'return', 'index.html'), 'utf8');
const methodEnglishHtml = fs.readFileSync(path.join(root, 'what-is-human-architecture', 'index.html'), 'utf8');
const methodGermanHtml = fs.readFileSync(path.join(root, 'was-ist-human-architecture', 'index.html'), 'utf8');
const legacyEventsScript = fs.readFileSync(path.join(root, 'events', 'events.js'), 'utf8');
const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const expectedEventPosters = [
  {
    cardClass: 'event-card--body-language', poster: '/assets/events/posters/body-language-poster.jpg', alt: 'BODY LANGUAGE workshop poster',
    homepageClass: 'homepage-event__visual--body-language', info: '/body-language/', book: '/body-language/book/', voucher: 'body_language',
  },
  {
    cardClass: 'event-card--astrology', poster: '/assets/events/posters/astrology-poster.jpg', alt: 'Advent of Astrology course poster',
    homepageClass: 'homepage-event__visual--astrology', info: '/kurse/westliche-astrologie/', book: '/kurse/westliche-astrologie/#anmeldung', voucher: 'astrology',
  },
  {
    cardClass: 'event-card--deep-rest', poster: '/assets/events/deep-rest-poster-client-facing.jpg', alt: 'Official DEEP REST event poster',
    homepageClass: 'homepage-event__visual--deep-rest', info: '/events/deep-rest/', book: '/events/deep-rest/#tickets', voucher: 'deep_rest',
  },
];
for (const {cardClass, poster, alt, homepageClass, info, book, voucher} of expectedEventPosters) {
  const card = eventsHtml.match(new RegExp(`<article class="event-card ${cardClass}">([\\s\\S]*?)</article>`));
  assert.ok(card, `Missing ${cardClass} event card`);
  assert.match(card[1], new RegExp(`<img src="${poster}" alt="${alt}"`), `Wrong poster on ${cardClass}`);
  const homepageCard = homepageHtml.match(new RegExp(`<figure class="homepage-event__visual[^>]*${homepageClass}[^>]*><img src="([^"]+)"`));
  assert.equal(homepageCard?.[1], poster, `Wrong homepage poster for ${cardClass}`);
  for (const route of [info, book, `/gutscheine/?voucher=${voucher}#anfrage`]) {
    assert.match(eventJourneys, new RegExp(`selector: '.${cardClass}',[\\s\\S]*?${regexEscape(route)}`), `Missing ${route} journey for ${cardClass}`);
    assert.match(homepageHtml, new RegExp(`href="${regexEscape(route)}"`), `Missing ${route} homepage route for ${cardClass}`);
    assert.match(card[1], new RegExp(`href="${regexEscape(route)}"`), `Missing built-in ${route} route for ${cardClass}`);
    assert.match(eventsHtml, new RegExp(`<noscript>[\\s\\S]*?href="${regexEscape(route)}"`), `Missing no-script ${route} route`);
  }
  assert.match(voucherHtml, new RegExp(`<option value="${voucher}"`), `Missing ${voucher} voucher option`);
  assert.match(voucherScript, new RegExp(`${voucher}:'`), `Missing ${voucher} voucher choice`);
  assert.match(eventVisuals, new RegExp(`'${cardClass}'[\\s\\S]*?${regexEscape(poster)}`), `Wrong visual poster mapping for ${cardClass}`);
}
assert.match(bodyLanguageHtml, /Samstag, 28\. November 2026[\s\S]*?15:00–17:00 Uhr[\s\S]*?Clever Fit Kümmersbruck/, 'BODY LANGUAGE date, time and venue must remain aligned');
assert.match(eventsHtml, /29 November · 6, 13 &amp; 20 December/, 'Astrology course dates must remain aligned on the event listing');
assert.match(astrologyHtml, /29\.11\.2026[\s\S]*?06\.12\.2026[\s\S]*?13\.12\.2026[\s\S]*?20\.12\.2026/, 'Astrology session dates must remain aligned on the course page');
assert.match(deepRestHtml, /Friday · 11 December 2026[\s\S]*?18:00–19:30[\s\S]*?ZEN CENTER, Regensburg/, 'DEEP REST date, time and venue must remain aligned');
assert.match(deepRestHtml, /href="https:\/\/www\.paypal\.com\/ncp\/payment\/EXGYF8VE28KKY" target="_blank" rel="noopener"[\s\S]*?Book one place/, 'DEEP REST single ticket must open its direct PayPal payment link');
assert.match(deepRestHtml, /href="https:\/\/www\.paypal\.com\/ncp\/payment\/WRN57NR7MYY6E" target="_blank" rel="noopener"[\s\S]*?Book two places/, 'DEEP REST pair ticket must open its direct PayPal payment link');
assert.match(eventJourneys, /document\.readyState === 'loading'/, 'Event actions must initialize whether the page is newly loaded or restored');
assert.match(eventJourneys, /enhanceEventsPage\(\)/, 'Event actions must be initialized by the page enhancer');
assert.doesNotMatch(eventJourneys, /event-card--return|voucher=return/, 'RETURN must not appear in the current-event journey');
assert.doesNotMatch(eventVisuals, /return-poster|event-card--return|querySelectorAll\('\.event-card'\)/, 'Event visuals must not retain RETURN or card-position assumptions');
assert.doesNotMatch(eventLanguage, /RETURN|querySelectorAll\('\.event-card'\)\[\d+\]/, 'Event language controls must not use stale RETURN/card-position assumptions');
assert.match(eventLanguage, /actions: \['BODY LANGUAGE entdecken', 'Platz wählen & direkt zahlen', 'Als Gutschein schenken'\]/, 'BODY LANGUAGE needs all three German action labels');
assert.match(eventLanguage, /actions: \['Kurs entdecken', 'Platz wählen & direkt zahlen', 'Als Gutschein schenken'\]/, 'Astrology needs all three German action labels');
assert.match(eventLanguage, /actions: \['DEEP REST entdecken', 'Ticket wählen & direkt zahlen', 'Als Gutschein schenken'\]/, 'DEEP REST needs all three German action labels');
assert.doesNotMatch(voucherHtml, /value="return"/, 'RETURN must not be offered as a current-event voucher');
assert.doesNotMatch(voucherScript, /return:'RETURN|voucherPayments[^;]*return:/, 'RETURN must not have a current-event payment route');
assert.match(sitemap, /https:\/\/www\.human-architecture\.info\/events\/deep-rest\//, 'Current DEEP REST event page must be discoverable in the sitemap');
assert.match(sitemap, /https:\/\/www\.human-architecture\.info\/was-ist-human-architecture\//, 'German method page must be discoverable in the sitemap');
assert.match(methodEnglishHtml, /href="\/was-ist-human-architecture\/"[\s\S]*?hreflang="de"/, 'English method page must link directly to its German counterpart');
assert.match(methodGermanHtml, /href="\/what-is-human-architecture\/" hreflang="en"/, 'German method page must link directly to its English counterpart');
assert.match(methodGermanHtml, /<html lang="de">/, 'German method page must declare German content');
assert.doesNotMatch(sitemap, /mihira-ceremonia\/return/, 'Retired RETURN page must not be promoted in the sitemap');
assert.doesNotMatch(returnHtml, /14\. November|November Session|voucher=return/, 'RETURN format page must not present the finished public session as active');
assert.match(returnHtml, /Öffentliche Sessions/, 'RETURN format page must remain available for future public dates');
assert.ok(!fs.existsSync(path.join(root, 'api', 'return-public.js')), 'Expired RETURN registration endpoint must not be deployed');
assert.doesNotMatch(fs.readFileSync(path.join(root, 'mihira-ceremonia', 'return', 'return.js'), 'utf8'), /return-public|public-booking-form/, 'RETURN format page must not retain the finished-session registration flow');
assert.doesNotMatch(legacyEventsScript, /returnCard|Sulzbach-Rosenberg|Register & continue to payment/, 'Legacy event enhancement must not reinsert the finished RETURN session');
for (const source of ['/body-language/book/(.*)', '/body-language/en/book/(.*)']) {
  const rule = vercelConfig.headers.find((header) => header.source === source);
  assert.ok(rule?.headers.some((header) => header.key === 'X-Robots-Tag' && header.value === 'noindex, follow'), `Booking route ${source} must not compete with public offer pages in search`);
}

const idsByFile = new Map();
const presentationIssues = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const viewportTags = html.match(/<meta[^>]+name=["']viewport["'][^>]*>/gi) || [];
  if (viewportTags.length !== 1) presentationIssues.push(`${path.relative(root, file)} must have exactly one viewport meta tag`);
  for (const image of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(image[1])) presentationIssues.push(`${path.relative(root, file)} contains an image without alt text`);
  }
  for (const link of html.matchAll(/<a\b[^>]*>/gi)) {
    if (/\btarget=["']_blank["']/i.test(link[0]) && !/\brel=["'][^"']*\bnoopener\b/i.test(link[0])) {
      presentationIssues.push(`${path.relative(root, file)} opens a new tab without noopener protection`);
    }
  }
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate id in ${path.relative(root, file)}`);
  idsByFile.set(file, new Set(ids));
}
assert.deepEqual(presentationIssues, [], `Presentation integrity issues:\n${presentationIssues.join('\n')}`);

const missing = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const references = [...html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const reference of references) {
    if (!reference || /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(reference)) continue;
    const [rawPath, fragment = ''] = reference.split('#');
    const cleanPath = rawPath.split('?')[0];
    let target = file;
    if (cleanPath) {
      const resolved = cleanPath.startsWith('/') ? path.join(root, cleanPath) : path.resolve(path.dirname(file), cleanPath);
      target = path.extname(resolved) ? resolved : path.join(resolved, 'index.html');
      if (!fs.existsSync(target)) {
        missing.push(`${path.relative(root, file)} -> ${reference}`);
        continue;
      }
    }
    if (fragment && target.endsWith('.html')) {
      if (!idsByFile.has(target)) {
        const targetHtml = fs.readFileSync(target, 'utf8');
        idsByFile.set(target, new Set([...targetHtml.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1])));
      }
      if (!idsByFile.get(target).has(decodeURIComponent(fragment))) missing.push(`${path.relative(root, file)} -> ${reference} (missing anchor)`);
    }
  }
}

assert.deepEqual(missing, [], `Broken internal references:\n${missing.join('\n')}`);
console.log(`Site integrity passed: ${htmlFiles.length} HTML pages, no broken internal files, anchors or duplicate IDs.`);
