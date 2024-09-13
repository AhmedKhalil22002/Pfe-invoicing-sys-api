ALTER TABLE `quotation`
ADD COLUMN `bankAccountId` int DEFAULT NULL,
ADD CONSTRAINT `FK_bank_account_quotation` FOREIGN KEY (`bankAccountId`) REFERENCES `bank_account` (`id`) ON DELETE SET NULL;

CREATE TABLE
    IF NOT EXISTS uploads (
        `id` INT AUTO_INCREMENT,
        `slug` VARCHAR(255) NOT NULL,
        `filename` VARCHAR(255) NOT NULL,
        `relativePath` VARCHAR(255) NOT NULL,
        `mimetype` VARCHAR(255) NOT NULL,
        `size` FLOAT NOT NULL,
        `createdAt` TIMESTAMP DEFAULT NOW (),
        `updatedAt` TIMESTAMP DEFAULT NOW (),
        `deletedAt` TIMESTAMP DEFAULT NULL,
        `isDeletionRestricted` BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (`id`)
    );