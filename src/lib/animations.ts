/**
 * Motion One Animation Utilities
 * Provides reusable animation patterns following Web Interface Guidelines
 * 
 * Motion One is compositor-friendly and respects prefers-reduced-motion automatically
 */

import { animate, inView, scroll } from 'motion';

/**
 * Fade in animation for elements entering viewport
 * Best for: text content, images, cards
 */
export function fadeInOnScroll(
  selector: string,
  options: { delay?: number; duration?: number } = {}
): void {
  const { delay = 0, duration = 0.6 } = options;

  inView(
    selector,
    (element) => {
      animate(
        element,
        { 
          opacity: [0, 1], 
          transform: ['translateY(20px)', 'translateY(0px)'] 
        },
        { 
          duration,
          delay
        }
      );
    },
    { amount: 0.3 } // Start animation when 30% visible
  );
}

/**
 * Slide in from left animation
 * Best for: section headings, feature cards
 */
export function slideInLeft(
  selector: string,
  options: { delay?: number; duration?: number } = {}
): void {
  const { delay = 0, duration = 0.7 } = options;

  inView(
    selector,
    (element) => {
      animate(
        element,
        { 
          opacity: [0, 1], 
          transform: ['translateX(-40px)', 'translateX(0px)'] 
        },
        { 
          duration,
          delay
        }
      );
    },
    { amount: 0.3 }
  );
}

/**
 * Stagger animation for lists/grids
 * Best for: blog cards, project grids, feature lists
 */
export function staggerIn(
  selector: string,
  options: { stagger?: number; duration?: number } = {}
): void {
  const { stagger = 0.1, duration = 0.5 } = options;

  inView(
    selector,
    (element) => {
      const children = Array.from(element.children);
      
      children.forEach((child, index) => {
        animate(
          child as Element,
          { 
            opacity: [0, 1], 
            transform: ['translateY(20px)', 'translateY(0px)'] 
          },
          { 
            duration,
            delay: index * stagger
          }
        );
      });
    },
    { amount: 0.2 }
  );
}

/**
 * Scale in animation
 * Best for: modals, tooltips, badges appearing
 */
export function scaleIn(
  selector: string,
  options: { delay?: number; duration?: number } = {}
): void {
  const { delay = 0, duration = 0.4 } = options;

  inView(
    selector,
    (element) => {
      animate(
        element,
        { 
          opacity: [0, 1], 
          transform: ['scale(0.9)', 'scale(1)'] 
        },
        { 
          duration,
          delay
        }
      );
    },
    { amount: 0.5 }
  );
}

/**
 * Parallax scroll effect
 * Best for: hero backgrounds, decorative elements
 */
export function parallaxScroll(
  selector: string,
  options: { speed?: number } = {}
): void {
  const { speed = 0.5 } = options;
  const element = document.querySelector(selector);
  
  if (!element) return;

  scroll(
    animate(element as Element, { 
      transform: ['translateY(0px)', `translateY(${200 * speed}px)`] 
    }),
    { target: element as Element, offset: ['start end', 'end start'] }
  );
}

/**
 * Hover lift effect (compositor-friendly)
 * Best for: cards, buttons, interactive elements
 */
export function hoverLift(selector: string): void {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
      animate(
        element,
        { transform: 'translateY(-4px) scale(1.01)' },
        { duration: 0.2 }
      );
    });

    element.addEventListener('mouseleave', () => {
      animate(
        element,
        { transform: 'translateY(0px) scale(1)' },
        { duration: 0.2 }
      );
    });
  });
}

/**
 * Initialize all animations for a page
 * Call this at the end of each page's script
 */
export function initPageAnimations(): void {
  // Fade in sections as they come into view
  fadeInOnScroll('section', { duration: 0.8 });
  
  // Animate section headings
  slideInLeft('h1, h2', { duration: 0.7 });
  
  // Stagger blog cards and project cards
  staggerIn('[data-blog-card]', { stagger: 0.15 });
  staggerIn('[data-project-card]', { stagger: 0.15 });
  
  // Add hover effects to cards
  hoverLift('[data-blog-card], [data-project-card]');
}
