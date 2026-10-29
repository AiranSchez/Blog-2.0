import { test } from 'node:test';
import assert from 'node:assert/strict';
import { testimonialsByLocale, selectedWorkByLocale } from '../../src/data/portfolio-content';

for (const locale of ['en', 'es', 'ja'] as const) {
  test(`${locale} recommendation excerpt is literal evidence, not invented praise`, () => {
    const review = testimonialsByLocale[locale].find(item => !item.placeholder)!;
    assert.ok(review.excerpt);
    assert.ok(review.quote.includes(review.excerpt));
    assert.ok(review.excerpt.length < review.quote.length);
  });
  test(`${locale} featured video belongs to the real published project`, () => {
    const projects = selectedWorkByLocale[locale].filter(item => item.published);
    assert.equal(projects.length, 1);
    assert.equal(projects[0].title, 'JaponesApp');
    assert.equal(projects[0].video, '/projects/japonesapp/demo.mp4');
  });
}
