CREATE TABLE `tasks` (
	`id` text(26) PRIMARY KEY,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'inbox' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_tasks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text(26) PRIMARY KEY,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `accounts_provider_provider_account_id_unique` UNIQUE(`provider`,`provider_account_id`)
);
--> statement-breakpoint
INSERT INTO `__new_accounts`(`id`, `user_id`, `provider`, `provider_account_id`, `password`, `created_at`, `updated_at`) SELECT `id`, `user_id`, `provider`, `provider_account_id`, `password`, `created_at`, `updated_at` FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text(26) PRIMARY KEY,
	`username` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`(`id`, `username`, `name`, `email`, `email_verified`, `created_at`, `updated_at`) SELECT `id`, `username`, `name`, `email`, `email_verified`, `created_at`, `updated_at` FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_accounts_user_id` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_tasks_user_id_status` ON `tasks` (`user_id`,`status`);