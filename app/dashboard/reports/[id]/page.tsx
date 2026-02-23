import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";
import { Database, ArrowLeft, Activity, Star, Calendar, CheckCircle, XCircle, Code, FileText, GitCommit, Settings, AlertTriangle, TrendingUp, Lightbulb, Zap, ShieldAlert, GitBranch, Target } from "lucide-react";
import Link from "next/link";

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
    repositories(name, full_name)
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
                                <p className="text-sm text-slate-500 font-medium">AI-generated architectural insights and roadmap</p>
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
                                // NEW FORMAT HANDLING (OpenAI generation)
                                if (parsedSummary.executiveOverview || parsedSummary.summary || parsedSummary.architecturalInsights || parsedSummary.codeQuality) {
                                    return (
                                        <div className="space-y-10">
                                            {/* Executive Overview */}
                                            {(parsedSummary.executiveOverview || parsedSummary.summary) && (
                                                <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-[#0a0a0c] border border-slate-800 dark:border-[#2d2d35] shadow-2xl">
                                                    <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                                                    <div className="absolute bottom-0 left-0 p-32 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

                                                    <div className="relative p-8 md:p-10 z-10">
                                                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <SparklesMiniIcon className="w-4 h-4" />
                                                            Executive Overview
                                                        </h3>
                                                        <p className="text-white text-lg md:text-xl leading-relaxed font-medium">
                                                            {parsedSummary.executiveOverview || parsedSummary.summary}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Key Insights Grid */}
                                            {parsedSummary.architecturalInsights && Array.isArray(parsedSummary.architecturalInsights) && parsedSummary.architecturalInsights.length > 0 && (
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                                        <Lightbulb className="w-5 h-5 text-amber-500" />
                                                        Key Architectural Insights
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {parsedSummary.architecturalInsights.map((insight: string, idx: number) => {
                                                            // Simple heuristic for icon selection based on content length or keywords
                                                            const isWarning = insight.toLowerCase().includes("absence") || insight.toLowerCase().includes("lack") || insight.toLowerCase().includes("issue") || insight.toLowerCase().includes("risk");
                                                            const isPositive = insight.toLowerCase().includes("benefit") || insight.toLowerCase().includes("positive") || insight.toLowerCase().includes("good") || insight.toLowerCase().includes("strong");

                                                            return (
                                                                <div key={idx} className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isWarning
                                                                    ? "bg-red-50/50 dark:bg-red-500/5 border-red-100 dark:border-red-900/30 hover:shadow-red-500/10"
                                                                    : isPositive
                                                                        ? "bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-900/30 hover:shadow-emerald-500/10"
                                                                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-[#2d2d35] hover:shadow-primary/5"
                                                                    }`}>
                                                                    <div className="flex items-start gap-4">
                                                                        <div className={`mt-1 flex-shrink-0 size-8 rounded-full flex items-center justify-center ${isWarning
                                                                            ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                                                                            : isPositive
                                                                                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                                                                : "bg-primary/10 text-primary dark:text-primary"
                                                                            }`}>
                                                                            {isWarning ? <ShieldAlert className="w-4 h-4" /> : isPositive ? <Zap className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                                                                        </div>
                                                                        <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                                                                            {insight}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                                {/* Code Quality Block */}
                                                {parsedSummary.codeQuality && (
                                                    <div className="col-span-1 lg:col-span-2 space-y-4">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="size-10 rounded-full bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-500">
                                                                <Code className="w-5 h-5" />
                                                            </div>
                                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Code Quality</h3>
                                                        </div>

                                                        {/* Strengths */}
                                                        {parsedSummary.codeQuality.strengths && Array.isArray(parsedSummary.codeQuality.strengths) && parsedSummary.codeQuality.strengths.length > 0 && (
                                                            <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5">
                                                                <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">Strengths</h4>
                                                                <ul className="space-y-2">
                                                                    {parsedSummary.codeQuality.strengths.map((s: string, i: number) => (
                                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                                            <span>{s}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Weaknesses */}
                                                        {parsedSummary.codeQuality.weaknesses && Array.isArray(parsedSummary.codeQuality.weaknesses) && parsedSummary.codeQuality.weaknesses.length > 0 && (
                                                            <div className="bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-900/30 rounded-2xl p-5">
                                                                <h4 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-3">Weaknesses</h4>
                                                                <ul className="space-y-2">
                                                                    {parsedSummary.codeQuality.weaknesses.map((w: string, i: number) => (
                                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                                                            <span>{w}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Recommendations */}
                                                        {parsedSummary.codeQuality.recommendations && Array.isArray(parsedSummary.codeQuality.recommendations) && parsedSummary.codeQuality.recommendations.length > 0 && (
                                                            <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5">
                                                                <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3">Recommendations</h4>
                                                                <ul className="space-y-2">
                                                                    {parsedSummary.codeQuality.recommendations.map((r: string, i: number) => (
                                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                                            <Activity className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                                                            <span>{r}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Fallback if it's still a string */}
                                                        {typeof parsedSummary.codeQuality === 'string' && (
                                                            <div className="p-5 border rounded-2xl bg-white dark:bg-[#151022] text-slate-700 dark:text-slate-300">
                                                                {parsedSummary.codeQuality}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Recommended Roadmap Timeline */}
                                                {parsedSummary.roadmap && Array.isArray(parsedSummary.roadmap) && parsedSummary.roadmap.length > 0 && (
                                                    <div className="col-span-1 lg:col-span-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#2d2d35] rounded-3xl p-8">
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                                            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                                <GitBranch className="w-5 h-5" />
                                                            </div>
                                                            Recommended Action Roadmap
                                                        </h3>
                                                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                                                            {parsedSummary.roadmap.map((step: string, idx: number) => {
                                                                // Infer tier from text
                                                                let tierColor = "text-slate-500";
                                                                let tierBg = "bg-white dark:bg-[#151022]";
                                                                if (step.toLowerCase().includes('immediate')) { tierColor = "text-red-500"; tierBg = "bg-red-50 dark:bg-red-500/10 border-red-200"; }
                                                                else if (step.toLowerCase().includes('short-term')) { tierColor = "text-blue-500"; tierBg = "bg-blue-50 dark:bg-blue-500/10 border-blue-200"; }
                                                                else if (step.toLowerCase().includes('long-term')) { tierColor = "text-purple-500"; tierBg = "bg-purple-50 dark:bg-purple-500/10 border-purple-200"; }

                                                                return (
                                                                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                                        {/* Icon Node */}
                                                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors ${tierBg} ${tierColor}`}>
                                                                            <span className="text-sm font-bold">{idx + 1}</span>
                                                                        </div>

                                                                        {/* Content */}
                                                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-slate-200 dark:border-[#2d2d35] bg-white dark:bg-white/5 shadow-sm group-hover:shadow-md transition-shadow">
                                                                            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">{step.replace(/^(Immediate|Short-term|Long-term):\s*/i, '')}</p>
                                                                            <span className={`inline-block mt-3 text-xs font-bold uppercase tracking-wider ${tierColor}`}>
                                                                                {step.match(/^(Immediate|Short-term|Long-term)/i)?.[0] || 'Milestone'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }

                                // LEGACY FALLBACK FORMAT HANDLING (deepseek old format)
                                else if (parsedSummary.executive_summary) {
                                    // Legacy structure rendering
                                    // (Skipping to keep it simple, or dropping it since old structure might not have executive_summary anymore anyway)
                                    // Let's just fall back to raw string for anything else that doesn't match the new schema.
                                }
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
