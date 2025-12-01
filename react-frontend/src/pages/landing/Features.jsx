import { Brain, TrendingDown, TrendingUp, Lightbulb, FileText, AlertCircle } from 'lucide-react'

export default function Features() {
    return (
        <div className="bg-white">
            {/* Header */}
            <section className="bg-gradient-to-br from-blue-50 to-primary-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Powerful Features for
                        <span className="bg-gradient-to-r from-blue-600 to-primary-600 bg-clip-text text-transparent"> Smart Finance</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover how our cutting-edge technology transforms financial management for gig workers
                    </p>
                </div>
            </section>

            {/* The Smart Engine */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6 font-medium">
                                <Brain className="w-4 h-4 mr-2" />
                                The Smart Engine
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Intelligent Receipt Processing
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Our Smart Engine combines the power of <strong>Tesseract OCR</strong> and <strong>Random Forest Machine Learning</strong> to automatically extract and categorize your receipts with incredible accuracy.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Tesseract OCR</h3>
                                        <p className="text-gray-600">
                                            Advanced optical character recognition extracts merchant name, date, amount, and line items from any receipt format.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <Brain className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Random Forest Categorization</h3>
                                        <p className="text-gray-600">
                                            Machine learning model trained on thousands of transactions automatically categorizes expenses (Food, Transport, Utilities, etc.) with 95%+ accuracy.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <Lightbulb className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Smart Learning</h3>
                                        <p className="text-gray-600">
                                            The system learns from your corrections and improves categorization accuracy over time, adapting to your unique spending patterns.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-primary-50 p-8 rounded-2xl border border-blue-100">
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="text-sm text-gray-500 mb-2">Receipt Analysis</div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-gray-700">Merchant</span>
                                        <span className="font-semibold text-gray-900">Zomato</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-gray-700">Amount</span>
                                        <span className="font-semibold text-gray-900">₹470.00</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-gray-700">Date</span>
                                        <span className="font-semibold text-gray-900">Nov 23, 2025</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-700">Category</span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            Food & Dining
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <div className="text-xs text-gray-500 mb-1">Confidence Score</div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-blue-600 to-primary-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                                    </div>
                                    <div className="text-right text-xs text-gray-600 mt-1">96% Accurate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Advisor */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="bg-white p-8 rounded-2xl shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Income Volatility Detection</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-start">
                                            <TrendingDown className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                                            <div>
                                                <div className="font-semibold text-red-900 mb-1">Income Drought Detected</div>
                                                <div className="text-sm text-red-700">
                                                    Your income has dropped 45% below your 3-month average. Consider reducing discretionary spending.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-start">
                                            <TrendingUp className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                                            <div>
                                                <div className="font-semibold text-yellow-900 mb-1">Income Spike Alert</div>
                                                <div className="text-sm text-yellow-700">
                                                    Unusual income spike detected (+120%). Remember to set aside 30% for taxes.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start">
                                            <Lightbulb className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                                            <div>
                                                <div className="font-semibold text-blue-900 mb-1">Smart Recommendation</div>
                                                <div className="text-sm text-blue-700">
                                                    Based on your income pattern, we recommend maintaining a 2-month emergency fund of ₹45,000.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-6 font-medium">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                The Advisor
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Income Volatility Analysis
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Gig workers face unique challenges with irregular income. Our Smart Advisor continuously monitors your cash flow and alerts you to potential problems before they become critical.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Drought Detection</h3>
                                        <p className="text-gray-600">
                                            Identifies when your income falls significantly below your average, helping you prepare for lean periods.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <TrendingUp className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Spike Alerts</h3>
                                        <p className="text-gray-600">
                                            Warns you about unusual income spikes and reminds you to set aside money for taxes and savings.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <Lightbulb className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Proactive Guidance</h3>
                                        <p className="text-gray-600">
                                            Provides actionable recommendations based on your unique income patterns and spending habits.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explainable AI */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6 font-medium">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Explainable AI (XAI)
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Transparent Risk Assessment
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Unlike traditional "black box" AI, our Explainable AI system tells you exactly <strong>WHY</strong> your audit risk score is high and provides clear, actionable steps to reduce it.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <Brain className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">SHAP Values</h3>
                                        <p className="text-gray-600">
                                            Uses SHapley Additive exPlanations to break down exactly which factors contribute to your risk score.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Plain English Explanations</h3>
                                        <p className="text-gray-600">
                                            No jargon. Just clear, understandable explanations of what's affecting your score and why.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <Lightbulb className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Actionable Insights</h3>
                                        <p className="text-gray-600">
                                            Get specific recommendations on how to improve your compliance and reduce audit risk.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-100">
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Audit Risk Score</span>
                                        <span className="text-2xl font-bold text-red-600">72/100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div className="bg-gradient-to-r from-yellow-500 to-red-500 h-3 rounded-full" style={{ width: '72%' }}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">High Risk - Action Required</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-sm font-semibold text-gray-900 mb-2">Risk Factors:</div>
                                    <div className="flex items-center justify-between py-2 border-b">
                                        <span className="text-sm text-gray-700">Missing receipts</span>
                                        <span className="text-sm font-semibold text-red-600">+35 points</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b">
                                        <span className="text-sm text-gray-700">Irregular categorization</span>
                                        <span className="text-sm font-semibold text-orange-600">+22 points</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b">
                                        <span className="text-sm text-gray-700">High cash transactions</span>
                                        <span className="text-sm font-semibold text-yellow-600">+15 points</span>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-start">
                                        <Lightbulb className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-blue-900">
                                            <strong>Recommendation:</strong> Upload missing receipts for transactions over ₹500 to reduce your risk score by ~30 points.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
