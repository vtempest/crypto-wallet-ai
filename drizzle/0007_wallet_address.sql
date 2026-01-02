CREATE TABLE `walletAddress` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`address` text NOT NULL,
	`chainId` integer NOT NULL,
	`isPrimary` integer DEFAULT 0,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `walletAddress_address_unique` ON `walletAddress` (`address`);
