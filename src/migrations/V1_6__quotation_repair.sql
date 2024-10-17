UPDATE `quotation`
SET `total` = `total` - IFNULL(`taxStamp`, 0);

ALTER TABLE `quotation`
DROP COLUMN `taxStamp`;

ALTER TABLE `tax` RENAME COLUMN `rate` TO `value`;

ALTER TABLE `tax` ADD COLUMN `isRate` BOOLEAN DEFAULT TRUE;