"use client";

import { useRouter } from "next/navigation";

interface RepoSelectorClientProps {
    repositories: any[];
    activeRepoId: string | null;
}

export default function RepoSelectorClient({ repositories, activeRepoId }: RepoSelectorClientProps) {
    const router = useRouter();

    return (
        <select
            value={activeRepoId || ""}
            onChange={(e) => {
                if (e.target.value) {
                    router.push(`/dashboard/pr-insights?repoId=${e.target.value}`);
                }
            }}
            className="border border-slate-200 dark:border-[#2d2d35] bg-slate-50 dark:bg-[#0a0a0c] text-sm rounded-lg px-3 py-2 text-slate-900 dark:text-slate-300 focus:outline-none focus:border-primary"
        >
            <option value="" disabled>Select a repository...</option>
            {repositories.map(repo => (
                <option key={repo.id} value={repo.id}>
                    {repo.name} ({repo.full_name})
                </option>
            ))}
        </select>
    );
}
