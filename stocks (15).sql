-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 07, 2025 at 04:40 PM
-- Server version: 5.7.28
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stocks`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_accounthead`
--

DROP TABLE IF EXISTS `tbl_accounthead`;
CREATE TABLE IF NOT EXISTS `tbl_accounthead` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `head_name` varchar(255) NOT NULL,
  `grp_name` varchar(255) NOT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_accounthead`
--

INSERT INTO `tbl_accounthead` (`nid`, `head_name`, `grp_name`, `active_status`, `b_status`, `creation_date`) VALUES
(1, 'tester', 'test1', 'active', 1, '2025-04-01 16:27:21');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_adminheader`
--

DROP TABLE IF EXISTS `tbl_adminheader`;
CREATE TABLE IF NOT EXISTS `tbl_adminheader` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `comp_name` varchar(255) NOT NULL,
  `sub_head` varchar(255) NOT NULL,
  `adminhead_email` varchar(255) NOT NULL,
  `adminhead_address` varchar(255) NOT NULL,
  `active_status` enum('active','block') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_adminheader`
--

INSERT INTO `tbl_adminheader` (`nid`, `comp_name`, `sub_head`, `adminhead_email`, `adminhead_address`, `active_status`, `b_status`, `creation_date`) VALUES
(1, 'xyz', 'xyz', 'xyz@gmail.com', 'poiutrew8765432', 'active', 1, '2025-04-22 17:23:02');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_attribute`
--

DROP TABLE IF EXISTS `tbl_attribute`;
CREATE TABLE IF NOT EXISTS `tbl_attribute` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_name` varchar(255) NOT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_attribute`
--

INSERT INTO `tbl_attribute` (`nid`, `attribute_name`, `active_status`, `b_status`, `creation_date`) VALUES
(1, 'Quality', 'active', 1, '2025-04-02 13:30:52'),
(2, 'Colour', 'active', 1, '2025-04-02 16:08:19'),
(3, 'Mines', 'active', 1, '2025-04-02 16:08:43'),
(4, 'Treatment', 'active', 1, '2025-04-02 16:09:04'),
(5, 'Stone', 'active', 1, '2025-04-02 16:10:12'),
(6, 'Size', 'active', 1, '2025-04-02 16:10:34'),
(7, 'Shape', 'active', 1, '2025-04-02 16:10:53'),
(9, 'Cut', 'active', 1, '2025-05-28 18:24:32');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_attribute_value`
--

DROP TABLE IF EXISTS `tbl_attribute_value`;
CREATE TABLE IF NOT EXISTS `tbl_attribute_value` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_name` varchar(255) NOT NULL,
  `attribute_value` varchar(255) NOT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_attribute_value`
--

INSERT INTO `tbl_attribute_value` (`nid`, `attribute_name`, `attribute_value`, `active_status`, `b_status`, `creation_date`) VALUES
(2, 'Colour', 'test', 'active', 1, '2025-05-28 18:07:59'),
(3, 'Colour', 'test', 'active', 1, '2025-05-28 18:09:05'),
(4, 'Size', 't6est', 'active', 1, '2025-05-28 18:17:04'),
(5, 'Quality', 't2', 'active', 1, '2025-05-28 18:17:51'),
(6, 'Mines', 'm1', 'active', 1, '2025-05-28 18:17:57'),
(7, 'Treatment', 't1', 'active', 1, '2025-05-28 18:18:05'),
(11, 'Cut', 'c1', 'active', 1, '2025-05-28 18:24:47'),
(9, 'Shape', 's3', 'active', 1, '2025-05-28 18:18:21'),
(10, 'Stone', 's4', 'active', 1, '2025-05-28 18:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_balancesheet_grp`
--

DROP TABLE IF EXISTS `tbl_balancesheet_grp`;
CREATE TABLE IF NOT EXISTS `tbl_balancesheet_grp` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `grp_name` varchar(255) NOT NULL,
  `grp_type` varchar(255) NOT NULL,
  `grp_rev_cap` varchar(255) NOT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_balancesheet_grp`
--

INSERT INTO `tbl_balancesheet_grp` (`nid`, `grp_name`, `grp_type`, `grp_rev_cap`, `active_status`, `b_status`, `creation_date`) VALUES
(1, 'test1', 'test', 'capital', 'active', 1, '2025-04-01 16:26:58');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_bank`
--

DROP TABLE IF EXISTS `tbl_bank`;
CREATE TABLE IF NOT EXISTS `tbl_bank` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(255) NOT NULL,
  `bank_branch` varchar(255) NOT NULL,
  `Active_status` enum('Active','Inactive') DEFAULT 'Active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `acc_num` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_bank`
--

INSERT INTO `tbl_bank` (`nid`, `bank_name`, `bank_branch`, `Active_status`, `b_status`, `creation_date`, `acc_num`) VALUES
(3, 'test', 'test center ', 'Active', 1, '2025-05-29 08:51:33', '098754321');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_categories`
--

DROP TABLE IF EXISTS `tbl_categories`;
CREATE TABLE IF NOT EXISTS `tbl_categories` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `ctr_name` varchar(255) NOT NULL,
  `ctr_code` varchar(100) NOT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_categories`
