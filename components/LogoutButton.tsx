"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        // Force a hard reload to clear any residual client state or Next.js cache
        window.location.href = "/";
    };

    return (
        <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors cursor-pointer mt-2"
        >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-left">Sign Out</span>
        </button>
    );
}
