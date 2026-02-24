import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Bolt, Dashboard as DashboardIcon, People, Settings, Code, Search, Notifications, Link as LinkIcon, Visibility, Help, Shield } from "@mui/icons-material";
import { Activity, LayoutDashboard, Database, PlusCircle, Users, Settings as SettingsIcon, BarChart2, Search as SearchIcon, Bell, Link2Off, Link2, Eye, HelpCircle, ShieldCheck, ArrowRight, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardEmptyState() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch actual data
    const [{ count: repoCount }, { count: reportCount }, { data: recentReports }] = await Promise.all([
        supabase.from('repositories').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('reports').select('*, repositories(name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
    ]);

    const hasConnectedRepos = (repoCount || 0) > 0;
    const hasReports = (reportCount || 0) > 0;

    return (
        <div className="bg-background-light dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden font-display">
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-white dark:bg-[#151022] border-r border-slate-200 dark:border-primary/10 flex flex-col h-screen sticky top-0 z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_40px_rgba(91,43,238,0.2)]">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">DevPulse</h1>
                        <p className="text-xs text-primary font-medium uppercase tracking-widest">Engineering AI</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 mt-6 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                        <BarChart2 className="w-5 h-5" />
                        <span className="font-medium">Reports</span>
                    </Link>
                    <Link href="/dashboard/pr-insights" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
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

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 dark:bg-[#151022]/60 dark:backdrop-blur-md border border-slate-200 dark:border-primary/10 p-4 rounded-xl space-y-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Need help getting started?</p>
                        <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                            View Documentation
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen relative z-10">
                {/* Top Header */}
                <header className="h-20 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between px-10 bg-white/50 dark:bg-[#151022]/60 backdrop-blur-md">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-md">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                className="w-full bg-slate-100 dark:bg-[#0a0a0c]/50 border border-slate-200 dark:border-primary/10 rounded-lg pl-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                                placeholder="Search analytics..."
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-0 right-0 size-2.5 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></span>
                        </button>
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
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 flex flex-col p-10 overflow-y-auto w-full">
                    {!hasConnectedRepos ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="max-w-2xl w-full text-center space-y-10">
                                {/* Illustration Section */}
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full"></div>
                                    <div className="relative z-10 bg-white/50 dark:bg-[#151022]/60 backdrop-blur-md p-8 rounded-full border border-slate-200 dark:border-primary/20 flex items-center justify-center size-48 mx-auto">
                                        <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                        <Link2Off className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(91,43,238,0.8)]" />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">No repository connected yet</h2>
                                    <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
                                        DevPulse is ready to analyze your code. Connect your first GitHub repository to start generating AI engineering insights, performance metrics, and team health reports.
                                    </p>
                                </div>

                                {/* Action Section */}
                                <div className="flex flex-col items-center gap-6">
                                    <Link href="/dashboard/repositories">
                                        <Button size="lg" className="group relative flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(91,43,238,0.2)]">
                                            <Link2 className="w-6 h-6" />
                                            Connect Repository
                                        </Button>
                                    </Link>

                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
                                            <Eye className="w-4 h-4" />
                                            View Demo Data
                                        </button>
                                        <span className="text-slate-300 dark:text-slate-700">|</span>
                                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
                                            <HelpCircle className="w-4 h-4" />
                                            How it works
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-7xl mx-auto space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Overview</h2>
                                <p className="text-slate-500 dark:text-slate-400">Here's what's happening in your engineering projects today.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link href="/dashboard/repositories" className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-[#2d2d35] rounded-xl p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group relative overflow-hidden">
                                    <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
                                    <div className="flex items-center gap-3 mb-4 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                                        <Database className="w-5 h-5" />
                                        <h3 className="font-semibold text-sm">Connected Repositories</h3>
                                    </div>
                                    <p className="text-4xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{repoCount}</p>
                                    <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                                        View Repositories <ArrowRight className="w-3 h-3" />
                                    </div>
                                </Link>

                                <Link href="/dashboard/reports" className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-[#2d2d35] rounded-xl p-6 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all group relative overflow-hidden">
                                    <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
                                    <div className="flex items-center gap-3 mb-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">
                                        <BarChart2 className="w-5 h-5 text-emerald-500" />
                                        <h3 className="font-semibold text-sm">Generated Reports</h3>
                                    </div>
                                    <p className="text-4xl font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{reportCount}</p>
                                    <div className="mt-4 flex items-center gap-1 text-xs text-emerald-500 font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                                        View Reports <ArrowRight className="w-3 h-3" />
                                    </div>
                                </Link>

                                <Link href="/dashboard/repositories/connect" className="group bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <PlusCircle className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="font-semibold text-primary">Connect Another Repo</span>
                                </Link>
                            </div>

                            {!hasReports ? (
                                <div className="mt-12 bg-white/50 dark:bg-[#1a1a1e]/50 border border-slate-200 dark:border-[#2d2d35] rounded-xl p-10 text-center backdrop-blur-sm">
                                    <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Activity className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Generate your first report</h3>
                                    <p className="text-slate-500 max-w-md mx-auto mb-6">You've connected a repository, but haven't generated any AI insights yet. Let's analyze your code.</p>
                                    <Link href="/dashboard/repositories">
                                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-lg">
                                            Go to Repositories
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-12">
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">Recent Activity</h2>
                                    <div className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-[#2d2d35] rounded-xl overflow-hidden shadow-sm">
                                        <ul className="divide-y divide-slate-200 dark:divide-[#2d2d35]">
                                            {recentReports?.map((report) => (
                                                <li key={report.id} className="p-4 hover:bg-slate-50 dark:hover:bg-[#151022]/50 transition-colors flex items-center gap-4">
                                                    <div className="size-10 rounded-full bg-emerald-500/10 flex flex-shrink-0 items-center justify-center border border-emerald-500/20">
                                                        <Activity className="w-5 h-5 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                            Report generated for <span className="font-bold">{report.repositories?.name}</span>
                                                        </p>
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {new Date(report.created_at).toLocaleDateString()} at {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Score: {report.score}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Link href={`/dashboard/reports/${report.id}`}>
                                                            <Button variant="outline" size="sm" className="text-xs">
                                                                View
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Decorative background elements */}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
            </main>
        </div>
    );
}
