use badjs;

CREATE TABLE `b_score` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `badjsid` int(11) NOT NULL DEFAULT '0',
  `score` varchar(10) DEFAULT NULL,
  `date` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `badjsid` (`badjsid`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;


CREATE TABLE `b_pv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `badjsid` int(11) NOT NULL DEFAULT '0',
  `pv` int(11) NOT NULL DEFAULT '0',
  `date` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `badjsid` (`badjsid`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

