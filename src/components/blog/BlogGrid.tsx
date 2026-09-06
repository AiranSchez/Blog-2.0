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
    draft: boolean;
    featuredImage?: string;
  };
}

interface BlogGridProps {
  posts: BlogPost[];
  locale: string;
}

const copy = {
  en: {
    tags: 'Topics',
    years: 'Years',
    clear: 'Clear filters',
    empty: 'No articles match these filters.',
    latest: 'Latest article',
    read: 'Read article',
    count: (value: number) => `${value} ${value === 1 ? 'article' : 'articles'}`,
  },
  es: {
    tags: 'Temas',
    years: 'Años',
    clear: 'Limpiar filtros',
    empty: 'No hay artículos con estos filtros.',
    latest: 'Último artículo',
    read: 'Leer artículo',
    count: (value: number) => `${value} ${value === 1 ? 'artículo' : 'artículos'}`,
  },
  ja: {
    tags: 'テーマ',
    years: '年',
    clear: 'フィルターを解除',
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
  const [expandedMenu, setExpandedMenu] = useState<'tags' | 'years' | null>(null);

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

    if (matchingTag) setSelectedTags([matchingTag]);
  }, [tagItems]);

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
        return hasTag && (selectedYear === null || selectedYear === year);
      }),
    [posts, selectedTags, selectedYear],
  );

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setSelectedYear(null);
  }, []);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));

  const [leadPost, ...archivePosts] = filteredPosts;
  const hasFilters = selectedTags.length > 0 || selectedYear !== null;

  return (
    <div className="blog-ecosystem">
      <div className="filter-toolbar" aria-label="Article filters">
        <button
          className={`filter-button ${expandedMenu === 'tags' ? 'is-active' : ''}`}
          type="button"
          aria-expanded={expandedMenu === 'tags'}
          onClick={() => setExpandedMenu(expandedMenu === 'tags' ? null : 'tags')}
        >
          {strings.tags} ({tagItems.length})
        </button>
        <button
          className={`filter-button ${expandedMenu === 'years' ? 'is-active' : ''}`}
          type="button"
          aria-expanded={expandedMenu === 'years'}
          onClick={() => setExpandedMenu(expandedMenu === 'years' ? null : 'years')}
        >
          {strings.years} ({yearItems.length})
        </button>
        {hasFilters && (
          <button className="filter-button" type="button" onClick={clearFilters}>
            {strings.clear}
          </button>
        )}

        {expandedMenu && (
          <div className="filter-options">
            {expandedMenu === 'tags' &&
              tagItems.map(([tag, count]) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    className="filter-button"
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setSelectedTags((current) =>
                        selected ? current.filter((item) => item !== tag) : [...current, tag],
                      )
                    }
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            {expandedMenu === 'years' &&
              yearItems.map(([year, count]) => (
                <button
                  key={year}
                  className="filter-button"
                  type="button"
                  aria-pressed={selectedYear === year}
                  onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                >
                  {year} ({count})
                </button>
              ))}
          </div>
        )}

        <p className="filter-count" aria-live="polite">
          {strings.count(filteredPosts.length)}
        </p>
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
                {strings.latest} · {formatDate(leadPost.data.date)}
              </span>
              <h2 className="article-lead__title">
                <a href={articleHref(locale, leadPost.slug)}>{leadPost.data.title}</a>
              </h2>
              <p className="article-lead__description">{leadPost.data.description}</p>
              <div className="tag-list" aria-label="Tags">
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
                      <span aria-hidden="true">↗</span>
                    </div>
                    <h2>{post.data.title}</h2>
                    <p>{post.data.description}</p>
                    <div className="tag-list" aria-label="Tags">
                      {post.data.tags.slice(0, 3).map((tag) => (
                        <span className="tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
