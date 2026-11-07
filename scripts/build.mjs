import { build } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { brands } from '../src/brands.js';

// Builds the FindTheBabies site into dist/ and writes firebase.json for it.
const key = 'findthebabies';
const brand = brands[key];
const config = JSON.parse(await readFile(`config/${key}.json`, 'utf8'));
if (config.projectId !== brand.project) throw new Error(`Wrong Firebase project for ${key}`);
await build({ define: { __SITE__: JSON.stringify(key), __FIREBASE__: JSON.stringify(config) }, build: { outDir: 'dist', emptyOutDir: true } });

const htmlPath = 'dist/index.html';
let html = await readFile(htmlPath, 'utf8');
html = html
  .replace('<title>A new beginning</title>', `<title>${brand.name} — ${brand.eyebrow.replaceAll('&', '&amp;')}</title>`)
  .replace('A new place for ideas, community, and meaningful action.', brand.description);
await writeFile(htmlPath, html);

await writeFile('firebase.json', JSON.stringify({
  hosting: {
    site: brand.project, public: 'dist', ignore: ['**/.*'],
    rewrites: [{ source: '**', destination: '/index.html' }],
    headers: [
      { source: '**', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ] },
      { source: '/assets/**', headers: [{ key: 'Cache-Control', value: 'public,max-age=31536000,immutable' }] },
    ],
  },
  firestore: { rules: 'firestore.rules' },
  auth: { providers: { googleSignIn: {
    oAuthBrandDisplayName: brand.name, supportEmail: 'w3develops@gmail.com',
    authorizedRedirectUris: [
      `https://${brand.project}.firebaseapp.com/__/auth/handler`,
      `https://${brand.project}.web.app/__/auth/handler`,
      `https://${brand.domain}/__/auth/handler`,
      `https://www.${brand.domain}/__/auth/handler`,
    ],
  } } },
  emulators: { firestore: { host: '127.0.0.1', port: 8080 }, auth: { host: '127.0.0.1', port: 9099 }, ui: { enabled: false }, singleProjectMode: true },
}, null, 2) + '\n');
