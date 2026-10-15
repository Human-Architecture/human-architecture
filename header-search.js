/* Lightweight search control for public pages with bespoke headers. */
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-site-search-link], a[href="/search/"]')) return;

  const header = document.querySelector('header');
  if (!header) return;

  const style = document.createElement('style');
  style.textContent = '.site-search-control{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-width:38px;min-height:38px;padding:7px;border:1px solid currentColor;border-radius:50%;color:inherit;text-decoration:none;line-height:1}.site-search-control svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}.site-search-control__label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.site-search-control:hover{background:#f5f0e7;color:#063442}.site-search-control:focus-visible{outline:3px solid #c8af8b;outline-offset:4px}';
  document.head.append(style);

  const search = document.createElement('a');
  search.href = '/search/';
  search.dataset.siteSearchLink = '';
  search.className = 'site-search-control';
  search.setAttribute('aria-label', 'Search the Human Architecture site');
  search.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><circle cx="10.8" cy="10.8" r="5.8"></circle><path d="m15.2 15.2 5 5"></path></svg><span class="site-search-control__label">Search</span>';

  const nav = header.querySelector('nav[aria-label="Primary navigation"], .nav, nav');
  if (nav) nav.append(search);
  else header.append(search);
});
