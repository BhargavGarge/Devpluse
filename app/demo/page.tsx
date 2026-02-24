import { Database, LayoutDashboard, BarChart2, Users, Settings as SettingsIcon, GitPullRequest, SearchIcon, Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PRReviewHealth from "@/components/pr-insights/PRReviewHealth";
import { DemoTour } from "@/components/demo/DemoTour";

export default function DemoPage() {
    const mockMetrics = {
        id: "demo",
        repositoryId: "demo-repo",
        averagePRSize: 245,
        averageReviewTime: 4.2,
        unreviewedRatio: 0.05,
        largePRRatio: 0.12,
        healthScore: 92,
        riskLevel: "Low",
        analyzedAt: new Date().toISOString(),
        contributorInsights: {
            singleContributorRatio: 0.2,
            reviewParticipationRate: 0.85,
            topContributors: [
                { login: "alice-dev", prCount: 14, linesChanged: 3400 },
                { login: "bob-engineer", prCount: 11, linesChanged: 2100 },
                { login: "carol-codes", prCount: 8, linesChanged: 1500 }
            ]
        },
        languageDistribution: {
            primaryLanguage: "TypeScript",
            fragmentationScore: 0.2,
            languages: {
                "TypeScript": 85000,
                "CSS": 12000,
                "HTML": 5000
            }
        },
        reviewDeepDive: {
            multipleReviewersRatio: 0.6,
            averageComments: 4.5,
            medianReviewTime: 2.1,
            fastMergeRatio: 0.25
        }
    };

    return (
        <div className="bg-background-light dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden font-display relative">
            <DemoTour />

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

                <nav className="flex-1 px-4 mt-6 space-y-2 pointer-events-none">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400">
                        <BarChart2 className="w-5 h-5" />
                        <span className="font-medium">Reports</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary">
                        <GitPullRequest className="w-5 h-5" />
                        <span className="font-medium">PR Insights</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Teams</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400">
                        <SettingsIcon className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </div>
                </nav>

                <div className="p-4 mt-auto">
                    <Link href="/register">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold pointer-events-auto">
                            Sign Up Now
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
                {/* Header */}
                <header className="w-full border-b border-slate-200 dark:border-primary/10 bg-white/80 dark:bg-[#151022]/80 backdrop-blur-md sticky top-0 z-10 px-10 py-4 flex items-center justify-between pointer-events-none">
                    <div>
                        <h2 className="text-xl font-bold">Pull Request Review Analytics</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Deep dive into your team's code review discipline (Demo Data)</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-500 dark:text-slate-400">
                            <Bell className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-primary/10 pl-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    demo_user
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Guest</p>
                            </div>
                            <div className="size-10 rounded-full bg-primary/20 border border-primary/40 p-0.5">
                                <div className="rounded-full w-full h-full bg-slate-300 dark:bg-slate-700" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto w-full relative z-0">
                    <div className="space-y-8 pointer-events-none" id="tour-ai-insights">
                        <PRReviewHealth repositoryId="demo-repo" initialMetrics={mockMetrics as any} />
                    </div>
                </div>
            </main>
        </div>
    );
}
