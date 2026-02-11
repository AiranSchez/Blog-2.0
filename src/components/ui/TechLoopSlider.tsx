import { motion } from 'framer-motion';
import techLogos from '../../config/tech-logos.json';

interface TechLoopSliderProps {
  technologies: string[];
  speed?: number; // Duration in seconds for one loop
}

export default function TechLoopSlider({ technologies, speed = 30 }: TechLoopSliderProps) {
  if (!technologies || technologies.length === 0) return null;

  // Filter technologies that have logos defined in the config
  const techsWithLogos = technologies.filter(tech => {
    const logoUrl = (techLogos as Record<string, string>)[tech];
    return logoUrl && logoUrl.trim() !== '';
  });

  // If no technologies with logos, don't render anything
  if (techsWithLogos.length === 0) return null;

  // Duplicate the array to create seamless loop
  const duplicatedTechs = [...techsWithLogos, ...techsWithLogos];

  // Get logo URL from config
  const getIconUrl = (tech: string): string => {
    return (techLogos as Record<string, string>)[tech] || '';
  };

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Gradient overlays for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-alabaster/90 to-transparent dark:from-carbon/90 dark:to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-alabaster/90 to-transparent dark:from-carbon/90 dark:to-transparent z-10 pointer-events-none" />

      {/* Infinite scrolling container */}
      <motion.div
        className="flex gap-8 items-center"
        animate={{
          x: [0, -50 + '%'],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
        style={{ width: 'fit-content' }}
      >
        {duplicatedTechs.map((tech, index) => (
          <motion.div
            key={`${tech}-${index}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/50 dark:bg-stormy/50 backdrop-blur-sm border border-alabaster/30 dark:border-seaweed/20 shadow-sm w-fit"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <img
              src={getIconUrl(tech)}
              alt={tech}
              className="w-5 h-5 opacity-80"
              onError={(e) => {
                // Fallback if icon doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-sm font-medium text-carbon dark:text-alabaster whitespace-nowrap">
              {tech}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
