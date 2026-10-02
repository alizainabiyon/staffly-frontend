'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building, 
  DollarSign, 
  FileText, 
  BarChart3, 
  Settings,
  Wallet,
  Calendar,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  Award
} from 'lucide-react';

export function SystemCapabilities() {
  const capabilities = [
    {
      category: "Employee Management",
      icon: Users,
      features: [
        "Complete employee profiles with documents",
        "Automated salary calculations",
        "Attendance tracking with biometric integration",
        "Leave management and approval workflows",
        "Loan and advance management",
        "Performance tracking and reviews"
      ],
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      category: "Financial Operations",
      icon: DollarSign,
      features: [
        "Professional invoicing with PDF generation",
        "Quotation management and tracking",
        "Vendor order processing",
        "Payment tracking and reconciliation",
        "Multi-currency support",
        "Tax calculations and compliance"
      ],
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      category: "Customer Relations",
      icon: Building,
      features: [
        "Comprehensive customer database",
        "Vendor and contractor management",
        "Lead tracking and conversion",
        "Communication history",
        "Document management",
        "Relationship analytics"
      ],
      color: "bg-purple-50 border-purple-200 text-purple-800"
    },
    {
      category: "Business Intelligence",
      icon: BarChart3,
      features: [
        "Real-time dashboard analytics",
        "Custom report generation",
        "Financial performance insights",
        "Employee productivity metrics",
        "Revenue and expense tracking",
        "Export to PDF, Excel, CSV"
      ],
      color: "bg-orange-50 border-orange-200 text-orange-800"
    },
    {
      category: "Cash Management",
      icon: Wallet,
      features: [
        "Real-time till management",
        "Transaction categorization",
        "Cash flow monitoring",
        "Bank reconciliation",
        "Payment method tracking",
        "Daily entry management"
      ],
      color: "bg-cyan-50 border-cyan-200 text-cyan-800"
    },
    {
      category: "System Administration",
      icon: Settings,
      features: [
        "Role-based access control",
        "User management and permissions",
        "System configuration",
        "Backup and recovery",
        "Audit logging",
        "Security settings"
      ],
      color: "bg-gray-50 border-gray-200 text-gray-800"
    }
  ];

  const stats = [
    { label: "Modules", value: "8+", icon: Settings },
    { label: "Features", value: "100+", icon: CheckCircle },
    { label: "Reports", value: "50+", icon: BarChart3 },
    { label: "Integrations", value: "20+", icon: Zap }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Award className="w-4 h-4 mr-2" />
            Comprehensive Business Solution
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything Your Business Needs
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From small startups to large enterprises, Staffly provides all the tools 
            you need to manage your business operations efficiently and professionally.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <capability.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{capability.category}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {capability.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Transform Your Business Operations?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of Pakistani businesses that have already streamlined their operations 
              with Staffly comprehensive business management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trusted by 500+ Businesses
              </Badge>
              <Badge className="bg-green-50 text-green-800 border-green-200 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Bank-Grade Security
              </Badge>
              <Badge className="bg-blue-50 text-blue-800 border-blue-200 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                24/7 Support
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
