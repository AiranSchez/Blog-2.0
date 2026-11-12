import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readingMinutes } from '../../src/services/reading-time';

test('reading time counts latin words and CJK characters', () => {
  assert.equal(readingMinutes(''), 1);
  assert.equal(readingMinutes(Array.from({ length: 220 }, () => 'word').join(' ')), 1);
  assert.equal(readingMinutes(Array.from({ length: 440 }, () => 'word').join(' ')), 2);
  assert.equal(readingMinutes('漢'.repeat(500)), 1);
  assert.equal(readingMinutes('漢'.repeat(1000)), 2);
});

test('reading time ignores code blocks, links and markup', () => {
  const markdown = '`inline` [link](https://example.com) <div>html</div>\n```js\n' + 'word '.repeat(500) + '\n```';
  assert.equal(readingMinutes(markdown), 1);
});

