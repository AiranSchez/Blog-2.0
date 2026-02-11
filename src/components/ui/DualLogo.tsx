import { motion } from 'framer-motion';
import { useState } from 'react';

interface DualLogoProps {
  leanmindLogo: string;
  leanmindUrl?: string;
  companyLogo?: string;
  companyUrl?: string;
  companyName: string;
  isLeanMindOnly?: boolean;
}

export default function DualLogo({ leanmindLogo, leanmindUrl, companyLogo, companyUrl, companyName, isLeanMindOnly }: DualLogoProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  };

  if (isLeanMindOnly) {
    const LogoContent = (
      <motion.div
        className="flex justify-center mb-6"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
      >
        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-seaweed/30 shadow-lg cursor-pointer">
          <img
            src={leanmindLogo}
            alt="LeanMind"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    );

    return leanmindUrl ? (
      <a href={leanmindUrl} target="_blank" rel="noopener noreferrer" className="block">
        {LogoContent}
      </a>
    ) : LogoContent;
  }

  return (
    <div className="flex items-center justify-center gap-6 mb-6">
      {/* LeanMind Logo (Left) - 80px */}
      <motion.div
        className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-seaweed/30 shadow-lg"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', damping: 20, delay: 0.1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {leanmindUrl ? (
          <a href={leanmindUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
            <img
              src={leanmindLogo}
              alt="LeanMind"
              className="w-full h-full object-cover"
            />
          </a>
        ) : (
          <img
            src={leanmindLogo}
            alt="LeanMind"
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>

      {/* Connecting Line with Perfectly Centered Pulsing Dot */}
      <motion.div
        className="relative flex items-center justify-center h-0.5 w-16 bg-gradient-to-r from-seaweed via-alabaster to-stormy"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-alabaster shadow-lg ring-2 ring-white/50"
          animate={{
            scale: [1, 1.4, 1],
            boxShadow: [
              '0 0 0 0 rgba(255, 255, 255, 0.7)',
              '0 0 0 8px rgba(255, 255, 255, 0)',
              '0 0 0 0 rgba(255, 255, 255, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Company Logo (Right) - 80px with Magnetic Effect */}
      <motion.div
        className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-stormy/30 shadow-lg cursor-pointer"
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
        {companyUrl ? (
          <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <img
              src={companyLogo}
              alt={companyName}
              className="w-full h-full object-cover bg-white"
            />
          </a>
        ) : (
          <img
            src={companyLogo}
            alt={companyName}
            className="w-full h-full object-cover bg-white"
          />
        )}
      </motion.div>
    </div>
  );
}
