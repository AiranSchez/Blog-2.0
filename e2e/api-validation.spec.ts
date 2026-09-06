import { test, expect } from '@playwright/test';

test('API routes reject malformed bodies without provider access', async ({ request }) => {
  for (const endpoint of ['/api/comments', '/api/comments/reactions', '/api/translate']) {
    for (const data of ['null', '[]', '{broken']) {
      const response = await request.post(endpoint, { data, headers: { 'Content-Type': 'application/json' } });
      expect(response.status(), `${endpoint}: ${data}`).toBe(400);
    }
  }
});

test('empty comments and honeypots retain their public contract', async ({ request }) => {
  const empty = await request.post('/api/comments', { data: { content: '' } });
  expect(empty.status()).toBe(400);
  expect((await empty.json()).code).toBe('EMPTY_CONTENT');
  const bot = await request.post('/api/comments', { data: { website: 'bot' } });
  expect(bot.status()).toBe(200);
  expect(await bot.json()).toEqual({ comment: null });
});
