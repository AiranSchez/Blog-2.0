import { motion } from 'framer-motion';
import { useState } from 'react';

interface DualLogoProps {
  leanmindLogo: string;
  companyLogo?: string;
  companyName: string;
  isLeanMindOnly?: boolean;
}

export default function DualLogo({ leanmindLogo, companyLogo, companyName, isLeanMindOnly }: DualLogoProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  };

  if (isLeanMindOnly) {
    return (
      <motion.div
        className="flex justify-center mb-6"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
      >
        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-seaweed/30 shadow-lg">
          <img
            src={leanmindLogo}
            alt="LeanMind"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {/* LeanMind Logo (Left) */}
      <motion.div
        className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-seaweed/30 shadow-lg"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', damping: 20, delay: 0.1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <img
          src={leanmindLogo}
          alt="LeanMind"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Connecting Line */}
      <motion.div
        className="relative h-0.5 w-12 bg-gradient-to-r from-seaweed via-alabaster to-stormy"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-alabaster"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Company Logo (Right) with Magnetic Effect */}
      <motion.div
        className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-stormy/30 shadow-lg cursor-pointer"
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', damping: 20, delay: 0.1 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
        animate={{
          x: mousePosition.x * 0.1,
          y: mousePosition.y * 0.1,
        }}
        whileHover={{ scale: 1.1, rotate: -5 }}
      >
        <img
          src={companyLogo}
          alt={companyName}
          className="w-full h-full object-cover bg-white"
        />
      </motion.div>
    </div>
  );
}
