CREATE TABLE `walletAddress` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`address` text NOT NULL,
	`chainId` integer NOT NULL,
	`isPrimary` integer DEFAULT false,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `user` ADD `stripeCustomerId` text;--> statement-breakpoint
ALTER TABLE `user` ADD `subscriptionStatus` text;--> statement-breakpoint
ALTER TABLE `user` ADD `trialAllowed` integer DEFAULT true;
