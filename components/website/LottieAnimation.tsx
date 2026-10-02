'use client';

import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LottieAnimationProps {
  animationData: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  width?: number | string;
  height?: number | string;
}

export function LottieAnimation({
  animationData,
  className = '',
  loop = true,
  autoplay = true,
  speed = 1,
  width = '100%',
  height = '100%'
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (containerRef.current && animationData) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      });

      if (animationRef.current) {
        animationRef.current.setSpeed(speed);
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationData, loop, autoplay, speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, height }}
    />
  );
}
