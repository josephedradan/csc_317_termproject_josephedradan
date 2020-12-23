-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: csc_317_termproject
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comments_id` int NOT NULL AUTO_INCREMENT,
  `comments_comment` longtext NOT NULL,
  `comments_date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments_fk_users_id` int NOT NULL,
  `comments_fk_posts_id` int NOT NULL,
  PRIMARY KEY (`comments_id`),
  UNIQUE KEY `comments_id_UNIQUE` (`comments_id`),
  KEY `comments_fk_users_id_FK_users_id` (`comments_fk_users_id`),
  KEY `comments_fk_posts_id_FK_users_id` (`comments_fk_posts_id`),
  CONSTRAINT `CONSTRAINT_comments_fk_posts_id_FK_posts_id` FOREIGN KEY (`comments_fk_posts_id`) REFERENCES `posts` (`posts_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CONSTRAINT_comments_fk_users_id_FK_users_id` FOREIGN KEY (`comments_fk_users_id`) REFERENCES `users` (`users_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'very nice!','2020-12-22 22:42:30',3,5);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `posts_id` int NOT NULL AUTO_INCREMENT,
  `posts_title` varchar(128) NOT NULL,
  `posts_description` longtext NOT NULL,
  `posts_path_file` varchar(4096) NOT NULL,
  `posts_path_thumbnail` varchar(4096) NOT NULL,
  `posts_active` int NOT NULL DEFAULT '0',
  `posts_date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `posts_fk_users_id` int NOT NULL,
  PRIMARY KEY (`posts_id`),
  UNIQUE KEY `posts_id_UNIQUE` (`posts_id`),
  KEY `posts_fk_users_id_FK_users_id` (`posts_fk_users_id`),
  CONSTRAINT `CONSTRAINT_posts_fk_users_id_FK_users_id` FOREIGN KEY (`posts_fk_users_id`) REFERENCES `users` (`users_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'Nice','WOW','/images/uploads/604a7e1fd542db9bbbf676843d4ef9ac87e8dd431c7d.jpeg','/images/uploads/thumbnail-604a7e1fd542db9bbbf676843d4ef9ac87e8dd431c7d.jpeg',0,'2020-12-22 22:27:44',1),(2,'Dungeon Master Van','Dungeon Master','/images/uploads/2e3c576eacce9336b01240aa6c4226cd12678a4ee03a.webp','/images/uploads/thumbnail-2e3c576eacce9336b01240aa6c4226cd12678a4ee03a.webp',0,'2020-12-22 22:28:12',1),(3,'Nice Abs!','jesus','/images/uploads/4930d6a57ec3dd9f6c4d84ef9a056c99c68f416f1f80.webp','/images/uploads/thumbnail-4930d6a57ec3dd9f6c4d84ef9a056c99c68f416f1f80.webp',0,'2020-12-22 22:28:31',1),(4,'Normal Van','daaaamn','/images/uploads/fc460c09c066b0863d9b1a1e902bcd0a40b89f63d8e0.jpeg','/images/uploads/thumbnail-fc460c09c066b0863d9b1a1e902bcd0a40b89f63d8e0.jpeg',0,'2020-12-22 22:28:59',1),(5,'Billy 2','Nice','/images/uploads/9ba04a674bc53c1b41d4e6576c4d85a45effcb8e28ee.png','/images/uploads/thumbnail-9ba04a674bc53c1b41d4e6576c4d85a45effcb8e28ee.png',0,'2020-12-22 22:42:03',3);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `users_id` int NOT NULL AUTO_INCREMENT,
  `users_username` varchar(64) NOT NULL,
  `users_email` varchar(128) NOT NULL,
  `users_password` varchar(128) NOT NULL,
  `users_usertype` int NOT NULL DEFAULT '0',
  `users_active` int NOT NULL DEFAULT '0',
  `users_date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`users_id`),
  UNIQUE KEY `users_id_UNIQUE` (`users_id`),
  UNIQUE KEY `users_username_UNIQUE` (`users_username`),
  UNIQUE KEY `email_UNIQUE` (`users_email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test3','Test3@Test3.com','$2b$10$bs6OzrVW0mjl1GxQZSlToeXpy6kTE1dyiW7FCyzd.9.CR9E3TSL/.',0,0,'2020-12-22 22:27:07'),(2,'test1','Test1@Test1.com','$2b$10$V.2lDtQFIQSbJ6RIdR76ledsMORQvlMIAJY79Qkx6VCpRCDvRneOu',0,0,'2020-12-22 22:40:28'),(3,'test2','Test2@Test2.com','$2b$10$9L7na363Pwv92sSYsAoEhecP/XoKDgygFIF8VMPnk01lDz/IDm2ma',0,0,'2020-12-22 22:41:35');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-22 23:16:32
