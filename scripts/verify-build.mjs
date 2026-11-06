import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const html = await readFile(path.join(dist, 'index.html'), 'utf8');
const content = await readFile('src/content/approved.html', 'utf8');
const sourceScript = await readFile('src/scripts/site.js', 'utf8');
const css = await readFile(path.join(dist, 'styles.css'), 'utf8');
const views = [...html.matchAll(/data-view="([^"]+)"/g)].map(match => match[1]);
const expected = ['home', 'about', 'members', 'profile', 'visit', 'membership', 'stories', 'story', 'contact', 'privacy'];
assert.deepEqual(views, expected, 'All ten approved views must be present');
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Element IDs must be unique');
for (const [, target] of html.matchAll(/data-page="([^"]+)"/g)) {
  assert(expected.includes(target), `Unknown navigation target: ${target}`);
}
assert(html.includes('lang="lt"'), 'Lithuanian language declaration missing');
assert(html.includes('noindex,nofollow'), 'Review robots directive missing');
assert(html.includes('Svetainės peržiūra · pavyzdiniai narių duomenys'), 'Review notice missing');
assert.equal((content.match(/onsubmit="return false"/g) ?? []).length, 2, 'Both demo forms must block native submission');
assert(!/openai|widgetState|globalThis\.Tweak|set_globals/.test(sourceScript), 'Preview host APIs must not ship');
assert(!/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/.test(sourceScript), 'Demo must not send or store visitor data');
assert(sourceScript.includes("window.addEventListener('hashchange'"), 'History support missing');
assert(sourceScript.includes('renderRoute(false)'), 'Direct fragment route initialization missing');
assert(sourceScript.includes('window.location.hash = route'), 'Shareable fragment navigation missing');
assert.deepEqual([...new Set(css.match(/#[0-9a-fA-F]{3,8}\b/g))].sort(), ['#000', '#c8102e', '#fff'], 'Approved palette changed');
assert(!html.includes('__BASE__'), 'Unresolved asset base path');
assert(!html.includes('data:image'), 'Images must be local files');
const stylesheet = html.match(/href="([^"]*styles\.css)"/)[1];
const base = stylesheet.slice(0, -'styles.css'.length);
for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (!ref.startsWith(base) || /^https?:/.test(ref)) continue;
  const asset = path.join(dist, ref.slice(base.length));
  await readFile(asset);
}
const assets = (await readdir(path.join(dist, 'assets'))).filter(name => name.endsWith('.jpg'));
assert.equal(assets.length, 5, 'Exactly five authentic JPG files expected');
for (const asset of assets) {
  const bytes = await readFile(path.join(dist, 'assets', asset));
  assert.equal(bytes.subarray(0, 2).toString('hex'), 'ffd8', `Invalid JPEG: ${asset}`);
}
console.log(`Verified ${views.length} views, ${assets.length} photos, unique IDs, navigation targets, asset paths (${base}), palette, demo form guards and standalone behavior.`);
