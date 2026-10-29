export interface ActivityDay { date: string; count: number; level: number }
export interface ActivitySnapshot {
  source: string;
  capturedAt: string;
  from: string;
  to: string;
  year: number;
  total: number;
  days: ActivityDay[];
}

const timestamp = (date: string) => Date.parse(`${date}T00:00:00Z`);
export const isActivityDate = (date: unknown): date is string => typeof date === 'string'
  && /^\d{4}-\d{2}-\d{2}$/.test(date)
  && Number.isFinite(timestamp(date))
  && new Date(timestamp(date)).toISOString().slice(0, 10) === date;

export function validateActivity(value: unknown, today: string): ActivitySnapshot {
  const data = value as ActivitySnapshot;
  if (!data || !isActivityDate(data.capturedAt) || data.capturedAt > today
    || !Array.isArray(data.days) || !data.days.length
    || data.from !== `${data.year}-01-01` || data.to !== data.capturedAt
    || !Number.isInteger(data.year) || data.capturedAt.slice(0, 4) !== String(data.year)
    || !data.source?.startsWith('https://github.com/')) {
    throw new Error('Invalid activity snapshot');
  }
  let previous = '';
  for (const day of data.days) {
    if (!isActivityDate(day.date) || day.date > data.capturedAt
      || (previous && timestamp(day.date) - timestamp(previous) !== 86_400_000)
      || !Number.isInteger(day.count) || day.count < 0
      || !Number.isInteger(day.level) || day.level < 0 || day.level > 4) {
      throw new Error('Invalid or incomplete activity dates');
    }
    previous = day.date;
  }
  if (data.days[0].date !== data.from || previous !== data.to
    || data.total !== data.days.reduce((total, day) => total + day.count, 0)) {
    throw new Error('Activity range or total mismatch');
  }
  return data;
}

export function summarizeActivity(days: ActivityDay[]) {
  const months = new Map<string, { key: string; total: number; days: number; from: string; to: string }>();
  const weekdays = Array.from({ length: 7 }, (_, index) => ({ index, total: 0 }));
  let total = 0, activeDays = 0, streak = 0, longestStreak = 0;
  let bestDay: ActivityDay | null = null;
  for (const day of days) {
    total += day.count;
    if (day.count > 0) {
      activeDays++;
      longestStreak = Math.max(longestStreak, ++streak);
      if (!bestDay || day.count > bestDay.count) bestDay = day;
    } else streak = 0;
    const key = day.date.slice(0, 7);
    const month = months.get(key) ?? { key, total: 0, days: 0, from: day.date, to: day.date };
    month.total += day.count;
    month.days++;
    month.to = day.date;
    months.set(key, month);
    weekdays[new Date(timestamp(day.date)).getUTCDay()].total += day.count;
  }
  return { total, activeDays, longestStreak, average: days.length ? total / days.length : 0,
    bestDay, months: [...months.values()], weekdays };
}
