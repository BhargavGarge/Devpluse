"use client";

import { Github } from "lucide-react";

export function Integrations() {
    return (
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-slate-500 text-sm font-medium uppercase tracking-[0.2em] mb-10">
                    Seamlessly integrates with your stack
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2">
                        <Github className="w-8 h-8" />
                        <span className="font-bold text-xl">GitHub</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-8 h-8 fill-[#3ECF8E]" viewBox="0 0 24 24"><path d="M21.362 9.354H12V.396L2.638 14.646H12v8.958l9.362-14.25z"></path></svg>
                        <span className="font-bold text-xl">Supabase</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-10 h-10 fill-[#635BFF]" viewBox="0 0 24 24"><path d="M13.962 10.935c0-1.077-.852-1.636-2.285-1.636-1.565 0-2.892.493-4.144 1.107L6.444 8.243C7.947 7.39 9.845 7 11.764 7c3.483 0 5.768 1.764 5.768 4.706 0 4.71-6.46 3.96-6.46 5.992 0 .973.832 1.542 2.373 1.542 1.84 0 3.35-.61 4.58-1.325l1.085 2.14c-1.626 1.047-3.69 1.616-5.69 1.616-3.614 0-5.887-1.84-5.887-4.705 0-4.832 6.464-3.99 6.464-6.035z"></path></svg>
                        <span className="font-bold text-xl">Stripe</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
