import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Resolves all repository IDs a user has access to, combining explicitly owned repos
 * and repos assigned to teams the user is a member of.
 */
export async function getAccessibleRepoIds(
    supabase: SupabaseClient,
    userId: string,
    githubUsername: string
): Promise<string[]> {
    const accessibleIds = new Set<string>();

    // 1. Get explicitly owned repositories
    const { data: ownedRepos } = await supabase
        .from('repositories')
        .select('id')
        .eq('user_id', userId);

    if (ownedRepos) {
        ownedRepos.forEach(repo => accessibleIds.add(repo.id));
    }

    // 2. Get teams the user legally belongs to
    // They can be a member by explicit user_id OR their github_username
    const { data: teamMemberships } = await supabase
        .from('team_members')
        .select('team_id')
        .or(`user_id.eq.${userId},github_username.eq.${githubUsername}`);

    const teamIds = teamMemberships?.map(tm => tm.team_id) || [];

    // 3. Get repos assigned to those teams
    if (teamIds.length > 0) {
        const { data: teamRepos } = await supabase
            .from('team_repos')
            .select('repo_id')
            .in('team_id', teamIds);

        if (teamRepos) {
            teamRepos.forEach(tr => accessibleIds.add(tr.repo_id));
        }
    }

    // Return unique deduplicated array
    return Array.from(accessibleIds);
}

/**
 * Determines a user's role for a specific repository.
 * If the user explicitly owns the repository, they have role "Owner".
 * Otherwise, it resolves their highest permission level through their teams.
 */
export async function getRepoRole(
    supabase: SupabaseClient,
    userId: string,
    githubUsername: string,
    repositoryId: string
): Promise<"Owner" | "Reviewer" | "Viewer" | "None"> {
    // 1. Check if the user explicitly owns the repo
    const { data: repo } = await supabase
        .from('repositories')
        .select('user_id')
        .eq('id', repositoryId)
        .single();

    if (repo && repo.user_id === userId) {
        return "Owner";
    }

    // 2. See what teams have this repo mapped
    const { data: teamRepos } = await supabase
        .from('team_repos')
        .select('team_id')
        .eq('repo_id', repositoryId);

    const teamIds = teamRepos?.map(tr => tr.team_id) || [];

    if (teamIds.length === 0) {
        return "None";
    }

    // 3. Find the user's role in any of these teams
    const { data: memberRoles } = await supabase
        .from('team_members')
        .select('role')
        .in('team_id', teamIds)
        .or(`user_id.eq.${userId},github_username.eq.${githubUsername}`);

    if (!memberRoles || memberRoles.length === 0) {
        return "None";
    }

    // A user might be in multiple teams that have access. Find their highest privilege.
    const roles = memberRoles.map(mr => mr.role);

    if (roles.includes("Owner")) return "Owner";
    if (roles.includes("Reviewer")) return "Reviewer";
    if (roles.includes("Viewer")) return "Viewer";

    return "None";
}
