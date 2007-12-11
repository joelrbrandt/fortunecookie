-- phpMyAdmin SQL Dump
-- version 2.11.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 11, 2007 at 08:14 AM
-- Server version: 5.0.45
-- PHP Version: 5.2.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `flvtagger`
--

-- --------------------------------------------------------

--
-- Table structure for table `flvtags`
--

CREATE TABLE `flvtags` (
  `uniqueID` int(11) NOT NULL auto_increment,
  `filename` varchar(100) collate latin1_general_ci NOT NULL,
  `authorName` varchar(50) collate latin1_general_ci NOT NULL,
  `eventType` varchar(50) collate latin1_general_ci NOT NULL,
  `eventSubType` varchar(50) collate latin1_general_ci NOT NULL,
  `eventID` varchar(20) collate latin1_general_ci NOT NULL,
  `annotation` text collate latin1_general_ci,
  `startTime` int(11) NOT NULL,
  `endTime` int(11) NOT NULL,
  PRIMARY KEY  (`uniqueID`),
  KEY `startTime` (`startTime`),
  KEY `endTime` (`endTime`),
  KEY `filename` (`filename`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=16 ;
