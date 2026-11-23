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
const voucherHtml = fs.readFileSync(path.join(root, 'gutscheine', 'index.html'), 'utf8');
const voucherScript = fs.readFileSync(path.join(root, 'growth.js'), 'utf8');
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
    assert.match(eventsHtml, new RegExp(`<noscript>[\\s\\S]*?href="${regexEscape(route)}"`), `Missing no-script ${route} route`);
  }
  assert.match(voucherHtml, new RegExp(`<option value="${voucher}"`), `Missing ${voucher} voucher option`);
  assert.match(voucherScript, new RegExp(`${voucher}:'`), `Missing ${voucher} voucher choice`);
}
assert.match(eventJourneys, /document\.readyState === 'loading'/, 'Event actions must initialize whether the page is newly loaded or restored');
assert.match(eventJourneys, /enhanceEventsPage\(\)/, 'Event actions must be initialized by the page enhancer');
assert.doesNotMatch(eventJourneys, /event-card--return|voucher=return/, 'RETURN must not appear in the current-event journey');
assert.doesNotMatch(voucherHtml, /value="return"/, 'RETURN must not be offered as a current-event voucher');
assert.doesNotMatch(voucherScript, /return:'RETURN|voucherPayments[^;]*return:/, 'RETURN must not have a current-event payment route');

const idsByFile = new Map();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate id in ${path.relative(root, file)}`);
  idsByFile.set(file, new Set(ids));
}

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
