import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeamsClient, { TeamData, TeamMemberInfo, AssignedRepoInfo, WorkspaceRepo } from "./TeamsClient";

export default async function TeamsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const currentUser = {
        name: user.user_metadata?.user_name || user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
        role: "Admin", // Assuming workspace owner/admin
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjXgxnW4ShEHA2-mnNx-LE5OI3n3PBjiX0_YHy85B_Jb5PXiuQGBzgBt5OMGyoII1kiRdk08JfSsSvfPDU0WCRJdFG4BIERyzMc-XHnx2fw90Plvdvm3RjsWNhckfx31jBSkmMlZhogrtYOkI7IQKLXQbMb1ss0F88vrCPpEaK2Rhowxw4fLD7SyrLXqVVBxmF3nqaZ6QLg7oF4qGBJcMit4TtR7nc2xxUe2f8ct1AJql16AF60bNNWLilg6SCd3zw8GE4kiQ00hc"
    };

    // 1. Fetch available workspace repositories (for assignment)
    const { data: repos } = await supabase
        .from("repositories")
        .select("id, name")
        .eq("user_id", user.id);

    const workspaceRepos: WorkspaceRepo[] = repos || [];

    // 2. Fetch all teams for this workspace
    const { data: dbTeams, error: teamsError } = await supabase
        .from("teams")
        .select(`
            id, name, color, description, created_at,
            team_members (
                id, user_id, github_username, role, joined_at
            ),
            team_repos (
                repo_id,
                assigned_at,
                repositories (
                    id, name, full_name, created_at
                )
            )
        `)
        .eq("workspace_id", user.id)
        .order("created_at", { ascending: false });

    // Handle any fetch issues gracefully, but generally empty arrays are fine
    if (teamsError) {
        console.error("Failed to fetch teams:", teamsError.message);
    }

    // Transform DB results to TeamData format matching our UI types
    const teams: TeamData[] = (dbTeams || []).map((dbTeam: any) => {

        const members: TeamMemberInfo[] = (dbTeam.team_members || []).map((m: any) => ({
            id: m.id,
            name: m.github_username, // Fallback, could join auth.users if public
            handle: `@${m.github_username}`,
            role: m.role,
            avatar: "https://github.com/shadcn.png" // Placeholder avatar
        }));

        const assignedRepos: AssignedRepoInfo[] = (dbTeam.team_repos || []).map((tr: any) => {
            const r = tr.repositories;
            return {
                id: r.id,
                name: r.name,
                language: "TypeScript",
                health: 85, // TODO: Fetch from reports table
                lastAnalyzed: tr.assigned_at ? new Date(tr.assigned_at).toLocaleDateString() : 'recently'
            };
        });

        // Compute aggregate health simply as avg of assigned repos
        const totalHealth = assignedRepos.reduce((acc, curr) => acc + curr.health, 0);
        const health = assignedRepos.length > 0 ? Math.round(totalHealth / assignedRepos.length) : 0;

        return {
            id: dbTeam.id,
            name: dbTeam.name,
            color: dbTeam.color || "bg-blue-500",
            description: dbTeam.description || "",
            createdAt: dbTeam.created_at,
            members,
            repos: assignedRepos,
            health
        };
    });

    return (
        <TeamsClient
            teams={teams}
            workspaceRepos={workspaceRepos}
            currentUser={currentUser}
        />
    );
}
