-- Teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  color text,
  description text,
  workspace_id uuid NOT NULL,  -- links to the workspace/user
  created_by uuid NOT NULL REFERENCES auth.users(id),    -- user who created it
  created_at timestamp DEFAULT now()
);

-- Team members junction table
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  github_username text,
  role text NOT NULL CHECK (role IN ('Owner', 'Reviewer', 'Viewer')),
  invited_at timestamp DEFAULT now(),
  joined_at timestamp
);

-- Team repos junction table
CREATE TABLE IF NOT EXISTS public.team_repos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  repo_id uuid NOT NULL REFERENCES public.repositories(id) ON DELETE CASCADE,
  assigned_at timestamp DEFAULT now()
);

-- RLS Policies for teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view teams in their workspace" ON public.teams
  FOR SELECT USING (workspace_id = auth.uid());

CREATE POLICY "Users can insert teams in their workspace" ON public.teams
  FOR INSERT WITH CHECK (workspace_id = auth.uid());

CREATE POLICY "Users can update their teams" ON public.teams
  FOR UPDATE USING (workspace_id = auth.uid());

CREATE POLICY "Users can delete their teams" ON public.teams
  FOR DELETE USING (workspace_id = auth.uid());

-- RLS Policies for team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view members of teams in their workspace" ON public.team_members
  FOR SELECT USING (
    team_id IN (SELECT id FROM public.teams WHERE workspace_id = auth.uid())
  );

CREATE POLICY "Users can insert members into teams in their workspace" ON public.team_members
  FOR INSERT WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE workspace_id = auth.uid())
  );

CREATE POLICY "Users can update members of teams in their workspace" ON public.team_members
  FOR UPDATE USING (
    team_id IN (SELECT id FROM public.teams WHERE workspace_id = auth.uid())
  );

CREATE POLICY "Users can delete members from teams in their workspace" ON public.team_members
  FOR DELETE USING (
    team_id IN (SELECT id FROM public.teams WHERE workspace_id = auth.uid())
  );

-- RLS Policies for team_repos
ALTER TABLE public.team_repos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view repos of teams in their workspace" ON public.team_repos
  FOR SELECT USING (
    team_id IN (SELECT id FROM public.teams WHERE workspace_id = auth.uid())
  );

CREATE POLICY "Users can insert repos into teams in their workspace" ON public.team_repos
  FOR INSERT WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE workspace_id = auth.uid())
  );

CREATE POLICY "Users can delete repos from teams in their workspace" ON public.team_repos
  FOR DELETE USING (
    team_id IN (SELECT id FROM public.teams WHERE workspace_id = auth.uid())
  );
