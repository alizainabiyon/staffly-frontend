'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Users, Building, DollarSign, UserCheck, Wallet, Calendar, BarChart3, Settings } from 'lucide-react';
import { AnimatedFeatureCard } from './AnimatedFeatureCard';

interface EnhancedFeaturesSectionProps {
  payrollAnimation?: any;
  crmAnimation?: any;
  financeAnimation?: any;
  directorAnimation?: any;
  tillAnimation?: any;
  dailyEntriesAnimation?: any;
  reportsAnimation?: any;
  settingsAnimation?: any;
}

export function EnhancedFeaturesSection({
  payrollAnimation,
  crmAnimation,
  financeAnimation,
  directorAnimation,
  tillAnimation,
  dailyEntriesAnimation,
  reportsAnimation,
  settingsAnimation
}: EnhancedFeaturesSectionProps) {
  const features = [
    {
      icon: Users,
      title: "Payroll Management",
      description: "Complete employee management, salary processing, attendance tracking, and loan management with automated calculations.",
      benefits: ["Employee Records", "Salary Slips", "Attendance Tracking", "Loan Management"],
      animation: payrollAnimation
    },
    {
      icon: Building,
      title: "CRM System",
      description: "Comprehensive customer relationship management with customer, vendor, and contractor management capabilities.",
      benefits: ["Customer Database", "Vendor Management", "Contractor Tracking", "Lead Management"],
      animation: crmAnimation
    },
    {
      icon: DollarSign,
      title: "Finance Management",
      description: "Professional invoicing, quotations, vendor orders, and financial reporting with PDF generation.",
      benefits: ["Invoicing", "Quotations", "Vendor Orders", "Financial Reports"],
      animation: financeAnimation
    },
    {
      icon: UserCheck,
      title: "Director Management",
      description: "Complete director information management with detailed profiles and relationship tracking.",
      benefits: ["Director Profiles", "Relationship Tracking", "Document Management", "Communication History"],
      animation: directorAnimation
    },
    {
      icon: Wallet,
      title: "Till Management",
      description: "Real-time cash flow tracking, transaction management, and account balance monitoring.",
      benefits: ["Cash Flow Tracking", "Transaction Management", "Balance Monitoring", "Payment Processing"],
      animation: tillAnimation
    },
    {
      icon: Calendar,
      title: "Daily Entries",
      description: "Comprehensive daily financial entry system with categorization and approval workflows.",
      benefits: ["Daily Transactions", "Entry Categorization", "Approval Workflows", "Financial Tracking"],
      animation: dailyEntriesAnimation
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description: "Detailed business analytics, financial reports, and performance insights with export capabilities.",
      benefits: ["Business Analytics", "Financial Reports", "Performance Insights", "Export Options"],
      animation: reportsAnimation
    },
    {
      icon: Settings,
      title: "System Settings",
      description: "Comprehensive system configuration, user management, and security settings.",
      benefits: ["System Configuration", "User Management", "Security Settings", "Backup Management"],
      animation: settingsAnimation
    }
  ];

  return (
    <section id="features" className="py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Everything You Need to Manage Your Business
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            From payroll to financial reporting, Staffly provides all the tools you need 
            to run a successful business in Pakistan.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <AnimatedFeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              benefits={feature.benefits}
              animationData={feature.animation}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
