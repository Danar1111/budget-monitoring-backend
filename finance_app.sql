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
  PRIMARY KEY (`idForecastPemasukan`),
  FOREIGN KEY (`idUser`) REFERENCES `users`(`idUser`)
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
  PRIMARY KEY (`idForecastPengeluaran`),
  FOREIGN KEY (`idUser`) REFERENCES `users`(`idUser`)
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
  `Notes` VARCHAR(500),
  PRIMARY KEY (`idRequest_Item`),
  FOREIGN KEY (`idActualPengeluaran`) REFERENCES `actual_pengeluaran`(`idActualPengeluaran`),
  FOREIGN KEY (`idUser`) REFERENCES `users`(`idUser`),
  FOREIGN KEY (`idKategori`) REFERENCES `kategori_forecast_pengeluaran`(`idKategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `divisi` (`idDivisi`, `Nama_Divisi`) VALUES
('ADMN', 'admin'),
('FNCE', 'finance');

INSERT INTO `users` (`idUser`, `idDivisi`, `Nama`, `Email`, `Role`, `Password`, `CreatedAt`, `Report_to`) VALUES
('adm-001', 'ADMN', 'admin-danar', 'danar@admin.com', 'supervisor', 'admin112233', '2024-08-27 06:37:15', NULL),
('UID-CxFjgTOhQXY=', 'FNCE', 'finance1', 'finance@gmail.com', 'supervisor', '$2a$10$FTaELoPtRsIwkFlB4BeG1u1SmoeFqjr4nTNawhChMk860epFwQgLG', '2024-08-27 10:06:31', NULL),
('UID-MT0At081vXM=', 'ADMN', 'danar', 'priyambodo02@gmail.com', 'supervisor', '$2a$10$0BISt4YtLcUxj5DUncUf1uhlo2.1XZ9rTEjaIis/PsKvgrxLipU3O', '2024-08-27 06:47:27', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
