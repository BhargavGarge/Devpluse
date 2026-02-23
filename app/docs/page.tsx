import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
    Search, Rocket, Settings, Key, LineChart, Brain, Webhook,
    GitMerge, CircleDollarSign, Code2, Info, Copy, BarChart3,
    ThumbsUp, ThumbsDown, ChevronRight, MessageSquare, CheckCircle2
} from "lucide-react";

export default function DocsPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen">
            <Navigation />

            <div className="max-w-[1440px] mx-auto flex min-h-screen pt-20">
                {/* Sticky Left Sidebar */}
                <aside className="hidden lg:block w-72 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto border-r border-slate-200 dark:border-slate-800/80 p-6 doc-scrollbar">
                    <div className="flex flex-col gap-8">
                        <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Getting Started</h5>
                            <ul className="space-y-1">
                                <li>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold" href="#">
                                        <Rocket className="w-5 h-5 text-primary" />Introduction
                                    </a>
                                </li>
                                <li>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent transition-colors text-slate-600 dark:text-slate-300" href="#">
                                        <Settings className="w-5 h-5" />Installation
                                    </a>
                                </li>
                                <li>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent transition-colors text-slate-600 dark:text-slate-300" href="#">
                                        <Key className="w-5 h-5" />Authentication
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Concepts</h5>
                            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                                <li>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                                        <LineChart className="w-5 h-5" />Metrics Explained
                                    </a>
                                </li>
                                <li>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                                        <Brain className="w-5 h-5" />AI Scoring Logic
                                    </a>
                                </li>
                                <li>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                                        <Webhook className="w-5 h-5" />Webhooks
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Integrations</h5>
                            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                                <li>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                                        <GitMerge className="w-5 h-5" />GitHub Flow
                                    </a>
                                </li>
                                <li>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                                        <CircleDollarSign className="w-5 h-5" />GitLab Sync
                                    </a>
                                </li>
                                <li>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                                        <Code2 className="w-5 h-5" />SDK Reference
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800/80">
                            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                                <p className="text-xs font-bold text-primary uppercase mb-1">Status</p>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">All systems operational</p>
                                <div className="mt-2 h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 px-6 lg:px-12 py-10 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                            <a className="hover:text-primary transition-colors" href="#">Docs</a>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-slate-900 dark:text-slate-100 font-medium">Quick Start Guide</span>
                        </nav>

                        <article className="prose prose-slate dark:prose-invert max-w-none">
                            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Quick Start Guide</h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                Learn how to integrate DevPulse with your GitHub workflow in minutes and start generating AI-powered engineering insights.
                            </p>

                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10 flex gap-4 not-prose">
                                <Info className="w-8 h-8 text-primary shrink-0" />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Prerequisites</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">You'll need a GitHub Organization with Admin access to install the DevPulse App and generate your first OAuth credentials.</p>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mt-12 mb-4 scroll-mt-20 text-slate-900 dark:text-white" id="authentication">1. GitHub OAuth Flow</h2>
                            <p className="mb-6 text-slate-600 dark:text-slate-400">To begin syncing your repository data, you must first authorize DevPulse to access your GitHub metadata. We use fine-grained permissions to ensure only code frequency and pull request metadata are collected.</p>

                            <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl overflow-hidden mb-8 not-prose">
                                <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d35]/50 border-b border-[#313244]">
                                    <span className="text-xs font-mono text-slate-400">python</span>
                                    <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                </div>
                                <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto text-slate-300"><code><span className="italic text-[#5c6370]"># Initialize the DevPulse Client</span>
                                    <span className="text-[#c678dd]">import</span> devpulse

                                    client = devpulse.<span className="text-[#61afef]">Client</span>(api_key=<span className="text-[#98c379]">"dp_live_4x9f..."</span>)

                                    <span className="italic text-[#5c6370]"># Trigger the OAuth handshake</span>
                                    auth_url = client.auth.<span className="text-[#61afef]">generate_github_url</span>(
                                    redirect_uri=<span className="text-[#98c379]">"https://app.yourdomain.com/callback"</span>,
                                    scopes=[<span className="text-[#98c379]">"repo"</span>, <span className="text-[#98c379]">"read:org"</span>]
                                    )

                                    <span className="text-[#61afef]">print</span>(<span className="text-[#98c379]">f"Authorize at: {"{auth_url}"}"</span>)</code></pre>
                            </div>

                            <h2 className="text-2xl font-bold mt-12 mb-4 scroll-mt-20 text-slate-900 dark:text-white" id="ai-logic">2. Understanding AI Scoring</h2>
                            <p className="mb-6 text-slate-600 dark:text-slate-400">The DevPulse Scoring engine uses an ensemble of Transformer-based models to evaluate engineering velocity. Unlike traditional lines-of-code metrics, we analyze:</p>

                            <ul className="space-y-4 mb-8 list-none px-0 not-prose">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-slate-900 dark:text-slate-100 block mb-1">Cognitive Complexity:</strong>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 m-0">Measures how difficult the code is to understand and maintain, not just how much was written.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-slate-900 dark:text-slate-100 block mb-1">Review Impact:</strong>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 m-0">Quantifies the contribution of high-quality peer reviews and their effect on PR lifecycle speed.</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="relative w-full h-64 rounded-xl overflow-hidden mb-12 border border-slate-200 dark:border-slate-800 group not-prose">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-900/40 to-slate-900 dark:to-background-dark flex items-center justify-center z-10">
                                    <div className="text-center p-8">
                                        <BarChart3 className="w-12 h-12 text-primary mb-4 mx-auto block" />
                                        <h3 className="text-xl font-bold text-white mb-2">Visualizing the Logic</h3>
                                        <p className="text-sm text-slate-200 dark:text-slate-400 max-w-sm mx-auto">Explore how our AI maps 42 different signals into a single productivity score.</p>
                                    </div>
                                </div>
                                <img className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" alt="Abstract data visualization showing engineering metrics" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrJz2csvnS8XkaG_UkpeBVZJdaRoRzyiNnTvtuhMb5m52IAU7ZXHjejkrbKrXT9QRTFtz327SA9wm2Nn1RARsxkS2l3BtH94ESE7X8QynAUX05RdOAYSLdbeuaw3UZ5_jMbYwC51UMClnZ_U5GbT2VGZe3AnyaTiGOAWsZKV6qlplRGH7-xHWhunxMbcSVEXBk2wM5Nq5WlIOBVDwlTMQ0n5GoHuThCTYiciG3u_Biq4PA6krVYf9KU21KizKwNP8TwehAt-vcXYM" />
                            </div>

                            <h2 className="text-2xl font-bold mt-12 mb-4 scroll-mt-20 text-slate-900 dark:text-white" id="next-steps">Next Steps</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 not-prose">
                                <a className="p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-primary dark:hover:border-primary transition-all group bg-white dark:bg-transparent" href="#">
                                    <h4 className="font-bold mb-1 group-hover:text-primary text-slate-900 dark:text-white">Custom Dashboards</h4>
                                    <p className="text-sm text-slate-500">Configure widgets to track team-specific KPIs.</p>
                                </a>
                                <a className="p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-primary dark:hover:border-primary transition-all group bg-white dark:bg-transparent" href="#">
                                    <h4 className="font-bold mb-1 group-hover:text-primary text-slate-900 dark:text-white">Slack Integration</h4>
                                    <p className="text-sm text-slate-500">Get weekly digest reports directly in Slack.</p>
                                </a>
                            </div>
                        </article>

                        {/* Documentation Footer */}
                        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-6 pb-12">
                            <p className="text-sm text-slate-500">Last updated November 2023 • v1.4.2</p>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <ThumbsUp className="w-4 h-4" /> Helpful
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <ThumbsDown className="w-4 h-4" /> Not helpful
                                </button>
                            </div>
                        </footer>
                    </div>
                </main>

                {/* Right Sidebar (Table of Contents) */}
                <aside className="hidden xl:block w-64 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto p-6">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">On this page</h5>
                    <ul className="space-y-4">
                        <li><a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors border-l-2 border-transparent pl-4 hover:border-primary/50 block" href="#authentication">GitHub OAuth Flow</a></li>
                        <li><a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors border-l-2 border-transparent pl-4 hover:border-primary/50 block" href="#ai-logic">AI Scoring Logic</a></li>
                        <li><a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors border-l-2 border-transparent pl-4 hover:border-primary/50 block" href="#next-steps">Next Steps</a></li>
                    </ul>

                    <div className="mt-12 bg-slate-50 dark:bg-[#1a1a1e] rounded-xl p-6 border border-slate-200 dark:border-[#2d2d35]">
                        <p className="text-sm font-bold mb-2 text-slate-900 dark:text-white">Need help?</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Chat with our engineering support team or join our Discord.</p>
                        <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Open Support
                        </button>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Reading Progress</span>
                            <span className="text-primary font-bold">42%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: "42%" }}></div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
