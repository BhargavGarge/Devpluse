"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "./DashboardMockup";
import Link from "next/link";

export function HeroSection() {
    return (
        <main className="pt-40 pb-24 px-6 relative z-10 w-full overflow-hidden">
            {/* Decorative Orbs */}
            <div className="glow-orb bg-primary w-[500px] h-[500px] -top-48 -left-48 hidden lg:block"></div>
            <div className="glow-orb bg-cyan-400 w-[400px] h-[400px] top-1/2 -right-48 hidden lg:block"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-8"
                >
                    <div className="flex flex-col gap-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <BadgeCheck className="text-primary w-4 h-4" />
                                Trusted by 120+ engineering teams
                            </span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-primary text-xs font-bold uppercase tracking-widest">
                                New: Engineering Intelligence v2.0
                            </span>
                        </div>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                        AI-Powered <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                            Engineering Intelligence
                        </span>
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                        Unlock the full potential of your development team with calm, data-driven insights. No noise, just clarity for high-performing organizations.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg font-bold px-8 py-6 rounded-xl hover:shadow-[0_0_30px_rgba(91,43,238,0.5)] transition-all flex items-center justify-center gap-2">
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Link href="/demo">
                            <Button size="lg" variant="outline" className="glass-card bg-transparent text-lg font-bold px-8 py-6 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2 border-white/10 text-white">
                                View Demo
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 pt-4 text-slate-500">
                        <div className="flex -space-x-3">
                            <img alt="Avatar 1" className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0bI43DQu8tHDoEPHxnwlXnkjqqHFUlKfC5iO6nruKz-o2lari0Yrsdvw0-6Ho-SUFZ0A8CEh94WbJFEfMjWvaLPdk0oXj34l9Jb6bVm2jgGmsGpgdME0ZsQicZZqVWrcbIYP6iNp-dNLhhqHayjPISnDTuESVmtVNqhrVC9lkQdJoIeYFVBF9oxOixcUBvU4uJGAChq-B6lo5j-rF6j7KbweQrot9ZaRul1Qw_OGhe7iEqnNdjTB6maPpiqHZfog7iXlR5YWpeqw" />
                            <img alt="Avatar 2" className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlR7yiLjqdqEhDhV4Pn8G9WQh1RfsoASNFKVlCTzrryizdHm0rDqSuTJH2k-hx2ROUBeCvdmcxtx2OopqgOcF4_tzCAdyikfQm9FLZyue0ZWeIkSLQMyywe1801MCDIcbqP1c41r2ELxUO--owPftvWYeTIIxxHbo0y3dOEwqQ_UnhZkiHLGCqaSQCxEa21OIRqxbn0sEwwjXIxaC5YaTNGRnOXqZxGJhMHjZbumx_WVMKtc_dhi7UMSRTs4pvrbrqDnPcWHwvVfM" />
                            <img alt="Avatar 3" className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT2f_FKiKB4hfTQXpV4HyBFbot2ecesXee9cOoVtgAZNbExpqKr4hemkDhuUiCkk3-fcGSazZg8Wmg5nicCNb-Qy0pYaJVTusbb4V48XcGWhXzqb3LKaUWVc7v57d4e-CCzKML8QXT8uz_NQX5any0Q0qOakBl5sBTubswhIxTi3j_43x72eN7aHwq6174CCz7tL31hnqKIVNaO3Tlm87MKSwzlceX837jSfnZ_E6GhcRX2k5fiVDPtU_NkkwGEcxfmX4lqGUNy7k" />
                        </div>
                        <p className="text-sm italic">Trusted by 500+ engineering leads</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <DashboardMockup />
                </motion.div>
            </div>
        </main>
    );
}
