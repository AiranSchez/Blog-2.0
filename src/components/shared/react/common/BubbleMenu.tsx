/**
 * BubbleMenu Component (ReactBits Adapter)
 * Animated floating bubble menu for tags/filters
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export interface BubbleItem {
  id: string | number;
  label: string;
  count?: number;
}

interface BubbleMenuProps {
  items: BubbleItem[];
  selectedItems: (string | number)[];
  onItemClick: (itemId: string | number) => void;
  multiSelect?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
  colorScheme?: 'primary' | 'secondary';
  collapsible?: boolean;
  label?: string;
}

export default function BubbleMenu({
  items,
  selectedItems,
  onItemClick,
  multiSelect = true,
  className = '',
  variant = 'default',
  colorScheme = 'primary',
  collapsible = true,
  label = 'Filters',
}: BubbleMenuProps) {
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const isSelected = (id: string | number) => selectedItems.includes(id);

  const colors = {
    primary: {
      bg: 'bg-stormy dark:bg-seaweed',
      bgHover: 'hover:bg-stormy/90 dark:hover:bg-seaweed/90',
      bgInactive: 'bg-alabaster-200 dark:bg-carbon-700',
      bgInactiveHover: 'hover:bg-alabaster-300 dark:hover:bg-carbon-600',
      text: 'text-white',
      textInactive: 'text-carbon dark:text-alabaster',
      border: 'border-stormy/20 dark:border-seaweed/20',
    },
    secondary: {
      bg: 'bg-seaweed dark:bg-stormy',
      bgHover: 'hover:bg-seaweed/90 dark:hover:bg-stormy/90',
      bgInactive: 'bg-muted/20 dark:bg-carbon-600',
      bgInactiveHover: 'hover:bg-muted/30 dark:hover:bg-carbon-500',
      text: 'text-white',
      textInactive: 'text-carbon/80 dark:text-alabaster/80',
      border: 'border-seaweed/20 dark:border-stormy/20',
    },
  };

  const scheme = colors[colorScheme];
  const sizeClasses = variant === 'compact' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  // If collapsible and not expanded, show toggle button
  if (collapsible && !isExpanded) {
    return (
      <div className={className}>
        <motion.button
          onClick={() => setIsExpanded(true)}
          className={`
            ${sizeClasses}
            rounded-full font-medium
            transition-all duration-300
            border-2
            ${scheme.bgInactive} ${scheme.textInactive} ${scheme.bgInactiveHover} border-transparent
            cursor-pointer shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy dark:focus:ring-seaweed
            flex items-center gap-2
          `}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <span>{label}</span>
          <span className="opacity-60">({items.length})</span>
          <motion.span
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {collapsible && (
        <motion.button
          onClick={() => setIsExpanded(false)}
          className={`
            ${sizeClasses}
            rounded-full font-medium
            transition-all duration-300
            border-2
            ${scheme.bg} ${scheme.text} ${scheme.bgHover} ${scheme.border}
            cursor-pointer shadow-md
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy dark:focus:ring-seaweed
            flex items-center gap-2
          `}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <span>{label}</span>
          <motion.span
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </motion.button>
      )}
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => {
          const selected = isSelected(item.id);
          const isHovered = hoveredId === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
              className={`
                ${sizeClasses}
                rounded-full font-medium
                transition-all duration-300
                border-2
                ${selected 
                  ? `${scheme.bg} ${scheme.text} ${scheme.bgHover} ${scheme.border} shadow-md` 
                  : `${scheme.bgInactive} ${scheme.textInactive} ${scheme.bgInactiveHover} border-transparent`
                }
                cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy dark:focus:ring-seaweed
              `}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: selected ? 1.05 : 1,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                delay: index * 0.03,
              }}
              aria-pressed={selected}
            >
              <motion.span
                className="flex items-center gap-1.5"
                animate={{
                  y: isHovered ? -2 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
                {item.count !== undefined && (
                  <motion.span
                    className={`
                      ${variant === 'compact' ? 'text-[10px]' : 'text-xs'}
                      opacity-70 font-semibold
                    `}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ delay: index * 0.03 + 0.1 }}
                  >
                    ({item.count})
                  </motion.span>
                )}
              </motion.span>

              {/* Ripple effect on click */}
              {selected && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
