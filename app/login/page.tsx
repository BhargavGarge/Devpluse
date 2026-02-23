"use client";

import { Mail, Lock, Github, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);

        const supabase = createClient();
        const redirectUrl = new URL("/auth/callback", window.location.origin).toString();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: redirectUrl,
                scopes: 'repo read:user user:email'
            },
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(91,43,238,0.15)_0%,_rgba(11,15,25,0)_70%)] pointer-events-none"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <main className="relative z-10 w-full max-w-[440px] px-6">
                {/* Brand Identity */}
                <div className="flex flex-col items-center mb-8">
                    <div className="size-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                        <svg className="text-white size-7" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                            <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="white" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">DevPulse</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest">Engineering Intelligence</p>
                </div>

                {/* Login Card */}
                <div className="glass-card rounded-xl p-8 shadow-2xl backdrop-blur-2xl">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Sign in to continue</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base">Unlock AI-powered software metrics and engineering insights.</p>
                    </div>
                    <div className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
                                {error}
                            </div>
                        )}
                        <Button
                            size="lg"
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-6 px-4 rounded-lg transition-all duration-200 shadow-sm border border-slate-200 disabled:opacity-70"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="size-6 animate-spin" />
                            ) : (
                                <Github className="size-6" />
                            )}
                            <span>{isLoading ? "Redirecting..." : "Sign in with GitHub"}</span>
                        </Button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-200/10"></div>
                            <span className="flex-shrink mx-4 text-slate-500 text-xs font-medium uppercase">or</span>
                            <div className="flex-grow border-t border-slate-200/10"></div>
                        </div>

                        <Button size="lg" variant="outline" className="w-full flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-6 px-4 rounded-lg transition-all duration-200 border border-primary/20">
                            <Mail className="w-5 h-5" />
                            <span>Continue with SSO</span>
                        </Button>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-slate-500">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs font-medium">Enterprise Grade Security</span>
                    </div>
                </div>

                {/* Footer Privacy Links */}
                <footer className="mt-8 text-center">
                    <p className="text-slate-500 dark:text-slate-500 text-xs leading-relaxed max-w-[320px] mx-auto">
                        By signing in, you agree to our{" "}
                        <Link className="text-primary hover:underline font-medium" href="#">Terms of Service</Link>{" "}
                        and{" "}
                        <Link className="text-primary hover:underline font-medium" href="#">Privacy Policy</Link>.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-500">
                        <Link className="hover:text-primary transition-colors" href="#">Documentation</Link>
                        <span className="size-1 bg-slate-700 rounded-full"></span>
                        <Link className="hover:text-primary transition-colors" href="#">Support</Link>
                        <span className="size-1 bg-slate-700 rounded-full"></span>
                        <Link className="hover:text-primary transition-colors" href="#">Status</Link>
                    </div>
                </footer>
            </main>

            {/* Decorative Elements */}
            <div className="fixed top-12 left-12 opacity-10 hidden lg:block">
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="size-2 bg-white rounded-full"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
