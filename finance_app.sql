-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 25, 2024 at 10:48 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

-- Table structure for table `divisi`
--

CREATE TABLE `divisi` (
  `idDivisi` varchar(50) NOT NULL,
  `Nama_Divisi` varchar(100) NOT NULL,
  PRIMARY KEY (`idDivisi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `users`
--

CREATE TABLE `users` (
  `idUser` varchar(50) NOT NULL,
  `idDivisi` varchar(50),
  `Nama` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Role` varchar(20),
  `Password` varchar(200) NOT NULL,
  `CreatedAt` timestamp NOT NULL,
  `Report_to` varchar(50),
  PRIMARY KEY (`idUser`),
  FOREIGN KEY (`idDivisi`) REFERENCES `divisi`(`idDivisi`),
  FOREIGN KEY (`Report_to`) REFERENCES `users`(`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `forecast_pemasukan`
--

CREATE TABLE `forecast_pemasukan` (
  `idForecastPemasukan` varchar(50) NOT NULL,
  `idUser` varchar(50),
  `Bulan` int(11) NOT NULL,
  `Tahun` int(11) NOT NULL,
  `Total_Forecast_Pemasukan` decimal(10,0) NOT NULL,
  `isApproved` ENUM('approved', 'rejected', 'waiting') NOT NULL DEFAULT 'waiting',
  `approvedBy` varchar(50),
  `timeApproved` datetime,
  `notes` text,
  PRIMARY KEY (`idForecastPemasukan`),
  FOREIGN KEY (`idUser`) REFERENCES `users`(`idUser`),
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `forecast_pengeluaran`
--

CREATE TABLE `forecast_pengeluaran` (
  `idForecastPengeluaran` varchar(50) NOT NULL,
  `idUser` varchar(50),
  `Bulan` int(11) NOT NULL,
  `Tahun` int(11) NOT NULL,
  `Total_Forecast_Pengeluaran` decimal(10,0) NOT NULL,
  `isApproved` ENUM('approved', 'rejected', 'waiting') NOT NULL DEFAULT 'waiting',
  `approvedBy` varchar(50),
  `timeApproved` datetime,
  `notes` text,
  PRIMARY KEY (`idForecastPengeluaran`),
  FOREIGN KEY (`idUser`) REFERENCES `users`(`idUser`),
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `actual_pemasukan`
--

CREATE TABLE `actual_pemasukan` (
  `idActualPemasukan` varchar(50) NOT NULL,
  `idDivisi` varchar(50),
  `Bulan` int(11) NOT NULL,
  `Tahun` int(11) NOT NULL,
  `Total_Actual_Pemasukan` decimal(10,0) NOT NULL,
  PRIMARY KEY (`idActualPemasukan`),
  FOREIGN KEY (`idDivisi`) REFERENCES `divisi`(`idDivisi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `actual_pengeluaran`
--

CREATE TABLE `actual_pengeluaran` (
  `idActualPengeluaran` varchar(50) NOT NULL,
  `idDivisi` varchar(50),
  `Bulan` int(11) NOT NULL,
  `Tahun` int(11) NOT NULL,
  `Total_Actual_Pengeluaran` decimal(10,0) NOT NULL,
  PRIMARY KEY (`idActualPengeluaran`),
  FOREIGN KEY (`idDivisi`) REFERENCES `divisi`(`idDivisi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `kategori_forecast_pemasukan`
--

CREATE TABLE `kategori_forecast_pemasukan` (
  `idKategori` varchar(50) NOT NULL,
  `idForecastPemasukan` varchar(50),
  `Nama_Kategori` varchar(100) NOT NULL,
  `Harga` decimal(10,0) NOT NULL,
  PRIMARY KEY (`idKategori`),
  FOREIGN KEY (`idForecastPemasukan`) REFERENCES `forecast_pemasukan`(`idForecastPemasukan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `kategori_forecast_pengeluaran`
--

CREATE TABLE `kategori_forecast_pengeluaran` (
  `idKategori` varchar(50) NOT NULL,
  `idForecastPengeluaran` varchar(50),
  `Nama_Kategori` varchar(100) NOT NULL,
  `Harga` decimal(10,0) NOT NULL,
  PRIMARY KEY (`idKategori`),
  FOREIGN KEY (`idForecastPengeluaran`) REFERENCES `forecast_pengeluaran`(`idForecastPengeluaran`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `item_actual_pemasukan`
--

CREATE TABLE `item_actual_pemasukan` (
  `idItem` varchar(50) NOT NULL,
  `idActualPemasukan` varchar(50),
  `idUser` varchar(50),
  `Nama_Item` varchar(100) NOT NULL,
  `Harga` decimal(10,0) NOT NULL,
  `idKategori` varchar(50),
  PRIMARY KEY (`idItem`),
  FOREIGN KEY (`idActualPemasukan`) REFERENCES `actual_pemasukan`(`idActualPemasukan`),
  FOREIGN KEY (`idUser`) REFERENCES `users`(`idUser`),
  FOREIGN KEY (`idKategori`) REFERENCES `kategori_forecast_pemasukan`(`idKategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- Table structure for table `item_actual_pengeluaran`
--

CREATE TABLE `item_actual_pengeluaran` (
  `idItem` varchar(50) NOT NULL,
  `idActualPengeluaran` varchar(50),
  `idUser` varchar(50),
  `idKategori` varchar(50),
  `Nama_Item` varchar(100) NOT NULL,
  `Harga` decimal(10,0) NOT NULL,
  `Sisa_Anggaran_Kategori` decimal(10,0) NOT NULL,
  PRIMARY KEY (`idItem`),
  FOREIGN KEY (`idActualPengeluaran`) REFERENCES `actual_pengeluaran`(`idActualPengeluaran`),
  FOREIGN KEY (`idUser`) REFERENCES `users`(`idUser`),
  FOREIGN KEY (`idKategori`) REFERENCES `kategori_forecast_pengeluaran`(`idKategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `request_item_actual_pengeluaran` (
  `idRequest_Item` varchar(50) NOT NULL,
  `idActualPengeluaran` varchar(50),
  `idUser` varchar(50),
  `idKategori` varchar(50),
  `Nama_Item` varchar(100) NOT NULL,
  `Harga` decimal(10,0) NOT NULL,
  `isApproved` ENUM('approved', 'rejected', 'waiting') NOT NULL DEFAULT 'waiting',
  `approvedBy` varchar(50),
  `timeApproved` datetime,
  `Notes` text,
  PRIMARY KEY (`idRequest_Item`),
  FOREIGN KEY (`idActualPengeluaran`) REFERENCES `actual_pengeluaran`(`idActualPengeluaran`),
  FOREIGN KEY (`idUser`) REFERENCES `users`(`idUser`),
  FOREIGN KEY (`idKategori`) REFERENCES `kategori_forecast_pengeluaran`(`idKategori`),
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `divisi` (`idDivisi`, `Nama_Divisi`) VALUES
('ADMN', 'admin'),
('FNCE', 'finance'),
('HRDP', 'human resource'),
('ITSD', 'IT support'),
('MFG', 'manufacturing'),
('MKTM', 'marketing'),
('PRCH', 'purchasing'),
('RND', 'research and development');

INSERT INTO `users` (`idUser`, `idDivisi`, `Nama`, `Email`, `Role`, `Password`, `CreatedAt`, `Report_to`) VALUES
('adm-001', 'ADMN', 'admin-danar', 'danar@admin.com', 'supervisor', 'admin112233', '2024-08-27 06:37:15', NULL),
('UID-bpnixs4c', 'PRCH', 'dandan', 'coba@gmail.com', 'user', '$2a$10$uByZWJjsaOEhGkMBvKyBj./dhF8tniXyO0ap07q/9HMHBBX5dopGC', '2024-09-01 16:00:09', 'adm-001'),
('UID-CxFjgTOhQXY=', 'FNCE', 'finance1', 'finance@gmail.com', 'supervisor', '$2a$10$FTaELoPtRsIwkFlB4BeG1u1SmoeFqjr4nTNawhChMk860epFwQgLG', '2024-08-27 10:06:31', NULL),
('UID-Dj49jfaRkVu=', 'ITSD', 'itsd1', 'itsd1@company.com', 'supervisor', '$2a$10$sQpmcXvhOfpGRKXTEB9a7uXlnIJT.NorFnJMuVZXuO/VJncozJgSO', '2024-08-30 04:00:00', NULL),
('UID-Fm9DjsK01EY=', 'HRDP', 'hrd1', 'hrd1@company.com', 'employee', '$2a$10$XaKq/jLbQfGHuVJgoLLoM.OXGVz5Ne6vqOeEYyecVZlbTVwGP.eSu', '2024-08-28 01:30:00', 'UID-CxFjgTOhQXY='),
('UID-Jj8TKX93uWs=', 'MFG', 'manufacturing1', 'mfg1@company.com', 'supervisor', '$2a$10$YAG.juJha5Hre0TwV3W8F.GllT89KvNXYmLnbj5KJSGO.CMO2kMNy', '2024-09-01 15:43:46', 'UID-CxFjgTOhQXY='),
('UID-MT0At081vXM=', 'ADMN', 'danar', 'priyambodo02@gmail.com', 'supervisor', '$2a$10$0BISt4YtLcUxj5DUncUf1uhlo2.1XZ9rTEjaIis/PsKvgrxLipU3O', '2024-08-27 06:47:27', NULL),
('UID-Xl2BjS2nPkd=', 'MKTM', 'marketing1', 'mktm1@company.com', 'employee', '$2a$10$sKEMyjKhvYr9UeIgbk4/hO0lsNXSDc1U5TwWcOpZBndmnqEEmw6HG', '2024-08-29 03:00:00', 'UID-MT0At081vXM=');

INSERT INTO `actual_pengeluaran` (`idActualPengeluaran`, `idDivisi`, `Bulan`, `Tahun`, `Total_Actual_Pengeluaran`) VALUES
('APG-001', 'HRDP', 9, 2024, '38000000'),
('APG-002', 'MFG', 8, 2024, '52000000'),
('APG-003', 'MKTM', 8, 2024, '60000000'),
('APG-004', 'ITSD', 8, 2024, '70000000');

INSERT INTO `forecast_pemasukan` (`idForecastPemasukan`, `idUser`, `Bulan`, `Tahun`, `Total_Forecast_Pemasukan`, `isApproved`) VALUES
('FPM-001', 'UID-Fm9DjsK01EY=', 8, 2024, '50000000', 'approved'),
('FPM-002', 'UID-Jj8TKX93uWs=', 8, 2024, '70000000', 'waiting'),
('FPM-003', 'UID-Xl2BjS2nPkd=', 8, 2024, '60000000', 'rejected'),
('FPM-004', 'UID-Dj49jfaRkVu=', 8, 2024, '80000000', 'waiting');

INSERT INTO `forecast_pengeluaran` (`idForecastPengeluaran`, `idUser`, `Bulan`, `Tahun`, `Total_Forecast_Pengeluaran`, `isApproved`) VALUES
('FPG-001', 'UID-Fm9DjsK01EY=', 8, 2024, '40000000', 'approved'),
('FPG-002', 'UID-Jj8TKX93uWs=', 8, 2024, '50000000', 'waiting'),
('FPG-003', 'UID-Xl2BjS2nPkd=', 8, 2024, '55000000', 'rejected'),
('FPG-004', 'UID-Dj49jfaRkVu=', 8, 2024, '75000000', 'approved');

INSERT INTO `kategori_forecast_pengeluaran` (`idKategori`, `idForecastPengeluaran`, `Nama_Kategori`, `Harga`) VALUES
('KFP-001', 'FPG-001', 'Operational Expenses', '50000000'),
('KFP-002', 'FPG-001', 'Marketing Budget', '20000000'),
('KFP-003', 'FPG-002', 'Employee Salaries', '70000000'),
('KFP-004', 'FPG-002', 'Office Supplies', '15000000'),
('KFP-005', 'FPG-003', 'Research and Development', '100000000'),
('KFP-006', 'FPG-003', 'New Equipment', '30000000'),
('KFP-007', 'FPG-004', 'IT Infrastructure', '25000000'),
('KFP-008', 'FPG-004', 'Software Licenses', '15000000');

INSERT INTO `request_item_actual_pengeluaran` (`idRequest_Item`, `idActualPengeluaran`, `idUser`, `idKategori`, `Nama_Item`, `Harga`, `isApproved`, `Notes`) VALUES
('RIPG-001', 'APG-001', 'UID-Fm9DjsK01EY=', 'KFP-001', 'Request-Item1-HRDP', '10000000', 'rejected', 'mantap bang'),
('RIPG-002', 'APG-002', 'UID-Jj8TKX93uWs=', 'KFP-002', 'Request-Item2-MFG', '15000000', 'approved', 'Approved by supervisor'),
('RIPG-003', 'APG-003', 'UID-Xl2BjS2nPkd=', 'KFP-003', 'Request-Item3-MKTM', '20000000', 'rejected', 'Not within budget'),
('RIPG-004', 'APG-004', 'UID-Dj49jfaRkVu=', 'KFP-004', 'Request-Item4-ITSD', '25000000', 'waiting', 'Pending final review');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
