
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
DROP TABLE IF EXISTS `wp_5jr1kpv4pd_yoast_seo_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_5jr1kpv4pd_yoast_seo_links` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `target_post_id` bigint(20) unsigned NOT NULL,
  `type` varchar(8) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `link_direction` (`post_id`,`type`)
) ENGINE=MyISAM AUTO_INCREMENT=7947 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `wp_5jr1kpv4pd_yoast_seo_links` WRITE;
/*!40000 ALTER TABLE `wp_5jr1kpv4pd_yoast_seo_links` DISABLE KEYS */;
INSERT INTO `wp_5jr1kpv4pd_yoast_seo_links` VALUES (6598,'/health',24,1032,'internal'),(6599,'mailto:Information@fimc.com',24,0,'external'),(6600,'tel:877.343.7521',24,0,'external'),(6597,'/home',24,1022,'internal'),(6596,'/auto',24,1028,'internal'),(6594,'/home',24,1022,'internal'),(6595,'/health',24,1032,'internal'),(6592,'https://www.linkedin.com/company/fimc',24,0,'external'),(6593,'/auto',24,1028,'internal'),(6560,'tel:877.343.7521',27,0,'external'),(6561,'/contact-us/',27,1076,'internal'),(7037,'mailto:Information@fimc.com',1035,0,'external'),(7038,'tel:877.343.7521',1035,0,'external'),(7039,'/contact-us/',1035,1076,'internal'),(7079,'mailto:Information@fimc.com',1022,0,'external'),(7080,'tel:877.343.7521',1022,0,'external'),(7081,'/contact-us/',1022,1076,'internal'),(7751,'/contact-us/',1028,1076,'internal'),(7750,'tel:877.343.7521',1028,0,'external'),(7749,'mailto:Information@fimc.com',1028,0,'external'),(7073,'mailto:Information@fimc.com',2006,0,'external'),(7074,'tel:877.343.7521',2006,0,'external'),(7043,'mailto:Information@fimc.com',1032,0,'external'),(7044,'tel:877.343.7521',1032,0,'external'),(7045,'/contact-us/',1032,1076,'internal'),(6336,'https://www.linkedin.com/company/fimc',1042,0,'external'),(6337,'mailto:Information@fimc.com',1042,0,'external'),(6338,'tel:877.343.7521',1042,0,'external'),(6339,'/contact-us/',1042,1076,'internal'),(6296,'https://www.linkedin.com/company/fimc',20,0,'external'),(6297,'mailto:Information@fimc.com',20,0,'external'),(6298,'tel:877.343.7521',20,0,'external'),(6299,'/contact-us/',20,1076,'internal'),(6559,'mailto:Information@fimc.com',27,0,'external'),(6558,'https://www.linkedin.com/company/fimc',27,0,'external'),(6601,'/contact-us/',24,1076,'internal'),(7075,'/contact-us/',2006,1076,'internal'),(7067,'mailto:Information@fimc.com',1039,0,'external'),(7068,'tel:877.343.7521',1039,0,'external'),(7069,'/contact-us/',1039,1076,'internal'),(7946,'https://homeandauto.com',5568,0,'external'),(7945,'javascript:void(0)',5568,0,'external'),(7944,'javascript:void(0)',5568,0,'external'),(7943,'javascript:void(0)',5568,0,'external'),(7938,'javascript:void(0)',5568,0,'external'),(7939,'javascript:void(0)',5568,0,'external'),(7940,'javascript:void(0)',5568,0,'external'),(7941,'javascript:void(0)',5568,0,'external'),(7942,'javascript:void(0)',5568,0,'external'),(7882,'/contact-us/',46,1076,'internal'),(7881,'tel:877.343.7521',46,0,'external'),(7880,'mailto:Information@fimc.com',46,0,'external'),(7879,'/company/',46,20,'internal'),(7878,'/why-us#extend',46,27,'internal'),(7877,'/why-us#revenue',46,27,'internal'),(7876,'/why-us#engage',46,27,'internal'),(7875,'https://www.linkedin.com/company/fimc',46,0,'external'),(7937,'javascript:void(0)',5568,0,'external'),(7936,'javascript:void(0)',5568,0,'external'),(7935,'javascript:void(0)',5568,0,'external'),(7934,'javascript:void(0)',5568,0,'external'),(7933,'javascript:void(0)',5568,0,'external'),(7932,'javascript:void(0)',5568,0,'external');
/*!40000 ALTER TABLE `wp_5jr1kpv4pd_yoast_seo_links` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

