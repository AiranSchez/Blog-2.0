import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ScrollFloatProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export default function ScrollFloat({ 
  children, 
  className = '',
  delay = 0,
  once = true
}: ScrollFloatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once,
    margin: '0px 0px -100px 0px'
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        y: 60,
        filter: 'blur(4px)'
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)'
      } : { 
        opacity: 0, 
        y: 60,
        filter: 'blur(4px)'
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
        y: { type: 'spring', stiffness: 100, damping: 15 }
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
    >
      {children}
    </motion.div>
  );
}
