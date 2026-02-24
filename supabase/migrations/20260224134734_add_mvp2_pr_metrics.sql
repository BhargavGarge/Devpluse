-- Migration for MVP 2 PR Insights (Contributor, Language, Deep Dive)

ALTER TABLE "public"."pull_request_metrics"
ADD COLUMN "contributor_insights" jsonb,
ADD COLUMN "language_distribution" jsonb,
ADD COLUMN "review_deep_dive" jsonb;
