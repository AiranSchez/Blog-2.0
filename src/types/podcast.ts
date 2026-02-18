/**
 * Podcast Types
 * Type definitions for podcast episode data structures
 */

export interface PodcastEpisode {
  id: string;
  url: string;
  title: string;
  description: string;
  date: string; // Format: YYYY-MM-DD
  duration?: string; // Format: HH:MM or MM:SS
}

export interface PodcastCardProps {
  id: string;
  url: string;
  title: string;
  description: string;
  date: string;
  duration?: string;
  index: number;
}
