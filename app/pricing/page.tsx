"use client";

import { Check, Database } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
            {/* Navigation */}
            <header className="sticky top-0 z-50 border-b border-border-dark bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Database className="w-5 h-5" />
                        </div>
                        <Link href="/" className="text-2xl font-bold tracking-tight">DevPulse</Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-10">
                        <Link href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">Product</Link>
                        <Link href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">Solutions</Link>
                        <Link href="#" className="text-white border-b-2 border-primary pb-1 font-medium">Pricing</Link>
                        <Link href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">Docs</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">Log in</Link>
                        <Link href="/login" className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Simple, scalable pricing</h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                        Scale your engineering intelligence with AI-powered GitHub insights. Choose the plan that fits your team's velocity.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className="text-sm font-medium text-slate-400">Monthly billing</span>
                        <div className="bg-[#16161a] border border-[#2a2a2e] p-1 rounded-full flex items-center relative w-16 h-8 cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                            <div className="absolute right-1 size-6 bg-primary rounded-full transition-transform"></div>
                        </div>
                        <span className="text-sm font-medium text-white flex items-center gap-2">
                            Yearly billing
                            <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-primary/30">Save 20%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {/* Starter Plan */}
                    <div className="bg-[#16161a] border border-[#2a2a2e] rounded-xl p-8 flex flex-col hover:border-slate-700 transition-colors">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">Starter</h3>
                            <p className="text-slate-400 text-sm">For individual developers tracking personal projects.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-5xl font-bold">$0</span>
                            <span className="text-slate-400">/mo</span>
                        </div>
                        <Button variant="outline" className="w-full py-6 border-[#2a2a2e] bg-transparent text-white rounded-lg font-bold mb-8 hover:bg-slate-800 transition-colors">
                            Start for free
                        </Button>
                        <ul className="space-y-4 flex-grow">
                            {['Public repositories only', 'Basic PR velocity metrics', 'Weekly email summaries', '1 Team member'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                    <Check className="text-primary w-5 h-5 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-[#16161a] border-2 border-primary rounded-xl p-8 flex flex-col relative scale-[1.02] md:scale-105 z-10 shadow-[0_0_20px_rgba(91,43,238,0.15),_0_0_40px_rgba(91,43,238,0.05)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
                            Most Popular
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">Pro</h3>
                            <p className="text-slate-400 text-sm">Advanced insights for high-performance teams.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-5xl font-bold">$49</span>
                            <span className="text-slate-400">/seat/mo</span>
                        </div>
                        <Button className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold mb-8 transition-colors shadow-lg shadow-primary/30">
                            Upgrade to Pro
                        </Button>
                        <ul className="space-y-4 flex-grow">
                            {['Unlimited private repos', 'AI Sentiment Analysis', 'Code quality trend tracking', 'Slack & Discord integrations', 'Priority support'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-white">
                                    <Check className="text-primary w-5 h-5 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-[#16161a] border border-[#2a2a2e] rounded-xl p-8 flex flex-col hover:border-slate-700 transition-colors">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                            <p className="text-slate-400 text-sm">Governance and scale for large organizations.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-5xl font-bold">Custom</span>
                        </div>
                        <Button variant="outline" className="w-full py-6 border-[#2a2a2e] text-white bg-transparent rounded-lg font-bold mb-8 hover:bg-slate-800 transition-colors">
                            Contact Sales
                        </Button>
                        <ul className="space-y-4 flex-grow">
                            {['Everything in Pro', 'SAML Single Sign-On (SSO)', 'Custom data retention', 'Dedicated Success Manager', 'Custom SLA & Onboarding'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                    <Check className="text-primary w-5 h-5 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#2a2a2e] py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="size-6 bg-primary rounded flex items-center justify-center text-[10px] text-white font-bold">DP</div>
                        <span className="text-slate-400 text-sm">© 2024 DevPulse Intelligence Inc. All rights reserved.</span>
                    </div>
                    <div className="flex gap-8 text-sm text-slate-500">
                        <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
                        <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
                        <Link className="hover:text-white transition-colors" href="#">Status</Link>
                        <Link className="hover:text-white transition-colors" href="#">Security</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
