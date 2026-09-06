import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

function files(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? files(`${path}/${entry.name}`) : [`${path}/${entry.name}`]);
}

test('browser comment graph cannot import server code or privileged credentials', () => {
  const visited = new Set<string>();
  function visit(file: string) {
    if (visited.has(file)) return;
    visited.add(file);
    assert.ok(!file.includes('/src/server/'), file);
    const source = readFileSync(file, 'utf8');
    assert.ok(!source.includes('SUPABASE_SERVICE_ROLE_KEY'), file);
    for (const { fileName } of ts.preProcessFile(source).importedFiles) {
      if (!fileName.startsWith('.')) continue;
      const base = resolve(dirname(file), fileName);
      const target = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find(existsSync);
      assert.ok(target, `${file}: ${fileName}`);
      visit(target!);
    }
  }
  visit(resolve('src/components/blog/comments/CommentsSection.tsx'));
});

test('feature use cases and server code have no UI imports', () => {
  for (const file of [...files('src/server'), ...files('src/features')]) {
    const source = readFileSync(file, 'utf8');
    for (const { fileName } of ts.preProcessFile(source).importedFiles) {
      assert.ok(!fileName.includes('components/'), `${file}: ${fileName}`);
      if (file.startsWith('src/features/comments/')) {
        assert.ok(!fileName.includes('server/') && !fileName.includes('supabase') && !fileName.includes('astro'), `${file}: ${fileName}`);
      }
    }
  }
});
