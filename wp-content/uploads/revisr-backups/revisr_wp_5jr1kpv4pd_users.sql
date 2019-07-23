
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `wp_5jr1kpv4pd_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_5jr1kpv4pd_users` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_login` varchar(60) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_pass` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_nicename` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_email` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_url` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_activation_key` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_status` int(11) NOT NULL DEFAULT '0',
  `display_name` varchar(250) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`),
  KEY `user_login_key` (`user_login`),
  KEY `user_nicename` (`user_nicename`),
  KEY `user_email` (`user_email`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `wp_5jr1kpv4pd_users` WRITE;
/*!40000 ALTER TABLE `wp_5jr1kpv4pd_users` DISABLE KEYS */;
INSERT INTO `wp_5jr1kpv4pd_users` VALUES (1,'fimc1440','$P$B1DQ4JstajIBYnPYbQW0RgDkGIE.ow0','fimc1440','itcontracts@fimc.com','','2019-01-25 20:15:35','',0,'fimc1440'),(2,'studio','$P$BALEdAZHhQk3F2nqnKoisE7x1QZIf9.','studio','studio@iperdesign.com','','2019-02-08 16:02:02','1549641722:$P$BQrl5qmh8C976YSNTWf3dGoqXvx4IH1',0,'Studio Iperdesign'),(3,'msubhan@fimc.com','$P$BucIN1Za7zxfh6b.3yRBdSEUmwfCZz.','msubhanfimc-com','msubhan@fimc.com','','2019-03-26 15:18:17','1553613497:$P$Bd0lG3ZSGGw5bbOURYbBvq2BK8ydIT.',0,'Michael Subhan'),(4,'cscaraville@fimc.com','$P$B2WOm4imSgbxzjTQHS3aGSZezpgEpH1','cscaravillefimc-com','cscaraville@fimc.com','','2019-03-26 15:20:13','1553613613:$P$B.MLUx78DXBEE5kjabqSfN7wG81XUQ.',0,'Christina Scaraville'),(5,'tg@iperdesign.com','$P$Bi9xwlz1VFOxkPFvoXXwEuE9hnUOv10','tgiperdesign-com','tg@iperdesign.com','','2019-04-15 19:36:27','1555356987:$P$BKLsCEIL3bqg7vMpTD32xLyt11.Siz0',0,'Tony Groves'),(6,'SCurran','$P$BVcbWUnHr16N/rDxvg9XQDjV.127hU1','scurran','scurran@fimc.com','','2019-05-08 13:56:31','1557323792:$P$BuJIWOBWF.DycQPH6nN6rZFqbZLm/u0',0,'Shane Curran'),(7,'gravindran@fimc.com','$P$BT4PfZ6OmPwPIW.YBvAHKqgir8y9HL1','gravindranfimc-com','gravindran@fimc.com','','2019-06-20 13:52:26','',0,'Gerald Ravindran'),(8,'nkharade@fimc.com','$P$BfW.bx6ocFYUxJ.YinanMXgCHmcSg5.','nkharadefimc-com','nkharade@fimc.com','','2019-06-20 13:58:06','',0,'Nitin Kharade');
/*!40000 ALTER TABLE `wp_5jr1kpv4pd_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

