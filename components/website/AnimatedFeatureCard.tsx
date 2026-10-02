'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, LucideIcon } from 'lucide-react';
import { LottieAnimation } from './LottieAnimation';
import { useState } from 'react';

interface AnimatedFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  animationData?: any;
  index: number;
}

export function AnimatedFeatureCard({
  icon: Icon,
  title,
  description,
  benefits,
  animationData,
  index
}: AnimatedFeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <CardHeader>
          <div className="relative">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            {animationData && (
              <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <LottieAnimation
                  animationData={animationData}
                  loop={true}
                  autoplay={isHovered}
                  speed={1.5}
                  width={64}
                  height={64}
                />
              </div>
            )}
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-slate-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.ul 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            {benefits.map((benefit, benefitIndex) => (
              <motion.li 
                key={benefitIndex} 
                className="flex items-center text-sm text-slate-600"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 + benefitIndex * 0.05 }}
              >
                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                {benefit}
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