--

INSERT INTO `tbl_categories` (`nid`, `ctr_name`, `ctr_code`, `active_status`, `b_status`, `creation_date`) VALUES
(1, 'testc', 'tc2', 'active', 1, '2025-04-01 05:33:44');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_curruncy`
--

DROP TABLE IF EXISTS `tbl_curruncy`;
CREATE TABLE IF NOT EXISTS `tbl_curruncy` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `symbol` varchar(10) NOT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_customers`
--

DROP TABLE IF EXISTS `tbl_customers`;
CREATE TABLE IF NOT EXISTS `tbl_customers` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `cust_name` varchar(255) NOT NULL,
  `cust_mobile` varchar(15) NOT NULL,
  `cust_email` varchar(255) NOT NULL,
  `cust_firm_name` varchar(255) DEFAULT NULL,
  `cust_address` varchar(500) DEFAULT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_customers`
--

INSERT INTO `tbl_customers` (`nid`, `cust_name`, `cust_mobile`, `cust_email`, `cust_firm_name`, `cust_address`, `active_status`, `b_status`, `creation_date`) VALUES
(1, 'harsh', '876544567234', 'harsh@test.com', 'xyzltd', 'x-123', 'active', 1, '2025-04-01 06:08:28');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_customer_payment`
--

DROP TABLE IF EXISTS `tbl_customer_payment`;
CREATE TABLE IF NOT EXISTS `tbl_customer_payment` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `sale_ref` varchar(100) NOT NULL,
  `payment_mode` varchar(100) NOT NULL,
  `payment_date` varchar(50) NOT NULL,
  `amount` varchar(100) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `b_status` tinyint(1) DEFAULT '1',
  `parent_id` varchar(255) DEFAULT NULL,
  `bank` varchar(50) DEFAULT NULL,
  `invoice_amount` varchar(100) DEFAULT NULL,
  `paid_amount` varchar(100) DEFAULT NULL,
  `due_amount` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_customer_payment`
--

INSERT INTO `tbl_customer_payment` (`nid`, `customer_name`, `sale_ref`, `payment_mode`, `payment_date`, `amount`, `remark`, `b_status`, `parent_id`, `bank`, `invoice_amount`, `paid_amount`, `due_amount`) VALUES
(1, 'harsh', '1', 'Cash', '2025-04-30', '100', 'half', 1, '1', NULL, '100.99', '50', '50.989999999999995');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_head_categories`
--

DROP TABLE IF EXISTS `tbl_head_categories`;
CREATE TABLE IF NOT EXISTS `tbl_head_categories` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `ctr_name` varchar(255) NOT NULL,
  `ctr_code` varchar(100) NOT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_head_categories`
--

INSERT INTO `tbl_head_categories` (`nid`, `ctr_name`, `ctr_code`, `active_status`, `b_status`, `creation_date`) VALUES
(8, 'fake stone ', 'fs01', 'active', 1, '2025-05-28 17:48:33'),
(7, 'precious stone ', 'ps1', 'active', 1, '2025-05-28 17:24:15');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_managestockno`
--

DROP TABLE IF EXISTS `tbl_managestockno`;
CREATE TABLE IF NOT EXISTS `tbl_managestockno` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `head_category` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `lot` varchar(255) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `image` blob,
  `certificate_image` blob,
  `description` varchar(255) DEFAULT NULL,
  `dimension` varchar(255) DEFAULT NULL,
  `colour` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `quality` varchar(255) DEFAULT NULL,
  `mines` varchar(255) DEFAULT NULL,
  `shape` varchar(255) DEFAULT NULL,
  `stone_type` varchar(255) DEFAULT NULL,
  `pcs` varchar(255) DEFAULT NULL,
  `price_code` varchar(255) DEFAULT NULL,
  `treatment` varchar(255) DEFAULT NULL,
  `partner` varchar(255) DEFAULT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `barcode_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` varchar(50) DEFAULT NULL,
  `cut` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `weight_unit` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_managestockno`
--

INSERT INTO `tbl_managestockno` (`nid`, `head_category`, `category`, `lot`, `barcode`, `weight`, `image`, `certificate_image`, `description`, `dimension`, `colour`, `size`, `quality`, `mines`, `shape`, `stone_type`, `pcs`, `price_code`, `treatment`, `partner`, `active_status`, `b_status`, `creation_date`, `barcode_image`, `price`, `cut`, `location`, `weight_unit`) VALUES
(1, 'test', 'testc', 'xyz', '80546836348', '100', 0x3130, NULL, NULL, 'test', '1', '12', '1', '1', '1', 'ruby', '80', '1', '1', '1', 'active', 1, '2025-04-03 05:26:43', 'data:image/png;base64,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', '50', NULL, NULL, NULL),
(2, 'test', 'testc2', 'test', '12019047587', '389', 0x3130, NULL, NULL, '1', '1', '12', '1', '1', '1', 'emerald', '309', '1', '1', '1', 'active', 1, '2025-04-07 09:11:46', 'data:image/png;base64,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', NULL, NULL, NULL, NULL),
(10, 'fake stone ', 'testc', 'FS0', '49408777443', '0                                                                                ', NULL, NULL, 'descp', 'dimen', 'test', 't6est', 't2', 'm1', 's3', 's4', '0', 'pc', 't1', 'part', 'active', 1, '2025-05-29 12:51:38', 'data:image/png;base64,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', NULL, 'c1', 'location', NULL),
(11, 'fake stone ', 'testc', 'FS1', '50052265989', '0                                        ', NULL, NULL, 'descprition', 'dimen', 'test', 't6est', 't2', 'm1', 's3', 's4', '0', 'pc', 't1', 'part', 'active', 1, '2025-05-29 18:19:18', 'data:image/png;base64,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', NULL, 'c1', 'location', 'carat');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mng_purchase`
--

