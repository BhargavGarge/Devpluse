"use client";

import { Activity, Search, Bell, Moon, User, Terminal, CreditCard, Shield, AlertTriangle, Edit2, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountSettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [github, setGithub] = useState<any>(null);

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
        if (!confirm("DANGER: Are you absolutely sure you want to delete your entire account? This action cannot be undone.")) {
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
            <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-primary/20 bg-background-light dark:bg-background-dark px-6 md:px-12 py-4 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">DevPulse</h2>
                    </div>
                    <div className="hidden md:flex">
                        <label className="flex flex-col min-w-64 h-10">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 dark:border-primary/10 bg-slate-100 dark:bg-primary/5 focus-within:border-primary transition-all">
                                <div className="text-slate-500 flex items-center justify-center pl-3">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-none focus:ring-0 placeholder:text-slate-400 text-sm font-medium px-3" placeholder="Search commands or docs..." />
                            </div>
                        </label>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/20 transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button className="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/20 transition-colors">
                        <Moon className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-primary/20 mx-2"></div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBMLFSxfkUylF8TefcDQEdd-k7s4mCERhB61UZN39cRnSi101aDJaOkzTC5e2-eRkH8g7ooHtamr342xIKLMQ34dxUwNWw2KEmu9cqZHXRTB51TdRhVvjDZRwqI3FfjZW-M5-ZBUly3JA1ftPOP340qE1-w3FkoNiYl5qBgFOpKwDXR3lMAyVQznGTmlLCSxCx72gWk-DSa_Bw1XKifJQ67rKSH_8Orbi_uZfMEBMlzrvnrKNSTCaxNZVooMwpY73C6TbrhekKwLsQ")' }}></div>
                </div>
            </header>

            <div className="flex flex-1 flex-col md:flex-row max-w-7xl mx-auto w-full px-6 md:px-12 py-8 gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="flex flex-col gap-1 sticky top-24">
                        <h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest px-4 mb-2">Settings</h3>
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium transition-all group">
                            <User className="w-5 h-5" />
                            <span>Profile</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 transition-all group">
                            <Terminal className="w-5 h-5" />
                            <span>GitHub Integration</span>
                        </Link>
                        <Link href="/settings/billing" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 transition-all group">
                            <CreditCard className="w-5 h-5" />
                            <span>Billing</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 transition-all group">
                            <Shield className="w-5 h-5" />
                            <span>Security</span>
                        </Link>
                        <div className="h-[1px] bg-slate-200 dark:bg-primary/10 my-4 mx-4"></div>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Danger Zone</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 max-w-4xl">
                    <section className="mb-10">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Account Settings</h1>
                            <p className="text-slate-500 dark:text-slate-400">Configure your personal identity and workspace preferences.</p>
                        </div>

                        {/* Profile Information Card */}
                        <div className="bg-white dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/10 overflow-hidden shadow-sm">
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
                                    <div className="relative group">
                                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 border-4 border-white dark:border-[#0a0714] shadow-xl" style={{ backgroundImage: `url("${github?.data?.avatar_url || profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb5g1_B6jZh0ntCNOEw7NguTW0oMYfdSKTUQ7X8XfLyC4H4BZVpdJJ92VDbOOptVWT0sVM4cqDF5Lv4Cv5ed-EAKIXjNXiIhWFNdFIByOP97BY7XYKPpmQRYHPUJAHxP2aB1DPdvnzqwBGIKCcrqkTP6cvp0eBsqpzvA3Vsf_YtquKWrJdKmip_YfvzD1WTm3CuUS1IPitMnt4g4g4LSlvZzFFk435R2I8VthwYVC2PHy-0_mCRH1L2h6G-jPd8KkPHnIokE2qmjk'}")` }}></div>
                                        <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{github?.data?.name || github?.data?.login || profile?.username || "DevPulse User"}</h2>
                                        <p className="text-slate-500 dark:text-slate-400 mb-4">{github?.data?.email || profile?.email}</p>
                                        <div className="flex gap-3">
                                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all">Update Photo</Button>
                                            <Button variant="secondary" className="bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-primary/20 transition-all">Remove</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</span>
                                        <input className="form-input rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-primary/5 focus:ring-primary focus:border-primary dark:text-white px-4 py-3 focus:outline-none" placeholder="Enter your full name" type="text" defaultValue={github?.data?.name || github?.data?.login || profile?.username || ""} />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</span>
                                        <input className="form-input rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-primary/5 focus:ring-primary focus:border-primary dark:text-white px-4 py-3 focus:outline-none" placeholder="Enter your email" type="email" defaultValue={github?.data?.email || profile?.email || ""} />
                                    </label>
                                    <label className="flex flex-col gap-2 md:col-span-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</span>
                                        <textarea className="form-input rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-primary/5 focus:ring-primary focus:border-primary dark:text-white px-4 py-3 focus:outline-none" placeholder="Write a short developer bio..." rows={3} defaultValue={github?.data?.bio || ""} />
                                    </label>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-primary/10 px-8 py-4 flex justify-end gap-3 border-t border-slate-200 dark:border-primary/10">
                                <Button variant="ghost" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Discard changes</Button>
                                <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all">Save Profile</Button>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">GitHub Integration</h2>
                            <p className="text-slate-500 dark:text-slate-400">Manage your connected repositories and sync frequency.</p>
                        </div>
                        <div className="bg-white dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/10 overflow-hidden shadow-sm">
                            <div className="p-8">
                                <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 bg-[#0B0F19] rounded-full flex items-center justify-center border border-white/20">
                                            <svg className="size-7 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">
                                                {github?.connected ? `Connected as @${github?.data?.login || profile?.username || 'user'}` : 'Not Connected'}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`size-2 rounded-full ${github?.connected ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                <p className={`text-xs font-medium ${github?.connected ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                                                    {github?.connected ? `Active Syncing • Last sync: ${new Date(github.last_synced_at).toLocaleString()}` : 'Disconnected'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all">
                                        <RefreshCw className="w-4 h-4" />
                                        Sync Now
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-primary/10">
                                        <div>
                                            <p className="text-sm font-bold dark:text-slate-200">Organization Access</p>
                                            <p className="text-xs text-slate-500">DevPulse-Engineering, Lab-AI-Ops</p>
                                        </div>
                                        <button className="text-sm font-bold text-primary hover:underline">Manage</button>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="text-sm font-bold dark:text-slate-200">Repository Syncing</p>
                                            <p className="text-xs text-slate-500">12 repositories selected for intelligence analysis</p>
                                        </div>
                                        <button className="text-sm font-bold text-primary hover:underline">Edit Selection</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-red-500 mb-1">Danger Zone</h2>
                            <p className="text-slate-500 dark:text-slate-400">Irreversible actions that affect your data and account access.</p>
                        </div>
                        <div className="bg-white dark:bg-red-500/5 rounded-xl border border-red-200 dark:border-red-500/20 overflow-hidden shadow-sm">
                            <div className="p-6 divide-y divide-red-100 dark:divide-red-500/10">
                                <div className="flex items-center justify-between py-4">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Disconnect GitHub Account</p>
                                        <p className="text-xs text-slate-500">You will no longer receive intelligence pulses for your repos.</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="text-red-600 border border-red-200 dark:border-red-500/40 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                        onClick={handleDisconnectGitHub}
                                        disabled={!github?.connected || isDisconnecting}
                                    >
                                        {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between py-4 pt-6">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Delete Account</p>
                                        <p className="text-xs text-slate-500">Permanently delete all historical analysis and account data.</p>
                                    </div>
                                    <Button
                                        className="bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "Deleting..." : "Delete Permanently"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex items-center justify-between text-slate-400 dark:text-slate-600 text-xs mt-12 mb-8">
                        <p>© 2024 DevPulse Intelligence Inc. All rights reserved.</p>
                        <div className="flex gap-4">
                            <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
                            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
