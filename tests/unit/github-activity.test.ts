import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeActivity, validateActivity } from '../../src/features/github-activity';
import { loadGithubActivity, parseGithubCalendar } from '../../src/server/github-activity';

const capturedAt = '2026-01-03';
const days = [
  { date: '2026-01-01', count: 2, level: 1 },
  { date: '2026-01-02', count: 0, level: 0 },
  { date: '2026-01-03', count: 4, level: 2 },
];
const snapshot = { source: 'https://github.com/users/AiranSchez/contributions', capturedAt, from: '2026-01-01', to: capturedAt, year: 2026, total: 6, days };
const calendar = days.map((day, i) => `<td data-date="${day.date}" id="day-${i}" data-level="${day.level}"></td><tool-tip for="day-${i}">${day.count ? `${day.count} contributions` : 'No contributions'} on January ${i + 1}.</tool-tip>`).join('');

describe('verified public GitHub data', () => {
  test('parses counts from tooltip identities, not visual intensity', () => {
    const result = parseGithubCalendar(calendar, capturedAt);
    assert.deepEqual(result.days, days);
    assert.equal(result.total, 6);
  });
  test('excludes future calendar placeholders', () => {
    const future = '<td data-date="2026-01-04" id="future" data-level="0"></td>';
    assert.equal(parseGithubCalendar(calendar + future, capturedAt).days.length, 3);
  });
  test('rejects missing dates rather than inventing zero activity', () => {
    assert.throws(() => parseGithubCalendar(calendar.replace(/<td[^>]*id="day-1"[^>]*><\/td>/, ''), capturedAt));
  });
  test('rejects absent tooltips, duplicate dates and unrelated markup', () => {
    assert.throws(() => parseGithubCalendar(calendar.replace('<tool-tip for="day-0">2 contributions on January 1.</tool-tip>', ''), capturedAt));
    assert.throws(() => parseGithubCalendar(calendar + calendar, capturedAt));
    assert.throws(() => parseGithubCalendar('<h1>Unavailable</h1>', capturedAt));
  });
  test('validates totals and calendar dates', () => {
    assert.deepEqual(validateActivity(snapshot, capturedAt), snapshot);
    assert.throws(() => validateActivity({ ...snapshot, total: 99 }, capturedAt));
    assert.throws(() => validateActivity({ ...snapshot, capturedAt: '2026-02-30' }, capturedAt));
    assert.throws(() => validateActivity(snapshot, '2026-01-02'));
  });
  test('rejects negative counts, invalid levels and snapshots crossing years', () => {
    assert.throws(() => validateActivity({ ...snapshot, days: [{ ...days[0], count: -1 }, ...days.slice(1)] }, capturedAt));
    assert.throws(() => validateActivity({ ...snapshot, days: [{ ...days[0], level: 9 }, ...days.slice(1)] }, capturedAt));
    assert.throws(() => validateActivity({ ...snapshot, year: 2025, from: '2025-01-01' }, capturedAt));
  });
  test('calculates graphs, totals and streaks from the same selected days', () => {
    const result = summarizeActivity(days);
    assert.equal(result.total, 6);
    assert.equal(result.activeDays, 2);
    assert.equal(result.longestStreak, 1);
    assert.equal(result.average, 2);
    assert.equal(result.months.reduce((n, m) => n + m.total, 0), 6);
    assert.equal(result.weekdays.reduce((n, d) => n + d.total, 0), 6);
    assert.deepEqual(result.bestDay, days[2]);
  });
  test('counts consecutive days and distinguishes empty from inactive data', () => {
    assert.equal(summarizeActivity([days[0], { ...days[1], count: 3 }]).longestStreak, 2);
    assert.equal(summarizeActivity([]).bestDay, null);
    assert.equal(summarizeActivity([{ ...days[0], count: 0 }]).bestDay, null);
  });
  test('returns fresh verified data from the fixed public source', async () => {
    const result = await loadGithubActivity({ today: capturedAt, fallback: snapshot, fetcher: async () => new Response(calendar) });
    assert.equal(result.status, 'fresh');
    assert.equal(result.snapshot?.total, 6);
  });
  test('retains the verified snapshot when upstream fails', async () => {
    const result = await loadGithubActivity({ today: capturedAt, fallback: snapshot, fetcher: async () => new Response('unavailable', { status: 503 }) });
    assert.equal(result.status, 'cached');
    assert.deepEqual(result.snapshot, snapshot);
  });
  test('invalid live data does not replace a valid snapshot', async () => {
    const result = await loadGithubActivity({ today: capturedAt, fallback: snapshot, fetcher: async () => new Response('not a calendar') });
    assert.equal(result.status, 'cached');
    assert.equal(result.snapshot?.total, 6);
  });
  test('reports unavailable instead of fabricated zeroes when both sources fail', async () => {
    const result = await loadGithubActivity({ today: capturedAt, fallback: {}, fetcher: async () => { throw new Error('offline'); } });
    assert.equal(result.status, 'unavailable');
    assert.equal(result.snapshot, null);
  });
});
