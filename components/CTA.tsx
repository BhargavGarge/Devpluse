"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
    return (
        <section className="py-32 px-6">
            <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] p-12 lg:p-20 text-center glass-card border-white/5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center gap-8">
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight max-w-2xl leading-tight">
                        Ready to scale your engineering culture?
                    </h2>
                    <p className="text-lg text-slate-400 max-w-xl">
                        Join forward-thinking teams using DevPulse to drive excellence without sacrificing peace of mind.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Button size="lg" className="bg-white text-background-dark text-lg font-bold px-8 py-6 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                            <Github className="w-6 h-6" />
                            Sign in with GitHub
                        </Button>
                    </div>
                    <div className="text-sm text-slate-500">
                        No credit card required • Unlimited free tier available
                    </div>
                </div>
            </div>
        </section>
    );
}
