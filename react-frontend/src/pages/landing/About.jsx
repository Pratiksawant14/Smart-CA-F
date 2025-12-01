import { Target, Users, Heart, Award, Linkedin, Github } from 'lucide-react'

export default function About() {
    const teamMembers = [
        {
            name: "Atharva Shirgaonkar",
            role: "Full Stack Developer",
            description: "Specialized in React, Node.js, and AI/ML integration",
            linkedin: "#",
            github: "#"
        },
        {
            name: "Shubham Sukhadare",
            role: "ML Engineer",
            description: "Expert in OCR, NLP, and Explainable AI systems",
            linkedin: "#",
            github: "#"
        },
        {
            name: "Ronak Suryawanshi",
            role: "UI/UX Designer",
            description: "Focused on creating intuitive financial interfaces",
            linkedin: "#",
            github: "#"
        }
    ]

    return (
        <div className="bg-white">
            {/* Header */}
            <section className="bg-gradient-to-br from-blue-50 to-primary-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        About
                        <span className="bg-gradient-to-r from-blue-600 to-primary-600 bg-clip-text text-transparent"> Smart CA</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Empowering gig workers with financial clarity through AI-powered insights
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6 font-medium">
                                <Target className="w-4 h-4 mr-2" />
                                Our Mission
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Financial Clarity for the Gig Economy
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                We believe that every gig worker, freelancer, and independent contractor deserves access to professional-grade financial tools—regardless of their location or income level.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                Smart CA was born from a simple observation: while traditional accounting software is built for established businesses, gig workers in Tier 2 and Tier 3 cities face unique challenges that existing tools don't address.
                            </p>
                            <p className="text-lg text-gray-600">
                                Our mission is to empower these workers with AI-powered insights that help them understand their finances, plan for volatility, and stay compliant—all without needing an expensive accountant.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
                                <div className="text-gray-600">Active Users</div>
                            </div>
                            <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-100">
                                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
                                <div className="text-gray-600">Accuracy Rate</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
                                <div className="text-gray-600">User Rating</div>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-100">
                                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
                                <div className="text-gray-600">Receipts Processed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we build
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
                            <p className="text-gray-600">
                                We believe in explainable AI. You should always know WHY our system makes a recommendation, not just WHAT it recommends.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-7 h-7 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
                            <p className="text-gray-600">
                                Professional financial tools shouldn't be limited to big businesses. We're making them accessible to everyone.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                <Heart className="w-7 h-7 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Empowerment</h3>
                            <p className="text-gray-600">
                                We don't just give you data—we give you insights and actionable recommendations that help you make better decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-6 font-medium">
                            <Users className="w-4 h-4 mr-2" />
                            Meet the Team
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            The People Behind Smart CA
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            A passionate team dedicated to solving real problems for gig workers
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <div className="h-48 bg-gradient-to-br from-blue-100 to-primary-100 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                        <Users className="w-12 h-12 text-gray-400" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                    <div className="text-primary-600 font-medium mb-3">{member.role}</div>
                                    <p className="text-gray-600 mb-4">{member.description}</p>
                                    <div className="flex space-x-3">
                                        <a
                                            href={member.linkedin}
                                            className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                        >
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                        <a
                                            href={member.github}
                                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                                        >
                                            <Github className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 to-primary-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Built with Cutting-Edge Technology
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        We leverage the latest in AI, machine learning, and cloud computing to deliver a seamless experience
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                            <div className="font-bold text-lg mb-1">React</div>
                            <div className="text-sm text-blue-100">Frontend</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                            <div className="font-bold text-lg mb-1">Python</div>
                            <div className="text-sm text-blue-100">Backend</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                            <div className="font-bold text-lg mb-1">Tesseract</div>
                            <div className="text-sm text-blue-100">OCR Engine</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                            <div className="font-bold text-lg mb-1">Supabase</div>
                            <div className="text-sm text-blue-100">Database</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
