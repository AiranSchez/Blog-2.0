import React, { useState } from 'react';
import type { PodcastEpisode } from '../../types/podcast';

interface PodcastCardProps extends PodcastEpisode {
  index: number;
  className?: string;
  onClick?: () => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({
  id,
  url,
  title,
  date,
  duration,
  index,
  className = '',
  onClick
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger if not clicking on iframe or its container
    const target = e.target as HTMLElement;
    if (!target.closest('.podcast-player-container')) {
      onClick?.();
    }
  };

  return (
    <div
      className={`podcast-card group relative overflow-hidden rounded-xl bg-gradient-to-br from-alabaster to-alabaster-50 dark:from-carbon-700 dark:to-carbon-800 border border-carbon/10 dark:border-seaweed/10 transition-all duration-300 hover:shadow-xl hover:shadow-seaweed/20 hover:-translate-y-2 cursor-pointer ${className}`}
      data-podcast-card={id}
      data-index={index}
      onClick={handleCardClick}
    >
      <div className="p-4 sm:p-5 space-y-3">
        {/* Header with title and metadata - compact */}
        <div className="space-y-2 pb-3 border-b border-carbon/10 dark:border-seaweed/10">
          <h3 className="text-base sm:text-lg font-bold text-stormy dark:text-seaweed line-clamp-2 group-hover:text-seaweed dark:group-hover:text-muted transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-4 text-xs text-carbon/60 dark:text-alabaster/60">
            {date && (
              <time dateTime={date} className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(date).toLocaleDateString()}
              </time>
            )}
            {duration && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {duration}
              </span>
            )}
          </div>
        </div>

        {/* iVoox iframe with better styling + loading state */}
        <div className="podcast-player-container relative rounded-lg overflow-hidden">
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-alabaster/90 to-alabaster-100/90 dark:from-carbon-700/90 dark:to-carbon-800/90 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-seaweed/30 border-t-seaweed rounded-full animate-spin" />
                <span className="text-xs text-carbon/60 dark:text-alabaster/60">Cargando...</span>
              </div>
            </div>
          )}
          
          <iframe
            id={`audio_${id}`}
            frameBorder="0"
            allowFullScreen
            scrolling="no"
            height="200"
            className="w-full block"
            style={{
              border: 'none',
              boxSizing: 'border-box',
              display: 'block'
            }}
            src={url}
            loading="lazy"
            title={title}
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
