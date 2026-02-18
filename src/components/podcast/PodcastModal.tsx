import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { PodcastEpisode } from '../../types/podcast';

interface PodcastModalProps {
  episode: PodcastEpisode | null;
  isOpen: boolean;
  onClose: () => void;
}

const PodcastModal: React.FC<PodcastModalProps> = ({ episode, isOpen, onClose }) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  if (!episode) return null;

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Full-screen container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-alabaster to-alabaster-50 dark:from-carbon-800 dark:to-carbon-900 border border-carbon/10 dark:border-seaweed/20 shadow-2xl transition-all">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-carbon/5 dark:bg-seaweed/10 hover:bg-carbon/10 dark:hover:bg-seaweed/20 transition-colors group"
                  aria-label="Cerrar modal"
                >
                  <svg
                    className="w-5 h-5 text-carbon dark:text-seaweed group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Modal content */}
                <div className="p-6 sm:p-8">
                  {/* Title */}
                  <Dialog.Title
                    as="h3"
                    className="text-2xl sm:text-3xl font-bold text-stormy dark:text-seaweed mb-4 pr-8"
                  >
                    {episode.title}
                  </Dialog.Title>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-carbon/70 dark:text-alabaster/70">
                    {episode.date && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time dateTime={episode.date}>
                          {new Date(episode.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    )}
                    {episode.duration && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{episode.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Podcast Player */}
                  <div className="relative rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-carbon-50 to-carbon-100 dark:from-carbon-900 dark:to-carbon-950">
                    {/* Loading indicator */}
                    {isIframeLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-alabaster/90 to-alabaster-100/90 dark:from-carbon-700/90 dark:to-carbon-800/90 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-3 border-seaweed/30 border-t-seaweed rounded-full animate-spin" />
                          <span className="text-sm text-carbon/60 dark:text-alabaster/60">Cargando reproductor...</span>
                        </div>
                      </div>
                    )}

                    <iframe
                      id={`modal_audio_${episode.id}`}
                      frameBorder="0"
                      allowFullScreen
                      scrolling="no"
                      height="250"
                      className="w-full block"
                      style={{
                        border: 'none',
                        boxSizing: 'border-box',
                        display: 'block'
                      }}
                      src={episode.url}
                      loading="eager"
                      title={episode.title}
                      onLoad={handleIframeLoad}
                    />
                  </div>

                  {/* Description */}
                  {episode.description && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-carbon/80 dark:text-alabaster/80 uppercase tracking-wide flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Descripción
                      </h4>
                      <Dialog.Description
                        as="p"
                        className="text-base leading-relaxed text-carbon dark:text-alabaster/90"
                      >
                        {episode.description}
                      </Dialog.Description>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PodcastModal;
