CREATE TABLE
    IF NOT EXISTS `tax-withholding` (
        `id` int NOT NULL AUTO_INCREMENT,
        `label` varchar(255) DEFAULT NULL,
        `rate` float DEFAULT NULL,
        `createdAt` TIMESTAMP DEFAULT NOW (),
        `updatedAt` TIMESTAMP DEFAULT NOW (),
        `deletedAt` TIMESTAMP DEFAULT NULL,
        `isDeletionRestricted` BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (`id`)
    );

INSERT INTO `tax-withholding` (`label`, `rate`)
VALUES
    ('Frais - Régime forfaitaire', 10),
    ('Frais - Régime forfaitaire', 15),
    ('Frais - Régime réel', 3),
    ('Frais - Régime réel', 5),
    ('Loyer - Frais spéciaux - Société exportation', 2.5),
    ('Marché - Frais généraux', 1),
    ('Marché - Frais généraux', 1.5),
    ('Marché - Frais spéciaux - Société exportation', 0.5),
    ('Revenus des comptes épargne spéciaux', 20);

ALTER TABLE `invoice`
ADD COLUMN `taxWithholdingId` INT NULL,
ADD CONSTRAINT `FK_invoice_tax-withholding` FOREIGN KEY (`taxWithholdingId`) REFERENCES `tax-withholding` (`id`) ON DELETE SET NULL;


ALTER TABLE `invoice_meta_data`
ADD COLUMN `hasTaxWithholding` BOOLEAN DEFAULT FALSE;

ALTER TABLE `invoice`
ADD COLUMN `taxWithholdingAmount` float DEFAULT NULL, 
