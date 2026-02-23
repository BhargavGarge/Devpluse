"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings as SettingsIcon, User, Github, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [github, setGithub] = useState<any>(null);

    // Form states
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchSettingsData = async () => {
            try {
                const res = await fetch('/api/profile/get');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data.profile);
                    setGithub(data.github);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Failed to fetch profile data', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettingsData();
    }, [router]);

    const handleDisconnectGitHub = async () => {
        if (!confirm("Are you sure you want to disconnect GitHub? This will remove all connected repositories and reports.")) {
            return;
        }

        setIsDisconnecting(true);
        try {
            const res = await fetch('/api/github/disconnect', { method: 'POST' });
            if (res.ok) {
                alert("GitHub disconnected successfully.");
                // Reload dashboard or settings
                window.location.reload();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to disconnect GitHub.");
        } finally {
            setIsDisconnecting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("DANGER: Are you absolutely sure you want to delete your entire account? This action cannot be undone and will permanently erase all data, insights, and history.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch('/api/account/delete', { method: 'POST' });
            if (res.ok) {
                alert("Your account has been deleted.");
                window.location.href = "/";
            } else {
                const data = await res.json();
                alert(`Failed to delete account: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete account. Ensure the SUPABASE_SERVICE_ROLE_KEY is configured.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-[#0a0a0c]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 min-h-screen font-display pb-12">
            {/* Header */}
            <header className="w-full border-b border-slate-200 dark:border-primary/10 bg-white dark:bg-[#151022] sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <span className="text-slate-300 dark:text-slate-700">/</span>
                        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                            <SettingsIcon className="w-5 h-5 text-primary" />
                            Settings
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">

                {/* Profile Card */}
                <div className="bg-white dark:bg-[#151022] border border-slate-200 dark:border-[#2d2d35] rounded-3xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
                        <User className="w-6 h-6 text-primary" />
                        Account Profile
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="size-24 rounded-full border-4 border-slate-100 dark:border-[#2d2d35] overflow-hidden bg-slate-100 dark:bg-[#2d2d35]">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-slate-400 m-auto mt-5" />
                            )}
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{profile?.username || "DevPulse User"}</p>
                            <p className="text-slate-500 mt-1">{profile?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Integrations Card */}
                <div className="bg-white dark:bg-[#151022] border border-slate-200 dark:border-[#2d2d35] rounded-3xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
                        <Github className="w-6 h-6 text-primary" />
                        Connected Integrations
                    </h2>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-[#2d2d35]">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                GitHub
                                {github?.connected ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase">Connected</span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold tracking-wide uppercase">Disconnected</span>
                                )}
                            </h3>
                            <p className="text-sm text-slate-500 mt-2">
                                {github?.connected
                                    ? `Last synced: ${new Date(github.last_synced_at).toLocaleString()}`
                                    : "Connect your GitHub account to generate AI-powered engineering insights."}
                            </p>
                        </div>
                        {github?.connected ? (
                            <Button
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                                onClick={handleDisconnectGitHub}
                                disabled={isDisconnecting}
                            >
                                {isDisconnecting ? "Disconnecting..." : "Disconnect Account"}
                            </Button>
                        ) : (
                            <Link href="/login">
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                                    Reconnect GitHub
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Danger Zone Card */}
                <div className="bg-white dark:bg-[#151022] border border-red-200 dark:border-red-900/50 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl pointer-events-none rounded-full"></div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-2 text-red-600 dark:text-red-500">
                        <AlertTriangle className="w-6 h-6" />
                        Danger Zone
                    </h2>
                    <p className="text-slate-500 mb-6">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-900/30">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Delete Account</h3>
                            <p className="text-sm text-slate-500 mt-1">Permanently erase all personal data, integrations, and generated reports.</p>
                        </div>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 px-8 disabled:opacity-50"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Account"}
                        </Button>
                    </div>
                </div>

            </main>
        </div>
    );
}
