/**
 * Experience Types
 * Type definitions for experience-related data structures
 */

export interface Experience {
  company: string;
  role: string;
  startDate: string; // Format: YYYY-MM
  endDate: string | null; // Format: YYYY-MM or null for "Present"
  description?: string;
  skills?: string[];
  technologies?: string[];
  companyLogo?: string;
  companyUrl?: string;
  leanmindUrl?: string;
  isLeanMindOnly?: boolean;
}

export interface ExperienceCardProps {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  duration: string;
  description?: string;
  skills?: string[];
  technologies?: string[];
  index: number;
  lang?: string;
  presentText?: string;
}

export interface DualLogoProps {
  leanmindLogo: string;
  leanmindUrl?: string;
  companyLogo?: string;
  companyUrl?: string;
  companyName: string;
  isLeanMindOnly?: boolean;
}
