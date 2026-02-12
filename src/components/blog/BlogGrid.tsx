/**
 * BlogGrid Component
 * Grid layout with filtering logic for blog posts
 */
import { useState, useCallback, useMemo } from 'react';

interface BubbleItem {
  id: string | number;
  label: string;
  count?: number;
}

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

export default function BlogGrid({ posts, locale }: BlogGridProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [expandedMenu, setExpandedMenu] = useState<'tags' | 'years' | null>(null);

  // Extract unique tags and years with counts
  const tagItems = useMemo<BubbleItem[]>(() => {
    const tagCounts = new Map<string, number>();
    posts.forEach(post => {
      post.data.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ id: tag, label: tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  const yearItems = useMemo<BubbleItem[]>(() => {
    const yearCounts = new Map<number, number>();
    posts.forEach(post => {
      const year = new Date(post.data.date).getFullYear();
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
    });
    return Array.from(yearCounts.entries())
      .map(([year, count]) => ({ id: year, label: String(year), count }))
      .sort((a, b) => (b.id as number) - (a.id as number));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some(tag => post.data.tags.includes(tag));

      const postYear = new Date(post.data.date).getFullYear();
      const matchesYear = selectedYear === null || postYear === selectedYear;

      return matchesTags && matchesYear;
    });
  }, [posts, selectedTags, selectedYear]);

  const handleTagClick = useCallback((tagId: string | number) => {
    setSelectedTags(prev =>
      prev.includes(tagId as string)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId as string]
    );
  }, []);

  const handleYearClick = useCallback((yearId: string | number) => {
    setSelectedYear(prev => prev === yearId ? null : yearId as number);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setSelectedYear(null);
  }, []);

  const hasActiveFilters = selectedTags.length > 0 || selectedYear !== null;

  const translations = {
    en: {
      noResults: 'No posts found with those filters.',
      readMore: 'Read More',
      filterByTags: 'Filter by Tags',
      filterByYear: 'Filter by Year',
      clearFilters: 'Clear All Filters',
      showingResults: (count: number) => `Showing ${count} ${count === 1 ? 'post' : 'posts'}`,
    },
    es: { 
      noResults: 'No se encontraron artículos con esos filtros.',
      readMore: 'Leer Más',
      filterByTags: 'Filtrar por Tags',
      filterByYear: 'Filtrar por Año',
      clearFilters: 'Limpiar Filtros',
      showingResults: (count: number) => `Mostrando ${count} ${count === 1 ? 'artículo' : 'artículos'}`,
    },
    ja: { 
      noResults: 'フィルターに一致する記事が見つかりませんでした。',
      readMore: '続きを読む',
      filterByTags: 'タグでフィルタ',
      filterByYear: '年でフィルタ',
      clearFilters: 'フィルターをクリア',
      showingResults: (count: number) => `${count}件の記事を表示中`,
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  const toggleMenu = (menu: 'tags' | 'years') => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <div>
      {/* Filters Section */}
      <div className="mb-10 space-y-4">
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-stormy dark:text-seaweed hover:underline transition-colors flex items-center gap-2"
            >
              {t.clearFilters} <span aria-hidden="true">✕</span>
            </button>
          </div>
        )}

        {/* Filter Menu Buttons - Horizontal Layout */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => toggleMenu('tags')}
            className={`
              px-4 py-2 text-sm rounded-full font-medium
              transition-all duration-300 border-2
              flex items-center gap-2
              ${expandedMenu === 'tags'
                ? 'bg-stormy dark:bg-seaweed text-white border-stormy dark:border-seaweed shadow-md'
                : 'bg-alabaster-200 dark:bg-carbon-700 text-carbon dark:text-alabaster border-transparent hover:bg-alabaster-300 dark:hover:bg-carbon-600'
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy dark:focus:ring-seaweed
            `}
          >
            <span>{t.filterByTags}</span>
            <span className="opacity-60">({tagItems.length})</span>
            <span className="transition-transform duration-300" style={{ transform: expandedMenu === 'tags' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          <button
            onClick={() => toggleMenu('years')}
            className={`
              px-4 py-2 text-sm rounded-full font-medium
              transition-all duration-300 border-2
              flex items-center gap-2
              ${expandedMenu === 'years'
                ? 'bg-seaweed dark:bg-stormy text-white border-seaweed dark:border-stormy shadow-md'
                : 'bg-alabaster-200 dark:bg-carbon-700 text-carbon dark:text-alabaster border-transparent hover:bg-alabaster-300 dark:hover:bg-carbon-600'
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-seaweed dark:focus:ring-stormy
            `}
          >
            <span>{t.filterByYear}</span>
            <span className="opacity-60">({yearItems.length})</span>
            <span className="transition-transform duration-300" style={{ transform: expandedMenu === 'years' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
        </div>

        {/* Shared Options Container */}
        {expandedMenu && (
          <div className="bg-alabaster-100 dark:bg-carbon-800 rounded-lg p-6 shadow-inner">
            <div className="flex flex-wrap gap-2 justify-center">
              {expandedMenu === 'tags' && tagItems.map((item) => {
                const selected = selectedTags.includes(item.id as string);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTagClick(item.id)}
                    className={`
                      px-4 py-2 text-sm rounded-full font-medium
                      transition-all duration-300 border-2
                      ${selected 
                        ? 'bg-stormy dark:bg-seaweed text-white border-stormy dark:border-seaweed shadow-md scale-105' 
                        : 'bg-white dark:bg-carbon-700 text-carbon dark:text-alabaster border-transparent hover:bg-alabaster-200 dark:hover:bg-carbon-600'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy dark:focus:ring-seaweed
                    `}
                  >
                    <span className="flex items-center gap-1.5">
                      {item.label}
                      {item.count !== undefined && (
                        <span className="text-xs opacity-70 font-semibold">
                          ({item.count})
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
              {expandedMenu === 'years' && yearItems.map((item) => {
                const selected = selectedYear === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleYearClick(item.id)}
                    className={`
                      px-4 py-2 text-sm rounded-full font-medium
                      transition-all duration-300 border-2
                      ${selected 
                        ? 'bg-seaweed dark:bg-stormy text-white border-seaweed dark:border-stormy shadow-md scale-105' 
                        : 'bg-white dark:bg-carbon-700 text-carbon dark:text-alabaster border-transparent hover:bg-alabaster-200 dark:hover:bg-carbon-600'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-seaweed dark:focus:ring-stormy
                    `}
                  >
                    <span className="flex items-center gap-1.5">
                      {item.label}
                      {item.count !== undefined && (
                        <span className="text-xs opacity-70 font-semibold">
                          ({item.count})
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Count */}
        {hasActiveFilters && (
          <div className="text-center text-sm text-carbon/60 dark:text-alabaster/60">
            {t.showingResults(filteredPosts.length)}
          </div>
        )}
      </div>

      {/* Results Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-carbon/60 dark:text-alabaster/60 mb-4">
            {t.noResults}
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-stormy dark:bg-seaweed text-white rounded-lg hover:bg-stormy/90 dark:hover:bg-seaweed/90 transition-colors font-medium"
          >
            {t.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const fallbackImage = `https://picsum.photos/seed/${post.id}/800/450`;
            const postImage = post.data.featuredImage || fallbackImage;
            
            return (
              <article
                key={post.id}
                className="h-full flex flex-col overflow-hidden bg-white dark:bg-carbon-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                  {/* Image Section (40%) */}
                  <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
                    <img
                      src={postImage}
                      alt={post.data.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Content Section (60%) */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold mb-2 text-stormy dark:text-seaweed line-clamp-2">
                      <a
                        href={`/${locale}/blog/${post.slug}/`}
                        className="hover:underline focus-visible:underline"
                      >
                        {post.data.title}
                      </a>
                    </h2>

                    <time
                      dateTime={new Date(post.data.date).toISOString()}
                      className="text-xs text-carbon/60 dark:text-alabaster/60 mb-3 block"
                    >
                      {new Date(post.data.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>

                    <p className="text-sm text-carbon/80 dark:text-alabaster/80 mb-4 line-clamp-2 flex-grow">
                      {post.data.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Tags">
                      {post.data.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-alabaster-200 dark:bg-carbon-600 text-carbon dark:text-alabaster"
                          role="listitem"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.data.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full border border-alabaster-300 dark:border-carbon-500 text-carbon dark:text-alabaster">
                          +{post.data.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <a
                      href={`/${locale}/blog/${post.slug}/`}
                      className="inline-flex items-center gap-1 text-sm text-stormy dark:text-seaweed hover:underline font-semibold transition-all group-hover:gap-2 mt-auto"
                    >
                      {t.readMore}
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
