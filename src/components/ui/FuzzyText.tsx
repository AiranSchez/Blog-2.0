import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface FuzzyTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function FuzzyText({ 
  text, 
  className = '',
  delay = 0,
  duration = 2
}: FuzzyTextProps) {
  const letters = useMemo(() => text.split(''), [text]);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: duration / letters.length,
        delayChildren: delay 
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-block' }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          variants={child}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
