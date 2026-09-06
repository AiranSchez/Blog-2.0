import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function legacyPathPattern(path) {
  const bare = path.replace(/\/$/, '');
  const variants = [...new Set([bare, encodeURI(bare)])];
  return `^(?:${variants.map(escapeRegex).join('|')})/?$`;
}

export function finalizeBlogRedirects(config, legacy) {
  for (const { oldPath, newPath } of legacy) {
    if (oldPath === newPath) continue;
    const matches = config.routes.filter(route => route.status === 301 && route.headers?.Location === newPath);
    if (matches.length !== 1) throw new Error(`Expected one generated redirect for ${oldPath}; review the Vercel adapter output`);
    // Adapter 9 generates exact paths without the historic trailing slash.
    // Match encoded spaces too, while keeping all other generated routes intact.
    matches[0].src = legacyPathPattern(oldPath);
    matches[0].caseSensitive = true;
  }
  return config;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const path = '.vercel/output/config.json';
  const config = JSON.parse(readFileSync(path, 'utf8'));
  const legacy = JSON.parse(readFileSync('src/data/blog-legacy-routes.json', 'utf8'));
  writeFileSync(path, JSON.stringify(finalizeBlogRedirects(config, legacy), null, 2) + '\n');
  console.log('Verified legacy blog redirects for Vercel (encoded paths and optional trailing slash).');
}
