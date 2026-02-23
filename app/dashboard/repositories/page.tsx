import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Database, PlusCircle, Activity, Lock, Globe, AlertCircle, PlayCircle, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnalyzeButton } from "@/components/AnalyzeButton";

export default async function ConnectedRepositories() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all connected repositories for this user
    const { data: repositories, error } = await supabase
        .from('repositories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // We'll also want to know the latest report for each repo
    // To do this simply, we will fetch the reports and map them
    const { data: reports } = await supabase
        .from('reports')
        .select('repository_id, score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const getLatestReport = (repoId: string) => {
        return reports?.find(r => r.repository_id === repoId) || null;
    };

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
                            <Database className="w-5 h-5 text-primary" />
                            Repositories
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/repositories/connect">
                            <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                <PlusCircle className="w-4 h-4" />
                                Connect Repository
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Your Repositories</h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Manage your connected GitHub projects. Generate new AI reports or review historical data to track your engineering health over time.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8 border border-red-200 dark:border-red-800/50">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">Failed to load repositories: {error.message}</p>
                    </div>
                )}

                {(!repositories || repositories.length === 0) && !error ? (
                    <div className="bg-white/50 dark:bg-[#151022]/60 backdrop-blur-md border border-slate-200 dark:border-[#2d2d35] rounded-2xl p-16 text-center max-w-3xl mx-auto mt-20">
                        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Database className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No repositories connected</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                            Get started by connecting your first GitHub repository to unlock powerful AI engineering insights.
                        </p>
                        <Link href="/dashboard/repositories/connect">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 rounded-xl shadow-[0_0_40px_rgba(91,43,238,0.2)] hover:scale-105 transition-transform">
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Connect your first repo
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {repositories?.map((repo) => {
                            const latestReport = getLatestReport(repo.id);

                            return (
                                <div key={repo.id} className="bg-white dark:bg-[#151022] border border-slate-200 dark:border-[#2d2d35] rounded-2xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-primary/5 transition-all group flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-colors">
                                                <Database className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[300px]">
                                                        {repo.name}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${repo.visibility === 'private'
                                                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                                        : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                                        }`}>
                                                        {repo.visibility === 'private' ? (
                                                            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Private</span>
                                                        ) : (
                                                            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Public</span>
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono truncate max-w-[250px] sm:max-w-[350px]">
                                                    {repo.full_name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Repo Details & Latest Report */}
                                    <div className="bg-slate-50 dark:bg-[#0a0a0c] rounded-xl p-4 mb-6 flex-1 border border-slate-100 dark:border-[#2d2d35]/50">
                                        {latestReport ? (
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Latest Analysis</p>
                                                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                                                        {new Date(latestReport.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 mb-1">Health Score</p>
                                                    <p className={`font-bold text-lg ${latestReport.score >= 80 ? 'text-emerald-500' :
                                                        latestReport.score >= 60 ? 'text-amber-500' : 'text-red-500'
                                                        }`}>
                                                        {latestReport.score} / 100
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-center p-2">
                                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                                    <Activity className="w-4 h-4" />
                                                    No reports generated yet
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-[#2d2d35] mt-auto">
                                        <Link href="/dashboard/reports" className="flex-1">
                                            <Button variant="outline" className="w-full bg-transparent border-slate-300 dark:border-[#2d2d35] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2d2d35]">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Reports
                                            </Button>
                                        </Link>
                                        <AnalyzeButton repoId={repo.id} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
