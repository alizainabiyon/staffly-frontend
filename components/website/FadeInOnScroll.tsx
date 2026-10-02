'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface FadeInOnScrollProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function FadeInOnScroll({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '' 
}: FadeInOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const directionVariants = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 }
  };

  const animateVariants = {
    up: { y: 0, opacity: 1 },
    down: { y: 0, opacity: 1 },
    left: { x: 0, opacity: 1 },
    right: { x: 0, opacity: 1 }
  };

  return (
    <motion.div
      ref={ref}
      initial={directionVariants[direction]}
      animate={isInView ? animateVariants[direction] : directionVariants[direction]}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
