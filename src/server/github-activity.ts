import savedActivity from '../data/github-activity.json';
import { isActivityDate, validateActivity, type ActivitySnapshot, type ActivityDay } from '../features/github-activity';

// GitHub includes future cells in the year's HTML. Only complete, dated evidence
// through the capture date is accepted; a missing tooltip is not zero activity.
export function parseGithubCalendar(html: string, capturedAt: string): ActivitySnapshot {
  if (!isActivityDate(capturedAt)) throw new Error('Invalid capture date');
  const year = Number(capturedAt.slice(0, 4));
  const tooltips = new Map<string, string>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = match[1].match(/\bfor="([^"]+)"/)?.[1];
    if (id) tooltips.set(id, match[2].replace(/<[^>]*>/g, '').trim());
  }
  const days: ActivityDay[] = [];
  for (const match of html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)) {
    const attributes = match[1];
    const date = attributes.match(/\bdata-date="([^"]+)"/)![1];
    if (!isActivityDate(date)) throw new Error('Invalid upstream date');
    if (date < `${year}-01-01` || date > capturedAt) continue;
    const id = attributes.match(/\bid="([^"]+)"/)?.[1];
    const label = tooltips.get(id ?? '') ?? '';
    const count = /^No contributions\b/i.test(label) ? 0
      : Number(label.match(/^([\d,]+) contributions?\b/i)?.[1].replaceAll(',', '') ?? NaN);
    const level = Number(attributes.match(/\bdata-level="(\d)"/)?.[1] ?? NaN);
    days.push({ date, count, level });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  return validateActivity({
    source: `https://github.com/users/AiranSchez/contributions?from=${year}-01-01&to=${capturedAt}`,
    capturedAt, from: `${year}-01-01`, to: capturedAt, year,
    total: days.reduce((sum, day) => sum + day.count, 0), days,
  }, capturedAt);
}

type ActivityResult = { status: 'fresh' | 'cached' | 'unavailable'; snapshot: ActivitySnapshot | null };
interface Options {
  today?: string;
  fallback?: unknown;
  fetcher?: (url: string, options?: RequestInit) => Promise<Response>;
}

export async function loadGithubActivity({
  today = new Date().toISOString().slice(0, 10),
  fallback = savedActivity,
  fetcher = fetch,
}: Options = {}): Promise<ActivityResult> {
  try {
    const year = today.slice(0, 4);
    const response = await fetcher(`https://github.com/users/AiranSchez/contributions?from=${year}-01-01&to=${today}`, {
      headers: { Accept: 'text/html', 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error('Activity source unavailable');
    return { status: 'fresh', snapshot: parseGithubCalendar(await response.text(), today) };
  } catch {
    try { return { status: 'cached', snapshot: validateActivity(fallback, today) }; }
    catch { return { status: 'unavailable', snapshot: null }; }
  }
}

// The three prerendered locales share one request. Static pages display their
// build/capture date; this is deliberately not described as real-time activity.
let activity: Promise<ActivityResult> | undefined;
export function getGithubActivity() {
  return activity ??= loadGithubActivity();
}
