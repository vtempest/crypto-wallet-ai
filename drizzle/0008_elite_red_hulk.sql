-- Drop the old single-column unique index
DROP INDEX IF EXISTS `walletAddress_address_unique`;
--> statement-breakpoint
-- Create new composite unique index on address + chainId
CREATE UNIQUE INDEX `walletAddress_address_chainId_unique` ON `walletAddress` (`address`,`chainId`);