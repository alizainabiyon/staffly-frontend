'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Zap, Crown } from 'lucide-react';
import { LottieAnimation } from './LottieAnimation';

interface EnhancedPricingSectionProps {
  onGetStarted: () => void;
  pricingAnimation?: any;
}

export function EnhancedPricingSection({ 
  onGetStarted, 
  pricingAnimation 
}: EnhancedPricingSectionProps) {
  const pricingPlans = [
    {
      name: "Starter",
      price: "Rs 5,000",
      period: "/month",
      description: "Perfect for small businesses",
      icon: Star,
      features: [
        "Up to 10 employees",
        "Basic payroll management",
        "CRM system",
        "Basic reporting",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "Rs 15,000",
      period: "/month",
      description: "Ideal for growing businesses",
      icon: Zap,
      features: [
        "Up to 50 employees",
        "Complete payroll system",
        "Advanced CRM",
        "Finance management",
        "Till management",
        "Advanced reporting",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      icon: Crown,
      features: [
        "Unlimited employees",
        "All features included",
        "Custom integrations",
        "Dedicated support",
        "On-premise deployment",
        "Custom reporting",
        "24/7 support"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Animation */}
      {pricingAnimation && (
        <div className="absolute top-10 right-10 w-64 h-64 opacity-5">
          <LottieAnimation
            animationData={pricingAnimation}
            loop={true}
            autoplay={true}
            speed={0.5}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include core features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className={`h-full relative group transition-all duration-300 ${
                plan.popular 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:shadow-lg'
              }`}>
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Badge className="bg-primary text-white animate-pulse">
                      Most Popular
                    </Badge>
                  </motion.div>
                )}
                
                <CardHeader className="text-center">
                  <motion.div
                    className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <plan.icon className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                    {plan.name}
                  </CardTitle>
                  
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600">{plan.period}</span>
                  </motion.div>
                  
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <motion.ul 
                    className="space-y-3 mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 + featureIndex * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Button 
                      className={`w-full group ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'hover:bg-primary hover:text-white'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={onGetStarted}
                    >
                      Get Started
                      <motion.span
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
