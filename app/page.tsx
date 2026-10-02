"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Building,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  Wallet,
  Calendar,
  Shield,
  Zap,
  Globe,
  Star,
  TrendingUp,
  Clock,
  Award,
  Target,
  PieChart,
  CreditCard,
  Receipt,
  UserCheck,
  Building2,
  Calculator,
  FileSpreadsheet,
  Bell,
  Lock,
  Smartphone,
  Cloud,
  Headphones,
} from "lucide-react";
import { StructuredData } from "@/components/website/StructuredData";
import { EnhancedHeroSection } from "@/components/website/EnhancedHeroSection";
import { EnhancedFeaturesSection } from "@/components/website/EnhancedFeaturesSection";
import { EnhancedPricingSection } from "@/components/website/EnhancedPricingSection";
import { FloatingAnimations } from "@/components/website/FloatingAnimations";
import { ModulesShowcase } from "@/components/website/ModulesShowcase";
import LanguageSelector from "@/components/website/LanguageSelector";
// Import animation data
import payrollAnimation from "@/lib/website-gif/Payroll.json";
import crmAnimation from "@/lib/website-gif/CRM.json";
import invoiceAnimation from "@/lib/website-gif/Invoice.json";
import quotationAnimation from "@/lib/website-gif/Quotation.json";
import dailyEntriesAnimation from "@/lib/website-gif/Daily Enteries.json";
import directorAnimation from "@/lib/website-gif/Director.json";
import attendanceAnimation from "@/lib/website-gif/Attendence.json";
import { useTranslations } from "next-intl";
export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("HomePage");
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const features = [
    {
      icon: Users,
      title: "Payroll Management",
      description:
        "Complete employee management, salary processing, attendance tracking, and loan management with automated calculations.",
      benefits: [
        "Employee Records",
        "Salary Slips",
        "Attendance Tracking",
        "Loan Management",
      ],
    },
    {
      icon: Building,
      title: "CRM System",
      description:
        "Comprehensive customer relationship management with customer, vendor, and contractor management capabilities.",
      benefits: [
        "Customer Database",
        "Vendor Management",
        "Contractor Tracking",
        "Lead Management",
      ],
    },
    {
      icon: DollarSign,
      title: "Finance Management",
      description:
        "Professional invoicing, quotations, vendor orders, and financial reporting with PDF generation.",
      benefits: [
        "Invoicing",
        "Quotations",
        "Vendor Orders",
        "Financial Reports",
      ],
    },
    {
      icon: UserCheck,
      title: "Director Management",
      description:
        "Complete director information management with detailed profiles and relationship tracking.",
      benefits: [
        "Director Profiles",
        "Relationship Tracking",
        "Document Management",
        "Communication History",
      ],
    },
    {
      icon: Wallet,
      title: "Till Management",
      description:
        "Real-time cash flow tracking, transaction management, and account balance monitoring.",
      benefits: [
        "Cash Flow Tracking",
        "Transaction Management",
        "Balance Monitoring",
        "Payment Processing",
      ],
    },
    {
      icon: Calendar,
      title: "Daily Entries",
      description:
        "Comprehensive daily financial entry system with categorization and approval workflows.",
      benefits: [
        "Daily Transactions",
        "Entry Categorization",
        "Approval Workflows",
        "Financial Tracking",
      ],
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description:
        "Detailed business analytics, financial reports, and performance insights with export capabilities.",
      benefits: [
        "Business Analytics",
        "Financial Reports",
        "Performance Insights",
        "Export Options",
      ],
    },
    {
      icon: Settings,
      title: "System Settings",
      description:
        "Comprehensive system configuration, user management, and security settings.",
      benefits: [
        "System Configuration",
        "User Management",
        "Security Settings",
        "Backup Management",
      ],
    },
  ];

  const stats = [
    { label: "Active Businesses", value: "500+", icon: Building2 },
    { label: "Employees Managed", value: "10,000+", icon: Users },
    { label: "Transactions Processed", value: "1M+", icon: TrendingUp },
    { label: "Customer Satisfaction", value: "98%", icon: Star },
  ];

  const testimonials = [
    {
      name: "Ahmed Khan",
      company: "Tech Solutions Ltd",
      role: "CEO",
      content:
        "Staffly has revolutionized our business operations. The payroll system alone saved us 20 hours per month.",
      rating: 5,
    },
    {
      name: "Fatima Ali",
      company: "Retail Plus",
      role: "Finance Manager",
      content:
        "The comprehensive reporting and analytics help us make better business decisions every day.",
      rating: 5,
    },
    {
      name: "Muhammad Hassan",
      company: "Manufacturing Co",
      role: "Operations Director",
      content:
        "Excellent customer support and the system is incredibly user-friendly. Highly recommended!",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Rs 5,000",
      period: "/month",
      description: "Perfect for small businesses",
      features: [
        "Up to 10 employees",
        "Basic payroll management",
        "CRM system",
        "Basic reporting",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "Rs 15,000",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 50 employees",
        "Complete payroll system",
        "Advanced CRM",
        "Finance management",
        "Till management",
        "Advanced reporting",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited employees",
        "All features included",
        "Custom integrations",
        "Dedicated support",
        "On-premise deployment",
        "Custom reporting",
        "24/7 support",
      ],
      popular: false,
    },
  ];

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <StructuredData />
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{t('title')}</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-600 hover:text-primary transition-colors"
              >
                {t('navbar.features')}
              </a>
              <a
                href="#modules"
                className="text-slate-600 hover:text-primary transition-colors"
              >
                {t('navbar.modules')}
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-primary transition-colors"
              >
                {t('navbar.pricing')}
              </a>
              <a
                href="#testimonials"
                className="text-slate-600 hover:text-primary transition-colors"
              >
                {t('navbar.reviews')}
              </a>
              <Button
                onClick={() => router.push("/auth/login")}
                className="bg-primary hover:bg-primary/90"
              >
                {t('navbar.login')}
              </Button>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section with Animations */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <FloatingAnimations
          animations={[payrollAnimation, crmAnimation, invoiceAnimation]}
          className="opacity-20"
        />
        <EnhancedHeroSection
          onGetStarted={handleGetStarted}
          payrollAnimation={payrollAnimation}
          crmAnimation={crmAnimation}
          financeAnimation={invoiceAnimation}
        />
      </section>

      {/* Enhanced Features Section with Animations */}
      <section id="features" className="py-20 bg-white">
        <EnhancedFeaturesSection
          payrollAnimation={payrollAnimation}
          crmAnimation={crmAnimation}
          financeAnimation={invoiceAnimation}
          directorAnimation={directorAnimation}
          tillAnimation={quotationAnimation}
          dailyEntriesAnimation={dailyEntriesAnimation}
          reportsAnimation={attendanceAnimation}
          settingsAnimation={payrollAnimation}
        />
      </section>

      {/* Comprehensive Modules Showcase */}
      <section id="modules" className="py-22">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <Target className="w-4 h-4 mr-2" />
              Complete Business Solution
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Every Module You Need to
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                Run Your Business
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive suite of business management tools. Each
              module is designed to work seamlessly together, providing you with
              complete control over every aspect of your business operations.
            </p>
          </motion.div>
        </div>

        <ModulesShowcase
          payrollAnimation={payrollAnimation}
          crmAnimation={crmAnimation}
          invoiceAnimation={invoiceAnimation}
          quotationAnimation={quotationAnimation}
          dailyEntriesAnimation={dailyEntriesAnimation}
          directorAnimation={directorAnimation}
          attendanceAnimation={attendanceAnimation}
        />
      </section>

      {/* Why Choose Staffly */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Staffly?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built specifically for Pakistani businesses with local compliance
              and features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Pakistani Compliance",
                description:
                  "Built with Pakistani tax laws, labor laws, and business regulations in mind.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Optimized for speed with modern technology stack and cloud infrastructure.",
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description:
                  "Your data is protected with enterprise-level security and encryption.",
              },
              {
                icon: Smartphone,
                title: "Mobile Responsive",
                description:
                  "Access your business data anywhere, anytime with our mobile-optimized interface.",
              },
              {
                icon: Cloud,
                title: "Cloud-Based",
                description:
                  "No installation required. Access from anywhere with automatic backups.",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description:
                  "Dedicated support team available to help you succeed with your business.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join hundreds of Pakistani businesses that trust Staffly for their
              operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-4 italic">
                      {" "}
                      {testimonial.content}{" "}
                    </p>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section with Animations */}
      <section id="pricing" className="py-20 bg-slate-50">
        <EnhancedPricingSection
          onGetStarted={handleGetStarted}
          pricingAnimation={invoiceAnimation}
        />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join hundreds of Pakistani businesses already using Staffly to
              streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3"
                onClick={handleGetStarted}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">Staffly</span>
              </div>
              <p className="text-slate-400 mb-4">
                Complete business management solution for Pakistani enterprises.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#modules"
                    className="hover:text-white transition-colors"
                  >
                    Modules
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>
              &copy; 2024 Staffly. All rights reserved. Made with ❤️ for
              Pakistani businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
