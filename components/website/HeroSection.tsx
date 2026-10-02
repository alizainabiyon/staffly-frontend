'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const router = useRouter();

  const stats = [
    { label: "Active Businesses", value: "500+", icon: Building2 },
    { label: "Employees Managed", value: "10,000+", icon: Building2 },
    { label: "Transactions Processed", value: "1M+", icon: Building2 },
    { label: "Customer Satisfaction", value: "98%", icon: Building2 }
  ];

  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            🇵🇰 Made for Pakistani Businesses
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Complete Business
            <span className="text-primary block">Management Solution</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Streamline your business operations with Pakistans most comprehensive SaaS platform. 
            Manage payroll, CRM, finance, and more with professional-grade tools designed for Pakistani enterprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
              onClick={onGetStarted}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
