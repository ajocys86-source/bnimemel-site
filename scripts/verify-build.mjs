import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const members = JSON.parse(await readFile('src/data/members.json', 'utf8'));

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
assert(html.includes('Svetainės peržiūra · registracijos formos demonstracinės'), 'Review notice missing');
assert(html.includes('Duomenys iš oficialaus BNI Memel sąrašo · patikrinta 2026-11-06'), 'Member source and verification date missing');
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
assert(assets.length >= 5, 'At least five authentic club JPG files expected');
for (const asset of assets) {
  const bytes = await readFile(path.join(dist, 'assets', asset));
  assert.equal(bytes.subarray(0, 2).toString('hex'), 'ffd8', `Invalid JPEG: ${asset}`);
}
assert(members.length > 0, 'Official member roster is empty');
assert.equal(new Set(members.map(member => member.id)).size, members.length, 'Member IDs must be unique');
assert.equal(new Set(members.map(member => member.name)).size, members.length, 'Member names must be unique');
let memberPhotos = 0;
for (const member of members) {
  for (const field of ['id', 'name', 'company', 'category', 'role', 'description', 'photo', 'sourceUrl', 'photoSourceUrl']) {
    assert(Object.hasOwn(member, field), `Missing ${field} for member ${member.id}`);
  }
  for (const field of ['id', 'name', 'company', 'category', 'role']) {
    assert.equal(typeof member[field], 'string', `Invalid ${field} for member ${member.id}`);
    assert(member[field].trim(), `Empty ${field} for member ${member.id}`);
  }
  assert(/^[a-z0-9-]+$/.test(member.id), `Invalid stable member ID: ${member.id}`);
  const source = new URL(member.sourceUrl);
  assert(source.protocol === 'https:' && source.hostname === 'bni.lt' && source.pathname.includes('/memberdetails'), `Invalid official member source: ${member.id}`);
  assert(member.description === null || typeof member.description === 'string', `Invalid biography for ${member.id}`);
  if (member.photo) {
    assert(/^assets\/members\/[a-z0-9-]+\.(?:jpe?g|png|webp)$/.test(member.photo), `Non-local member photo: ${member.id}`);
    assert.equal(typeof member.photoSourceUrl, 'string', `Missing photo source for ${member.id}`);
    assert(new URL(member.photoSourceUrl).protocol === 'https:', `Invalid photo source for ${member.id}`);
    const bytes = await readFile(path.join(dist, member.photo));
    const jpeg = bytes.subarray(0, 2).toString('hex') === 'ffd8';
    const png = bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
    const webp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
    assert(jpeg || png || webp, `Invalid member image: ${member.id}`);
    memberPhotos++;
  } else {
    assert.equal(member.photo, null, `Use null for unavailable photo: ${member.id}`);
    assert.equal(member.photoSourceUrl, null, `Unexpected missing-photo source: ${member.id}`);
  }
}
for (const text of [content, sourceScript, await readFile('src/pages/index.astro', 'utf8'), await readFile('README.md', 'utf8'), JSON.stringify(members)]) {
  assert(!/Pavyzdiniai narių duomenys|pavyzdiniai narių duomenys|Pavyzdinis nario profilis|Pavyzdiniai narių profiliai|Vardas Pavardė|Nario pavyzdys/.test(text), 'Sample member content remains');
}
console.log(`Verified ${views.length} views, ${members.length} official members, ${memberPhotos} local member photos, ${assets.length} club photos, unique IDs, navigation, asset paths (${base}), palette and demo form guards.`);
