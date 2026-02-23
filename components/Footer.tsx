"use client";

import { LineChart, Share2, AtSign, Terminal } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-16 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex flex-col gap-4 items-center md:items-start">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <LineChart className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold">DevPulse</span>
                    </div>
                    <p className="text-sm text-slate-500">© 2024 DevPulse AI. All rights reserved.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
                    <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Status</Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary transition-all border-white/10">
                        <Share2 className="w-4 h-4 text-slate-300" />
                    </Link>
                    <Link href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary transition-all border-white/10">
                        <AtSign className="w-4 h-4 text-slate-300" />
                    </Link>
                    <Link href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary transition-all border-white/10">
                        <Terminal className="w-4 h-4 text-slate-300" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
