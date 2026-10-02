'use client';

import { motion } from 'framer-motion';
import { LottieAnimation } from './LottieAnimation';

interface FloatingAnimationsProps {
  animations: any[];
  className?: string;
}

export function FloatingAnimations({ animations, className = '' }: FloatingAnimationsProps) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {animations.map((animation, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${20 + (index * 20)}%`,
            top: `${10 + (index * 15)}%`,
            width: '200px',
            height: '200px',
            opacity: 0.1
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <LottieAnimation
            animationData={animation}
            loop={true}
            autoplay={true}
            speed={0.3 + index * 0.1}
          />
        </motion.div>
      ))}
    </div>
  );
}
