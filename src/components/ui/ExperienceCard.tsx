import { motion } from 'framer-motion';
import { useState } from 'react';
import SkillBadge from './SkillBadge';
import TechLoopSlider from './TechLoopSlider';

interface ExperienceCardProps {
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

export default function ExperienceCard({
  company,
  role,
  startDate,
  endDate,
  duration,
  description,
  skills = [],
  technologies = [],
  index,
  lang = 'en',
  presentText = 'Present',
}: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format date according to locale
  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short' }).format(date);
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        damping: 20,
        stiffness: 100,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline Dot */}
      <motion.div
        className="absolute -left-[21px] top-8 w-4 h-4 rounded-full bg-gradient-to-br from-seaweed to-stormy ring-4 ring-carbon dark:ring-stormy z-10"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.2 }}
        animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
      />

      {/* Card with glassmorphism */}
      <motion.div
        className="relative ml-8 p-6 rounded-2xl bg-gradient-to-br from-alabaster/90 to-white/80 dark:from-carbon/90 dark:to-stormy/80 backdrop-blur-sm border border-alabaster/20 dark:border-seaweed/20 shadow-lg overflow-hidden"
        whileHover={{
          scale: 1.02,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6 }}
          style={{ pointerEvents: 'none' }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Company & Role */}
          <motion.h3
            className="text-2xl font-bold text-stormy dark:text-alabaster mb-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {company}
          </motion.h3>

          <motion.p
            className="text-lg font-semibold text-stormy/80 dark:text-alabaster/80 mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.35 }}
          >
            {role}
          </motion.p>

          {/* Date & Duration */}
          <motion.div
            className="flex flex-wrap items-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <span className="text-sm text-carbon/60 dark:text-alabaster/60">
              {formatDate(startDate)} - {endDate ? formatDate(endDate) : presentText}
            </span>
            <span className="text-sm text-carbon/40 dark:text-alabaster/40">•</span>
            <motion.span
              className="px-3 py-1 text-sm font-medium rounded-full bg-seaweed/20 text-seaweed border border-seaweed/30"
              whileHover={{ scale: 1.05 }}
            >
              {duration}
            </motion.span>
          </motion.div>

          {/* Description */}
          {description && (
            <motion.p
              className="text-carbon/80 dark:text-alabaster/80 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.45 }}
            >
              {description}
            </motion.p>
          )}

          {/* Technologies Loop Slider */}
          {technologies.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.48 }}
            >
              <TechLoopSlider technologies={technologies} speed={25} />
            </motion.div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              {skills.map((skill, i) => (
                <SkillBadge key={skill} skill={skill} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
