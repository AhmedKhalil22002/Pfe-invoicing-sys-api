ALTER TABLE `quotation`
ADD COLUMN `bankAccountId` int DEFAULT NULL,
ADD CONSTRAINT `FK_bank_account_quotation`
FOREIGN KEY (`bankAccountId`) REFERENCES `bank_account` (`id`) ON DELETE SET NULL;