DROP TABLE IF EXISTS `tbl_mng_purchase`;
CREATE TABLE IF NOT EXISTS `tbl_mng_purchase` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(255) NOT NULL,
  `purchase_date` varchar(50) NOT NULL,
  `due_date` varchar(50) NOT NULL,
  `lot_no` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `weight` varchar(100) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `tax` varchar(100) DEFAULT NULL,
  `net_amount` varchar(100) DEFAULT NULL,
  `additional_charges` varchar(100) DEFAULT NULL,
  `discount_percent` varchar(100) DEFAULT NULL,
  `discount_amount` varchar(100) DEFAULT NULL,
  `exchange_rate` varchar(100) DEFAULT NULL,
  `net_total_amt` varchar(100) DEFAULT NULL,
  `price_multiply_by` varchar(100) DEFAULT NULL,
  `currency` varchar(50) DEFAULT NULL,
  `currency_value` varchar(100) DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `weightunit` varchar(255) DEFAULT NULL,
  `pcs` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_mng_purchase`
--

INSERT INTO `tbl_mng_purchase` (`nid`, `supplier_name`, `purchase_date`, `due_date`, `lot_no`, `description`, `weight`, `price`, `tax`, `net_amount`, `additional_charges`, `discount_percent`, `discount_amount`, `exchange_rate`, `net_total_amt`, `price_multiply_by`, `currency`, `currency_value`, `remarks`, `b_status`, `creation_date`, `weightunit`, `pcs`) VALUES
(1, '1', '2025-04-03', '2025-04-22', 'xyz', 'test', '100', '10', '5', '1050.00', '1', '1', '1', '1', '1040.50', '1', 'THB', '2', 'test', 1, '2025-04-03 16:12:38', 'carat', '100'),
(2, '1', '2025-04-03', '2025-04-22', 'xyz', 'test item', '100', '50', '5', '525', '5', '2', '10', '1', '520', '1', 'THB', '1', 'Test entry', 1, '2025-04-18 14:01:11', 'carat', '10'),
(3, '1', '2025-04-03', '2025-04-22', 'xyz', 'test item', '100', '50', '5', '525', '5', '2', '10', '1', '520', '1', 'THB', '1', 'Test entry', 1, '2025-04-18 14:03:07', 'carat', '10'),
(4, '1', '2025-04-03', '2025-04-22', 'xyz', 'test item', '100', '50', '5', '525', '5', '2', '10', '1', '520', '1', 'THB', '1', 'Test entry', 1, '2025-04-18 14:05:23', 'carat', '10'),
(5, '1', '2025-04-03', '2025-04-22', 'xyz', 'test item', '100', '50', '5', '525', '5', '2', '10', '1', '520', '1', 'THB', '1', 'Test entry', 1, '2025-04-18 14:06:41', 'carat', '10'),
(6, '1', '2025-04-03', '2025-04-22', 'xyz', 'test item', '100', '50', '5', '525', '5', '2', '10', '1', '520', '1', 'THB', '1', 'Test entry', 1, '2025-04-18 14:07:08', 'carat', '10'),
(7, '1', '2025-04-20', '2025-04-28', 'xyz', 'test', '1000', '25', '0', '2500.00', '0', '0', '0.00', '0', '2500.00', '0', 'THB', '1', 'test', 1, '2025-04-20 08:55:24', 'carat', '100'),
(8, '1', '2025-04-20', '2025-04-28', 'xyz', 'test', '1000', '25', '0', '2500.00', '0', '0', '0.00', '0', '2500.00', '0', 'THB', '1', 'test', 1, '2025-04-20 08:55:24', 'carat', '100'),
(9, '1', '2025-04-20', '2025-04-22', 'xyz', 'test', '100', '11', '0', '132.00', '0', '0', '0.00', '0', '132.00', '0', 'THB', '0', 'test', 1, '2025-04-20 09:05:58', 'carat', '12'),
(10, '1', '2025-04-03', '2025-04-22', 'xyz', 'test item', '100', '50', '5', '525', '5', '2', '10', '1', '520', '1', 'THB', '1', 'Test entry', 1, '2025-04-21 13:21:19', 'carat', '10');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mng_sales`
--

