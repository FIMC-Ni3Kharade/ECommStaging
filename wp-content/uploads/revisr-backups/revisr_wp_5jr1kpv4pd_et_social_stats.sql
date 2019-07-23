
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
DROP TABLE IF EXISTS `wp_5jr1kpv4pd_et_social_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_5jr1kpv4pd_et_social_stats` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `sharing_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `network` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `action` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `post_id` bigint(20) NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `media_url` varchar(2083) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `location` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `wp_5jr1kpv4pd_et_social_stats` WRITE;
/*!40000 ALTER TABLE `wp_5jr1kpv4pd_et_social_stats` DISABLE KEYS */;
INSERT INTO `wp_5jr1kpv4pd_et_social_stats` VALUES (1,'2019-04-09 19:50:35','linkedin','share',1032,'73.13.1.136','','sidebar'),(2,'2019-04-09 19:50:55','linkedin','share',20,'73.13.1.136','','sidebar'),(3,'2019-04-09 20:06:05','linkedin','share',1035,'73.13.1.136','','sidebar'),(4,'2019-04-12 20:36:30','linkedin','share',24,'69.242.64.33','','sidebar'),(5,'2019-04-12 20:36:51','linkedin','share',46,'69.242.64.33','','sidebar'),(6,'2019-04-12 21:58:27','linkedin','share',1016,'73.13.1.136','','sidebar'),(7,'2019-04-15 20:34:40','linkedin','follow',46,'73.13.1.136','',''),(8,'2019-04-18 18:59:35','linkedin','follow',46,'65.196.155.44','',''),(9,'2019-04-22 19:03:37','linkedin','follow',20,'173.161.168.253','',''),(10,'2019-04-23 15:41:34','linkedin','follow',46,'65.17.242.8','','');
/*!40000 ALTER TABLE `wp_5jr1kpv4pd_et_social_stats` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

