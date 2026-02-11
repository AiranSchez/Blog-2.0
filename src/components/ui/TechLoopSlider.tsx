import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';
import techLogos from '../../config/tech-logos.json';

interface TechLoopSliderProps {
  technologies: string[];
  speed?: number; // Duration in seconds for one loop
}

export default function TechLoopSlider({ technologies, speed = 30 }: TechLoopSliderProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout>();
  
  if (!technologies || technologies.length === 0) return null;

  // Filter technologies that have logos defined in the config
  const techsWithLogos = technologies.filter(tech => {
    const logoUrl = (techLogos as Record<string, string>)[tech];
    return logoUrl && logoUrl.trim() !== '';
  });

  // If no technologies with logos, don't render anything
  if (techsWithLogos.length === 0) return null;

  // Duplicate the array to create seamless loop
  const duplicatedTechs = [...techsWithLogos, ...techsWithLogos, ...techsWithLogos];

  // Get logo URL from config
  const getIconUrl = (tech: string): string => {
    return (techLogos as Record<string, string>)[tech] || '';
  };

  // Start infinite animation
  useEffect(() => {
    const startAnimation = async () => {
      if (!isDraggingRef.current && containerRef.current) {
        const containerWidth = containerRef.current.scrollWidth / 3; // One set width
        await controls.start({
          x: [-containerWidth, 0],
          transition: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          },
        });
      }
    };
    
    startAnimation();
  }, [controls, speed]);

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    
    // Resume animation after 2 seconds of inactivity
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    
    resumeTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.scrollWidth / 3;
        controls.start({
          x: [-containerWidth, 0],
          transition: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          },
        });
      }
    }, 2000);
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
    controls.stop();
    
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  return (
    <div className="relative w-full overflow-hidden py-4 flex items-center cursor-grab active:cursor-grabbing">
      {/* Infinite scrolling container */}
      <motion.div
        ref={containerRef}
        className="flex gap-8 items-center"
        drag="x"
        dragConstraints={{ left: -10000, right: 10000 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, width: 'fit-content' }}
      >
        {duplicatedTechs.map((tech, index) => (
          <motion.div
            key={`${tech}-${index}`}
            className="flex items-center justify-center gap-2 px-5 py-2 min-h-[40px] rounded-lg bg-white/50 dark:bg-stormy/50 backdrop-blur-sm border border-alabaster/30 dark:border-seaweed/20 shadow-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <img
              src={getIconUrl(tech)}
              alt={tech}
              className="w-5 h-5 flex-shrink-0 opacity-80 pointer-events-none select-none"
              draggable={false}
              onError={(e) => {
                // Fallback if icon doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-sm font-medium text-carbon dark:text-alabaster whitespace-nowrap leading-none select-none">
              {tech}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
