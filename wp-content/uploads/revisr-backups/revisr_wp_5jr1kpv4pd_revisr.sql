
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
DROP TABLE IF EXISTS `wp_5jr1kpv4pd_revisr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_5jr1kpv4pd_revisr` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `message` text,
  `event` varchar(42) NOT NULL,
  `user` varchar(60) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `wp_5jr1kpv4pd_revisr` WRITE;
/*!40000 ALTER TABLE `wp_5jr1kpv4pd_revisr` DISABLE KEYS */;
INSERT INTO `wp_5jr1kpv4pd_revisr` VALUES (1,'2019-07-01 13:26:13','Successfully created a new repository.','init','nkharade@fimc.com'),(2,'2019-07-01 13:26:42','Error pushing changes to the remote repository.','error','nkharade@fimc.com'),(3,'2019-07-01 13:30:02','Error pushing changes to the remote repository.','error','nkharade@fimc.com'),(4,'2019-07-01 13:36:16','Error pushing changes to the remote repository.','error','nkharade@fimc.com'),(5,'2019-07-01 13:36:28','Error pulling changes from the remote repository.','error','nkharade@fimc.com'),(6,'2019-07-01 13:39:18','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(7,'2019-07-02 11:18:21','Error pushing changes to the remote repository.','error','nkharade@fimc.com'),(8,'2019-07-02 11:24:13','Error pushing changes to the remote repository.','error','nkharade@fimc.com'),(9,'2019-07-02 11:25:30','Error pulling changes from the remote repository.','error','nkharade@fimc.com'),(10,'2019-07-02 11:25:42','Error pushing changes to the remote repository.','error','nkharade@fimc.com'),(11,'2019-07-02 11:51:01','Successfully pushed 2 commits to ECommStaging/master.','push','nkharade@fimc.com'),(12,'2019-07-02 12:04:25','Error pushing changes to the remote repository.','error','nkharade@fimc.com'),(13,'2019-07-02 12:08:17','Successfully pushed 0 commits to ECommStaging/master.','push','nkharade@fimc.com'),(14,'2019-07-05 11:28:57','Successfully pushed 0 commits to ECommStaging/master.','push','nkharade@fimc.com'),(15,'2019-07-05 11:29:36','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(16,'2019-07-05 11:29:45','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(17,'2019-07-14 16:41:24','Error pushing changes to the remote repository.','error','nkharade@fimc.com'),(18,'2019-07-14 16:42:09','Error pushing changes to the remote repository.','error','nkharade@fimc.com'),(19,'2019-07-14 16:43:54','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(20,'2019-07-14 16:45:58','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(21,'2019-07-14 16:46:48','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(22,'2019-07-14 16:47:08','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(23,'2019-07-14 16:47:43','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(24,'2019-07-14 16:49:20','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(25,'2019-07-14 16:50:10','Successfully pushed 0 commits to ECommStaging/master.','push','nkharade@fimc.com'),(26,'2019-07-14 16:50:31','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(27,'2019-07-14 16:51:28','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(28,'2019-07-14 16:52:51','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(29,'2019-07-14 16:53:04','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(30,'2019-07-14 16:54:08','Successfully pushed 0 commits to ECommStaging/master.','push','nkharade@fimc.com'),(31,'2019-07-14 17:04:00','Successfully pushed 0 commits to ECommStaging/master.','push','nkharade@fimc.com'),(32,'2019-07-14 17:04:35','There was an error committing the changes to the local repository.','error','nkharade@fimc.com'),(33,'2019-07-14 17:07:49','Committed <a href=\"http://mng.b0b.myftpupload.com/wp-admin/admin.php?page=revisr_view_commit&commit=e5e2b55&success=true\">#e5e2b55</a> to the local repository.','commit','nkharade@fimc.com'),(34,'2019-07-14 17:08:13','Successfully pushed 1 commit to ECommStaging/master.','push','nkharade@fimc.com'),(35,'2019-07-15 09:03:58','Committed <a href=\"http://mng.b0b.myftpupload.com/wp-admin/admin.php?page=revisr_view_commit&commit=1ea2459&success=true\">#1ea2459</a> to the local repository.','commit','nkharade@fimc.com'),(36,'2019-07-15 09:11:21','Successfully pushed 1 commit to ECommStaging/master.','push','nkharade@fimc.com'),(37,'2019-07-22 13:09:50','Committed <a href=\"http://mng.b0b.myftpupload.com/wp-admin/admin.php?page=revisr_view_commit&commit=68e407f&success=true\">#68e407f</a> to the local repository.','commit','nkharade@fimc.com'),(38,'2019-07-22 13:10:17','Successfully pushed 1 commit to ECommStaging/master.','push','nkharade@fimc.com');
/*!40000 ALTER TABLE `wp_5jr1kpv4pd_revisr` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

