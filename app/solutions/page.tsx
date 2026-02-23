import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Rocket, CheckCircle2, ArrowRight, Users, Heart, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SolutionsPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden min-h-screen">
            <Navigation />

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="max-w-4xl mx-auto px-6 text-center mb-32 relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/20">
                        Solutions for Every Stage
                    </span>
                    <h2 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-8">
                        Engineering intelligence <br />
                        <span className="text-primary italic">tailored to your role.</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Unlock velocity and visibility with AI-powered insights designed specifically for your unique team structure and technical challenges.
                    </p>
                </section>

                {/* 1. For Startups */}
                <section className="relative max-w-7xl mx-auto px-6 mb-40">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(91,43,238,0.15)_0%,rgba(15,15,18,0)_70%)] translate-x-1/4"></div>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Rocket className="w-8 h-8" />
                                    <h3 className="text-2xl font-bold">For Startups</h3>
                                </div>
                                <h4 className="text-4xl font-extrabold tracking-tight leading-tight">Accelerate your speed <br />to market.</h4>
                                <p className="text-slate-500 italic text-lg leading-relaxed dark:text-slate-400">
                                    "Our development has plateaued and we don't know why we can't ship as fast as we used to."
                                </p>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">Velocity Tracking</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Real-time tracking of deployment frequency and lead time.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">Sprint Insights</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Identify exactly where the sprint slowed down before the retro.</p>
                                    </div>
                                </li>
                            </ul>
                            <Button size="lg" className="group flex items-center gap-2 bg-slate-200 text-slate-900 hover:text-white dark:bg-slate-800 hover:bg-primary dark:text-white transition-all px-8 py-6 rounded-xl font-bold">
                                View Case Study
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                            <img className="w-full h-full object-cover opacity-80" alt="Data visualization dashboard showing velocity charts" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFkKZiDbi_vN7yDMXHT9cFmkEEK7ry9_YRxnfGfdsAeNYZacIgI0QSSwqO53MPY1HJo_03KXmEBFkmYUaNVt34CMkP9mp8wOEVniDfnLQk84lYSZG7IqnOEcxvSfvzBWg9SPy5GwgchHAw-OrhuKw0oOqP4n2mHacfSv_d0QjxXVBLSaH8utm0yI8hZNPKiIibli1Mfd38ZmnuDAuFM-eS98N-5PePAZgNi7y1RDQCz3uggza30_nPgIKqnuEE-pHT-9tIDtZo9wI" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-background-dark/80 to-transparent"></div>
                        </div>
                    </div>
                </section>

                {/* 2. For Engineering Managers */}
                <section className="relative max-w-7xl mx-auto px-6 mb-40">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(91,43,238,0.15)_0%,rgba(15,15,18,0)_70%)] -translate-x-1/4"></div>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                            <img className="w-full h-full object-cover opacity-80" alt="Bottleneck detection graph and team heatmaps" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjEz8k4lBBPmw8TqGjknWjmZ0lKxMGbDfPwvEFIYDhUkowXMz1NWlTpCzKnL6PnyA_59Gpz6bras_a_zxUvCEhBB0qR7LftefvQRr38j0ZnjE4cDv0qZw59HUGy33mK-G-SN4NfXKAwCw-P9rcgx9gH7WiDlhbU4irpZL6P09L7PVMJDiKZzMWXeRc7ith2k1uXEjbFOqMfYKVKinoyrdLjzJ0Q8xRuF6_VVq9Y88_jcLSCjsCLrxm9BB2ryqruox7HWBG2jLArhc" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-background-dark/80 to-transparent"></div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Users className="w-8 h-8" />
                                    <h3 className="text-2xl font-bold">For Engineering Managers</h3>
                                </div>
                                <h4 className="text-4xl font-extrabold tracking-tight leading-tight">Detect bottlenecks <br />before they burn out teams.</h4>
                                <p className="text-slate-500 italic text-lg leading-relaxed dark:text-slate-400">
                                    "I need to balance the workload across teams while ensuring critical features aren't stuck in code review."
                                </p>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">PR Cycle Time Analysis</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Uncover review silos and stuck pull requests automatically.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">Burnout Prevention</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Heatmaps of engineer activity to ensure healthy distribution.</p>
                                    </div>
                                </li>
                            </ul>
                            <Button size="lg" className="group flex items-center gap-2 bg-slate-200 text-slate-900 hover:text-white dark:bg-slate-800 hover:bg-primary dark:text-white transition-all px-8 py-6 rounded-xl font-bold">
                                View Case Study
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 3. For Maintainers */}
                <section className="relative max-w-7xl mx-auto px-6 mb-40">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(91,43,238,0.15)_0%,rgba(15,15,18,0)_70%)] translate-y-1/4"></div>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Heart className="w-8 h-8" />
                                    <h3 className="text-2xl font-bold">For Maintainers</h3>
                                </div>
                                <h4 className="text-4xl font-extrabold tracking-tight leading-tight">Scale your community <br />with sustainable health.</h4>
                                <p className="text-slate-500 italic text-lg leading-relaxed dark:text-slate-400">
                                    "Triage is overwhelming and we're losing contributors because we can't respond fast enough."
                                </p>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">Community Health Scoring</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">AI-driven metrics on contributor retention and issue sentiment.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">Issue Triage Assistant</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Prioritize bug reports based on severity and user impact.</p>
                                    </div>
                                </li>
                            </ul>
                            <Button size="lg" className="group flex items-center gap-2 bg-slate-200 text-slate-900 hover:text-white dark:bg-slate-800 hover:bg-primary dark:text-white transition-all px-8 py-6 rounded-xl font-bold">
                                View Case Study
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                            <img className="w-full h-full object-cover opacity-80" alt="Community health dashboard with sentiment analysis charts" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwvdhHrCbzS0aIUq9_t14ZDGml4Q7MWKmaOlC59sdiJSBvxW9bdApUSjvpnEpgeLXzOuh6Y7Uf6UArutuGuM1kDqM2qx3dnLrCc6TTNw2rCCKHc5NdNX2zKEbBtXBFZXdFuYMJH6GhXHBBiE4yFpV_YHm4d1PM91iAPL_C_lrna8h4O17Jc2fFYAf5hbK9Sb5G5kQf77lguwFYsHm6pNZTWpUtU0bCr6shree6Ja9rfz3xiFpQo3n0ZUex6gPs3-nrprziLqVEXMo" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-background-dark/80 to-transparent"></div>
                        </div>
                    </div>
                </section>

                {/* 4. For Agencies */}
                <section className="relative max-w-7xl mx-auto px-6 mb-20">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(91,43,238,0.15)_0%,rgba(15,15,18,0)_70%)] translate-x-1/2 -translate-y-1/2"></div>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-2xl relative">
                            <img className="w-full h-full object-cover opacity-80" alt="Executive reporting view with automated client metrics" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAQBFqdsYZ4nwinIP7EwJmIVo6yLA4jL5F02VCYm1a24Uleid0pWel3UxmyC-ibiB1YfDi8gYLvZkjpfoe67no_GIRlIVPwfd2P63Wnj9au_oNpc7XQOS0WWDIiDeaNuPy7LVasfz8UzuJhJxZ1SYCSYk-FbcnJI0pIWy-3xdbkNrKYMUxAcexhYhtwwBMC_E9hO6G7HD5HpHnmRxy003fdkoiXR9XhSfWKtqidnCyVNiyUtyI3VnJm2KMhBgG-NUdpaE1P8nahrg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-background-dark/80 to-transparent"></div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Building2 className="w-8 h-8" />
                                    <h3 className="text-2xl font-bold">For Agencies</h3>
                                </div>
                                <h4 className="text-4xl font-extrabold tracking-tight leading-tight">Prove your value <br />with radical transparency.</h4>
                                <p className="text-slate-500 italic text-lg leading-relaxed dark:text-slate-400">
                                    "Clients want to see the ROI on our development hours, but manual reporting takes too long."
                                </p>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">Automated Client Portals</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Share white-labeled dashboards of project health directly with clients.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold">Resource Allocation Analysis</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Visualize exactly which features are consuming your billing hours.</p>
                                    </div>
                                </li>
                            </ul>
                            <Button size="lg" className="group flex items-center gap-2 bg-slate-200 text-slate-900 hover:text-white dark:bg-slate-800 hover:bg-primary dark:text-white transition-all px-8 py-6 rounded-xl font-bold">
                                View Case Study
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer CTA Section */}
            <footer className="bg-slate-100 dark:bg-slate-900/50 py-24 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
                    <h2 className="text-4xl font-extrabold tracking-tight">Ready to boost your engineering intelligence?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-primary text-white text-lg font-bold px-10 py-6 rounded-xl hover:scale-[1.02] transition-transform shadow-xl shadow-primary/25">
                            Start Your Free Trial
                        </Button>
                        <Button size="lg" variant="outline" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold px-10 py-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Schedule a Demo
                        </Button>
                    </div>
                    <div className="pt-10 flex flex-col items-center gap-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 opacity-60">
                            <Rocket className="w-6 h-6 text-primary" />
                            <p className="font-extrabold tracking-tight">DevPulse</p>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 DevPulse Intelligence. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
