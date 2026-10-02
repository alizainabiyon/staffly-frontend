'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Building, DollarSign, UserCheck, Wallet, Calendar, BarChart3, Settings } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Payroll Management",
      description: "Complete employee management, salary processing, attendance tracking, and loan management with automated calculations.",
      benefits: ["Employee Records", "Salary Slips", "Attendance Tracking", "Loan Management"]
    },
    {
      icon: Building,
      title: "CRM System",
      description: "Comprehensive customer relationship management with customer, vendor, and contractor management capabilities.",
      benefits: ["Customer Database", "Vendor Management", "Contractor Tracking", "Lead Management"]
    },
    {
      icon: DollarSign,
      title: "Finance Management",
      description: "Professional invoicing, quotations, vendor orders, and financial reporting with PDF generation.",
      benefits: ["Invoicing", "Quotations", "Vendor Orders", "Financial Reports"]
    },
    {
      icon: UserCheck,
      title: "Director Management",
      description: "Complete director information management with detailed profiles and relationship tracking.",
      benefits: ["Director Profiles", "Relationship Tracking", "Document Management", "Communication History"]
    },
    {
      icon: Wallet,
      title: "Till Management",
      description: "Real-time cash flow tracking, transaction management, and account balance monitoring.",
      benefits: ["Cash Flow Tracking", "Transaction Management", "Balance Monitoring", "Payment Processing"]
    },
    {
      icon: Calendar,
      title: "Daily Entries",
      description: "Comprehensive daily financial entry system with categorization and approval workflows.",
      benefits: ["Daily Transactions", "Entry Categorization", "Approval Workflows", "Financial Tracking"]
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description: "Detailed business analytics, financial reports, and performance insights with export capabilities.",
      benefits: ["Business Analytics", "Financial Reports", "Performance Insights", "Export Options"]
    },
    {
      icon: Settings,
      title: "System Settings",
      description: "Comprehensive system configuration, user management, and security settings.",
      benefits: ["System Configuration", "User Management", "Security Settings", "Backup Management"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything You Need to Manage Your Business
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From payroll to financial reporting, Staffly provides all the tools you need 
            to run a successful business in Pakistan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