DROP TABLE IF EXISTS `tbl_mng_sales`;
CREATE TABLE IF NOT EXISTS `tbl_mng_sales` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `sales_date` varchar(50) NOT NULL,
  `due_date` varchar(50) NOT NULL,
  `lot_no` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `weight` varchar(100) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `tax` varchar(100) DEFAULT NULL,
  `net_amount` varchar(100) DEFAULT NULL,
  `additional_charges` varchar(100) DEFAULT NULL,
  `discount_percent` varchar(100) DEFAULT NULL,
  `discount_amount` varchar(100) DEFAULT NULL,
  `exchange_rate` varchar(100) DEFAULT NULL,
  `net_total_amt` varchar(100) DEFAULT NULL,
  `price_multiply_by` varchar(100) DEFAULT NULL,
  `currency` varchar(50) DEFAULT NULL,
  `currency_value` varchar(100) DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `weight_unit` varchar(255) DEFAULT NULL,
  `pcs` varchar(255) DEFAULT NULL,
  `sales_person` varchar(255) DEFAULT NULL,
  `commission_type` varchar(255) DEFAULT NULL,
  `commission_percentage` varchar(255) DEFAULT NULL,
  `sales_commission` varchar(255) DEFAULT NULL,
  `tax_7` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_mng_sales`
--

INSERT INTO `tbl_mng_sales` (`nid`, `customer_name`, `sales_date`, `due_date`, `lot_no`, `description`, `weight`, `price`, `tax`, `net_amount`, `additional_charges`, `discount_percent`, `discount_amount`, `exchange_rate`, `net_total_amt`, `price_multiply_by`, `currency`, `currency_value`, `remarks`, `b_status`, `creation_date`, `weight_unit`, `pcs`, `sales_person`, `commission_type`, `commission_percentage`, `sales_commission`, `tax_7`) VALUES
(1, '1', '2025-04-20', '2025-04-30', 'test', 'test', '10', '10', '1', '101.00', '1', '1', '1', '1', '100.99', '1', 'THB', '1', 'test', 1, '2025-04-20 10:09:41', 'carat', '10', 'harsh', 'received', '01', '1', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_permission`
--

DROP TABLE IF EXISTS `tbl_permission`;
CREATE TABLE IF NOT EXISTS `tbl_permission` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `rolename` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `heading` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `b_status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_permission`
--

