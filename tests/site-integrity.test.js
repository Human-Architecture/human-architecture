const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const skipDirs = new Set(['.git', 'node_modules']);
const htmlFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(root);

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
