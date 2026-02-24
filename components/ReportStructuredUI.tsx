"use client";

import { useState } from "react";
import { Activity, Star, CheckCircle, XCircle, AlertTriangle, TrendingUp, Lightbulb, Zap, ShieldAlert, Target, Info, Crosshair } from "lucide-react";

export default function ReportStructuredUI({ parsedSummary }: { parsedSummary: any }) {
    // State for the impact simulator
    const [simulatedScore, setSimulatedScore] = useState(parsedSummary?.healthBreakdown?.totalScore || 0);
    const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({});

    if (!parsedSummary) return null;

    const { executiveSnapshot, healthBreakdown, riskBoard, technicalDebtMeter } = parsedSummary;

    const handleToggle = (key: string, impactScore: number) => {
        const isActive = activeToggles[key];
        setActiveToggles(prev => ({ ...prev, [key]: !isActive }));

        if (!isActive) {
            setSimulatedScore(Math.min(100, simulatedScore + impactScore));
        } else {
            setSimulatedScore(Math.max(0, simulatedScore - impactScore));
        }
    };

    return (
        <div className="space-y-10 w-full">
            {/* 5. Executive Snapshot */}
            {executiveSnapshot && (
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-[#0a0a0c] border border-slate-800 dark:border-[#2d2d35] shadow-2xl">
                    <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 p-32 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative p-8 md:p-10 z-10">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Crosshair className="w-4 h-4" />
                            Executive Snapshot
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="text-white/50 text-xs font-bold uppercase mb-1">Production Ready</div>
                                <div className="flex items-center gap-2">
                                    {executiveSnapshot.productionReady ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                    <span className="text-white font-bold">{executiveSnapshot.productionReady ? "Yes" : "No"}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="text-white/50 text-xs font-bold uppercase mb-1">Maintenance Risk</div>
                                <div className="text-white font-bold">{executiveSnapshot.maintenanceRisk || "N/A"}</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="text-white/50 text-xs font-bold uppercase mb-1">Scaling Readiness</div>
                                <div className="text-white font-bold">{executiveSnapshot.scalingReadiness || "N/A"}</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="text-white/50 text-xs font-bold uppercase mb-1">Security Risk</div>
                                <div className="text-white font-bold">{executiveSnapshot.securityRisk || "N/A"}</div>
                            </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
                            <div className="text-white/60 text-xs font-bold uppercase mb-2">Investment Recommendation</div>
                            <p className="text-white text-lg leading-relaxed font-medium">
                                {executiveSnapshot.investmentRecommendation}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Health Breakdown */}
                <div className="col-span-1 lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        Health Breakdown
                    </h3>

                    {healthBreakdown && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(healthBreakdown).filter(([k]) => k !== 'totalScore').map(([key, data]: [string, any]) => (
                                <div key={key} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col gap-2">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">{data.score}</div>
                                        <div className="flex gap-2 text-xs">
                                            <span className={`px-2 py-1 rounded-md font-bold ${data.risk === 'Critical' || data.risk === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                                    data.risk === 'Moderate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                }`}>
                                                {data.risk} Risk
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. Technical Debt Meter */}
                <div className="col-span-1 border border-slate-200 dark:border-[#2d2d35] rounded-3xl p-6 bg-white dark:bg-[#151022]">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        Tech Debt Meter
                    </h3>

                    {technicalDebtMeter && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-5xl font-black mb-1">{technicalDebtMeter.technicalDebtIndex || "N/A"}</div>
                                <div className="text-xs uppercase font-bold text-slate-500">Tech Debt Index (0-100)</div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Dependency/File Ratio</span>
                                    <span className="font-bold">{technicalDebtMeter.dependencyToFileRatio}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Test/File Ratio</span>
                                    <span className="font-bold">{technicalDebtMeter.testToFileRatio}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Commit Velocity</span>
                                    <span className="font-bold">{technicalDebtMeter.commitVelocity}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Risk Trend</span>
                                    <span className={`font-bold flex items-center gap-1 ${technicalDebtMeter.riskTrend === 'Increasing' ? 'text-red-500' :
                                            technicalDebtMeter.riskTrend === 'Decreasing' ? 'text-emerald-500' : 'text-amber-500'
                                        }`}>
                                        {technicalDebtMeter.riskTrend}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Risk Board */}
                <div className="col-span-1 lg:col-span-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Risk Board
                    </h3>

                    <div className="space-y-4">
                        {riskBoard && riskBoard.map((risk: any, i: number) => (
                            <div key={i} className="bg-white dark:bg-[#151022] border border-slate-200 dark:border-[#2d2d35] rounded-2xl p-5 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${risk.severity === 'Critical' ? 'bg-red-500 text-white' :
                                                    risk.severity === 'High' ? 'bg-orange-500 text-white' :
                                                        risk.severity === 'Moderate' ? 'bg-amber-400 text-amber-900' :
                                                            'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                                }`}>
                                                {risk.severity} risk
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">Confidence: {risk.confidence}%</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{risk.title}</h4>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Fix Effort</div>
                                        <div className="font-mono text-sm bg-slate-100 dark:bg-[#0a0a0c] px-2 py-1 rounded inline-block">{risk.fixEffort}</div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{risk.description}</p>
                                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 flex gap-4 text-sm">
                                    <div><span className="font-bold text-slate-700 dark:text-slate-300">Business Risk:</span> {risk.businessRisk}</div>
                                    <div><span className="font-bold text-slate-700 dark:text-slate-300">Impact:</span> {risk.impact}</div>
                                </div>
                            </div>
                        ))}
                        {(!riskBoard || riskBoard.length === 0) && (
                            <div className="p-8 text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                                No critical risks automatically detected.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Impact Simulator */}
                <div className="col-span-1">
                    <div className="sticky top-24 bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20 rounded-3xl p-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Impact Simulator
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">See how fixing risks improves the repository health score.</p>

                        <div className="bg-white dark:bg-[#0a0a0c] rounded-2xl p-6 mb-6 text-center border border-slate-200 dark:border-[#2d2d35] shadow-inner">
                            <div className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-2">Simulated Score</div>
                            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                                {simulatedScore}
                            </div>
                            <div className="text-xs text-slate-400 mt-2 font-medium">Original: {parsedSummary?.healthBreakdown?.totalScore || 0}</div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Toggle Fixes:</div>

                            {/* Derive toggles from risk board if possible, else defaults */}
                            {(riskBoard && riskBoard.length > 0 ? riskBoard.slice(0, 4) : [
                                { title: "Add Automated Tests", severity: "Critical" },
                                { title: "Integrate CI/CD Pipeline", severity: "High" },
                                { title: "Reduce dependencies", severity: "Moderate" }
                            ]).map((risk: any, i: number) => {
                                // Guestimate score impact based on severity
                                const impact = risk.severity === 'Critical' ? 15 : risk.severity === 'High' ? 10 : 5;
                                const isChecked = !!activeToggles[risk.title];

                                return (
                                    <label key={i} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${isChecked ? 'bg-primary/10 border-primary/30' : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-primary/30'
                                        }`}>
                                        <div className="mt-0.5">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                                checked={isChecked}
                                                onChange={() => handleToggle(risk.title, impact)}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{risk.title}</div>
                                            <div className="text-xs font-bold text-emerald-500">+{impact} Points</div>
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
