"use client";

import { Brain, Check, Hourglass, FileText, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AIAnalysisProgress() {
    const [progress, setProgress] = useState(64);

    // Optional: Simulate progress filling up over time
    // useEffect(() => {
    //   const timer = setInterval(() => {
    //     setProgress((oldProgress) => {
    //       if (oldProgress >= 100) {
    //         clearInterval(timer);
    //         return 100;
    //       }
    //       const diff = Math.random() * 5;
    //       return Math.min(oldProgress + diff, 100);
    //     });
    //   }, 1000);
    //   return () => {
    //     clearInterval(timer);
    //   };
    // }, []);

    return (
        <div className="bg-background-light dark:bg-[#0B0F19] font-display text-slate-900 dark:text-slate-100 min-h-screen overflow-hidden selection:bg-primary/30 relative">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[radial-gradient(circle,_rgba(20,184,166,0.15)_0%,_transparent_70%)] rounded-full blur-3xl"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[radial-gradient(circle,_rgba(91,43,238,0.2)_0%,_transparent_70%)] rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex h-screen w-full flex-col">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="size-8 text-primary flex items-center justify-center">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">DevPulse <span className="text-primary">AI</span></h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <Link className="hover:text-primary dark:hover:text-white transition-colors" href="#">Documentation</Link>
                            <Link className="hover:text-primary dark:hover:text-white transition-colors" href="#">Support</Link>
                        </nav>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 hidden md:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">Alex Rivera</p>
                                <p className="text-[10px] text-slate-500">Engineering Lead</p>
                            </div>
                            <div className="rounded-full size-9 bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
                                <img className="w-full h-full object-cover" alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2cmAw_RlR_ctqg7UOFZbe2QGi7HO2E29h16owCCdOjA5tjz2gp-uAWOlO_QwBNcHaTa1zRxJTS3VMHNu2sPGSqCNJG2W5oP6YGD8OCaliVi0jZ4_u9De-iw0BFPQ0ppmj9tSMLl7Pz45cdJ3mze8xVqaCPoxC7AtvMgiuNmrd4ThqGkSL3iwmQ3Y8gPYuTVRTmla3aSJoOEJ6FONNKD2VlVF3N0BxkgwQU7eTQldGPeBUUr3Qe7DnjDgDx58Re2-CmxzBAOcX0Sg" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-2xl w-full bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl p-12 shadow-2xl relative overflow-hidden">
                        {/* Abstract AI Brain Visual */}
                        <div className="flex justify-center mb-10">
                            <div className="relative size-32 flex items-center justify-center">
                                {/* Outer Glow Layers */}
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-[pulse_3s_infinite_ease-in-out]"></div>
                                <div className="absolute inset-4 border border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-8 border border-teal-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

                                {/* Core Icon */}
                                <div className="relative bg-white/90 dark:bg-white/5 backdrop-blur-md rounded-full size-20 flex items-center justify-center border border-primary/50 shadow-[0_0_30px_rgba(91,43,238,0.4)]">
                                    <Brain className="w-10 h-10 text-primary" strokeWidth={1} />
                                </div>
                            </div>
                        </div>

                        {/* Text Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white">Analyzing your repository...</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">This usually takes 60 seconds. Sit tight while we crunch the data.</p>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-8 max-w-md mx-auto">
                            {/* Global Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-500 dark:text-slate-400">Total Progress</span>
                                    <span className="text-primary">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 relative">
                                    <div
                                        className="h-full bg-primary shadow-[0_0_15px_rgba(91,43,238,0.6)] rounded-full transition-all duration-1000 ease-out absolute left-0 top-0"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Status List */}
                            <div className="space-y-4">
                                {/* Item: Completed */}
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-6 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/40 shrink-0">
                                            <Check className="w-3 h-3 font-bold" />
                                        </div>
                                        <span className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base">Fetching commit history...</span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">Completed</span>
                                </div>

                                {/* Item: Active */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="size-6 flex items-center justify-center shrink-0">
                                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                        </div>
                                        <span className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base">Analyzing pull request patterns...</span>
                                    </div>
                                    <span className="text-xs text-primary font-mono animate-pulse shrink-0">In Progress</span>
                                </div>

                                {/* Item: Pending */}
                                <div className="flex items-center justify-between opacity-50">
                                    <div className="flex items-center gap-4">
                                        <div className="size-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-white/10 shrink-0">
                                            <Hourglass className="w-3 h-3" />
                                        </div>
                                        <span className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base hidden sm:inline">Evaluating code complexity...</span>
                                        <span className="text-slate-600 dark:text-slate-400 font-medium text-sm block sm:hidden">Evaluating complexity...</span>
                                    </div>
                                    <span className="text-xs text-slate-600 font-mono shrink-0">Waiting</span>
                                </div>

                                {/* Item: Pending */}
                                <div className="flex items-center justify-between opacity-50">
                                    <div className="flex items-center gap-4">
                                        <div className="size-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-white/10 shrink-0">
                                            <FileText className="w-3 h-3" />
                                        </div>
                                        <span className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">Generating intelligence report...</span>
                                    </div>
                                    <span className="text-xs text-slate-600 font-mono shrink-0">Waiting</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Tooltip */}
                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shrink-0">
                                <p className="text-[11px] font-bold text-primary uppercase tracking-widest">Pro Tip</p>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">Did you know? DevPulse AI tracks technical debt in real-time across 40+ languages.</p>
                        </div>

                        {/* Continue Button (Not in mockup but useful for flow) */}
                        {progress >= 100 && (
                            <div className="absolute bottom-6 right-6">
                                <Link href="/dashboard/reports">
                                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all animate-bounce">
                                        View Report
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer Credits */}
                <footer className="p-6 text-center text-slate-500 dark:text-slate-600 text-xs tracking-wide">
                    © 2024 DevPulse AI. All engineering data is encrypted end-to-end.
                </footer>
            </div>
        </div>
    );
}
