"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, ShieldCheck, ArrowRight, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acceptInviteAction } from "@/app/dashboard/teams/actions";

export default function InviteClient({
    token,
    teamName,
    role,
    invitedEmail,
    userEmail
}: {
    token: string,
    teamName: string,
    role: string,
    invitedEmail: string,
    userEmail: string
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEmailMismatch = invitedEmail.toLowerCase() !== userEmail.toLowerCase();

    const handleAccept = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await acceptInviteAction(token);
            if (res.success) {
                // Force a hard navigation to guarantee server components revalidate
                window.location.href = `/dashboard/teams`;
            }
        } catch (e: any) {
            setError(e.message || "Something went wrong.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-[#0a0a0c] text-slate-900 dark:text-white p-4 font-display relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] -z-10 rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] -z-10 rounded-full pointer-events-none" />

            <div className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-[rgba(255,255,255,0.06)] rounded-3xl p-8 max-w-lg w-full shadow-2xl relative z-10">

                {/* Header / Brand */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="size-16 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(91,43,238,0.3)] mb-4">
                        <Database className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">You've been invited!</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Join DevPulse to collaborate on engineering analytics.
                    </p>
                </div>

                {/* Invitation Details Card */}
                <div className="bg-slate-50 dark:bg-[#151022] border border-slate-200 dark:border-primary/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="size-12 bg-white dark:bg-[#0a0a0c] rounded-xl flex items-center justify-center text-primary font-bold shadow-sm border border-slate-200 dark:border-slate-800">
                            {teamName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Team Name</p>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{teamName}</h2>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Invited Email</p>
                                <p className="font-medium">{invitedEmail}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Assigned Role</p>
                                <p className="font-medium text-primary">{role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warnings / Errors */}
                {isEmailMismatch && (
                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-6 text-sm text-amber-800 dark:text-amber-400">
                        <strong>Note:</strong> You are currently logged in as <strong>{userEmail}</strong>, but this invite was sent to <strong>{invitedEmail}</strong>. You can still accept if this is intended.
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Action */}
                <Button
                    onClick={handleAccept}
                    disabled={isSubmitting}
                    className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(91,43,238,0.3)] transition-all"
                >
                    {isSubmitting ? "Accepting..." : "Accept Invitation"} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
}
