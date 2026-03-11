"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function isTeamOwner(supabase: any, user: any, teamId: string) {
    // Check if user is the workspace owner
    const { data: teamData } = await supabase
        .from("teams")
        .select("workspace_id")
        .eq("id", teamId)
        .single();
    if (teamData?.workspace_id === user.id) return true;

    // Check if user has Owner role in team_members
    const { data: memberData } = await supabase
        .from("team_members")
        .select("role")
        .eq("team_id", teamId)
        .eq("user_id", user.id)
        .single();
    if (memberData?.role === "Owner") return true;

    return false;
}

export async function createTeamAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const description = formData.get("description") as string;
    const repoIds = formData.getAll("repos") as string[];

    if (!name) throw new Error("Team name is required");

    // Insert Team
    const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({
            name,
            color: color || "bg-blue-500",
            description,
            workspace_id: user.id, // For this workspace model, mapping to user.id
            created_by: user.id
        })
        .select()
        .single();

    if (teamError) {
        console.error("Team creation failed:", teamError);
        throw new Error(teamError.message);
    }

    // Assign Creator as Owner
    const { error: memberError } = await supabase
        .from("team_members")
        .insert({
            team_id: team.id,
            user_id: user.id,
            github_username: user.user_metadata?.user_name || user.email?.split('@')[0] || "creator",
            role: "Owner",
            joined_at: new Date().toISOString()
        });

    if (memberError) {
        console.error("Member creation failed:", memberError);
    }

    // Assign repositories if any were selected
    if (repoIds && repoIds.length > 0) {
        const repoInserts = repoIds.map((repoId) => ({
            team_id: team.id,
            repo_id: repoId
        }));

        await supabase.from("team_repos").insert(repoInserts);
    }

    revalidatePath("/dashboard/teams");
    return team;
}

