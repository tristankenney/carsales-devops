CREATE DATABASE `route53`;
CREATE TABLE `route53`.`records` (
  `type` VARCHAR(45) NOT NULL,
  `name` TEXT NOT NULL,
  `value` TEXT NOT NULL,
  `ttl` INT NOT NULL);
    