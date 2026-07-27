/**
 * Hallmark · genre: atmospheric · macrostructure: Listening room
 * design-system: studied-DNA · designed-as-app
 */
import { useState } from 'react';
import PodcastModal from './PodcastModal';
import type { PodcastEpisode } from '../../types/podcast';

interface PodcastGridProps {
  episodes: PodcastEpisode[];
  locale: string;
}

const copy = {
  en: {
    listen: 'Listen',
    archive: 'Episode archive',
    latest: 'Latest episode',
    coverAlt: 'La Techtulia podcast cover',
  },
  es: {
    listen: 'Escuchar',
    archive: 'Archivo de episodios',
    latest: 'Último episodio',
    coverAlt: 'Portada del podcast La Techtulia',
  },
  ja: {
    listen: '聴く',
    archive: 'エピソード一覧',
    latest: '最新エピソード',
    coverAlt: 'La Techtulia ポッドキャストのカバー',
  },
} as const;

export default function PodcastGrid({ episodes, locale }: PodcastGridProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const strings = copy[locale as keyof typeof copy] || copy.en;
  const [latestEpisode, ...archiveEpisodes] = episodes;

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));

  if (!latestEpisode) {
    return <p className="empty-state">No episodes available.</p>;
  }

  return (
    <>
      <article className="podcast-feature">
        <div className="podcast-feature__art">
          <img
            src="/images/la-techtulia-cover.webp"
            alt={strings.coverAlt}
            loading="eager"
          />
        </div>
        <div className="podcast-feature__copy">
          <span className="episode-meta">
            {strings.latest} · {formatDate(latestEpisode.date)} · {latestEpisode.duration}
          </span>
          <p className="podcast-feature__show">La Techtulia</p>
          <h2>{latestEpisode.title}</h2>
          {latestEpisode.description && <p>{latestEpisode.description}</p>}
          <button
            className="primary-action podcast-feature__action"
            type="button"
            onClick={() => setSelectedEpisode(latestEpisode)}
          >
            <span aria-hidden="true">▶</span> {strings.listen}
          </button>
        </div>
      </article>

      <section className="podcast-archive" aria-labelledby="episode-archive-title">
        <h2 id="episode-archive-title" className="podcast-archive__title">
          {strings.archive}
        </h2>
        <ol className="episode-list">
          {archiveEpisodes.map((episode) => (
            <li className="episode-list__item" key={episode.id}>
              <button className="episode-row" type="button" onClick={() => setSelectedEpisode(episode)}>
                <span className="episode-row__content">
                  <span className="episode-meta">
                    {formatDate(episode.date)} · {episode.duration}
                  </span>
                  <span className="episode-row__title">{episode.title}</span>
                </span>
                <span className="episode-row__action"><span aria-hidden="true">▶</span> {strings.listen}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <PodcastModal
        episode={selectedEpisode}
        isOpen={selectedEpisode !== null}
        locale={locale}
        onClose={() => setSelectedEpisode(null)}
      />
    </>
  );
}
