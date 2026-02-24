import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";
import { Database, ArrowLeft, Activity, Star, Calendar, CheckCircle, XCircle, Code, FileText, GitCommit, Settings, AlertTriangle, TrendingUp, Lightbulb, Zap, ShieldAlert, GitBranch, Target } from "lucide-react";
import Link from "next/link";
import ReportStructuredUI from "@/components/ReportStructuredUI";
import PRReviewHealth from "@/components/pr-insights/PRReviewHealth";

function MetricCard({ label, value, icon }: { label: string, value: any, icon: React.ReactNode }) {
    return (
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#2d2d35] rounded-xl p-4 flex flex-col">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
                {icon}
                <span className="text-xs uppercase tracking-wider font-bold truncate">{label}</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white truncate" title={String(value)}>
                {value ?? '-'}
            </div>
        </div>
    )
}

export default async function ReportDetails({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient()

    // Make sure user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const { data: report } = await supabase
        .from("reports")
        .select(`
id,
    score,
    ai_summary,
    score_breakdown,
    metrics_snapshot,
    created_at,
    repositories(id, name, full_name)
        `)
        .eq("id", id)
        .single() as any;

    if (!report) {
        return (
            <div className="bg-background-light dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 min-h-screen py-20 font-display flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Report Not Found</h1>
                <p className="text-slate-500 mb-8">The requested analysis report does not exist or you do not have permission to view it.</p>
                <Link href="/dashboard/reports" className="text-primary hover:underline">Return to Reports</Link>
            </div>
        )
    }

    const repositoryId = Array.isArray(report.repositories) ? report.repositories[0]?.id : report.repositories?.id;
    let initialPRMetrics = null;
    if (repositoryId) {
        const { data: prData } = await supabase
            .from("pull_request_metrics")
            .select('*')
            .eq("repository_id", repositoryId)
            .single();

        if (prData) {
            initialPRMetrics = {
                id: prData.id,
                repositoryId: prData.repository_id,
                averagePRSize: prData.average_pr_size,
                averageReviewTime: prData.average_review_time,
                unreviewedRatio: prData.unreviewed_ratio,
                largePRRatio: prData.large_pr_ratio,
                healthScore: prData.health_score,
                riskLevel: prData.risk_level,
                analyzedAt: prData.analyzed_at
            };
        }
    }

    return (
        <div className="bg-background-light dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 min-h-screen font-display">
            {/* Header */}
            <header className="w-full border-b border-slate-200 dark:border-primary/10 bg-white dark:bg-[#151022] sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/reports" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.created_at).toLocaleString()}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white dark:bg-[#151022] border border-slate-200 dark:border-[#2d2d35] rounded-3xl p-8 md:p-12 shadow-sm">

                    {/* Report Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-slate-200 dark:border-[#2d2d35] pb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center border border-primary/20">
                                    <Database className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-slate-500 font-medium uppercase tracking-widest text-sm">Repository Analysis</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                                {Array.isArray(report.repositories) ? report.repositories[0]?.name : report.repositories?.name}
                            </h1>
                            <p className="text-lg text-slate-500 font-mono">
                                {Array.isArray(report.repositories) ? report.repositories[0]?.full_name : report.repositories?.full_name}
                            </p>
                        </div>

                        {/* Score Badge */}
                        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-[#2d2d35] rounded-2xl p-6 min-w-[200px]">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Health Score</span>
                            {(() => {
                                let displayScore = report.score;
                                let parsedScore = null;
                                try {
                                    parsedScore = JSON.parse(report.ai_summary);
                                    if (parsedScore && parsedScore.healthScore && typeof parsedScore.healthScore.score === 'number') {
                                        displayScore = parsedScore.healthScore.score;
                                    }
                                } catch (e) {
                                    // Default to db score
                                }

                                return (
                                    <>
                                        <div className={`text-6xl font-black ${displayScore >= 80 ? 'text-emerald-500' :
                                            displayScore >= 60 ? 'text-amber-500' : 'text-red-500'
                                            }`}>
                                            {displayScore}
                                        </div>
                                        <div className="text-slate-400 font-medium text-sm mt-1 mb-2">out of 100</div>
                                        {parsedScore?.healthScore?.summary && (
                                            <p className="text-xs text-center text-slate-500 leading-relaxed font-medium">
                                                {parsedScore.healthScore.summary}
                                            </p>
                                        )}
                                    </>
                                )
                            })()}
                        </div>
                    </div>

                    {/* AI Summary Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 text-white">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Technical Due Diligence Report</h2>
                                <p className="text-sm text-slate-500 font-medium">Interactive Risk Engine and architectural insights</p>
                            </div>
                        </div>

                        {(() => {
                            let parsedSummary = null;
                            try {
                                parsedSummary = JSON.parse(report.ai_summary);
                            } catch (e) {
                                // Fallback for old string-based reports
                            }

                            if (parsedSummary) {
                                // Map legacy format (executiveOverview) to new Risk Engine format
                                if (parsedSummary.executiveOverview && !parsedSummary.executiveSnapshot) {
                                    const score = parsedSummary.healthScore?.score || 50;
                                    const isPerfect = score >= 90;
                                    parsedSummary = {
                                        ...parsedSummary,
                                        executiveSnapshot: {
                                            productionReady: isPerfect,
                                            maintenanceRisk: score < 60 ? "High" : score < 80 ? "Medium" : "Low",
                                            scalingReadiness: score < 60 ? "Low" : score < 80 ? "Medium" : "High",
                                            securityRisk: parsedSummary.metrics?.dependencyHealth?.includes('Moderate') ? "Moderate" : "Low",
                                            investmentRecommendation: parsedSummary.executiveOverview || parsedSummary.healthScore?.summary
                                        },
                                        healthBreakdown: {
                                            codeQuality: { score: Math.floor(score * 0.2), risk: "Moderate", impact: "Medium" },
                                            testing: { score: parsedSummary.metrics?.hasTests ? 20 : 0, risk: parsedSummary.metrics?.hasTests ? "Low" : "Critical", impact: "High" },
                                            documentation: { score: parsedSummary.metrics?.hasReadme ? 10 : 0, risk: parsedSummary.metrics?.hasReadme ? "Low" : "High", impact: "Medium" },
                                            dependencyRisk: { score: 10, risk: "Moderate", impact: "High" },
                                            activityMaintenance: { score: 10, risk: "Moderate", impact: "Medium" },
                                            architectureModularity: { score: Math.floor(score * 0.2), risk: "Moderate", impact: "Medium" },
                                            totalScore: score
                                        },
                                        riskBoard: [
                                            ...(parsedSummary.codeQuality?.weaknesses || []).map((w: string) => ({
                                                title: w.length > 50 ? w.substring(0, 47) + "..." : w,
                                                severity: "High",
                                                impact: "High",
                                                businessRisk: "Code maintainability",
                                                fixEffort: "1-3 days",
                                                confidence: 85,
                                                description: w
                                            })),
                                            ...(parsedSummary.architecturalInsights || []).map((a: string) => ({
                                                title: a.length > 50 ? a.substring(0, 47) + "..." : a,
                                                severity: "Moderate",
                                                impact: "Medium",
                                                businessRisk: "Scalability",
                                                fixEffort: "3-5 days",
                                                confidence: 80,
                                                description: a
                                            }))
                                        ],
                                        technicalDebtMeter: {
                                            dependencyToFileRatio: (parsedSummary.metrics?.dependencies / Math.max(parsedSummary.metrics?.totalFiles || 1, 1)).toFixed(2),
                                            testToFileRatio: parsedSummary.metrics?.hasTests ? "0.1" : "0",
                                            commitVelocity: "Medium",
                                            contributorBusFactor: "High",
                                            technicalDebtIndex: 100 - score,
                                            riskTrend: "Stable"
                                        }
                                    };
                                }

                                // Use the new Risk Engine UI component if the schema matches
                                // We check for any of the new keys
                                if (parsedSummary.executiveSnapshot || parsedSummary.healthBreakdown || parsedSummary.riskBoard) {
                                    return <ReportStructuredUI parsedSummary={parsedSummary} />;
                                }

                                // Legacy fallback rendering for old reports...
                                return (
                                    <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                                        <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-6 rounded-r-2xl text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                                            <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(parsedSummary, null, 2)}</pre>
                                        </div>
                                    </div>
                                );
                            }

                            // Fallback to raw string if nothing parsed cleanly
                            return (
                                <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                                    <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-6 rounded-r-2xl text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                                        {report.ai_summary}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* PR Review Health Section */}
                    {repositoryId && (
                        <PRReviewHealth repositoryId={repositoryId} initialMetrics={initialPRMetrics} />
                    )}

                    {/* Repository Metrics Section */}
                    {report.metrics_snapshot && (
                        <div className="mt-12 pt-10 border-t border-slate-200 dark:border-[#2d2d35]">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <Activity className="w-6 h-6 text-primary" />
                                Repository Signals
                            </h3>

                            {(() => {
                                let aiMetrics = null;
                                try {
                                    const parsed = JSON.parse(report.ai_summary);
                                    if (parsed && parsed.metrics) aiMetrics = parsed.metrics;
                                } catch (e) { }

                                const renderMetrics = aiMetrics || report.metrics_snapshot;

                                return (
                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <MetricCard
                                                label="Language"
                                                value={renderMetrics.primaryLanguage || renderMetrics.primary_language}
                                                icon={<FileText className="w-4 h-4" />}
                                            />
                                            <MetricCard
                                                label="Dependencies"
                                                value={renderMetrics.dependencies}
                                                icon={<Settings className="w-4 h-4" />}
                                            />
                                            <MetricCard
                                                label="30-Day Commits"
                                                value={renderMetrics.recentCommits || renderMetrics.commitsLast30Days}
                                                icon={<GitCommit className="w-4 h-4" />}
                                            />
                                            <MetricCard
                                                label="Contributors"
                                                value={renderMetrics.contributors || 1}
                                                icon={<Target className="w-4 h-4" />}
                                            />
                                        </div>

                                        <div className="mt-6 flex flex-wrap gap-4 items-center">
                                            <div className={`px-5 py-3 rounded-xl border flex items-center gap-3 text-sm font-bold tracking-wide ${renderMetrics.hasReadme ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'}`}>
                                                {renderMetrics.hasReadme ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                                README.md
                                            </div>
                                            <div className={`px-5 py-3 rounded-xl border flex items-center gap-3 text-sm font-bold tracking-wide ${renderMetrics.hasTests ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400'}`}>
                                                {renderMetrics.hasTests ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                                Test Suite
                                            </div>

                                            {aiMetrics && aiMetrics.dependencyHealth && (
                                                <div className="px-5 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2">
                                                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                                                    <span className="font-bold">Health:</span> {aiMetrics.dependencyHealth}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                    )}

                </div>
            </main>
        </div>
    )
}

function SparklesMiniIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3a9 9 0 0 0 9 9 9 9 0 0 0-9 9 9 9 0 0 0-9-9 9 9 0 0 0 9-9Z" />
            <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />
        </svg>
    )
}
