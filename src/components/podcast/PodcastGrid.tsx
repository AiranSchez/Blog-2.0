import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import PodcastCard from './PodcastCard';
import PodcastModal from './PodcastModal';
import type { PodcastEpisode } from '../../types/podcast';

interface PodcastGridProps {
  episodes: PodcastEpisode[];
  className?: string;
}

const PodcastGrid: React.FC<PodcastGridProps> = ({ episodes, className = '' }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing the episode to allow exit animation
    setTimeout(() => setSelectedEpisode(null), 300);
  };

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('[data-podcast-card]');
    
    // Animate cards on mount
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );

    // Hover animations
    cards.forEach((card) => {
      const cardElement = card as HTMLElement;

      const handleMouseEnter = () => {
        gsap.to(cardElement, {
          y: -8,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardElement, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      cardElement.addEventListener('mouseenter', handleMouseEnter);
      cardElement.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        cardElement.removeEventListener('mouseenter', handleMouseEnter);
        cardElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, [episodes]);

  if (!episodes || episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-carbon/60 dark:text-alabaster/60">
          No hay episodios disponibles
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={gridRef}
        className={`podcast-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      >
        {episodes.map((episode, index) => (
          <PodcastCard
            key={episode.id}
            {...episode}
            index={index}
            onClick={() => handleCardClick(episode)}
          />
        ))}
      </div>

      {/* Modal */}
      <PodcastModal
        episode={selectedEpisode}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PodcastGrid;
