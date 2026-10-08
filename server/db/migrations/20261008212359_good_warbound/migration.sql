CREATE TABLE `projects` (
	`id` text(26) PRIMARY KEY,
	`user_id` text NOT NULL,
	`area_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_projects_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_projects_area_id_areas_id_fk` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `idx_projects_user_id` ON `projects` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_projects_area_id` ON `projects` (`area_id`);