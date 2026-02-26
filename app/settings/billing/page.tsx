"use client";

import { useEffect, useState } from "react";
import { Activity, Search, Bell, Calendar, CreditCard, ArrowUpCircle, Receipt, Filter, Download, Edit2, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BillingData {
    plan: "starter" | "pro";
    status: string;
    billingInterval?: "monthly" | "yearly";
    currentPeriodEnd?: number;
    card?: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
    invoices?: {
        id: string;
        date: number;
        amount: number;
        status: string;
        invoiceUrl: string;
    }[];
}

export default function BillingPage() {
    const [billingData, setBillingData] = useState<BillingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    useEffect(() => {
        fetch("/api/billing/summary")
            .then((res) => res.json())
            .then((data) => {
                setBillingData(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch billing data", err);
                setIsLoading(false);
            });
    }, []);

    async function openPortal() {
        setIsPortalLoading(true);
        try {
            const res = await fetch("/api/billing/create-portal-session", { method: "POST" });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Failed to open portal", error);
        } finally {
            setIsPortalLoading(false);
        }
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-[#0f0f12] text-slate-900 dark:text-slate-100 font-display">
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-3 bg-white/5 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="size-8 bg-gradient-to-br from-[#5b2bee] to-[#8b5cf6] rounded-lg flex items-center justify-center text-white">
                                <Activity className="w-5 h-5" />
                            </div>
                            <Link href="/" className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">DevPulse</Link>
                        </div>
                        <div className="hidden md:flex items-center gap-1">
                            <label className="flex flex-col min-w-40 h-10 max-w-64">
                                <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <div className="text-slate-500 flex items-center justify-center pl-3">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-none focus:ring-0 text-sm placeholder:text-slate-500 px-3" placeholder="Search insights..." />
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <nav className="hidden xl:flex items-center gap-8">
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-semibold transition-colors" href="/dashboard">Dashboard</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-semibold transition-colors" href="/dashboard/analysis">Intelligence</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-semibold transition-colors" href="/dashboard/reports">Reports</Link>
                            <Link className="text-primary text-sm font-bold border-b-2 border-primary pb-1" href="/settings">Settings</Link>
                        </nav>
                        <div className="flex gap-3">
                            <Link href="/pricing" className="flex items-center justify-center rounded-xl h-10 px-4 bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                                Pro Plan
                            </Link>
                            <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                <Bell className="w-5 h-5" />
                            </button>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/30" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDiTQtvmAYsKSWnbwaUWl_JlacdI35cPzLqDGYGLZmGGWwP_d0VnunoEHdxqTOI-6dsH8fP1jpJS6Xayu4gpNhHY9uruH8aa_4i1yYZ-Y2GYTEvBpmybOKAm6CeL1ZagSJAVM5CmIjlKmKxCIrYjOo8cFGLXA-KyR2ldBZeNjZPZijj-QzIM97N0UDmpt8npTL5AP5Cawlipi7x3AqU5O78V48Frdia472xpPAjJ4MvFiohubCc-nyMyzJgY-NvD6nhTURhVJWja0E")' }}></div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-6 lg:px-40 py-8 max-w-[1440px] mx-auto w-full">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <Link className="text-slate-500 hover:text-primary" href="/settings">Settings</Link>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-900 dark:text-slate-100 font-medium">Billing & Subscriptions</span>
                    </div>

                    {/* Pending / Warning Banners */}
                    {billingData?.status && billingData.status !== "active" && billingData.status !== "canceling" && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4 text-red-500">
                            <AlertTriangle className="w-6 h-6 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm">Subscription Attention Needed</h4>
                                <p className="text-xs mt-1">Your subscription status is <strong>{billingData.status.replace("_", " ")}</strong>. Please update your payment method to restore full access to Pro features.</p>
                            </div>
                            <Button onClick={openPortal} className="ml-auto bg-red-500 hover:bg-red-600 text-white shadow-none text-xs h-8">Resolve Issue</Button>
                        </div>
                    )}

                    {/* Page Header */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-slate-900 dark:text-white text-4xl font-extrabold tracking-tight mb-2">Billing & Subscriptions</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Manage your workspace's financial health, usage, and scaling options.</p>
                        </div>
                        {billingData?.plan === "pro" && (
                            <Button
                                variant="outline"
                                onClick={openPortal}
                                disabled={isPortalLoading}
                                className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white flex items-center gap-2 shadow-sm rounded-xl h-10 w-fit shrink-0"
                            >
                                <ExternalLink className="w-4 h-4" />
                                {isPortalLoading ? "Opening..." : "Manage in Stripe"}
                            </Button>
                        )}
                    </div>

                    {/* Hero Section: Current Plan */}
                    <div className="glass-card rounded-2xl p-8 mb-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="w-32 h-32" />
                        </div>
                        {isLoading ? (
                            <div className="h-24 flex items-center justify-center text-slate-500 animate-pulse">Loading subscription details...</div>
                        ) : (
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Current Plan</span>
                                        {billingData?.plan === "pro" ? (
                                            <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> PRO
                                            </span>
                                        ) : (
                                            <span className="bg-slate-500/10 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-500/20 uppercase">
                                                STARTER
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">
                                        {billingData?.plan || "Starter"} Plan
                                        {billingData?.plan === "pro" && (
                                            <span className="text-slate-400 font-normal ml-2">
                                                ({billingData.billingInterval === "yearly" ? "$470/yr" : "$49/mo"})
                                            </span>
                                        )}
                                    </h2>
                                    {billingData?.plan === "pro" && billingData.currentPeriodEnd && (
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="w-5 h-5" />
                                                <span className="text-sm">
                                                    {billingData.status === "canceling" ? "Ends on: " : "Next billing date: "}
                                                    <strong>{new Date(billingData.currentPeriodEnd * 1000).toLocaleDateString()}</strong>
                                                </span>
                                            </div>
                                            {billingData.card && (
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <CreditCard className="w-5 h-5" />
                                                    <span className="text-sm capitalize">{billingData.card.brand} ending in <strong>{billingData.card.last4}</strong></span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {billingData?.plan !== "pro" ? (
                                        <Link href="/pricing">
                                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                                <ArrowUpCircle className="w-5 h-5" />
                                                Upgrade to Pro
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button size="lg" variant="outline" className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold transition-all border-slate-300 dark:border-slate-700">
                                            Plan Details
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                        {/* Usage Metrics Card */}
                        <div className="xl:col-span-2 glass-card rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Usage Metrics</h3>
                                </div>
                                <button className="text-primary text-sm font-semibold hover:underline">Buy Add-ons</button>
                            </div>
                            <div className="space-y-8">
                                {/* Metric 1 */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-slate-900 dark:text-slate-100 font-bold">AI Report Credits</p>
                                            <p className="text-xs text-slate-500">85 of 100 reports generated this month</p>
                                        </div>
                                        <p className="text-sm font-mono text-primary font-bold">85%</p>
                                    </div>
                                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-br from-[#5b2bee] to-[#8b5cf6] rounded-full shadow-[0_0_15px_rgba(91,43,238,0.4)]" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                {/* Metric 2 */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-slate-900 dark:text-slate-100 font-bold">Team Seats</p>
                                            <p className="text-xs text-slate-500">12 of 20 active engineers</p>
                                        </div>
                                        <p className="text-sm font-mono text-slate-400 font-bold">60%</p>
                                    </div>
                                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-400/50 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Metrics reset on the 1st of every month. Your credits roll over up to 20% if unused. Need more capacity? Explore Enterprise options.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Method</h3>
                            </div>
                            {billingData?.card ? (
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 text-white shadow-xl">
                                    <div className="absolute top-0 right-0 p-4 opacity-20 capitalize text-8xl font-black -mr-4 -mt-6">
                                        {billingData.card.brand}
                                    </div>
                                    <div className="mb-8">
                                        <CreditCard className="w-8 h-8 opacity-80" />
                                    </div>
                                    <div className="text-lg font-mono tracking-widest mb-4">**** **** **** {billingData.card.last4}</div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] uppercase text-slate-400 tracking-tighter">Status</p>
                                            <p className="text-sm font-semibold text-emerald-400">Active</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase text-slate-400 tracking-tighter">Expires</p>
                                            <p className="text-sm font-semibold">{billingData.card.exp_month}/{billingData.card.exp_year}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center text-center h-[200px]">
                                    <CreditCard className="w-10 h-10 text-slate-400 mb-3" />
                                    <p className="text-slate-500 font-medium">No payment method connected.</p>
                                    <p className="text-xs text-slate-400 mt-1">Upgrade to Pro to add billing details.</p>
                                </div>
                            )}
                            {billingData?.plan === "pro" && (
                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        onClick={openPortal}
                                        disabled={isPortalLoading}
                                        className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold transition-all border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Update Payment Method
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Billing History Table */}
                        <div className="xl:col-span-3 glass-card rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Receipt className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Billing History</h3>
                                </div>
                                <button className="text-slate-500 hover:text-primary transition-colors">
                                    <Filter className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-slate-500 text-xs uppercase tracking-wider bg-slate-100 dark:bg-slate-800/30">
                                            <th className="px-6 py-4 font-bold">Invoice ID</th>
                                            <th className="px-6 py-4 font-bold">Date</th>
                                            <th className="px-6 py-4 font-bold">Amount</th>
                                            <th className="px-6 py-4 font-bold">Status</th>
                                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {!billingData?.invoices || billingData.invoices.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                                                    No invoices available yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            billingData.invoices.map((inv, idx) => (
                                                <tr key={idx} className="hover:bg-primary/5 transition-colors group">
                                                    <td className="px-6 py-5 text-sm font-mono text-slate-900 dark:text-slate-100">{inv.id}</td>
                                                    <td className="px-6 py-5 text-sm text-slate-500">{new Date(inv.date * 1000).toLocaleDateString()}</td>
                                                    <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">${(inv.amount / 100).toFixed(2)}</td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">{inv.status}</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <a href={inv.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 flex items-center gap-1 justify-end ml-auto group-hover:underline w-fit">
                                                            <Download className="w-4 h-4" />
                                                            <span className="text-xs font-bold uppercase">Download</span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/10 text-center">
                                <button className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">View All Invoices</button>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Secondary Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-slate-200 dark:border-slate-800 gap-6">
                        <div className="flex items-center gap-8 text-sm text-slate-500">
                            <Link className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Privacy Policy</Link>
                            <Link className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Terms of Service</Link>
                            <Link className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Support Center</Link>
                        </div>
                        {billingData?.plan === "pro" && (
                            <button
                                onClick={openPortal}
                                disabled={isPortalLoading}
                                className="text-slate-400 hover:text-red-500 text-xs font-medium uppercase tracking-widest transition-colors disabled:opacity-50"
                            >
                                Cancel Subscription
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
