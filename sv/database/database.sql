use alkemy_project;
CREATE TABLE IF NOT EXISTS users(
  `idUser` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `pass` varchar(45) NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `iduser_UNIQUE` (`idUser`),
  UNIQUE KEY `email_UNIQUE` (`email`)
);

CREATE TABLE IF NOT EXISTS transactions(
  `id_transaction` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `type_movement` varchar(50) NOT NULL,
  `concept` varchar(200) NOT NULL,
  `trans_date` date NOT NULL,
  `id_user` varchar(50) NOT NULL,
  `category` varchar(200) NOT NULL,
  PRIMARY KEY (`id_transaction`),
  KEY `fk_user` (`id_user`)
);
