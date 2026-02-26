"use client";

import { useState, useEffect } from "react";
import { Check, Database, Minus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get("canceled")) {
            setIsCanceled(true);
        }
    }, []);

    // TODO: Replace with real organization ID from auth context
    const currentOrgId = "temp-org-id";

    async function upgradeToPro(interval: "monthly" | "yearly") {
        setIsLoading(true);
        try {
            const res = await fetch("/api/billing/create-checkout-session", {
                method: "POST",
                body: JSON.stringify({
                    billingInterval: interval,
                    organizationId: currentOrgId,
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Failed to create session:", data);
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setIsLoading(false);
        }
    }

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
                    {isCanceled && (
                        <div className="mb-8 w-fit mx-auto bg-amber-500/10 border border-amber-500/20 text-amber-500 px-6 py-3 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">Checkout was canceled. You can try again when you're ready.</p>
                        </div>
                    )}
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Simple, scalable pricing</h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                        Scale your engineering intelligence with AI-powered GitHub insights. Choose the plan that fits your team's velocity.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-3">
                        <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
                        <div
                            className="bg-[#16161a] border border-[#2a2a2e] p-1 rounded-full flex items-center relative w-16 h-8 cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:border-slate-600 transition-colors"
                            onClick={() => setIsYearly(!isYearly)}
                        >
                            <div className={`absolute size-6 bg-primary rounded-full transition-all duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`}></div>
                        </div>
                        <span className={`text-sm font-medium flex items-center gap-2 ${isYearly ? 'text-white' : 'text-slate-400'}`}>
                            Yearly
                            <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-primary/30">Save 20%</span>
                        </span>
                    </div>
                    <p className="text-sm font-medium text-slate-400/80 mb-8">$49/mo → $470 per year</p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {/* Starter Plan */}
                    <div className="bg-[#16161a] border border-[#2a2a2e] rounded-xl p-8 flex flex-col hover:border-slate-700 transition-colors shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">Starter</h3>
                            <p className="text-slate-400 text-sm">For individual developers exploring engineering insights.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-5xl font-bold">$0</span>
                            <span className="text-slate-400">/mo</span>
                        </div>
                        <Button variant="outline" className="w-full py-6 border-[#2a2a2e] bg-transparent text-white rounded-lg font-bold mb-8 hover:bg-slate-800 transition-colors">
                            Start for free
                        </Button>
                        <ul className="space-y-4 flex-grow mb-8">
                            {[
                                '1 repository',
                                'Public repos only',
                                'PR velocity & size metrics',
                                'Weekly AI summary',
                                '1 team member',
                                'Community support'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                    <Check className="text-primary w-5 h-5 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-auto pt-6 border-t border-[#2a2a2e]">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Designed for personal projects and experimentation.
                            </p>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-[#16161a] border-2 border-primary rounded-xl p-8 flex flex-col relative scale-[1.02] md:scale-105 z-10 shadow-[0_0_30px_rgba(91,43,238,0.15),_0_0_60px_rgba(91,43,238,0.05)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-sm">
                            Most Popular
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">Pro – For Growing Engineering Teams</h3>
                            <p className="text-slate-400 text-sm">Advanced insights for high-performance teams.</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-5xl font-bold">{isYearly ? '$470' : '$49'}</span>
                            <span className="text-slate-400">{isYearly ? '/yr per org' : '/mo per org'}</span>
                        </div>
                        <Button
                            className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold mb-3 transition-colors shadow-lg shadow-primary/30 disabled:opacity-50"
                            onClick={() => upgradeToPro(isYearly ? "yearly" : "monthly")}
                            disabled={isLoading}
                        >
                            {isLoading ? "Starting checkout..." : "Start Pro Trial"}
                        </Button>
                        <p className="text-center text-xs text-slate-400 mb-8">Cancel anytime. No long-term contracts.</p>

                        <div className="flex-grow space-y-8 mb-8">
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-lg">🚀</span> Engineering Intelligence
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        'AI PR risk analysis',
                                        'Code quality trend tracking',
                                        'Contributor discipline insights',
                                        'Historical PR analytics'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                            <Check className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-lg">🔐</span> Collaboration
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        'Unlimited private repositories',
                                        'Slack & Discord alerts',
                                        'Priority support'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                            <Check className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-auto pt-6 border-t border-[#2a2a2e]">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Recommended for teams 3–15 engineers.
                            </p>
                        </div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-[#16161a] border border-[#2a2a2e] rounded-xl p-8 flex flex-col hover:border-slate-700 transition-colors shadow-sm">
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
                        <div className="flex-grow mb-8">
                            <p className="text-sm font-medium text-white mb-4">Includes all Pro features plus:</p>
                            <ul className="space-y-4">
                                {[
                                    'SAML SSO',
                                    'Role-based access controls',
                                    'Custom data retention policies',
                                    'Dedicated Success Manager',
                                    'Custom SLA & onboarding',
                                    'Volume-based pricing'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                        <Check className="text-primary w-5 h-5 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-auto pt-6 border-t border-[#2a2a2e]">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Designed for organizations with compliance and governance requirements.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div className="max-w-4xl mx-auto mb-24 bg-[#16161a] border border-[#2a2a2e] rounded-xl overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-[#2a2a2e] text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-white">Compare plans</h3>
                            <p className="text-slate-400 mt-1">Find the right level of insight for your team's needs.</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-[#2a2a2e] bg-[#1a1a1f]">
                                    <th className="p-5 font-semibold text-slate-300 w-1/3">Features</th>
                                    <th className="p-5 font-semibold text-white text-center w-[22%]">Starter</th>
                                    <th className="p-5 font-semibold text-primary text-center w-[22%]">Pro</th>
                                    <th className="p-5 font-semibold text-white text-center w-[22%]">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-[#2a2a2e]">
                                {[
                                    { name: "Repositories", starter: "1", pro: "Unlimited", ent: "Unlimited" },
                                    { name: "Private repos", starter: false, pro: true, ent: true },
                                    { name: "AI Advisor", starter: "Weekly Summary", pro: "Risk Analysis", ent: "Custom Models" },
                                    { name: "Historical analytics", starter: false, pro: true, ent: true },
                                    { name: "Slack integration", starter: false, pro: true, ent: true },
                                    { name: "SSO", starter: false, pro: false, ent: true },
                                    { name: "Support level", starter: "Community", pro: "Priority", ent: "Dedicated" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-[#1a1a1f]/50 transition-colors">
                                        <td className="p-5 text-slate-300 font-medium">{row.name}</td>
                                        <td className="p-5 text-center text-slate-400">
                                            {typeof row.starter === 'boolean' ? (
                                                row.starter ? <Check className="w-5 h-5 text-primary mx-auto" /> : <Minus className="w-5 h-5 text-slate-600 mx-auto" />
                                            ) : row.starter}
                                        </td>
                                        <td className="p-5 text-center text-white font-medium bg-primary/[0.03]">
                                            {typeof row.pro === 'boolean' ? (
                                                row.pro ? <Check className="w-5 h-5 text-primary mx-auto" /> : <Minus className="w-5 h-5 text-slate-600 mx-auto" />
                                            ) : row.pro}
                                        </td>
                                        <td className="p-5 text-center text-slate-400">
                                            {typeof row.ent === 'boolean' ? (
                                                row.ent ? <Check className="w-5 h-5 text-primary mx-auto" /> : <Minus className="w-5 h-5 text-slate-600 mx-auto" />
                                            ) : row.ent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="text-center mb-10">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Trusted by fast-moving engineering teams</p>
                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="text-2xl font-bold font-serif text-white">Acme Corp</div>
                        <div className="text-xl font-black tracking-tighter text-white">GlobalTech</div>
                        <div className="text-2xl font-semibold italic text-white flex items-center gap-2">
                            <Database className="w-6 h-6" /> Innovate.io
                        </div>
                        <div className="text-xl font-bold flex items-center gap-2 text-white">
                            <span className="w-6 h-6 rounded bg-white text-black flex items-center justify-center text-xs">NL</span> NextLevel
                        </div>
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
