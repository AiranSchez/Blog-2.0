import { motion } from 'framer-motion';

interface SkillBadgeProps {
  skill: string;
  index: number;
}

export default function SkillBadge({ skill, index }: SkillBadgeProps) {
  return (
    <motion.span
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-seaweed/10 text-seaweed border border-seaweed/20 hover:bg-seaweed/20 hover:scale-105 transition-all cursor-default"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        damping: 15,
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 0 20px rgba(var(--seaweed-rgb), 0.3)',
      }}
    >
      {skill}
    </motion.span>
  );
}
