import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InviteClient from "./InviteClient";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const supabase = await createClient();
    const { token } = await params;

    // 1. Validate the token exists in the database
    const { data: invite, error } = await supabase
        .from("team_invitations")
        .select("*, teams(name)")
        .eq("token", token)
        .single();

    if (error || !invite) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-[#0a0a0c] text-slate-900 dark:text-white p-4">
                <div className="bg-white dark:bg-[#1a1a1e] border border-red-200 dark:border-red-900/30 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
                    <div className="size-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Invalid Invitation</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">This invitation link is invalid or has expired.</p>
                    <a href="/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    // 2. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    // If not logged in, redirect to login but pass a redirect target so they land back here
    if (!user) {
        redirect(`/login?redirect=/invite/${token}`);
    }

    return (
        <InviteClient
            token={token}
            teamName={invite.teams.name}
            role={invite.role}
            invitedEmail={invite.email}
            userEmail={user.email || ""}
        />
    );
}
