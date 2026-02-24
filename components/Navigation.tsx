"use client";

import { LineChart, ArrowRight, LayoutDashboard, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function Navigation() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => setUser(session?.user ?? null)
        );

        return () => subscription.unsubscribe();
    }, []);

    return (
        <header className="fixed top-0 w-full z-50 px-6 py-4">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 glass-card rounded-2xl border-white/10">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                        <LineChart className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        DevPulse
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/product" className="text-sm font-medium hover:text-primary transition-colors">Product</Link>
                    <Link href="/solutions" className="text-sm font-medium hover:text-primary transition-colors">Solutions</Link>
                    <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
                    <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">Docs</Link>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <Button asChild className="bg-primary text-white text-sm font-bold px-5 py-5 rounded-xl hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(91,43,238,0.4)] transition-all">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="text-sm font-medium px-4 py-2 hover:bg-transparent hover:text-primary transition-colors rounded-xl">
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button asChild className="bg-primary text-white text-sm font-bold px-5 py-5 rounded-xl hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(91,43,238,0.4)] transition-all">
                                <Link href="/login">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
// k2uTt3fS27c7ESYu