CREATE TABLE IF NOT EXISTS `outfit_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Code` varchar(50) DEFAULT NULL,
  `Label` varchar(25) DEFAULT NULL,
  `Data` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;