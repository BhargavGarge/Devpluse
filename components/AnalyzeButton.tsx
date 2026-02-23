"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export function AnalyzeButton({ repoId }: { repoId: string }) {
    return (
        <form action="/api/reports/generate" method="POST" className="flex-1">
            <input type="hidden" name="repository_id" value={repoId} />
            <Button
                type="button"
                className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                onClick={async (e) => {
                    const btn = e.currentTarget;
                    const originalHtml = btn.innerHTML;
                    btn.innerHTML = 'Analyzing...';
                    btn.disabled = true;
                    try {
                        const res = await fetch('/api/reports/generate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ repository_id: repoId })
                        });

                        if (!res.ok) {
                            const data = await res.json();
                            alert(`Error: ${data.error || 'Failed to generate report'}`);
                        } else {
                            window.location.reload();
                        }
                    } finally {
                        btn.innerHTML = originalHtml;
                        btn.disabled = false;
                    }
                }}
            >
                <PlayCircle className="w-4 h-4" />
                Analyze Now
            </Button>
        </form>
    );
}
