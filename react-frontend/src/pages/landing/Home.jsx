import { Link } from 'react-router-dom'
import { Scan, TrendingUp, Shield, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

export default function Home() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-primary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6 font-medium">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI-Powered Financial Intelligence
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Smart CA: AI-Powered
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-primary-600 bg-clip-text text-transparent">
                                Financial Assistant
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
                            Automated Bookkeeping & Explainable Insights for Freelancers.
                            <br />
                            Built for the Gig Economy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/dashboard"
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-primary-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
                            >
                                Launch Dashboard
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/features"
                                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                            >
                                Explore Features
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </section>

            {/* Value Propositions */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Smart CA?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed specifically for gig workers and freelancers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: OCR Automation */}
                        <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Scan className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                OCR Automation
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Snap a photo of your receipt and let our AI extract, categorize, and organize your transactions automatically using advanced Tesseract OCR and Random Forest ML.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Instant receipt scanning</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Auto-categorization</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">99% accuracy rate</span>
                                </li>
                            </ul>
                        </div>

                        {/* Card 2: Volatility Analysis */}
                        <div className="group bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Volatility Analysis
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Detect income spikes and droughts before they become problems. Our Smart Advisor analyzes your cash flow patterns and alerts you to potential issues.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Income spike detection</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Drought warnings</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Predictive insights</span>
                                </li>
                            </ul>
                        </div>

                        {/* Card 3: Audit Risk Protection */}
                        <div className="group bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Audit Risk Protection
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Explainable AI tells you exactly WHY your risk score is high and what to do about it. Stay compliant and audit-ready with transparent insights.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">XAI explanations</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Risk score breakdown</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Compliance guidance</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 to-primary-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Take Control of Your Finances?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of freelancers who trust Smart CA for their financial management
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                    >
                        Get Started Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
