import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import type { PodcastEpisode } from '../../types/podcast';

interface PodcastModalProps {
  episode: PodcastEpisode | null;
  isOpen: boolean;
  locale: string;
  onClose: () => void;
}

const copy = {
  en: { close: 'Close player', loading: 'Loading player', description: 'About this episode' },
  es: { close: 'Cerrar reproductor', loading: 'Cargando reproductor', description: 'Sobre este episodio' },
  ja: { close: 'プレーヤーを閉じる', loading: 'プレーヤーを読み込み中', description: 'このエピソードについて' },
} as const;

export default function PodcastModal({
  episode,
  isOpen,
  locale,
  onClose,
}: PodcastModalProps) {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const strings = copy[locale as keyof typeof copy] || copy.en;

  useEffect(() => {
    setIsIframeLoading(true);
  }, [episode?.url]);

  if (!episode) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="podcast-dialog">
      <div className="podcast-dialog__backdrop" aria-hidden="true" />
      <div className="podcast-dialog__viewport">
        <div className="podcast-dialog__positioner">
          <Dialog.Panel className="podcast-dialog__panel">
            <button
              type="button"
              className="icon-control podcast-dialog__close"
              onClick={onClose}
              aria-label={strings.close}
            >
              <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={1.75} d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            <Dialog.Title className="podcast-dialog__title">{episode.title}</Dialog.Title>
            <p className="episode-meta">
              {new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(new Date(episode.date))}{' '}
              · {episode.duration}
            </p>

            <div className="podcast-dialog__player">
              {isIframeLoading && (
                <div className="podcast-dialog__loading">{strings.loading}</div>
              )}
              <iframe
                id={`modal_audio_${episode.id}`}
                allowFullScreen
                scrolling="no"
                height="250"
                src={episode.url}
                loading="eager"
                title={episode.title}
                onLoad={() => setIsIframeLoading(false)}
              />
            </div>

            {episode.description && (
              <>
                <h3>{strings.description}</h3>
                <Dialog.Description>{episode.description}</Dialog.Description>
              </>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
