ALTER TABLE `tasks` ADD `project_id` text REFERENCES projects(id) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `sort_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_tasks_project_id` ON `tasks` (`project_id`);