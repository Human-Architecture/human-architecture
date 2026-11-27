/* Lightweight search control for public pages with bespoke headers. */
document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname === '/mihira-ceremonia/experience/' || location.pathname === '/mihira-ceremonia/experience/index.html') {
    const languageGuide = document.createElement('script');
    languageGuide.src = '/mihira-ceremonia/experience-language.js';
    languageGuide.defer = true;
    document.head.append(languageGuide);
  }

  if (!document.querySelector('[data-site-experience-system]')) {
    const experience = document.createElement('link');
    experience.rel = 'stylesheet';
    experience.href = '/site-experience-system.css';
    experience.dataset.siteExperienceSystem = '';
    document.head.append(experience);
  }

  // Founder-led Mihira pages need a direct, composed portrait. The candid
  // phone image belongs in personal editorial context, not in the first
  // authority impression of a private practice.
  document.querySelectorAll('img[src*="/mihira-ceremonia/assets/mel-mihira-founder.webp"]').forEach((portrait) => {
    portrait.src = '/assets/portraits/mel-organizations-founder-v2.png';
    portrait.alt = 'Mel Mihira, Founder of Mihira Ceremonia and Human Architecture';
    portrait.width = 1122;
    portrait.height = 1402;
  });

  const octoberEntry = document.querySelector('a[href^="/codex/book/?offer=codex_2027_entry"]');
  if (octoberEntry) {
    octoberEntry.href = 'https://www.paypal.com/ncp/payment/JPQF7Y4QTZX3G';
    octoberEntry.setAttribute('aria-label', 'Secure the Codex 2027 October entry for €111');
  }

  const header = document.querySelector('header');
  if (!header) return;

  const style = document.createElement('style');
  style.textContent = '.site-search-control,.site-orientation-control{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 15px;border:1px solid currentColor;border-radius:999px;color:inherit;text-decoration:none;line-height:1;font:600 .62rem/1 Manrope,Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase}.site-search-control svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round}.site-search-control__label,.site-orientation-control__label{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto;white-space:normal}.site-search-control:hover,.site-orientation-control:hover{background:#f5f0e7;color:#063442}.site-search-control:focus-visible,.site-orientation-control:focus-visible{outline:3px solid #c8af8b;outline-offset:4px}@media(max-width:900px){.site-search-control{width:42px;min-width:42px;min-height:42px;padding:0;border-radius:50%}.site-search-control__label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.site-orientation-control{min-height:38px;padding:0 12px;font-size:.55rem;letter-spacing:.1em}}';
  document.head.append(style);

  const nav = header.querySelector('nav[aria-label="Primary navigation"], .nav, nav');
  const target = nav || header;
  const orientation = document.querySelector('[data-site-orientation-link]');
  const language = () => new URLSearchParams(location.search).get('lang') === 'de' || document.documentElement.lang.toLowerCase().startsWith('de') ? 'de' : 'en';
  const guideSource = () => {
    const page = document.body?.dataset?.page;
    if (page && /^[a-z0-9-]{1,48}$/i.test(page)) return page;
    const segment = location.pathname.split('/').filter(Boolean)[0] || 'website';
    return /^[a-z0-9-]{1,48}$/i.test(segment) ? segment : 'website';
  };

  if (!orientation) {
    const guide = document.createElement('a');
    guide.dataset.siteOrientationLink = '';
    guide.className = 'site-orientation-control';
    guide.innerHTML = '<span aria-hidden="true">↗</span><span class="site-orientation-control__label"></span>';
    target.append(guide);
  }

  const syncOrientation = () => {
    const guide = document.querySelector('[data-site-orientation-link]');
    if (!guide) return;
    const isGerman = language() === 'de';
    const params = new URLSearchParams({ lang: isGerman ? 'de' : 'en', source: guideSource() });
    guide.href = `/orientierung/?${params}`;
    guide.setAttribute('aria-label', isGerman ? 'Passenden Einstieg finden' : 'Find your next step');
    const label = guide.querySelector('.site-orientation-control__label');
    if (label) label.textContent = isGerman ? 'Passenden Einstieg finden' : 'Find your next step';
  };
  syncOrientation();
  new MutationObserver(syncOrientation).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  if (!document.querySelector('[data-site-search-link], a[href="/search/"]')) {
    const search = document.createElement('a');
    search.href = '/search/';
    search.dataset.siteSearchLink = '';
    search.className = 'site-search-control';
    search.setAttribute('aria-label', 'Search the Human Architecture site');
    search.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><circle cx="10.8" cy="10.8" r="5.8"></circle><path d="m15.2 15.2 5 5"></path></svg><span class="site-search-control__label">Search</span>';
    target.append(search);
  }
});
