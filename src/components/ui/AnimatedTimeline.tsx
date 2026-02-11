import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedTimelineProps {
  children: React.ReactNode;
}

export default function AnimatedTimeline({ children }: AnimatedTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center']
  });

  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className="relative">
      {/* Timeline Background Line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-alabaster/20 dark:bg-seaweed/20" />
      
      {/* Animated Progress Line */}
      <motion.div
        className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-seaweed via-alabaster to-seaweed origin-top"
        style={{ height }}
      />

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
