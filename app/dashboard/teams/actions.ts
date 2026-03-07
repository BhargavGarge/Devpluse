"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

    const github_username = formData.get("handle") as string;
    const role = formData.get("role") as string;

    if (!github_username || !role) throw new Error("Missing required fields");

    const { error } = await supabase
        .from("team_members")
        .insert({
            team_id: teamId,
            github_username,
            role,
        });

    if (error) {
        console.error("Invite member failed:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/teams");
}

export async function assignRepoAction(teamId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

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

    const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId)
        .eq("team_id", teamId);

    if (error) {
        console.error("Remove member failed:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/teams");
}
