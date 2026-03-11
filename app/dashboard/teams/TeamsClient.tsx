"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users, LayoutDashboard, BarChart2, GitPullRequest, Settings as SettingsIcon,
    SearchIcon, Bell, Database, Plus, ChevronLeft, MoreHorizontal,
    Mail, Shield, ShieldAlert, Monitor, CircleDashed, Trash2, Code2, Clock, Pencil, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTeamAction, inviteMemberAction, assignRepoAction, updateTeamAction, deleteTeamAction, removeMemberAction, scanTeamRiskAction, revokeInviteAction } from "./actions";

// Types
export type TeamMemberInfo = {
    id: string;
    name: string;
    handle: string;
    role: string;
    avatar: string;
};

export type AssignedRepoInfo = {
    id: string;
    name: string;
    language: string;
    health: number;
    lastAnalyzed: string;
};

export type TeamAlert = {
    id: string;
    team_id: string;
    title: string;
    type: string;
    message: string;
    is_read: boolean;
    created_at: string;
};

export type TeamInviteInfo = {
    id: string;
    email: string;
    role: string;
    token: string;
    createdAt: string;
};

export type TeamActivityInfo = {
    id: string;
    type: string;
    description: string;
    createdAt: string;
};

export type TeamData = {
    id: string;
    workspace_id?: string;
    name: string;
    color: string;
    description: string;
    createdAt: string;
    members: TeamMemberInfo[];
    repos: AssignedRepoInfo[];
    health: number;
    healthTrend: number;
    alerts: TeamAlert[];
    invites: TeamInviteInfo[];
    activity: TeamActivityInfo[];
};

export type WorkspaceRepo = {
    id: string;
    name: string;
};

interface TeamsClientProps {
    teams: TeamData[];
    workspaceRepos: WorkspaceRepo[];
    currentUser: { id: string; name: string; role: string; avatar: string };
}

