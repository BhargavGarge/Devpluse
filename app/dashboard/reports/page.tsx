import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BarChart2, Calendar, Database, Eye, AlertCircle, Activity, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ReportsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all reports, joined with their repository data
    const { data: reports, error } = await supabase
        .from('reports')
        .select(`
            id,
            score,
            ai_summary,
            created_at,
            repositories (
                id,
                name,
                full_name
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="bg-background-light dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 min-h-screen font-display pb-12">
            {/* Header */}
            <header className="w-full border-b border-slate-200 dark:border-primary/10 bg-white dark:bg-[#151022] sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <span className="text-slate-300 dark:text-slate-700">/</span>
                        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                            <BarChart2 className="w-5 h-5 text-emerald-500" />
                            Reports
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Analysis Reports</h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        A history of all AI engineering insights generated for your connected repositories.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8 border border-red-200 dark:border-red-800/50">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">Failed to load reports: {error.message}</p>
                    </div>
                )}

                {(!reports || reports.length === 0) && !error ? (
                    <div className="bg-white/50 dark:bg-[#151022]/60 backdrop-blur-md border border-slate-200 dark:border-[#2d2d35] rounded-2xl p-16 text-center max-w-3xl mx-auto mt-20">
                        <div className="size-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BarChart2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No reports generated</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                            Go to your repositories to generate your first AI engineering insight report.
                        </p>
                        <Link href="/dashboard/repositories">
                            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-6 rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:scale-105 transition-transform">
                                <Database className="w-5 h-5 mr-2" />
                                Go to Repositories
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#151022] border border-slate-200 dark:border-[#2d2d35] rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-[#0a0a0c] border-b border-slate-200 dark:border-[#2d2d35]">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Repository</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Analyzed</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Health Score</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#2d2d35]">
                                {reports?.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-[#1a1a1e] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center border border-primary/20">
                                                    <Database className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 dark:text-white block">{report.repositories?.name}</span>
                                                    <span className="text-xs text-slate-500 font-mono">{report.repositories?.full_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    {new Date(report.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="text-xs text-slate-500 mt-1">
                                                    {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`text-lg font-bold flex items-center gap-1.5 ${report.score >= 80 ? 'text-emerald-500' :
                                                        report.score >= 60 ? 'text-amber-500' : 'text-red-500'
                                                    }`}>
                                                    <Activity className="w-4 h-4" />
                                                    {report.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link href={`/dashboard/reports/${report.id}`}>
                                                <Button variant="ghost" className="text-slate-500 hover:text-primary hover:bg-primary/5 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                    <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
