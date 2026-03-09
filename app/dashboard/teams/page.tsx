import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeamsClient, { TeamData, TeamMemberInfo, AssignedRepoInfo, WorkspaceRepo, TeamAlert } from "./TeamsClient";

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

    // Fetch teams the user belongs to directly (via github username fallback or explicit user_id)
    const githubUsername = user.user_metadata?.user_name || user.email?.split('@')[0];

    const { data: memberTeams, error: memberTeamsError } = await supabase
        .from("team_members")
        .select("team_id")
        .or(`user_id.eq.${user.id},github_username.eq.${githubUsername}`);

    const teamIds = memberTeams?.map(mt => mt.team_id) || [];

    // 2. Fetch all teams for this workspace (owner) OR teams they are a member of
    let query = supabase
        .from("teams")
        .select(`
            id, name, color, description, created_at, workspace_id,
            team_members (
                id, user_id, github_username, role, joined_at
            ),
            team_repos (
                repo_id,
                assigned_at,
                repositories (
                    id, name, full_name, created_at
                )
            ),
            team_alerts (
                id, team_id, title, type, message, is_read, created_at
            ),
            team_invitations (
                id, team_id, email, role, token, created_at
            ),
            team_activity (
                id, activity_type, description, created_at
            )
        `);

    if (teamIds.length > 0) {
        query = query.or(`workspace_id.eq.${user.id},id.in.(${teamIds.join(',')})`);
    } else {
        query = query.eq("workspace_id", user.id);
    }

    const { data: dbTeams, error: teamsError } = await query
        .order("created_at", { ascending: false });

    // 3. Fetch all health reports for all repos in the workspace
    // We group by repository_id and take the most recent and the second most recent
    const { data: allReports, error: reportsError } = await supabase
        .from('reports')
        .select('repository_id, score, created_at')
        .order('created_at', { ascending: false });

    // Create a fast lookup map for repo -> {latestScore, previousScore, evaluatedAt}
    const repoHealthMap: Record<string, { latestScore: number, previousScore: number | null, evaluatedAt: string }> = {};
    if (allReports) {
        allReports.forEach(report => {
            if (!repoHealthMap[report.repository_id]) {
                // First time seeing this repo = latest report
                repoHealthMap[report.repository_id] = {
                    latestScore: report.score,
                    previousScore: null,
                    evaluatedAt: new Date(report.created_at).toLocaleDateString()
                };
            } else if (repoHealthMap[report.repository_id].previousScore === null) {
                // Second time seeing this repo = previous report
                repoHealthMap[report.repository_id].previousScore = report.score;
            }
        });
    }

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
            const healthData = repoHealthMap[r.id];

            return {
                id: r.id,
                name: r.name,
                language: "Analyzed", // You could fetch repo language if available
                health: healthData?.latestScore || 0, // Fallback to 0 if no report exists
                lastAnalyzed: healthData?.evaluatedAt || 'Never'
            };
        });

        // Compute aggregate health simply as avg of assigned repos
        const totalHealth = assignedRepos.reduce((acc, curr) => acc + curr.health, 0);
        const health = assignedRepos.length > 0 ? Math.round(totalHealth / assignedRepos.length) : 0;

        // Compute trend
        let totalPreviousHealth = 0;
        let validPreviousCount = 0;

        assignedRepos.forEach(repo => {
            const healthData = repoHealthMap[repo.id];
            if (healthData && healthData.previousScore !== null) {
                totalPreviousHealth += healthData.previousScore;
                validPreviousCount++;
            } else if (healthData && healthData.previousScore === null) {
                // If no previous score, assume it was the same as current (no trend)
                totalPreviousHealth += healthData.latestScore;
                validPreviousCount++;
            }
        });

        const previousAvgHealth = validPreviousCount > 0 ? Math.round(totalPreviousHealth / validPreviousCount) : health;
        const healthTrend = health - previousAvgHealth;

        // Filter out read alerts and sort by newest
        const unreadAlerts: TeamAlert[] = (dbTeam.team_alerts || [])
            .filter((a: any) => !a.is_read)
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10);

        const pendingInvites = (dbTeam.team_invitations || []).map((inv: any) => ({
            id: inv.id,
            email: inv.email,
            role: inv.role,
            token: inv.token,
            createdAt: inv.created_at
        }));

        const activityFeed = (dbTeam.team_activity || [])
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 20)
            .map((act: any) => ({
                id: act.id,
                type: act.activity_type,
                description: act.description,
                createdAt: act.created_at
            }));

        return {
            id: dbTeam.id,
            name: dbTeam.name,
            color: dbTeam.color || "bg-blue-500",
            description: dbTeam.description || "",
            createdAt: dbTeam.created_at,
            members,
            repos: assignedRepos,
            health,
            healthTrend,
            alerts: unreadAlerts,
            invites: pendingInvites,
            activity: activityFeed
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