INSERT INTO `tbl_permission` (`nid`, `rolename`, `parent_id`, `category`, `heading`, `role`, `b_status`) VALUES
(2, 'Manage Users', '0', 'Usermanagement', 'menu', 'admin', 1),
(3, 'Manage User', '2', 'Usermanagement', 'submenu', 'admin', 1),
(4, 'Admin header', '2', 'Usermanagement', 'submenu', 'admin', 1),
(5, 'User permission', '2', 'Usermanagement', 'submenu', 'admin', 1),
(6, 'Add attribute', '2', 'Usermanagement', 'submenu', 'admin', 1),
(7, 'Manage stocks', '0', 'Stocksmanagement', 'menu', 'admin', 1),
(8, 'Manage stockno', '7', 'Stockmanagement', 'submenu', 'admin', 1),
(9, 'Stock history', '7', 'Stockmanagement', 'submenu', 'admin', 1),
(10, 'Head Categories', '7', 'Stockmanagement', 'submenu', 'admin', 1),
(11, 'Categories', '7', 'Stockmanagement', 'submenu', 'admin', 1),
(12, 'Attribute value', '7', 'Stockmanagement', 'submenu', 'admin', 1),
(13, 'Stock printing', '7', 'Stockmanagement', 'submenu', 'admin', 1),
(14, 'Transfer stock', '7', 'Stockmanagement', 'submenu', 'admin', 1),
(15, 'View all transfer', '7', 'Stockmanagement', 'submenu', 'admin', 1),
(16, 'Expenses', '0', 'Expenses', 'menu', 'admin', 1),
(17, 'View balance sheet grp', '16', 'Expenses', 'submenu', 'admin', 1),
(18, 'Manage account head', '16', 'Expenses', 'submenu', 'admin', 1),
(19, 'Manage Bank', '16', 'Expenses', 'submenu', 'admin', 1),
(20, 'Manage Voucher', '16', 'Expenses', 'submenu', 'admin', 1),
(21, 'Personal Expense', '16', 'Expenses', 'submenu', 'admin', 1),
(22, 'Purchase', '0', 'Purchases', 'menu', 'admin', 1),
(23, 'Manage purchase', '22', 'Purchases', 'submenu', 'admin\r\n', 1),
(24, 'Manage suppliers', '22', 'Purchases', 'submenu', 'admin', 1),
(1, 'Dashboard', '0', 'dashboard', 'menu', 'admin', 1),
(25, 'Supplier payments', '22', 'Purchases', 'submenu', 'admin', 1),
(26, 'Sales', '0', 'Sales', 'menu', 'admin', 1),
(27, 'Manage Sales', '26', 'Sales', 'submenu', 'admin', 1),
(28, 'Manage customers', '26', 'Sales', 'submenu', 'admin', 1),
(29, 'Create Saleinvoice', '26', 'Sales', 'submenu', 'admin', 1),
(30, 'Manage saleperson', '26', 'Sales', 'submenu', 'admin', 1),
(31, 'Customer Payments', '26', 'Sales', 'submenu', 'admin', 1),
(32, 'Approvals', '0', 'Approvals', 'menu', 'admin', 1),
(33, 'Sales Approvals', '32', 'Approvals', 'submenu', 'admin', 1),
(34, 'Purchase Approvals', '32', 'Approvals', 'submenu', 'admin', 1),
(35, 'Report', '0', 'Reports', 'menu', 'admin', 1),
(36, 'Profitloss report', '35', 'Report', 'submenu', 'admin', 1),
(37, 'Stock report', '35', 'Report', 'submenu', 'admin', 1),
(38, 'Ledger report', '35', 'Report', 'submenu', 'admin', 1),
(39, 'Balance sheet', '35', 'Report', 'submenu', 'admin', 1),
(40, 'Cash book', '35', 'Report', 'submenu', 'admin', 1),
(41, 'Bank book', '35', 'Report', 'submenu', 'admin', 1),
(42, 'Purchase by stock', '35', 'Report', 'submenu', 'admin', 1),
(43, 'Purchase by supplier', '35', 'Report', 'submenu', 'admin', 1),
(44, 'Sales by stock', '35', 'Report', 'submenu', 'admin', 1),
(45, 'Sales by customer', '35', 'Report', 'submenu', 'admin', 1),
(46, 'Other Masters', '0', 'othermaster', 'menu', 'admin', 1),
(47, 'Manage currencies', '46', 'othermaster', 'submenu', 'admin', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_personal_exp`
--

DROP TABLE IF EXISTS `tbl_personal_exp`;
CREATE TABLE IF NOT EXISTS `tbl_personal_exp` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` varchar(50) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_personal_exp`
--

INSERT INTO `tbl_personal_exp` (`nid`, `date`, `description`, `amount`, `remarks`, `active_status`, `b_status`) VALUES
(1, '2025-04-01', 'tea', '10000', 'good', 'active', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_purchaseapp_detail`
--

DROP TABLE IF EXISTS `tbl_purchaseapp_detail`;
CREATE TABLE IF NOT EXISTS `tbl_purchaseapp_detail` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(255) NOT NULL,
  `lot_no` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `weight` varchar(100) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `sales_person` varchar(255) DEFAULT NULL,
  `entry_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `b_status` tinyint(1) DEFAULT '1',
  `status` enum('approved','pending','returned') DEFAULT 'pending',
  `sales_id` varchar(255) DEFAULT NULL,
  `pcs` varchar(255) DEFAULT NULL,
  `net_amount` varchar(255) DEFAULT NULL,
  `weight_unit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_purchase_approvals`
--

DROP TABLE IF EXISTS `tbl_purchase_approvals`;
CREATE TABLE IF NOT EXISTS `tbl_purchase_approvals` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(255) NOT NULL,
  `lot_no` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `weight` varchar(100) DEFAULT NULL,
  `net_amount` varchar(100) DEFAULT NULL,
  `sales_person` varchar(255) DEFAULT NULL,
  `entry_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `b_status` tinyint(1) DEFAULT '1',
  `pcs` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `weight_unit` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','returned') DEFAULT 'pending',
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_purchase_approvals`
--

INSERT INTO `tbl_purchase_approvals` (`nid`, `supplier_name`, `lot_no`, `description`, `weight`, `net_amount`, `sales_person`, `entry_date`, `b_status`, `pcs`, `price`, `weight_unit`, `status`) VALUES
(1, 'harsh', 'test', '10', '100', '900.00', 'harsh', '2025-04-11 10:17:31', 1, '100', '9', 'carat', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_salesapp_detail`
--

DROP TABLE IF EXISTS `tbl_salesapp_detail`;
CREATE TABLE IF NOT EXISTS `tbl_salesapp_detail` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `lot_no` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `weight` varchar(100) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `sales_person` varchar(255) DEFAULT NULL,
  `entry_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `b_status` tinyint(1) DEFAULT '1',
  `status` enum('approved','pending','returned') DEFAULT 'pending',
  `sales_id` varchar(255) DEFAULT NULL,
  `pcs` varchar(255) DEFAULT NULL,
  `net_amount` varchar(255) DEFAULT NULL,
  `weight_unit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sales_approvals`
--

DROP TABLE IF EXISTS `tbl_sales_approvals`;
CREATE TABLE IF NOT EXISTS `tbl_sales_approvals` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `lot_no` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `weight` varchar(100) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `sales_person` varchar(255) DEFAULT NULL,
  `entry_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `b_status` tinyint(1) DEFAULT '1',
  `status` enum('approved','pending','returned') DEFAULT 'pending',
  `pcs` varchar(255) DEFAULT NULL,
  `net_amount` varchar(255) DEFAULT NULL,
  `weight_unit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_sales_approvals`
--

INSERT INTO `tbl_sales_approvals` (`nid`, `customer_name`, `lot_no`, `description`, `weight`, `price`, `sales_person`, `entry_date`, `b_status`, `status`, `pcs`, `net_amount`, `weight_unit`) VALUES
(1, 'harsh', 'xyz', 'test', '9', '10', 'harsh', '2025-04-11 10:30:53', 1, 'pending', '80', '800.00', 'carat');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sale_person`
--

DROP TABLE IF EXISTS `tbl_sale_person`;
CREATE TABLE IF NOT EXISTS `tbl_sale_person` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `sale_per_name` varchar(255) NOT NULL,
  `sale_per_mob` varchar(15) NOT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_sale_person`
--

INSERT INTO `tbl_sale_person` (`nid`, `sale_per_name`, `sale_per_mob`, `active_status`, `b_status`, `creation_date`) VALUES
(1, 'harsh', '09928591501', 'active', 1, '2025-04-01 06:09:46');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_stock_log`
--

DROP TABLE IF EXISTS `tbl_stock_log`;
CREATE TABLE IF NOT EXISTS `tbl_stock_log` (
  `lot` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `action_date` varchar(255) DEFAULT NULL,
  `old_value` varchar(255) DEFAULT NULL,
  `new_value` varchar(255) DEFAULT NULL,
  `price` varchar(255) NOT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `customer` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_stock_log`
--

INSERT INTO `tbl_stock_log` (`lot`, `action`, `action_date`, `old_value`, `new_value`, `price`, `supplier`, `customer`) VALUES
('xyz', 'purchased', '2025-04-03', '0', '100', '10', 'harsh', NULL),
('xyz', 'purchased', '2025-04-03', '100', '100', '10', '1', NULL),
('xyz', 'sold', '2025-04-12', '100', '10', '50', NULL, '1'),
('xyz', 'purchase on approval', '2025-04-07', '80', '10', '2', 'harsh', NULL),
('xyz', 'purchase approved', '2025-04-10', '89', '89', '2', 'harsh', NULL),
('test', 'purchase on approval', '2025-04-10', '1', '100', '2', 'harsh', NULL),
('test', 'purchase on approval', '2025-04-10', '101', '99', '2', 'harsh', NULL),
('test', 'purchase approval edited', '2025-04-10', '100', '99', '2', 'harsh', NULL),
('test', 'purchase on approval', '2025-04-10', '199', '100', '2', 'harsh', NULL),
('test', 'purchase approval edited', '2025-04-10', '99', '100', '2', 'harsh', NULL),
('test', 'purchase on approval', '2025-04-10', '200', '100', '3', 'harsh', NULL),
('test', 'purchase approval edited', '2025-04-10', '100', '100', '3', 'harsh', NULL),
('test', 'purchase approval edited', '2025-04-10', '100', '99', '3', 'harsh', NULL),
('test', 'purchase on approval', '2025-04-11', '399', '100', '10', 'harsh', NULL),
('test', 'purchase approval edited', '2025-04-11', '100', '100', '9', 'harsh', NULL),
('xyz', 'sales approval edited', '2025-04-11', '70', '80', '10', NULL, 'harsh'),
('xyz', 'purchased', '2025-04-03', '-9', '10', '50', '1', NULL),
('xyz', 'purchased', '2025-04-03', '10', '10', '50', '1', NULL),
('xyz', 'purchased', '2025-04-03', '10', '10', '50', '1', NULL),
('xyz', 'purchased', '2025-04-03', '10', '10', '50', '1', NULL),
('xyz', 'purchased', '2025-04-03', '10', '10', '50', '1', NULL),
('xyz', 'sold', '2025-04-12', '10', '10', '50', NULL, '1'),
('xyz', 'purchased', '2025-04-20', '0', '100', '25', '1', NULL),
('xyz', 'purchased', '2025-04-20', '100', '100', '25', '1', NULL),
('xyz', 'purchased', '2025-04-20', '100', '12', '11', '1', NULL),
('xyz', 'sold', '2025-04-20', '12', '11', '20', NULL, '1'),
('xyz', 'sold', '2025-04-20', '12', '11', '20', NULL, '1'),
('test', 'sold', '2025-04-20', '499', '100', '100', NULL, '1'),
('test', 'sold', '2025-04-20', '399', '10', '10', NULL, '1'),
('xyz', 'purchased', '2025-04-03', '-10', '10', '50', '1', NULL),
('xyz', 'purchased', '2025-04-03', '10', '10', '50', '1', NULL),
('xyz', 'purchased', '2025-04-03', '10', '10', '50', '1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_suppliers`
--

DROP TABLE IF EXISTS `tbl_suppliers`;
CREATE TABLE IF NOT EXISTS `tbl_suppliers` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `sup_name` varchar(255) NOT NULL,
  `sup_comp_name` varchar(255) NOT NULL,
  `sup_email` varchar(255) NOT NULL,
  `sup_mobile` varchar(20) NOT NULL,
  `sup_address` text NOT NULL,
  `sup_tax_id` varchar(50) NOT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`),
  UNIQUE KEY `sup_email` (`sup_email`),
  UNIQUE KEY `sup_mobile` (`sup_mobile`),
  UNIQUE KEY `sup_tax_id` (`sup_tax_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_suppliers`
--

INSERT INTO `tbl_suppliers` (`nid`, `sup_name`, `sup_comp_name`, `sup_email`, `sup_mobile`, `sup_address`, `sup_tax_id`, `active_status`, `b_status`, `creation_date`) VALUES
(1, 'harsh', 'xyzltd', 'harsh@test.com', '876544567234', 'x-123', '8356yhb245', 'active', 1, '2025-04-01 04:21:41');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_supplier_payment`
--

DROP TABLE IF EXISTS `tbl_supplier_payment`;
CREATE TABLE IF NOT EXISTS `tbl_supplier_payment` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(255) NOT NULL,
  `purchase_ref` varchar(100) NOT NULL,
  `payment_mode` varchar(100) NOT NULL,
  `payment_date` varchar(50) NOT NULL,
  `amount` varchar(100) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `b_status` tinyint(1) DEFAULT '1',
  `parent_id` varchar(255) DEFAULT NULL,
  `invoice_amount` varchar(100) DEFAULT NULL,
  `paid_amount` varchar(100) DEFAULT NULL,
  `due_amount` varchar(100) DEFAULT NULL,
  `bank` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_supplier_payment`
--

INSERT INTO `tbl_supplier_payment` (`nid`, `supplier_name`, `purchase_ref`, `payment_mode`, `payment_date`, `amount`, `remark`, `b_status`, `parent_id`, `invoice_amount`, `paid_amount`, `due_amount`, `bank`) VALUES
(1, 'harsh', '1', 'Cash', '2025-04-30', '100', 'trial', 1, '1', '1040.5', '100', '940.5', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tranferstock`
--

DROP TABLE IF EXISTS `tbl_tranferstock`;
CREATE TABLE IF NOT EXISTS `tbl_tranferstock` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `from_lot` varchar(100) DEFAULT NULL,
  `from_current_qty` varchar(100) DEFAULT NULL,
  `from_trans_qty` varchar(100) DEFAULT NULL,
  `from_final_qty` varchar(100) DEFAULT NULL,
  `from_price` varchar(100) DEFAULT NULL,
  `from_amount` varchar(100) DEFAULT NULL,
  `to_lot` varchar(100) DEFAULT NULL,
  `to_current_qty` varchar(100) DEFAULT NULL,
  `to_trans_qty` varchar(100) DEFAULT NULL,
  `to_final_qty` varchar(100) DEFAULT NULL,
  `to_price` varchar(100) DEFAULT NULL,
  `to_amount` varchar(100) DEFAULT NULL,
  `total_tans_qty` varchar(100) DEFAULT NULL,
  `recut_charges` varchar(100) DEFAULT NULL,
  `total_amount` varchar(100) DEFAULT NULL,
  `recut_loss_qty` varchar(100) DEFAULT NULL,
  `missing_qty` varchar(100) DEFAULT NULL,
  `creationdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_trans_qty` varchar(100) DEFAULT NULL,
  `net_total_amt` varchar(100) DEFAULT NULL,
  `b_status` tinyint(1) DEFAULT '1',
  `remarks` varchar(255) DEFAULT NULL,
  `avg_price` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_tranferstock`
--

INSERT INTO `tbl_tranferstock` (`nid`, `from_lot`, `from_current_qty`, `from_trans_qty`, `from_final_qty`, `from_price`, `from_amount`, `to_lot`, `to_current_qty`, `to_trans_qty`, `to_final_qty`, `to_price`, `to_amount`, `total_tans_qty`, `recut_charges`, `total_amount`, `recut_loss_qty`, `missing_qty`, `creationdate`, `total_trans_qty`, `net_total_amt`, `b_status`, `remarks`, `avg_price`) VALUES
(1, 'xyz', '90', '10', '80.00', '1', '10.00', 'test', '0', '1', '-1.00', '1', '1.00', '10.00', '50', '500.00', '20', '30', '2025-04-07 15:19:05', '10.00', '500.00', 1, 'test', NULL),
(2, 'xyz', '10', '10', '0.00', '50', '500.00', 'test', '389', '10.00', '399.00', '10', '100.00', '10.00', '20', '520.00', '2', '2', '2025-04-22 00:48:38', '6.00', '100.00', 1, 'trial', NULL),
(3, 'test', '399', '50', '349.00', '10', '500.00', 'xyz', '0', '50.00', '50.00', '50', '2500.00', '50.00', '10', '510.00', '10', '10', '2025-04-22 09:06:03', '30.00', '2500.00', 1, 'test', '30.00'),
(4, NULL, NULL, NULL, NULL, NULL, NULL, 'xyz', '0', '50.00', '50.00', '50', '2500.00', '50.00', '10', '510.00', '10', '10', '2025-04-22 09:06:03', '30.00', '2500.00', 1, 'test', '30.00'),
(5, 'test', '349', '20', '329.00', '10', '200.00', 'xyz', '50', '20.00', '70.00', '50', '1000.00', '20.00', '50', '250.00', '5', '5', '2025-04-22 09:21:03', '10.00', '1000.00', 1, 'test', '30.00'),
(6, NULL, NULL, NULL, NULL, NULL, NULL, 'xyz', '50', '20.00', '70.00', '50', '1000.00', '20.00', '50', '250.00', '5', '5', '2025-04-22 09:21:03', '10.00', '1000.00', 1, 'test', '30.00'),
(7, 'test', '349', '20', '329.00', '10', '200.00', 'xyz', '50', '20.00', '70.00', '50', '1000.00', '20.00', '50', '250.00', '5', '5', '2025-04-22 09:21:05', '10.00', '1000.00', 1, 'test', '30.00'),
(8, NULL, NULL, NULL, NULL, NULL, NULL, 'xyz', '50', '20.00', '70.00', '50', '1000.00', '20.00', '50', '250.00', '5', '5', '2025-04-22 09:21:05', '10.00', '1000.00', 1, 'test', '30.00'),
(9, 'test', '349', '20', '329.00', '10', '200.00', 'xyz', '50', '20.00', '70.00', '50', '1000.00', '20.00', '50', '250.00', '5', '5', '2025-04-22 09:21:15', '10.00', '1000.00', 1, 'test', '30.00'),
(10, NULL, NULL, NULL, NULL, NULL, NULL, 'xyz', '50', '20.00', '70.00', '50', '1000.00', '20.00', '50', '250.00', '5', '5', '2025-04-22 09:21:15', '10.00', '1000.00', 1, 'test', '30.00'),
(11, 'test', '289', '10', '279.00', '10', '100.00', 'xyz', '50', '10.00', '60.00', '50', '500.00', '10.00', '10', '110.00', '5', '5', '2025-04-22 09:31:50', '0.00', '500.00', 1, 'test', '30.00'),
(12, NULL, NULL, NULL, NULL, NULL, NULL, 'xyz', '50', '10.00', '60.00', '50', '500.00', '10.00', '10', '110.00', '5', '5', '2025-04-22 09:31:50', '0.00', '500.00', 1, 'test', '30.00'),
(13, 'xyz', '100', '10', '90.00', '50', '500.00', 'test', '279', '10.00', '289.00', '20', '200.00', '10.00', '10', '510.00', '5', '5', '2025-04-22 09:39:41', '0.00', '200.00', 1, 'trial', '35.00'),
(14, NULL, NULL, NULL, NULL, NULL, NULL, 'test', '279', '10.00', '289.00', '20', '200.00', '10.00', '10', '510.00', '5', '5', '2025-04-22 09:39:41', '0.00', '200.00', 1, 'trial', '35.00'),
(15, 'xyz', '90', '10', '80.00', '50', '500.00', 'test', '299', '10.00', '309.00', '10', '100.00', '10.00', '10', '510.00', '5', '5', '2025-04-22 10:15:48', '0.00', '100.00', 1, 'test', '30.00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

DROP TABLE IF EXISTS `tbl_user`;
CREATE TABLE IF NOT EXISTS `tbl_user` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `roles` varchar(255) DEFAULT NULL,
  `active_status` enum('active','inactive') DEFAULT 'active',
  `bstatus` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`nid`, `user_name`, `user_password`, `user_email`, `firstname`, `lastname`, `phone`, `roles`, `active_status`, `bstatus`, `creation_date`) VALUES
(1, 'Admin', '$2b$10$dpj4ehUJ9Lkhn7dC7t265eBy3ZZSrN8sk01z/qOcKnAknWkpETQ1i', 'admin@gmail.com', 'Admin', 'main', '+123456789', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47', 'active', 1, '2025-04-11 02:04:07'),
(7, 'v123', '$2b$10$bDLQZENvr8VCFP9mTW2.B.OfS8H13uYzTGlfLa1cLVMGK7oyrzGgS', 'virat@gmail.com', 'virat', 'rathi', '+91 9365214812', NULL, 'active', 1, '2025-05-28 06:26:27'),
(8, 'anushka', '$2b$10$I7dXNZ/UBcH4WNKHxCeXwOYh4iUcPHySimC60HDKLRKgzgHNKocCG', 'anushka@gmail.com', 'anuhska', 'sharma', '095432098', NULL, 'active', 1, '2025-05-28 06:33:00'),
(9, 'rohit', '$2b$10$DV/ZlsuZn6pAvla/4FlAB.CQBD/TTp1NJTFhVlmxaxwKST/wqii0.', 'rohit@gmail.com', 'rohit', 'sharma', '+91329654494', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47', 'active', 1, '2025-05-28 06:40:17'),
(10, 'suryakumar', '$2b$10$CRgf9Njh0UuHv6FHHC3n8.cHXjcTRnswKxDpPh2kjQIS8i2/m85sO', 'surya@gmail.com', 'surya', 'kumar', '+9125987654356', NULL, 'active', 1, '2025-05-28 06:43:34'),
(11, 'priti123', '$2b$10$f0D./VzI91H3xiRfsmnRKeSAQGenDcs88tGV41feYRaOPSK8Br33i', 'priti@gmail.com', 'priti', 'rathi', '+9109876543', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47', 'active', 1, '2025-05-29 16:38:48'),
(12, 'sunil123', '$2b$10$/vA7vbN3wc/zGd18p1KrdupFpBlxf7T6TqA9.qkKqnI2sVFgGvfEu', 'sunil@gmail.com', 'sunil', 'rathi', '+91 098765432', NULL, 'active', 1, '2025-05-29 17:40:13');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_voucher`
--

DROP TABLE IF EXISTS `tbl_voucher`;
CREATE TABLE IF NOT EXISTS `tbl_voucher` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `account_name` varchar(255) NOT NULL,
  `payment_mode` varchar(50) NOT NULL,
  `payment_type` varchar(50) NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_ref_no` varchar(100) DEFAULT NULL,
  `remarks` text,
  `b_status` tinyint(1) DEFAULT '1',
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nid`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
