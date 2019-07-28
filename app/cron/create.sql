DROP TABLE IF EXISTS `records`;
CREATE TABLE `records` (
  `type` VARCHAR(45) NOT NULL,
  `name` TEXT NOT NULL,
  `value` TEXT NOT NULL,
  `ttl` INT NOT NULL);
    