/**
 * Estimate reading time from raw Markdown.
 * Latin words count at 220 wpm; CJK characters at 500 cpm.
 */
export function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ');

  const cjk = (text.match(/[\u3040-\u30ff\u3400-\u9fff]/g) ?? []).length;
  const latin = (text.match(/[A-Za-zÀ-ÿ0-9]+(?:['’-][A-Za-zÀ-ÿ0-9]+)*/g) ?? []).length;

  return Math.max(1, Math.ceil(latin / 220 + cjk / 500));
}
