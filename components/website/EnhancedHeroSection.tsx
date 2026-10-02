'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Building2, Users, TrendingUp, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LottieAnimation } from './LottieAnimation';
import { AnimatedCounter } from './AnimatedCounter';
import { useState, useEffect } from 'react';

interface EnhancedHeroSectionProps {
  onGetStarted: () => void;
  payrollAnimation?: any;
  crmAnimation?: any;
  financeAnimation?: any;
}

export function EnhancedHeroSection({ 
  onGetStarted, 
  payrollAnimation,
  crmAnimation,
  financeAnimation 
}: EnhancedHeroSectionProps) {
  const router = useRouter();
  const [currentAnimation, setCurrentAnimation] = useState(0);
  
  const animations = [payrollAnimation, crmAnimation, financeAnimation].filter(Boolean);

  useEffect(() => {
    if (animations.length > 0) {
      const interval = setInterval(() => {
        setCurrentAnimation((prev) => (prev + 1) % animations.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [animations.length]);

  const stats = [
    { 
      label: "Active Businesses", 
      value: 500, 
      suffix: "+", 
      icon: Building2 
    },
    { 
      label: "Employees Managed", 
      value: 10000, 
      suffix: "+", 
      icon: Users 
    },
    { 
      label: "Transactions Processed", 
      value: 1000000, 
      suffix: "+", 
      icon: TrendingUp 
    },
    { 
      label: "Customer Satisfaction", 
      value: 98, 
      suffix: "%", 
      icon: Star 
    }
  ];

  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 opacity-10">
          {animations[currentAnimation] && (
            <LottieAnimation
              animationData={animations[currentAnimation]}
              loop={true}
              autoplay={true}
              speed={0.5}
            />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-300">
              🇵🇰 Made for Pakistani Businesses
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-slate-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Complete Business
            <motion.span 
              className="text-primary block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Management Solution
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Streamline your business operations with Pakistans most comprehensive SaaS platform. 
            Manage payroll, CRM, finance, and more with professional-grade tools designed for Pakistani enterprises.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3 group"
              onClick={onGetStarted}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 hover:bg-slate-50 transition-colors duration-300"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  duration={2}
                  className="group-hover:text-primary transition-colors duration-300"
                />
              </div>
              <div className="text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
