import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Sparkles, ArrowRight, FileText, FileImage, Download, Activity, LineChart, AlertTriangle, Plug, CheckSquare, Brain, ClipboardList, Box, Database, CreditCard, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
    return (
        <div className="min-h-screen flex flex-col relative z-10 w-full overflow-hidden bg-background-light dark:bg-background-dark">
            <Navigation />

            <main className="flex-1 w-full relative">
                {/* Mesh Gradient Background Pattern mimicking the class */}
                <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(at 0% 0%, rgba(91, 43, 238, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(91, 43, 238, 0.1) 0px, transparent 50%)" }} />

                <div className="relative z-10">
                    {/* Hero Section */}
                    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                                <Sparkles className="w-4 h-4" />
                                Platform Capabilities
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
                                Engineering Intelligence, Decoded.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                                Transform GitHub data into actionable insights with AI-driven analytics.
                                Empower your team with deep visibility into velocity, quality, and risk.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" className="w-full sm:w-auto px-8 py-6 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform text-lg">
                                    Start Free Trial <ArrowRight className="w-5 h-5" />
                                </Button>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 glass-card text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-lg">
                                    View Demo
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Capabilities Grid */}
                    <section className="max-w-7xl mx-auto px-6 py-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Card 1: Weekly Reports */}
                            <div className="glass-card p-8 rounded-xl flex flex-col gap-6 group hover:border-primary/30 transition-all border border-slate-200 dark:border-white/10 dark:bg-white/5 bg-white">
                                <div className="flex items-start justify-between">
                                    <div className="size-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reports</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Automated Weekly Reports</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">AI-generated engineering summaries and stakeholder reports delivered directly to your inbox every Monday morning.</p>
                                </div>
                                <div className="mt-4 bg-slate-50 dark:bg-background-dark/50 rounded-lg border border-slate-100 dark:border-white/5 p-4 flex items-center gap-4 shadow-inner">
                                    <div className="size-12 rounded bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                        <FileImage className="w-6 h-6 text-red-500 dark:text-red-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full mb-2"></div>
                                        <div className="h-2 w-1/2 bg-slate-300 dark:bg-slate-800 rounded-full"></div>
                                    </div>
                                    <Download className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                                </div>
                            </div>

                            {/* Card 2: Quality Scoring */}
                            <div className="glass-card p-8 rounded-xl flex flex-col gap-6 group hover:border-primary/30 transition-all border border-slate-200 dark:border-white/10 dark:bg-white/5 bg-white">
                                <div className="flex items-start justify-between">
                                    <div className="size-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <Activity className="w-7 h-7" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Metrics</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Code Quality Scoring</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Real-time repository health scores based on complexity, documentation coverage, and testing velocity.</p>
                                </div>
                                <div className="mt-4 flex items-center justify-center py-4 bg-slate-50 dark:bg-background-dark/50 rounded-lg border border-slate-100 dark:border-white/5">
                                    <div className="relative size-32 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle className="text-slate-200 dark:text-slate-800 line-none stroke-current" cx="64" cy="64" fill="transparent" r="50" strokeWidth="8"></circle>
                                            <circle className="text-primary line-none stroke-current" cx="64" cy="64" fill="transparent" r="50" strokeDasharray="314" strokeDashoffset="62" strokeWidth="8"></circle>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black text-slate-900 dark:text-white">88</span>
                                            <span className="text-[10px] uppercase text-slate-500 font-bold">Health Score</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: PR Insights */}
                            <div className="glass-card p-8 rounded-xl flex flex-col gap-6 group hover:border-primary/30 transition-all border border-slate-200 dark:border-white/10 dark:bg-white/5 bg-white">
                                <div className="flex items-start justify-between">
                                    <div className="size-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <LineChart className="w-7 h-7" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Velocity</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">PR Review Insights</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Track cycle time trends and identify pull request bottlenecks to keep your shipping velocity high.</p>
                                </div>
                                <div className="mt-4 bg-slate-50 dark:bg-background-dark/50 rounded-lg border border-slate-100 dark:border-white/5 p-4 h-32 flex items-end gap-1 overflow-hidden">
                                    <div className="flex-1 bg-primary/20 rounded-t h-[40%]"></div>
                                    <div className="flex-1 bg-primary/30 rounded-t h-[60%]"></div>
                                    <div className="flex-1 bg-primary/40 rounded-t h-[50%]"></div>
                                    <div className="flex-1 bg-primary/60 rounded-t h-[80%]"></div>
                                    <div className="flex-1 bg-primary/40 rounded-t h-[55%]"></div>
                                    <div className="flex-1 bg-primary/80 rounded-t h-[95%]"></div>
                                    <div className="flex-1 bg-primary rounded-t h-[70%]"></div>
                                </div>
                            </div>

                            {/* Card 4: Risk Detection */}
                            <div className="glass-card p-8 rounded-xl flex flex-col gap-6 group hover:border-primary/30 transition-all border border-slate-200 dark:border-white/10 dark:bg-white/5 bg-white">
                                <div className="flex items-start justify-between">
                                    <div className="size-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <AlertTriangle className="w-7 h-7" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Security</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Risk Detection</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Highlighting technical debt, security vulnerabilities, and logic flaws before they reach production.</p>
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                                        <span className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-200"><span className="size-2 rounded-full bg-red-500"></span> Critical Debt</span>
                                        <span className="text-xs font-bold px-2 py-0.5 bg-red-100 dark:bg-red-500 text-red-700 dark:text-white rounded">High</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg opacity-80">
                                        <span className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-200"><span className="size-2 rounded-full bg-amber-500"></span> Logic Complexity</span>
                                        <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-500 text-amber-700 dark:text-white rounded">Med</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="py-24 border-y border-slate-200 dark:border-white/5 relative">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">How DevPulse Works</h2>
                                <p className="text-slate-600 dark:text-slate-400">Four simple steps to engineering excellence.</p>
                            </div>
                            <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4">
                                {/* Connector line for desktop */}
                                <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"></div>

                                {/* Step 1 */}
                                <div className="relative z-10 flex flex-col items-center text-center max-w-[240px] mx-auto group">
                                    <div className="size-24 rounded-full bg-white dark:bg-background-dark border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center text-primary mb-6 transition-all group-hover:border-primary group-hover:scale-110 shadow-sm">
                                        <Plug className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">1. Connect</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed">OAuth connection with your GitHub organization in seconds.</p>
                                </div>
                                {/* Step 2 */}
                                <div className="relative z-10 flex flex-col items-center text-center max-w-[240px] mx-auto group">
                                    <div className="size-24 rounded-full bg-white dark:bg-background-dark border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center text-primary mb-6 transition-all group-hover:border-primary group-hover:scale-110 shadow-sm">
                                        <CheckSquare className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">2. Select</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed">Choose the specific repositories and teams to monitor.</p>
                                </div>
                                {/* Step 3 */}
                                <div className="relative z-10 flex flex-col items-center text-center max-w-[240px] mx-auto group">
                                    <div className="size-24 rounded-full bg-white dark:bg-background-dark border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center text-primary mb-6 transition-all group-hover:border-primary group-hover:scale-110 shadow-sm">
                                        <Brain className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">3. Analyze</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed">Our AI engines scan historical and live PR data to build a baseline.</p>
                                </div>
                                {/* Step 4 */}
                                <div className="relative z-10 flex flex-col items-center text-center max-w-[240px] mx-auto group">
                                    <div className="size-24 rounded-full bg-white dark:bg-background-dark border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center text-primary mb-6 transition-all group-hover:border-primary group-hover:scale-110 shadow-sm">
                                        <ClipboardList className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">4. Report</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed">Get recurring reports and live dashboards with clear insights.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Technical Stack */}
                    <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-600 mb-10">Powered by the modern stack</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 dark:opacity-40 hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2 group cursor-default text-slate-800 dark:text-slate-300">
                                <Box className="w-10 h-10 group-hover:text-primary transition-colors" />
                                <span className="text-xl font-bold tracking-tighter">Next.js</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-default text-slate-800 dark:text-slate-300">
                                <Database className="w-10 h-10 group-hover:text-primary transition-colors" />
                                <span className="text-xl font-bold tracking-tighter">Supabase</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-default text-slate-800 dark:text-slate-300">
                                <CreditCard className="w-10 h-10 group-hover:text-primary transition-colors" />
                                <span className="text-xl font-bold tracking-tighter">Stripe</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-default text-slate-800 dark:text-slate-300">
                                <Terminal className="w-10 h-10 group-hover:text-primary transition-colors" />
                                <span className="text-xl font-bold tracking-tighter">GitHub</span>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="max-w-7xl mx-auto px-6 mb-20">
                        <div className="glass-card p-12 rounded-3xl text-center relative overflow-hidden border border-slate-200 dark:border-white/10 dark:bg-white/5 bg-white">
                            <div className="absolute inset-0 bg-primary/5 -z-10"></div>
                            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Ready to decode your engineering?</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto">Join 200+ engineering teams measuring what matters and shipping faster with DevPulse.</p>
                            <Button size="lg" className="px-10 py-6 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/20 dark:shadow-primary/40 hover:scale-105 transition-transform text-lg">
                                Get Started Now
                            </Button>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
