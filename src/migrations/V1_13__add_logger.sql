CREATE TABLE
    logger (
        id INT NOT NULL AUTO_INCREMENT,
        access_type VARCHAR(255) NULL,
        event VARCHAR(255) NULL,
        payload JSON NULL,
        userId INT NULL,
        `createdAt` DATETIME (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` DATETIME (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` DATETIME (6) DEFAULT NULL,
        `isDeletionRestricted` TINYINT NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`),
        KEY `FK_user_logger` (`userId`),
        CONSTRAINT `FK_user_logger` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
    );