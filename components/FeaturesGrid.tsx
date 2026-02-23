"use client";

import { Sparkles, Activity, Users } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturesGrid() {
    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight">Engineering Intelligence, Simplified</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Deep insights into your development lifecycle without the noise of traditional management tools.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Sparkles className="w-6 h-6" />}
                        title="Weekly AI Reports"
                        description="Summarized progress without the manual overhead. Get the signal, skip the noise with automated executive summaries."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Activity className="w-6 h-6" />}
                        title="Repo Health Score"
                        description="Real-time visibility into technical debt and code quality across all your repositories with actionable remediation steps."
                        theme="cyan"
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Users className="w-6 h-6" />}
                        title="Contributor Insights"
                        description="Understanding team velocity and impact through advanced AI-driven behavioral analysis and collaboration patterns."
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
}
