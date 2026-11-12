import { articlePath } from '../../features/blog/routes';
/**
 * Hallmark · genre: atmospheric · macrostructure: Ecosystem Index
 * design-system: studied-DNA · designed-as-app
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

interface BlogPost {
  id: string;
  slug: string;
  data: {
    title: string;
    description: string;
    date: Date;
    tags: string[];
    category: 'web' | 'data' | 'craft';
    draft: boolean;
    featuredImage?: string;
  };
  readingMinutes?: number;
}

interface BlogGridProps {
  posts: BlogPost[];
  locale: string;
}

const copy = {
  en: {
    tags: 'Topics',
    years: 'Year',
    allYears: 'All years',
    clear: 'Clear filters',
    filters: 'Article filters',
    tagsLabel: 'Topics',
    categoriesLabel: 'Categories',
    allCategories: 'All',
    categories: { web: 'Web', data: 'Data', craft: 'Craft' },
    minutes: 'min read',
    pagination: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    empty: 'No articles match these filters.',
    latest: 'Latest article',
    read: 'Read article',
    count: (value: number) => `${value} ${value === 1 ? 'article' : 'articles'}`,
  },
  es: {
    tags: 'Temas',
    years: 'Año',
    allYears: 'Todos los años',
    clear: 'Limpiar filtros',
    filters: 'Filtros de artículos',
    tagsLabel: 'Temas',
    categoriesLabel: 'Categorías',
    allCategories: 'Todas',
    categories: { web: 'Web', data: 'Datos', craft: 'Oficio' },
    minutes: 'min de lectura',
    pagination: 'Paginación',
    previous: 'Anterior',
    next: 'Siguiente',
    empty: 'No hay artículos con estos filtros.',
    latest: 'Último artículo',
    read: 'Leer artículo',
    count: (value: number) => `${value} ${value === 1 ? 'artículo' : 'artículos'}`,
  },
  ja: {
    tags: 'テーマ',
    years: '年',
    allYears: 'すべての年',
    clear: 'フィルターを解除',
    filters: '記事のフィルター',
    tagsLabel: 'テーマ',
    categoriesLabel: 'カテゴリー',
    allCategories: 'すべて',
    categories: { web: 'Web', data: 'データ', craft: '仕事' },
    minutes: '分で読めます',
    pagination: 'ページ送り',
    previous: '前へ',
    next: '次へ',
    empty: '条件に一致する記事がありません。',
    latest: '最新の記事',
    read: '記事を読む',
    count: (value: number) => `${value}件の記事`,
  },
} as const;

const articleHref = (locale: string, slug: string) =>
  articlePath(locale, slug);

export default function BlogGrid({ posts, locale }: BlogGridProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [category, setCategory] = useState<'all' | 'web' | 'data' | 'craft'>('all');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const strings = copy[locale as keyof typeof copy] || copy.en;

  const tagItems = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) => {
      post.data.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  useEffect(() => {
    const requestedTag = new URLSearchParams(window.location.search).get('tag');
    if (!requestedTag) return;

    const matchingTag = tagItems.find(([tag]) =>
      tag.toLocaleLowerCase() === requestedTag.toLocaleLowerCase(),
    )?.[0];

    if (matchingTag) {
      setSelectedTags([matchingTag]);
      setPage(1);
    }
  }, [tagItems]);

  const categoryItems = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) => counts.set(post.data.category, (counts.get(post.data.category) || 0) + 1));
    return (['web', 'data', 'craft'] as const).map((id) => ({ id, count: counts.get(id) || 0 }));
  }, [posts]);

  const yearItems = useMemo(() => {
    const counts = new Map<number, number>();
    posts.forEach((post) => {
      const year = new Date(post.data.date).getFullYear();
      counts.set(year, (counts.get(year) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[0] - a[0]);
  }, [posts]);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const hasTag =
          selectedTags.length === 0 ||
          selectedTags.some((tag) => post.data.tags.includes(tag));
        const year = new Date(post.data.date).getFullYear();
        return (
          (category === 'all' || post.data.category === category) &&
          hasTag &&
          (selectedYear === null || selectedYear === year)
        );
      }),
    [posts, selectedTags, selectedYear, category],
  );

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setSelectedYear(null);
    setCategory('all');
    setPage(1);
  }, []);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / perPage));
  const currentPage = Math.min(page, pageCount);
  const pagePosts = filteredPosts.slice((currentPage - 1) * perPage, currentPage * perPage);
  const [leadPost, ...archivePosts] = pagePosts;
  const hasFilters = selectedTags.length > 0 || selectedYear !== null || category !== 'all';

  return (
    <div className="blog-ecosystem">
      <div className="index-filter">
        <div className="index-filter__tabs" role="group" aria-label={strings.categoriesLabel}>
          <button
            className={`index-filter__tab ${category === 'all' ? 'is-active' : ''}`}
            type="button"
            aria-pressed={category === 'all'}
            onClick={() => {
              setCategory('all');
              setPage(1);
            }}
          >
            {strings.allCategories} <span>{posts.length}</span>
          </button>
          {categoryItems.map(({ id, count }) => (
            <button
              key={id}
              className={`index-filter__tab ${category === id ? 'is-active' : ''}`}
              type="button"
              aria-pressed={category === id}
              onClick={() => {
                setCategory(category === id ? 'all' : id);
                setPage(1);
              }}
            >
              {strings.categories[id]} <span>{count}</span>
            </button>
          ))}
        </div>

        <div className="index-filter__tools">
          {selectedTags.length > 0 && (
            <button
              className="tag-active"
              type="button"
              onClick={() => {
                setSelectedTags([]);
                setPage(1);
              }}
            >
              #{selectedTags[0]} ×
            </button>
          )}

          <label className="year-filter">
            <span>{strings.years}</span>
            <select
              value={selectedYear ?? ''}
              onChange={(event) => {
                setSelectedYear(event.target.value ? Number(event.target.value) : null);
                setPage(1);
              }}
            >
              <option value="">{strings.allYears}</option>
              {yearItems.map(([year]) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>

          {hasFilters && (
            <button className="text-filter" type="button" onClick={clearFilters}>
              {strings.clear}
            </button>
          )}

          <p className="filter-count" aria-live="polite">
            {strings.count(filteredPosts.length)}
          </p>
        </div>
      </div>

      {!leadPost ? (
        <p className="empty-state">{strings.empty}</p>
      ) : (
        <>
          <article className="article-lead">
            {leadPost.data.featuredImage ? (
              <img
                className="article-lead__image"
                src={leadPost.data.featuredImage}
                alt=""
                loading="eager"
              />
            ) : (
              <div className="article-lead__image article-lead__image--fallback" aria-hidden="true" />
            )}
            <div className="article-lead__copy">
              <span className="meta">
                {strings.latest} · {formatDate(leadPost.data.date)} · {leadPost.readingMinutes} {strings.minutes}
              </span>
              <h2 className="article-lead__title">
                <a href={articleHref(locale, leadPost.slug)}>{leadPost.data.title}</a>
              </h2>
              <p className="article-lead__description">{leadPost.data.description}</p>
              <div className="tag-list" aria-label={strings.tagsLabel}>
                {leadPost.data.tags.slice(0, 5).map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="archive-action">
                <a className="text-link" href={articleHref(locale, leadPost.slug)}>
                  {strings.read}
                </a>
              </div>
            </div>
          </article>

          <ul className="article-ecosystem">
            {archivePosts.map((post, index) => (
              <li
                className={`article-card ${index % 5 === 0 ? 'article-card--wide' : ''}`}
                key={post.id}
              >
                <a href={articleHref(locale, post.slug)}>
                  {post.data.featuredImage ? (
                    <img src={post.data.featuredImage} alt="" loading="lazy" />
                  ) : (
                    <div className="article-card__fallback" aria-hidden="true" />
                  )}
                  <div className="article-card__copy">
                    <div className="article-card__meta">
                      <time dateTime={new Date(post.data.date).toISOString()}>
                        {formatDate(post.data.date)}
                      </time>
                      <span>{post.readingMinutes} {strings.minutes}</span>
                    </div>
                    <h2>{post.data.title}</h2>
                    <p>{post.data.description}</p>
                    <div className="tag-list" aria-label={strings.tagsLabel}>
                      {post.data.tags.slice(0, 3).map((tag) => (
                        <span className="tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {pageCount > 1 && (
            <nav className="pagination" aria-label={strings.pagination}>
              <button type="button" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                ← {strings.previous}
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={value === currentPage ? 'is-active' : ''}
                  aria-current={value === currentPage ? 'page' : undefined}
                  onClick={() => setPage(value)}
                >
                  {value}
                </button>
              ))}
              <button type="button" onClick={() => setPage(Math.min(pageCount, currentPage + 1))} disabled={currentPage === pageCount}>
                {strings.next} →
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
