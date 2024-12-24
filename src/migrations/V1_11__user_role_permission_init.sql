CREATE TABLE IF NOT EXISTS `role` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deletedAt` DATETIME(6) DEFAULT NULL,
    `isDeletionRestricted` TINYINT NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `permission` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deletedAt` DATETIME(6) DEFAULT NULL,
    `isDeletionRestricted` TINYINT NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(255) DEFAULT NULL,
    `lastName` VARCHAR(255) DEFAULT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `dateOfBirth` DATE DEFAULT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deletedAt` DATETIME(6) DEFAULT NULL,
    `isDeletionRestricted` TINYINT NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_unique_username` (`username`),
    UNIQUE KEY `user_unique_email` (`email`)
);

CREATE TABLE IF NOT EXISTS `role_permission` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `roleId` INT NOT NULL,
    `permissionId` INT NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deletedAt` DATETIME(6) DEFAULT NULL,
    `isDeletionRestricted` TINYINT NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `FK_role_permission_role` (`roleId`),
    KEY `FK_role_permission_permission` (`permissionId`),
    CONSTRAINT `FK_role_permission_role` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`),
    CONSTRAINT `FK_role_permission_permission` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`)
);