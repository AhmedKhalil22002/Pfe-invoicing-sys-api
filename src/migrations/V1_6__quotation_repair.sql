UPDATE `quotation`
SET `total` = `total` - IFNULL(`taxStamp`, 0);

ALTER TABLE `quotation`
DROP COLUMN `taxStamp`;