export async function inviteMemberAction(teamId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const isOwner = await isTeamOwner(supabase, user, teamId);
    if (!isOwner) throw new Error("Unauthorized: Only Owners can manage team members");

    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    if (!email || !role) throw new Error("Missing required fields");

    // Check if they are already in the team
    const { data: existingMember } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", teamId)
        .eq("github_username", email); // Legacy fallback check, ideally we'd check users table first

    if (existingMember && existingMember.length > 0) {
        return { error: "User is already in the team" };
    }

    // Insert into team_invitations
    const { data: invite, error } = await supabase
        .from("team_invitations")
        .insert({
            team_id: teamId,
            email,
            role,
            invited_by: user.id
        })
        .select()
        .single();

    if (error) {
        console.error("Invite member failed:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/teams");
    return { success: true, invite };
}

export async function assignRepoAction(teamId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const isOwner = await isTeamOwner(supabase, user, teamId);
    if (!isOwner) throw new Error("Unauthorized: Only Owners can assign repositories");

    const repo_id = formData.get("repo_id") as string;

    if (!repo_id) throw new Error("Missing required fields");

    const { error } = await supabase
        .from("team_repos")
        .insert({
            team_id: teamId,
            repo_id,
        });

    if (error) {
        console.error("Assign repo failed:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/teams");
}

export async function updateTeamAction(teamId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const isOwner = await isTeamOwner(supabase, user, teamId);
    if (!isOwner) throw new Error("Unauthorized: Only Owners can update team details");

    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const description = formData.get("description") as string;

    if (!name) throw new Error("Team name is required");

    const { error } = await supabase
        .from("teams")
        .update({
            name,
            color,
            description,
        })
        .eq("id", teamId)
        .eq("workspace_id", user.id);

    if (error) {
        console.error("Update team failed:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/teams");
}

export async function deleteTeamAction(teamId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const isOwner = await isTeamOwner(supabase, user, teamId);
    if (!isOwner) throw new Error("Unauthorized: Only Owners can delete teams");

    // 1. Delete associated repos
    const { error: reposError } = await supabase
        .from("team_repos")
        .delete()
        .eq("team_id", teamId);

    if (reposError) {
        console.error("Delete team repos failed:", reposError);
        throw new Error("Failed to delete associated repositories");
    }

    // 2. Delete associated members
    const { error: membersError } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", teamId);

    if (membersError) {
        console.error("Delete team members failed:", membersError);
        throw new Error("Failed to delete associated team members");
    }

    // 3. Delete the team itself
    const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId)
        .eq("workspace_id", user.id);

    if (error) {
        console.error("Delete team failed:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/teams");
}

export async function removeMemberAction(teamId: string, memberId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const isOwner = await isTeamOwner(supabase, user, teamId);
    if (!isOwner) {
        throw new Error("Unauthorized to remove members");
    }

    const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId)
        .eq("team_id", teamId);

    if (error) {
        console.error("Remove member failed:", error);
        throw new Error(error.message);
    }

    // Log to team activity
    await supabase.from("team_activity").insert({
        team_id: teamId,
        activity_type: "member_leave",
        description: `A team member was removed by the owner.` // Could join user names if we had them easily accessible
    });

    revalidatePath("/dashboard/teams");
}

export async function revokeInviteAction(teamId: string, inviteId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const isOwner = await isTeamOwner(supabase, user, teamId);
    if (!isOwner) {
        throw new Error("Unauthorized to revoke invites");
    }

    const { error } = await supabase
        .from("team_invitations")
        .delete()
        .eq("id", inviteId)
        .eq("team_id", teamId);

    if (error) {
        console.error("Revoke invite failed:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/teams");
}

export async function acceptInviteAction(token: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized. Please log in first.");

    // Create admin client for securely validating and deleting the token without RLS
    const { createClient: createAdmin } = await import('@supabase/supabase-js');
    const supabaseAdmin = createAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Find the invite
    const { data: invite, error: fetchError } = await supabaseAdmin
        .from("team_invitations")
        .select("*")
        .eq("token", token)
        .single();

    if (fetchError || !invite) {
        throw new Error("Invalid or expired invitation link.");
    }

    // 2. Check if already a member
    const { data: existingMember } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", invite.team_id)
        .eq("user_id", user.id); // Not using single so it doesn't throw if not found

    if (existingMember && existingMember.length > 0) {
        // Just delete the redundant invite
        await supabaseAdmin.from("team_invitations").delete().eq("id", invite.id);
        return { success: true, teamId: invite.team_id, message: "You are already a member of this team... wait, the backend deleted the redundant invitation!" };
    }

    // 3. Insert into team_members
    const githubUsername = user.user_metadata?.user_name || user.email?.split('@')[0] || "User";

    const { error: insertError } = await supabaseAdmin
        .from("team_members")
        .insert({
            team_id: invite.team_id,
            user_id: user.id,
            github_username: githubUsername,
            role: invite.role,
            joined_at: new Date().toISOString()
        });

    if (insertError) {
        console.error("Failed to join team via invite:", insertError);
        throw new Error("Failed to join the team.");
    }

    // 4. Delete the used invitation
    await supabaseAdmin.from("team_invitations").delete().eq("id", invite.id);

    // 5. Log joining to team activity
    await supabaseAdmin.from("team_activity").insert({
        team_id: invite.team_id,
        activity_type: "member_join",
        description: `${githubUsername} joined the team as a ${invite.role}.`
    });

    revalidatePath("/dashboard/teams");
    return { success: true, teamId: invite.team_id };
}

export async function scanTeamRiskAction(teamId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Get assigned repos
    const { data: teamRepos } = await supabase
        .from("team_repos")
        .select("repo_id, repositories(name)")
        .eq("team_id", teamId);

    if (!teamRepos || teamRepos.length === 0) return;

    // Check each repo for recent metrics anomalies
    // Calculate a dynamic threshold Date (e.g. within last 7 days)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);

    let alertsToCreate = [];

    for (const tr of teamRepos) {
        const { data: recentMetrics } = await supabase
            .from("repository_metrics_snapshots")
            .select("unreviewed_ratio, avg_pr_size")
            .eq("repository_id", tr.repo_id)
            .gte("created_at", recentDate.toISOString())
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (recentMetrics) {
            // Business Logic: Too many unreviewed PRs or PRs are too large
            if (recentMetrics.unreviewed_ratio > 0.3) {
                alertsToCreate.push({
                    team_id: teamId,
                    repository_id: tr.repo_id,
                    type: "pr_risk",
                    title: "High Unreviewed PR Ratio",
                    message: `${(tr.repositories as any).name} has over 30% of its PRs unreviewed recently. Consider reassigning reviewers.`
                });
            }

            if (recentMetrics.avg_pr_size > 400) {
                alertsToCreate.push({
                    team_id: teamId,
                    repository_id: tr.repo_id,
                    type: "pr_risk",
                    title: "Large PRs Detected",
                    message: `Average PR size in ${(tr.repositories as any).name} exceeds 400 lines. This slows down review velocity and increases bug risk.`
                });
            }
        }
    }

    if (alertsToCreate.length > 0) {
        // Simple deduplication attempt: Don't insert if an exact alert title for this repo exists and is unread
        const { data: existingUnread } = await supabase
            .from("team_alerts")
            .select("title, repository_id")
            .eq("team_id", teamId)
            .eq("is_read", false);

        const newAlerts = alertsToCreate.filter(alert => {
            return !existingUnread?.some(ea => ea.title === alert.title && ea.repository_id === alert.repository_id);
        });

        if (newAlerts.length > 0) {
            await supabase.from("team_alerts").insert(newAlerts);

            // Also log to activity feed
            const activityInserts = newAlerts.map(alert => ({
                team_id: teamId,
                activity_type: "alert_triggered",
                description: `System triggered a ${alert.type} alert: ${alert.title}`
            }));
            await supabase.from("team_activity").insert(activityInserts);

            revalidatePath("/dashboard/teams");
        }
    }
}
