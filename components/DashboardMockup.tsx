"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardMockup() {
    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all"></div>
            <div className="relative glass-card rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="text-xs font-medium text-slate-500">Project: devpulse-core / analytics</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Velocity Score</p>
                        <div className="text-2xl font-bold text-primary">94.2%</div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "94%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Health Index</p>
                        <div className="text-2xl font-bold text-cyan-400">A+</div>
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-1.5 w-4 bg-cyan-400 rounded-full"></div>
                            ))}
                            <div className="h-1.5 w-4 bg-cyan-400/20 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 h-48 flex items-end gap-2">
                    {/* Visual Chart Mock */}
                    {[60, 85, 40, 95, 70, 100, 75].map((height, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                            className={`flex-1 rounded-t-lg ${i === 6 ? 'bg-cyan-400/60' : 'bg-primary/60'} hover:bg-primary/80 transition-colors cursor-pointer`}
                            style={{ opacity: i === 6 ? 1 : 0.3 + (height / 100) * 0.7 }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute -top-6 -right-6 glass-card p-4 rounded-xl shadow-xl border border-white/20"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-400 w-5 h-5" />
                        <div className="text-xs">
                            <p className="font-bold text-slate-200">Optimization Alert</p>
                            <p className="text-slate-400">CI/CD Pipeline refined.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
