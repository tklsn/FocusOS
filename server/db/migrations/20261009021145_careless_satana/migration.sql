ALTER TABLE `tasks` ADD `is_next_action` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `completed_at` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_tasks_next_action` ON `tasks` (`project_id`) WHERE is_next_action = 1;