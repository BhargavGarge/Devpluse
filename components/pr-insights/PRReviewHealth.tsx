"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, FileCode2, GitPullRequestDraft, ShieldAlert, Sparkles, RefreshCw, Users, Code2, GitMerge, MessageSquare, AlertTriangle, Brain, TrendingUp, Download } from "lucide-react";
import { PullRequestMetrics } from "@/lib/domain/pr-metrics/entities";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

interface PRReviewHealthProps {
    repositoryId: string;
    initialMetrics?: PullRequestMetrics | null;
}

export default function PRReviewHealth({ repositoryId, initialMetrics }: PRReviewHealthProps) {
    const [metrics, setMetrics] = useState<PullRequestMetrics | null>(initialMetrics || null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const res = await fetch(`/api/repositories/${repositoryId}/analyze-prs`, {
                method: 'POST'
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to analyze PRs');

            setMetrics(data.metrics);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExportPDF = async () => {
        const element = document.getElementById("insights-report-container");
        if (!element) return;

        setIsExporting(true);
        try {
            // Adjust padding briefly to ensure margins look good on PDF
            const originalPadding = element.style.padding;
            const originalBg = element.style.backgroundColor;
            element.style.padding = "20px";
            // Check if dark mode is active by looking at doc element or just force transparent bg

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: null,
            });

            element.style.padding = originalPadding;
            element.style.backgroundColor = originalBg;

            const imgData = canvas.toDataURL("image/png");

            const pdfWidth = 210;
            const pageHeight = 297;
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            const pdf = new jsPDF("p", "mm", "a4");

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Engineering_Report_${repositoryId}.pdf`);
        } catch (err) {
            console.error("PDF generation failed", err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <section className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">PR Review Health</h2>
                    <p className="text-muted-foreground mt-1">
                        Production-ready insights based on your recent pull request velocity and discipline.
                    </p>
                </div>
                {metrics && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting || isAnalyzing}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-md shadow-sm bg-card hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                        >
                            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {isExporting ? 'Exporting...' : 'Export Report'}
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || isExporting}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                            {isAnalyzing ? 'Analyzing...' : 'Re-analyze PRs'}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
                    <ShieldAlert className="inline w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            <AnimatePresence mode="wait">
                {isAnalyzing ? (
                    <LoadingSkeleton key="skeleton" />
                ) : !metrics ? (
                    <EmptyState key="empty" onAnalyze={handleAnalyze} />
                ) : (
                    <motion.div
                        id="insights-report-container"
                        key="content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 bg-background dark:bg-transparent"
                    >
                        {/* Full Width Top Section */}
                        {metrics.smartAlerts && metrics.smartAlerts.length > 0 && (
                            <div className="md:col-span-full" id="tour-smart-alerts">
                                <SmartAlertsList alerts={metrics.smartAlerts} />
                            </div>
                        )}

                        <div className="md:col-span-1 lg:col-span-1 space-y-6" id="tour-health-score">
                            <PRHealthCard score={metrics.healthScore} riskLevel={metrics.riskLevel} breakdown={metrics.healthScoreBreakdown} />
                            {metrics.aiRiskNarrative && (
                                <AIRiskNarrativeCard narrative={metrics.aiRiskNarrative} />
                            )}
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 space-y-6" id="tour-metrics-grid">
                            <PRMetricsGrid metrics={metrics} />
                        </div>

                        {/* Full Width Trend Section */}
                        <div className="md:col-span-full" id="tour-trend">
                            <PRHealthTrend repositoryId={repositoryId} currentScore={metrics.healthScore} />
                        </div>

                        {/* MVP 2 Features */}
                        {metrics.contributorInsights && (
                            <div className="md:col-span-2 lg:col-span-2" id="tour-contributor-risk">
                                <ContributorDiscipline insights={metrics.contributorInsights} />
                            </div>
                        )}
                        {metrics.languageDistribution && (
                            <div className="md:col-span-1 lg:col-span-2" id="tour-tech-stack">
                                <TechStackProfile distribution={metrics.languageDistribution} />
                            </div>
                        )}
                        {metrics.reviewDeepDive && (
                            <div className="md:col-span-full" id="tour-deep-dive">
                                <ReviewDeepDive deepDive={metrics.reviewDeepDive} />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

function EmptyState({ onAnalyze }: { onAnalyze: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-muted/20"
        >
            <div className="block p-4 mb-4 rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No PR Insights Available</h3>
            <p className="max-w-md mb-6 text-sm text-muted-foreground">
                Analyze your recent pull requests to uncover codebase health, review bottlenecks, and team discipline metrics.
            </p>
            <button
                onClick={onAnalyze}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors rounded-md shadow dark:text-black bg-primary hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                Analyze PRs Now
            </button>
        </motion.div>
    );
}

function LoadingSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 animate-pulse"
        >
            <div className="h-[250px] md:col-span-1 lg:col-span-1 bg-muted rounded-xl border"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2 lg:col-span-3 h-[250px]">
                <div className="rounded-xl bg-muted border"></div>
                <div className="rounded-xl bg-muted border"></div>
                <div className="rounded-xl bg-muted border"></div>
                <div className="rounded-xl bg-muted border"></div>
            </div>
        </motion.div>
    );
}

function PRHealthCard({ score, riskLevel, breakdown }: { score: number, riskLevel: string, breakdown?: PullRequestMetrics['healthScoreBreakdown'] }) {
    const isGood = riskLevel === "Low";
    const isModerate = riskLevel === "Moderate";
    const isHigh = riskLevel === "High";

    return (
        <div className="flex flex-col h-full p-6 transition-all border shadow-sm bg-card rounded-xl hover:shadow-md">
            <h3 className="text-sm font-medium text-muted-foreground">Overall PR Health</h3>
            <div className="flex flex-col items-center justify-center flex-1 mt-4">
                <div className="relative flex items-center justify-center w-32 h-32 mb-4">
                    {/* SVG Circular Progress */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" className="stroke-muted" strokeWidth="12" fill="none" />
                        <motion.circle
                            cx="64" cy="64" r="58"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            className={isGood ? "stroke-emerald-500" : isModerate ? "stroke-amber-500" : "stroke-red-500"}
                            initial={{ strokeDasharray: "0 400" }}
                            animate={{ strokeDasharray: `${(score / 100) * 364} 400` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-4xl font-bold tracking-tighter"
                        >
                            {score}
                        </motion.span>
                    </div>
                </div>

                <span className={`px-3 py-1 text-xs font-semibold rounded-full mt-2 mb-6 ${isGood ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    isModerate ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {riskLevel} Risk
                </span>

                {breakdown && (
                    <div className="w-full mt-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Score Breakdown</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center py-1 border-b border-border/50">
                                <span className="text-muted-foreground">PR Size (25%)</span>
                                <span className="font-medium">{breakdown.prSizeScore} / 25</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-border/50">
                                <span className="text-muted-foreground">Review Time (20%)</span>
                                <span className="font-medium">{breakdown.reviewTimeScore} / 20</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-border/50">
                                <span className="text-muted-foreground">Unreviewed (25%)</span>
                                <span className="font-medium">{breakdown.unreviewedRatioScore} / 25</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-border/50">
                                <span className="text-muted-foreground">Merge Speed (15%)</span>
                                <span className="font-medium">{breakdown.mergeSpeedScore} / 15</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-muted-foreground">Multi-Reviewer (15%)</span>
                                <span className="font-medium">{breakdown.multiReviewerScore} / 15</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PRMetricsGrid({ metrics }: { metrics: PullRequestMetrics }) {
    const cards = [
        {
            title: "Avg PR Size",
            value: `${metrics.averagePRSize} lines`,
            desc: "Additions + Deletions",
            icon: <FileCode2 className="w-4 h-4" />,
            status: metrics.averagePRSize > 600 ? "warn" : "good"
        },
        {
            title: "Review Time",
            value: `${metrics.averageReviewTime} hrs`,
            desc: "Open to Merged",
            icon: <Clock className="w-4 h-4" />,
            status: (metrics.averageReviewTime < 1 || metrics.averageReviewTime > 48) ? "warn" : "good"
        },
        {
            title: "Unreviewed PRs",
            value: `${(metrics.unreviewedRatio * 100).toFixed(0)}%`,
            desc: "Zero review comments",
            icon: <GitPullRequestDraft className="w-4 h-4" />,
            status: metrics.unreviewedRatio > 0.4 ? "warn" : "good"
        },
        {
            title: "Large PR Ratio",
            value: `${(metrics.largePRRatio * 100).toFixed(0)}%`,
            desc: "> 500 lines changed",
            icon: <Activity className="w-4 h-4" />,
            status: metrics.largePRRatio > 0.3 ? "warn" : "good"
        }
    ];

    return (
        <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((card, idx) => (
                <div key={idx} className="flex flex-col justify-between p-5 transition-all border shadow-sm bg-card rounded-xl hover:shadow-md hover:bg-muted/10">
                    <div className="flex items-center justify-between mb-2 text-muted-foreground">
                        <span className="text-sm font-medium">{card.title}</span>
                        <div className={`p-2 rounded-full ${card.status === "good" ? "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-100/50 text-red-600 dark:bg-red-900/20 dark:text-red-400"}`}>
                            {card.icon}
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ContributorDiscipline({ insights }: { insights: PullRequestMetrics['contributorInsights'] }) {
    if (!insights) return null;

    const isHighRisk = insights.singleContributorRatio > 0.7;

    return (
        <div className="flex flex-col h-full p-6 transition-all border shadow-sm bg-card rounded-xl">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Contributor Discipline</h3>
            </div>

            <div className="space-y-4">
                {isHighRisk && (
                    <div className="flex gap-2 p-3 text-sm text-red-800 bg-red-100/50 rounded-lg dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/30">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p><strong>Ownership Risk:</strong> Single contributor dominance ({(insights.singleContributorRatio * 100).toFixed(0)}% of PRs). High Bus Factor.</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Participation Rate</p>
                        <p className="text-xl font-bold">{(insights.reviewParticipationRate * 100).toFixed(0)}%</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Top Contributor PRs</p>
                        <p className="text-xl font-bold">{insights.topContributors[0]?.prCount || 0}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Top Contributors</h4>
                    <div className="space-y-2">
                        {insights.topContributors.map((c, i) => (
                            <div key={i} className="flex flex-col p-3 text-sm rounded-md bg-muted/10 border border-transparent hover:border-border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{c.login}</span>
                                    <div className="flex gap-4 text-muted-foreground">
                                        <span className="flex items-center gap-1" title="Pull Requests"><GitPullRequestDraft className="w-3 h-3" /> {c.prCount}</span>
                                        <span className="flex items-center gap-1" title="Lines Changed"><FileCode2 className="w-3 h-3" /> {c.linesChanged > 1000 ? (c.linesChanged / 1000).toFixed(1) + 'k' : c.linesChanged}</span>
                                    </div>
                                </div>
                                {c.personaTags && c.personaTags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {c.personaTags.map((tag, tagIdx) => (
                                            <span key={tagIdx} className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TechStackProfile({ distribution }: { distribution: PullRequestMetrics['languageDistribution'] }) {
    if (!distribution) return null;

    const isFragmented = distribution.fragmentationScore > 0.5;
    const sortedLanguages = Object.entries(distribution.languages)
        .sort(([, a], [, b]) => b - a);

    const totalBytes = sortedLanguages.reduce((acc, [, bytes]) => acc + bytes, 0);

    return (
        <div className="flex flex-col h-full p-6 transition-all border shadow-sm bg-card rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold">Tech Stack Profile</h3>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800/30">
                    {distribution.primaryLanguage}
                </span>
            </div>

            <div className="space-y-5">
                <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Complexity Index</span>
                        <span className={`text-sm font-bold ${isFragmented ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {(distribution.fragmentationScore * 10).toFixed(1)} / 10
                        </span>
                    </div>
                    {isFragmented && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">High fragmentation indicates a mixed stack layer or legacy migration.</p>}
                </div>

                <div>
                    <div className="flex w-full h-3 rounded-full overflow-hidden mb-3">
                        {sortedLanguages.slice(0, 5).map(([lang, bytes], i) => {
                            const pct = Math.max(1, (bytes / totalBytes) * 100);
                            const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500'];
                            return <div key={lang} style={{ width: `${pct}%` }} className={colors[i % colors.length]} title={`${lang}: ${pct.toFixed(1)}%`} />;
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {sortedLanguages.slice(0, 4).map(([lang, bytes], i) => {
                            const pct = (bytes / totalBytes) * 100;
                            const colors = ['text-indigo-500', 'text-emerald-500', 'text-amber-500', 'text-rose-500'];
                            return (
                                <div key={lang} className="flex items-center gap-2 text-xs">
                                    <div className={`w-2 h-2 rounded-full ${colors[i % colors.length].replace('text-', 'bg-')}`} />
                                    <span className="truncate">{lang}</span>
                                    <span className="text-muted-foreground ml-auto">{pct.toFixed(0)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReviewDeepDive({ deepDive }: { deepDive: PullRequestMetrics['reviewDeepDive'] }) {
    if (!deepDive) return null;

    return (
        <div className="p-6 transition-all border shadow-sm bg-card rounded-xl">
            <div className="flex items-center gap-2 mb-6">
                <GitMerge className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-semibold">Review Discipline Deep Dive</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-xl bg-background shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Multi-Reviewer PRs</p>
                        <p className="text-2xl font-bold">{(deepDive.multipleReviewersRatio * 100).toFixed(0)}%</p>
                    </div>
                </div>

                <div className="p-4 border rounded-xl bg-background shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Avg. Comments</p>
                        <p className="text-2xl font-bold">{deepDive.averageComments.toFixed(1)}</p>
                    </div>
                </div>

                <div className="p-4 border rounded-xl bg-background shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Median Review Time</p>
                        <p className="text-2xl font-bold">{deepDive.medianReviewTime}h</p>
                    </div>
                </div>

                <div className="p-4 border rounded-xl bg-background shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-lg shrink-0 ${deepDive.fastMergeRatio > 0.4 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            Fast Merge Ratio
                            <span className="text-[10px] bg-muted px-1 rounded">&lt;30m</span>
                        </p>
                        <p className="text-2xl font-bold">{(deepDive.fastMergeRatio * 100).toFixed(0)}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AIRiskNarrativeCard({ narrative }: { narrative: PullRequestMetrics['aiRiskNarrative'] }) {
    if (!narrative) return null;

    const isExcellent = narrative.severity === "Excellent";
    const isCritical = (narrative.severity as string) === "Critical";
    const isHigh = narrative.severity === "High";

    return (
        <div className="flex flex-col p-6 transition-all border shadow-sm bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl border-indigo-500/20">
            <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-400">AI Risk Narrative</h3>
            </div>

            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-4">
                "{narrative.explanation}"
            </p>

            <div className={`p-3 rounded-lg border text-sm mb-4 ${isExcellent ? 'bg-emerald-100/50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800/30 dark:text-emerald-300' :
                isCritical || isHigh ? 'bg-red-100/50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300' :
                    'bg-amber-100/50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/30 dark:text-amber-300'
                }`}>
                <strong>{narrative.severity} Severity:</strong> {narrative.severityJustification}
            </div>

            {narrative.recommendedActions && narrative.recommendedActions.length > 0 && (
                <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recommended Actions</h4>
                    <ul className="space-y-2">
                        {narrative.recommendedActions.map((action: string, i: number) => (
                            <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <span className="text-indigo-500 font-bold mt-0.5">•</span>
                                <span>{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function SmartAlertsList({ alerts }: { alerts: PullRequestMetrics['smartAlerts'] }) {
    if (!alerts || alerts.length === 0) return null;

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const isCritical = criticalCount > 0;

    return (
        <div className={`p-4 rounded-xl border ${isCritical ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
            <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className={`w-5 h-5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
                <h3 className="font-semibold text-foreground">
                    Active Smart Alerts
                </h3>
                <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full ${isCritical ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                    {alerts.length} Issue{alerts.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="space-y-3">
                {alerts.map(alert => (
                    <div key={alert.id} className="flex gap-3 items-start bg-background p-3 rounded-lg border shadow-sm">
                        <div className="mt-0.5">
                            {alert.severity === 'critical' ? (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">{alert.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PRHealthTrend({ repositoryId, currentScore }: { repositoryId: string, currentScore: number }) {
    const [trendData, setTrendData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('1m');

    useEffect(() => {
        async function fetchTrends() {
            setLoading(true);
            try {
                const res = await fetch(`/api/repositories/${repositoryId}/pr-trends?range=${timeRange}`);
                if (res.ok) {
                    const data = await res.json();

                    // Format dates and ensure we have data
                    let formattedData = (data.trends || []).map((t: any) => ({
                        date: new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        score: t.health_score,
                        size: t.avg_pr_size
                    }));

                    setTrendData(formattedData);
                }
            } catch (err) {
                console.error("Failed to fetch trends", err);
            } finally {
                setLoading(false);
            }
        }

        fetchTrends();
    }, [repositoryId, currentScore, timeRange]);

    if (!loading && trendData.length === 0) return null;

    return (
        <div className="flex flex-col h-[300px] p-6 transition-all border shadow-sm bg-card rounded-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold">PR Health Trend</h3>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-sm border rounded-md px-2 py-1 bg-background text-foreground focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                    <option value="1m">Last 4 Weeks</option>
                    <option value="3m">Last 3 Months</option>
                    <option value="6m">Last 6 Months</option>
                </select>
            </div>

            <div className="flex-1 w-full h-full min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                            itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            name="Health Score"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
