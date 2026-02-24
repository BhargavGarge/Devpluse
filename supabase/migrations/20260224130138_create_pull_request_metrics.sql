-- Create pull_request_metrics table
CREATE TABLE IF NOT EXISTS public.pull_request_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    repository_id UUID NOT NULL REFERENCES public.repositories(id) ON DELETE CASCADE,
    average_pr_size NUMERIC NOT NULL DEFAULT 0,
    average_review_time NUMERIC NOT NULL DEFAULT 0,
    unreviewed_ratio NUMERIC NOT NULL DEFAULT 0,
    large_pr_ratio NUMERIC NOT NULL DEFAULT 0,
    health_score INTEGER NOT NULL DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High')),
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index on repository_id for fast lookups
CREATE INDEX IF NOT EXISTS pull_request_metrics_repository_id_idx ON public.pull_request_metrics(repository_id);

-- Add RLS policies
ALTER TABLE public.pull_request_metrics ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own repo metrics (assuming repositories table handles access)
CREATE POLICY "Users can view PR metrics for accessible repos"
    ON public.pull_request_metrics
    FOR SELECT
    USING (
        repository_id IN (
            SELECT id FROM public.repositories WHERE user_id = auth.uid()
        )
    );

-- Allow service role or authenticated users to insert/update metrics
CREATE POLICY "Users can insert PR metrics for accessible repos"
    ON public.pull_request_metrics
    FOR INSERT
    WITH CHECK (
        repository_id IN (
            SELECT id FROM public.repositories WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update PR metrics for accessible repos"
    ON public.pull_request_metrics
    FOR UPDATE
    USING (
        repository_id IN (
            SELECT id FROM public.repositories WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        repository_id IN (
            SELECT id FROM public.repositories WHERE user_id = auth.uid()
        )
    );
