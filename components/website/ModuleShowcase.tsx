'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LottieAnimation } from './LottieAnimation';
import { 
  Users, 
  Building, 
  DollarSign, 
  UserCheck, 
  Wallet, 
  Calendar, 
  BarChart3, 
  Settings,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  FileText,
  CreditCard,
  Clock,
  Target
} from 'lucide-react';

interface ModuleShowcaseProps {
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  animationData: any;
  icon: any;
  reverse?: boolean;
  stats?: { label: string; value: string; icon: any }[];
  demoFeatures?: { title: string; description: string; icon: any }[];
}

export function ModuleShowcase({
  title,
  description,
  features,
  benefits,
  animationData,
  icon: Icon,
  reverse = false,
  stats = [],
  demoFeatures = []
}: ModuleShowcaseProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-24 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
          
          {/* Animation Side */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`${reverse ? 'lg:col-start-2' : ''}`}
          >
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl transform rotate-3 scale-105"></div>
              
              {/* Animation container */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Lottie Animation */}
                <div className="h-80 w-full">
                  <LottieAnimation
                    animationData={animationData}
                    className="w-full h-full"
                    loop={true}
                    autoplay={true}
                  />
                </div>
                
                {/* Stats overlay */}
                {stats.length > 0 && (
                  <div className="absolute -bottom-4 left-4 right-4">
                    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <stat.icon className="w-4 h-4 text-blue-600 mr-1" />
                              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                            </div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className={`${reverse ? 'lg:col-start-1' : ''}`}
          >
            <div className="space-y-6">
              {/* Header */}
              <div>
                <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                  <Star className="w-4 h-4 mr-2" />
                  Complete Solution
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {title}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  Key Benefits
                </h3>
                <div className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Features */}
              {demoFeatures.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">What You will Get:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {demoFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                        <feature.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{feature.title}</p>
                          <p className="text-xs text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore {title}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
