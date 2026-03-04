"use client";

import { Sparkles, Activity, Users } from "lucide-react";
import RadialOrbitalTimeline, { TimelineItem } from "./ui/radial-orbital-timeline";

const featuresTimelineData: TimelineItem[] = [
    {
        id: 1,
        title: "Weekly AI Reports",
        date: "Continuous",
        content: "Summarized progress without the manual overhead. Get the signal, skip the noise with automated executive summaries.",
        category: "Reporting",
        icon: Sparkles,
        relatedIds: [2, 3],
        status: "completed",
        energy: 100,
    },
    {
        id: 2,
        title: "Repo Health Score",
        date: "Real-time",
        content: "Real-time visibility into technical debt and code quality across all your repositories with actionable remediation steps.",
        category: "Analysis",
        icon: Activity,
        relatedIds: [1],
        status: "in-progress",
        energy: 85,
    },
    {
        id: 3,
        title: "Contributor Insights",
        date: "Weekly",
        content: "Understanding team velocity and impact through advanced AI-driven behavioral analysis and collaboration patterns.",
        category: "Insights",
        icon: Users,
        relatedIds: [1],
        status: "in-progress",
        energy: 75,
    }
];

export function FeaturesGrid() {
    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4 relative z-20">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Engineering Intelligence, Simplified</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Deep insights into your development lifecycle without the noise of traditional management tools.</p>
                </div>

                <div className="mt-8">
                    <RadialOrbitalTimeline timelineData={featuresTimelineData} />
                </div>
            </div>
        </section>
    );
}
