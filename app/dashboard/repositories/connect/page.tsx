"use client";

import { Database, Search, Settings, Folder, CheckCircle, Star, ChevronLeft, ChevronRight, Zap, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RepositorySelection() {
    const [repositories, setRepositories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [connectingId, setConnectingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await fetch("/api/github/repos");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch repositories.");
                }

                // Add a selected property to the Github repos for the UI
                const reposWithUIState = data.repos.map((r: any) => ({ ...r, selected: false }));
                setRepositories(reposWithUIState);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRepos();
    }, []);

    const handleSelectRepo = (id: number) => {
        setRepositories(repos => repos.map(repo =>
            repo.id === id ? { ...repo, selected: !repo.selected } : repo
        ));
    };

    const handleConnectSelected = async () => {
        const selectedRepo = repositories.find(r => r.selected);
        if (!selectedRepo) {
            setError("Please select at least one repository to connect.");
            return;
        }

        setConnectingId(selectedRepo.id);
        setError(null);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Not authenticated");

            // 1. Insert into repositories table
            const { data: insertedRepo, error: dbError } = await supabase
                .from('repositories')
                .insert({
                    user_id: user.id,
                    github_id: selectedRepo.id,
                    name: selectedRepo.name,
                    full_name: selectedRepo.full_name,
                    description: selectedRepo.description,
                    url: selectedRepo.html_url,
                    visibility: selectedRepo.private ? 'private' : 'public'
                })
                .select()
                .single();

            if (dbError) {
                if (dbError.code !== '23505') throw dbError;
                // Wait, if it exists, we still want to generate a report for it? 
                // Actually if it exists, we just let it connect or pull the existing one
            }

            const repoIdToUse = insertedRepo ? insertedRepo.id : null;

            if (repoIdToUse) {
                await fetch("/api/reports/generate", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ repository_id: repoIdToUse })
                });
            }

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
            setConnectingId(null);
        }
    };

    const hasSelection = repositories.some(r => r.selected);

    return (
        <div className="bg-background-light dark:bg-[#151022] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display relative overflow-hidden">
            {/* Abstract Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

            {/* Top Navigation */}
            <header className="w-full border-b border-slate-200 dark:border-primary/20 px-6 py-4 flex items-center justify-between bg-white/50 dark:bg-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                        <Database className="text-white w-6 h-6" />
                    </div>
                    <Link href="/dashboard/repositories" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Repositories
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full mb-12">
                <div className="w-full max-w-4xl mt-12">
                    {/* Header Content */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold mb-3 tracking-tight text-slate-900 dark:text-slate-100">Select a Repository</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
                            Choose a project from your GitHub account to begin your AI-powered engineering intelligence journey.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8 border border-red-200 dark:border-red-800/50 max-w-2xl mx-auto">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Main Selection Card */}
                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        {/* Search & Filters */}
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 dark:bg-white/5">
                            <div className="relative w-full flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent focus:ring-2 focus:ring-primary rounded-lg py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none transition-all"
                                    placeholder="Search your GitHub repositories..."
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Repository List */}
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-100/90 dark:bg-[#151022]/90 backdrop-blur-sm z-20">
                                    <tr className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 dark:border-white/5">
                                        <th className="px-8 py-4">Repository Name</th>
                                        <th className="px-6 py-4">Visibility</th>
                                        <th className="px-6 py-4">Language</th>
                                        <th className="px-6 py-4 text-right">Stars</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                                                    <p>Fetching your repositories from GitHub...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : repositories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-slate-500">
                                                No repositories found.
                                            </td>
                                        </tr>
                                    ) : repositories.map((repo) => (
                                        <tr
                                            key={repo.id}
                                            onClick={() => handleSelectRepo(repo.id)}
                                            className={`transition-all cursor-pointer group ${repo.selected ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-slate-50 dark:hover:bg-primary/5 border-l-4 border-l-transparent'}`}
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    {repo.selected ? (
                                                        <CheckCircle className="text-primary w-5 h-5 flex-shrink-0" />
                                                    ) : (
                                                        <Folder className="text-slate-400 group-hover:text-primary transition-colors w-5 h-5 flex-shrink-0" />
                                                    )}
                                                    <div>
                                                        <div className={`font-medium transition-colors ${repo.selected ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-900 dark:text-slate-100 group-hover:text-primary'}`}>
                                                            {repo.name}
                                                        </div>
                                                        <div className={`text-xs ${repo.selected ? 'text-primary/80' : 'text-slate-500'}`}>
                                                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm">
                                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-tight ${repo.private ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'}`}>
                                                    {repo.private ? 'Private' : 'Public'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    {repo.language || 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right text-sm text-slate-500">{repo.stargazers_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / Action Area */}
                        <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-1">
                                {!isLoading && (
                                    <span className="text-sm text-slate-500">Showing {repositories.length} repositories</span>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={handleConnectSelected}
                                    disabled={!hasSelection || connectingId !== null}
                                    className={`flex items-center justify-center gap-2 px-8 py-6 rounded-lg font-bold shadow-lg transition-all hover:scale-[1.02] ${hasSelection ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed border-none'}`}
                                >
                                    {connectingId !== null ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            Connect & Analyze
                                            <Zap className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