export default function TeamsClient({ teams, workspaceRepos, currentUser }: TeamsClientProps) {
    // State
    const [activeView, setActiveView] = useState<"overview" | "detail">("overview");
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Form submission states
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Derived state
    const selectedTeam = teams.find(t => t.id === selectedTeamId) || null;

    // Handlers
    const handleViewTeam = async (id: string) => {
        setSelectedTeamId(id);
        setActiveView("detail");

        // Asynchronously trigger a risk scan so alerts are fresh next time or populate shortly after
        try {
            await scanTeamRiskAction(id);
        } catch (e) {
            console.error("Failed to scan team PR risks contextually", e);
        }
    };

    const handleBack = () => {
        setActiveView("overview");
        setSelectedTeamId(null);
    };

    // Server Action wrappers
    const handleCreateTeam = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            await createTeamAction(formData);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to create team", error);
            alert("Failed to create team");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInviteMember = async (formData: FormData) => {
        if (!selectedTeamId) return;
        setIsSubmitting(true);
        try {
            const res = await inviteMemberAction(selectedTeamId, formData);
            if (res && 'error' in res) {
                alert(res.error);
            } else {
                setIsInviteOpen(false);
            }
        } catch (error) {
            console.error("Failed to invite member", error);
            alert("Failed to invite member");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTeam = async (formData: FormData) => {
        if (!selectedTeamId) return;
        setIsSubmitting(true);
        try {
            await updateTeamAction(selectedTeamId, formData);
            setIsEditOpen(false);
        } catch (error) {
            console.error("Failed to update team", error);
            alert("Failed to update team");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTeam = async () => {
        if (!selectedTeamId) return;
        setIsSubmitting(true);
        try {
            await deleteTeamAction(selectedTeamId);
            setIsDeleteOpen(false);
            setActiveView("overview");
            setSelectedTeamId(null);
        } catch (error) {
            console.error("Failed to delete team", error);
            alert("Failed to delete team");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!selectedTeamId) return;
        if (!confirm("Are you sure you want to remove this member?")) return;
        try {
            await removeMemberAction(selectedTeamId, memberId);
        } catch (error) {
            console.error("Failed to remove member", error);
            alert("Failed to remove member");
        }
    };

    const handleRevokeInvite = async (inviteId: string) => {
        if (!selectedTeamId) return;
        if (!confirm("Are you sure you want to revoke this invitation?")) return;
        setIsSubmitting(true);
        try {
            await revokeInviteAction(selectedTeamId, inviteId);
        } catch (error) {
            console.error("Failed to revoke invite", error);
            alert("Failed to revoke invite");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateReport = async (repoId: string) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repository_id: repoId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to generate report");
            alert("Repository analyzed and report generated successfully!");
        } catch (error: any) {
            console.error("Analysis failed:", error);
            alert(error.message || "Failed to analyze repository");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Derived Permissions
    const isWorkspaceOwner = selectedTeam?.workspace_id === currentUser.id; // requires passing workspace_id or user id to component
    const currentUserMemberRole = selectedTeam?.members.find(
        m => m.name === currentUser.name || m.handle === `@${currentUser.name}` || m.handle === currentUser.name
    )?.role || "Viewer";

    // We treat 'Admin' role from component props as a master owner for UI purposes since page.tsx mocks it
    const isCurrentUserOwner = currentUser.role === "Admin" || currentUserMemberRole === "Owner";
    const canAnalyze = isCurrentUserOwner || currentUserMemberRole === "Reviewer";

    // Tailwnind color map for safelisting dynamic shadows
    const shadowMap: Record<string, string> = {
        "bg-blue-500": "shadow-blue-500/30",
        "bg-purple-500": "shadow-purple-500/30",
        "bg-emerald-500": "shadow-emerald-500/30",
        "bg-amber-500": "shadow-amber-500/30",
        "bg-rose-500": "shadow-rose-500/30",
        "bg-cyan-500": "shadow-cyan-500/30",
    };

    // Helper components
    const HealthRing = ({ score, size = 16 }: { score: number, size?: number }) => {
        const colorClass = score > 75 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-red-500";
        const circumference = 2 * Math.PI * (size / 2 - 2);
        const strokeDashoffset = circumference - (score / 100) * circumference;

        return (
            <div className={`relative flex items-center justify-center`} style={{ width: size, height: size }}>
                <svg className="transform -rotate-90 w-full h-full">
                    <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="10%" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                    <circle
                        cx="50%" cy="50%" r="40%"
                        stroke="currentColor"
                        strokeWidth="10%"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className={`transition-all duration-1000 ease-out ${colorClass}`}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-300">{score || 0}</span>
            </div>
        );
    };

    const RoleBadge = ({ role }: { role: string }) => {
        const colors: Record<string, string> = {
            "Owner": "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
            "Reviewer": "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
            "Viewer": "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20"
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[role] || colors["Viewer"]}`}>
                {role}
            </span>
        );
    };

    const LangDot = ({ lang }: { lang: string }) => {
        const colors: Record<string, string> = {
            "TypeScript": "bg-blue-400",
            "JavaScript": "bg-yellow-400",
            "React": "bg-cyan-400",
            "Python": "bg-blue-500",
            "Go": "bg-cyan-500"
        };
        return <span className={`size-2 rounded-full ${colors[lang] || "bg-slate-400"}`} />;
    };

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
                    <Link href="/dashboard/pr-insights" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                        <GitPullRequest className="w-5 h-5" />
                        <span className="font-medium">PR Insights</span>
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Teams</span>
                    </div>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
                        <SettingsIcon className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </Link>
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
            <main className="flex-1 flex flex-col h-screen relative z-10 overflow-y-auto">
                {/* Top Header */}
                <header className="h-20 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between px-10 bg-white dark:bg-[#151022] sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-md">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                className="w-full bg-slate-100 dark:bg-[#0a0a0c]/50 border border-slate-200 dark:border-primary/10 rounded-lg pl-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                                placeholder="Search teams or people..."
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
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{currentUser.role}</p>
                            </div>
                            <div className="size-10 rounded-full bg-primary/20 border border-primary/40 p-0.5">
                                <img className="rounded-full w-full h-full object-cover" alt="User profile" src={currentUser.avatar} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-10 w-full max-w-7xl mx-auto space-y-8">
                    {activeView === "overview" && (
                        <>
                            {/* Teams Overview Header */}
                            <div className="flex items-end justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Teams</h2>
                                    <p className="text-slate-500 dark:text-slate-400">Organize engineers and track collective repo health</p>
                                </div>
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_20px_rgba(91,43,238,0.3)] transition-all hover:scale-105"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Create Team
                                </Button>
                            </div>

                            {/* Teams Grid */}
                            {teams.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {teams.map((team) => (
                                        <div
                                            key={team.id}
                                            className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-[rgba(255,255,255,0.06)] rounded-2xl p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group flex flex-col"
                                        >
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`size-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner ${team.color}`}>
                                                        {team.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors">{team.name}</h3>
                                                        <p className="text-sm text-slate-500">{team.members.length} members</p>
                                                    </div>
                                                </div>
                                                <div className="p-2">
                                                    <HealthRing score={team.health} size={48} />
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Code2 className="w-4 h-4" /> {team.repos.length} repos
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewTeam(team.id)}
                                                    className="text-primary hover:bg-primary/10 group-hover:translate-x-1 transition-transform"
                                                >
                                                    View Team
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl mt-10">
                                    <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                        <Users className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No teams yet</h3>
                                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Create one to start collaborating and tracking collective repository health.</p>
                                    <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white">
                                        <Plus className="w-4 h-4 mr-2" /> Create Team
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {activeView === "detail" && selectedTeam && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Detail Header */}
                            <div className="mb-8">
                                <button onClick={handleBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-6 group">
                                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Teams
                                </button>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg ${shadowMap[selectedTeam.color] || "shadow-blue-500/30"} ${selectedTeam.color}`}>
                                            {selectedTeam.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{selectedTeam.name}</h2>
                                                <button onClick={() => setIsEditOpen(true)} className="text-slate-400 hover:text-primary transition-colors focus:outline-none" title="Edit Team">
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                    <SettingsIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <p className="text-slate-500 flex items-center gap-2 mt-1">
                                                <span>{selectedTeam.members.length} members</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                <span>Created {new Date(selectedTeam.createdAt).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-sm text-slate-500 font-medium">Avg Health Score</span>
                                        <div className="flex items-center gap-3 bg-white dark:bg-[#1a1a1e] px-4 py-2 rounded-xl border border-slate-200 dark:border-[rgba(255,255,255,0.06)] shadow-sm">
                                            <HealthRing score={selectedTeam.health} size={32} />
                                            <div className="flex flex-col">
                                                <span className={`text-xl font-bold leading-none ${selectedTeam.health > 75 ? 'text-emerald-500' : selectedTeam.health >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                                    {selectedTeam.health || 0}
                                                </span>
                                                <span className={`text-[10px] font-bold ${selectedTeam.healthTrend > 0 ? 'text-emerald-500' : selectedTeam.healthTrend < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {selectedTeam.healthTrend > 0 ? '+' : ''}{selectedTeam.healthTrend}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2-Column Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Column: Members */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-[rgba(255,255,255,0.06)] rounded-2xl p-6 shadow-sm">
                                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-primary" /> Team Members
                                        </h3>

                                        <div className="space-y-4 mb-6">
                                            {selectedTeam.members.map((member) => (
                                                <div key={member.id} className="group flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <img src={member.avatar || "https://github.com/shadcn.png"} alt={member.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800" />
                                                        <div>
                                                            <p className="font-medium text-sm text-slate-900 dark:text-white leading-tight">{member.name}</p>
                                                            <p className="text-xs text-slate-500">{member.handle}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <RoleBadge role={member.role} />
                                                        {isCurrentUserOwner && member.role !== "Owner" && (
                                                            <button
                                                                onClick={() => handleRemoveMember(member.id)}
                                                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all focus:outline-none focus:opacity-100 ml-2"
                                                                title="Remove Member"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pending Invites */}
                                        {selectedTeam.invites && selectedTeam.invites.length > 0 && (
                                            <div className="mb-6 space-y-4">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Invitations</h4>
                                                {selectedTeam.invites.map((invite) => (
                                                    <div key={invite.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-100 dark:bg-[#0a0a0c]">
                                                                <Mail className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm text-slate-900 dark:text-white leading-tight">{invite.email}</p>
                                                                <p className="text-[10px] text-slate-500">Invited {new Date(invite.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <RoleBadge role={invite.role} />
                                                            {isCurrentUserOwner && (
                                                                <>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 px-2 text-xs text-primary hover:bg-primary/10 ml-2"
                                                                        onClick={() => {
                                                                            const url = `${window.location.origin}/invite/${invite.token}`;
                                                                            navigator.clipboard.writeText(url);
                                                                            alert("Invite link copied to clipboard!");
                                                                        }}
                                                                    >
                                                                        Copy Link
                                                                    </Button>
                                                                    <button
                                                                        onClick={() => handleRevokeInvite(invite.id)}
                                                                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all focus:outline-none focus:opacity-100 p-1 rounded-md"
                                                                        title="Revoke Invite"
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {isInviteOpen ? (
                                            <form action={handleInviteMember} className="p-4 bg-slate-50 dark:bg-[#151022] rounded-xl border border-slate-200 dark:border-primary/20 space-y-3 animate-in fade-in slide-in-from-top-2">
                                                <input
                                                    name="email"
                                                    type="email"
                                                    placeholder="Developer's Email Address"
                                                    className="w-full bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                    required
                                                />
                                                <div className="flex items-center gap-2">
                                                    <select name="role" className="flex-1 bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                                        <option value="Viewer">Viewer</option>
                                                        <option value="Reviewer">Reviewer</option>
                                                        <option value="Owner">Owner</option>
                                                    </select>
                                                    <Button type="submit" size="sm" className="bg-primary text-white" disabled={isSubmitting}>
                                                        {isSubmitting ? "..." : "Send"}
                                                    </Button>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full border-dashed border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                                                onClick={() => setIsInviteOpen(true)}
                                            >
                                                <Mail className="w-4 h-4 mr-2" /> Invite Member
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Repos & Activity */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-[rgba(255,255,255,0.06)] rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <Code2 className="w-5 h-5 text-primary" /> Assigned Repos
                                            </h3>
                                        </div>

                                        <form action={async (formData) => {
                                            if (!selectedTeamId) return;
                                            setIsSubmitting(true);
                                            try {
                                                await assignRepoAction(selectedTeamId, formData);
                                            } catch (e) {
                                                alert("Failed to assign");
                                            } finally {
                                                setIsSubmitting(false);
                                            }
                                        }} className="flex items-center gap-3 mb-6">
                                            <select name="repo_id" required className="flex-1 bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                                <option value="">Map additional repo...</option>
                                                {workspaceRepos.filter(wr => !selectedTeam.repos.some(tr => tr.id === wr.id)).map(r => (
                                                    <option value={r.id} key={r.id}>{r.name}</option>
                                                ))}
                                            </select>
                                            <Button type="submit" variant="outline" size="sm" className="h-[38px]" disabled={isSubmitting}>Assign Repo</Button>
                                        </form>

                                        {selectedTeam.repos.length === 0 ? (
                                            <div className="text-center py-6 text-slate-500 text-sm">No repositories assigned yet.</div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedTeam.repos.map(repo => (
                                                    <div key={repo.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-primary/30 transition-colors group cursor-pointer">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <Database className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                                                                <span className="font-semibold text-sm">{repo.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {repo.health < 60 && (
                                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                                                        <AlertTriangle className="w-3 h-3" /> High Risk
                                                                    </div>
                                                                )}
                                                                <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${repo.health >= 75 ? 'bg-emerald-500/10 text-emerald-500' : repo.health >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                                                                    {repo.health}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-auto pt-2 text-xs text-slate-500">
                                                            <div className="flex items-center gap-1.5">
                                                                <LangDot lang={repo.language} />
                                                                {repo.language}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {repo.lastAnalyzed}
                                                            </div>
                                                            {canAnalyze && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 px-2 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary hover:bg-primary/20 z-10"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleGenerateReport(repo.id);
                                                                    }}
                                                                    disabled={isSubmitting}
                                                                >
                                                                    {isSubmitting ? '...' : 'Analyze'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Team Alerts Feed */}
                                    {selectedTeam.alerts && selectedTeam.alerts.length > 0 && (
                                        <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 shadow-sm">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-bold text-lg text-red-600 dark:text-red-400 flex items-center gap-2">
                                                    <Bell className="w-5 h-5 fill-red-500/20" /> Team Alerts
                                                </h3>
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                    {selectedTeam.alerts.length} new
                                                </span>
                                            </div>

                                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {selectedTeam.alerts.map(alert => (
                                                    <div key={alert.id} className="bg-white dark:bg-[#1a1a1e] border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex gap-4">
                                                        <div className="flex-shrink-0 mt-1">
                                                            {alert.type === 'health_drop' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                                                                alert.type === 'pr_risk' ? <GitPullRequest className="w-5 h-5 text-amber-500" /> :
                                                                    <Monitor className="w-5 h-5 text-violet-500" />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{alert.title}</h4>
                                                                <span className="text-xs text-slate-400 whitespace-nowrap">
                                                                    {new Date(alert.created_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">{alert.message}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Team Activity Feed */}
                                    <div className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-[rgba(255,255,255,0.06)] rounded-2xl p-6 shadow-sm">
                                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                            <CircleDashed className="w-5 h-5 text-primary" /> Activity Feed
                                        </h3>

                                        {!selectedTeam.activity || selectedTeam.activity.length === 0 ? (
                                            <div className="text-center py-6 text-slate-500 text-sm">No recent activity.</div>
                                        ) : (
                                            <div className="relative pl-4 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                                                {selectedTeam.activity.map((act, idx) => (
                                                    <div key={act.id} className="relative pl-6">
                                                        <div className="absolute left-[-17px] top-1 rounded-full p-1 bg-white dark:bg-[#1a1a1e] border-2 border-slate-200 dark:border-slate-700 z-10">
                                                            <div className={`w-2 h-2 rounded-full ${act.type === 'repo_analysis' ? 'bg-blue-500' :
                                                                act.type === 'member_join' ? 'bg-emerald-500' :
                                                                    act.type === 'member_leave' ? 'bg-slate-500' :
                                                                        act.type === 'alert_triggered' ? 'bg-amber-500' : 'bg-primary'
                                                                }`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-900 dark:text-slate-200 leading-snug">{act.description}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                                                                {new Date(act.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone: Delete Team */}
                            {isCurrentUserOwner && (
                                <div className="mt-12 pt-8 border-t border-red-500/20 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
                                    <p className="text-slate-500 text-sm mb-4">Deleting a team cannot be undone. All member assignments and repository mappings will be removed.</p>
                                    <Button
                                        variant="outline"
                                        className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                                        onClick={() => setIsDeleteOpen(true)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Team
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Decorative background elements */}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
            </main>

            {/* Create Team Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#1a1a1e] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Create New Team</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        <form action={handleCreateTeam}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Team Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Platform Engineering"
                                        required
                                        className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Color</label>
                                    <div className="flex gap-2">
                                        {["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"].map((color) => (
                                            <label key={color} className={`size-8 rounded-full ${color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1a1a1e] ring-transparent hover:ring-primary/50 transition-all cursor-pointer has-[:checked]:ring-primary`}>
                                                <input type="radio" name="color" value={color} className="sr-only" defaultChecked={color === "bg-blue-500"} />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        placeholder="What does this team focus on?"
                                        className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Assign Repositories (Optional)</label>
                                    <select name="repos" multiple className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-500 h-24">
                                        {workspaceRepos.map(repo => (
                                            <option value={repo.id} key={repo.id}>{repo.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-8">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-primary text-white" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Team"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Team Modal */}
            {isEditOpen && selectedTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsEditOpen(false)} />
                    <div className="relative bg-white dark:bg-[#1a1a1e] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Edit Team</h3>
                            <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        <form action={handleUpdateTeam}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Team Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        defaultValue={selectedTeam.name}
                                        required
                                        className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Color</label>
                                    <div className="flex gap-2">
                                        {["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"].map((color) => (
                                            <label key={color} className={`size-8 rounded-full ${color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1a1a1e] ring-transparent hover:ring-primary/50 transition-all cursor-pointer has-[:checked]:ring-primary`}>
                                                <input type="radio" name="color" value={color} className="sr-only" defaultChecked={color === selectedTeam.color} />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        defaultValue={selectedTeam.description}
                                        placeholder="What does this team focus on?"
                                        className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-8">
                                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-primary text-white" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Team Confirmation Modal */}
            {isDeleteOpen && selectedTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteOpen(false)} />
                    <div className="relative bg-white dark:bg-[#1a1a1e] w-full max-w-sm rounded-2xl shadow-2xl border border-red-200 dark:border-red-900/30 p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="size-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-2">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">Delete {selectedTeam.name}?</h3>
                            <p className="text-sm text-slate-500">
                                This action cannot be undone. You will lose the team grouping, but the underlying repositories and user accounts will remain safe.
                            </p>
                            <div className="flex items-center gap-3 w-full mt-6">
                                <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                                <Button
                                    onClick={handleDeleteTeam}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Deleting..." : "Yes, Delete Team"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
