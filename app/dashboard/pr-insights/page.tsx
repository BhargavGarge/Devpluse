import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Database, LayoutDashboard, BarChart2, Users, Settings as SettingsIcon, GitPullRequest, ChevronDown } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import PRReviewHealth from "@/components/pr-insights/PRReviewHealth";
import RepoSelectorClient from "@/components/pr-insights/RepoSelectorClient";

export default async function PRInsightsPage({ searchParams }: { searchParams: Promise<{ repoId?: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { repoId } = await searchParams;

    // Fetch repositories
    const { data: repositories } = await supabase
        .from('repositories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Determine active repository (defaults to the first one if searchParams.repoId is not specified)
    const activeRepoId = repoId || (repositories && repositories.length > 0 ? repositories[0].id : null);
    const activeRepo = repositories?.find(r => r.id === activeRepoId) || null;

    let initialPRMetrics = null;
    if (activeRepoId) {
        const { data: prData } = await supabase
            .from("pull_request_metrics")
            .select('*')
            .eq("repository_id", activeRepoId)
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
        <div className="bg-background-light dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden font-display">
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-white dark:bg-[#151022] border-r border-slate-200 dark:border-primary/10 flex flex-col h-screen sticky top-0 z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_40px_rgba(91,43,238,0.2)]">
                        <Database className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">DevPulse</h1>
                        <p className="text-xs text-primary font-medium uppercase tracking-widest">Engineering AI</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 mt-6 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                        <BarChart2 className="w-5 h-5" />
                        <span className="font-medium">Reports</span>
                    </Link>
                    <Link href="/dashboard/pr-insights" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary transition-colors cursor-pointer">
                        <GitPullRequest className="w-5 h-5" />
                        <span className="font-medium">PR Insights</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Teams</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                        <SettingsIcon className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </Link>
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-primary/10">
                        <LogoutButton />
                    </div>
                </nav>

            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Header */}
                <header className="w-full border-b border-slate-200 dark:border-primary/10 bg-white/80 dark:bg-[#151022]/80 backdrop-blur-md sticky top-0 z-10 px-10 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Pull Request Review Analytics</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Deep dive into your team's code review discipline</p>
                    </div>

                    <div className="flex items-center gap-3 border-l border-slate-200 dark:border-primary/10 pl-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {user.user_metadata?.user_name || user.user_metadata?.full_name || user.email?.split('@')[0]}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Authenticated</p>
                        </div>
                        <div className="size-10 rounded-full bg-primary/20 border border-primary/40 p-0.5">
                            <img
                                className="rounded-full w-full h-full object-cover"
                                alt="User profile"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjXgxnW4ShEHA2-mnNx-LE5OI3n3PBjiX0_YHy85B_Jb5PXiuQGBzgBt5OMGyoII1kiRdk08JfSsSvfPDU0WCRJdFG4BIERyzMc-XHnx2fw90Plvdvm3RjsWNhckfx31jBSkmMlZhogrtYOkI7IQKLXQbMb1ss0F88vrCPpEaK2Rhowxw4fLD7SyrLXqVVBxmF3nqaZ6QLg7oF4qGBJcMit4TtR7nc2xxUe2f8ct1AJql16AF60bNNWLilg6SCd3zw8GE4kiQ00hc"
                            />
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto w-full">
                    {!repositories || repositories.length === 0 ? (
                        <div className="text-center py-20">
                            <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium">No Repositories Found</h3>
                            <p className="text-sm text-slate-500 mb-6">Connect a repository to view PR Insights.</p>
                            <Link href="/dashboard/repositories/connect">
                                <Button>Connect Repository</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Repository Selector Dropdown Simulation */}
                            <div className="bg-white dark:bg-[#151022] border border-slate-200 dark:border-[#2d2d35] p-4 rounded-xl shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                        <GitPullRequest className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Target Repository</label>

                                        <div className="relative inline-block w-64">
                                            {/* Since this is a server component, we use native select or Links for navigation */}
                                            <div className="relative">
                                                <select
                                                    className="w-full appearance-none bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 py-1 pr-6 font-bold text-lg focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                                                    onChange={undefined} // handled client side if we split, but for SSR we just show a dropdown menu style
                                                >
                                                    <option>{activeRepo?.name || "Select Repository"}</option>
                                                </select>
                                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                            </div>
                                            {/* Server Side navigation workaround: We render real links disguised as dropdown options */}
                                            <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-[#2d2d35] rounded-lg shadow-lg opacity-0 invisible hover:opacity-100 hover:visible focus-within:opacity-100 focus-within:visible transition-all z-10 hidden group-hover/parent:block">
                                                {/* Requires client component for actual interactive select without JS hacks, so we make a simple client wrapper below */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <RepoSelectorClient repositories={repositories} activeRepoId={activeRepoId} />
                            </div>

                            {/* Render Component */}
                            {activeRepoId ? (
                                <PRReviewHealth repositoryId={activeRepoId} initialMetrics={initialPRMetrics} />
                            ) : null}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
