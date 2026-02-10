import { motion, easeInOut } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  variant?: 'fade' | 'slideUp' | 'typewriter';
  delay?: number;
}

export default function AnimatedText({ 
  text, 
  className = '', 
  variant = 'fade',
  delay = 0 
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (variant !== 'typewriter') return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, variant]);

  // Variants for different animation types
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration: 0.8,
          delay,
          ease: easeInOut
        }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          delay,
          ease: easeInOut
        }
      }
    },
    typewriter: {
      hidden: {},
      visible: {}
    }
  };

  if (variant === 'typewriter') {
    return (
      <span className={className}>
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants[variant]}
    >
      {text}
    </motion.span>
  );
}
