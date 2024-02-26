-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql24j11.db.hostpoint.internal
-- Erstellungszeit: 26. Feb 2024 um 20:17
-- Server-Version: 10.6.16-MariaDB-log
-- PHP-Version: 8.2.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `owoxogis_communitifood`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `codigos_verificacion`
--

CREATE TABLE `codigos_verificacion` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `codigo` varchar(6) NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `codigos_verificacion`
--

INSERT INTO `codigos_verificacion` (`id`, `email`, `codigo`, `fecha_envio`) VALUES
(1, 'info@lweb.ch', '2220', '2024-02-17 00:36:58'),
(2, 'info@lweb.ch', '2402', '2024-02-17 00:37:20'),
(3, 'info@lweb.ch', '6945', '2024-02-17 00:40:09'),
(4, 'info@lweb.ch', '4441', '2024-02-17 00:50:12'),
(5, 'info@lweb.ch', '6010', '2024-02-17 00:56:17'),
(6, 'info@lweb.ch', '8921', '2024-02-17 00:56:47'),
(7, '', '3265', '2024-02-17 00:58:03'),
(8, 'info@lweb.ch', '5739', '2024-02-17 00:59:04'),
(9, '', '2728', '2024-02-17 01:21:36'),
(10, 'info@lweb.ch', '4926', '2024-02-17 01:26:48'),
(11, 'info@lweb.ch', '6717', '2024-02-17 01:28:23'),
(12, 'info@lweb.ch', '5881', '2024-02-17 01:30:57'),
(13, 'info@lweb.ch', '8996', '2024-02-17 01:31:12'),
(14, 'info@lweb.ch', '4168', '2024-02-17 01:31:54'),
(15, 'info@lweb.ch', '7472', '2024-02-17 01:32:15'),
(16, 'info@lweb.ch', '9167', '2024-02-17 01:35:44'),
(17, 'info@lweb.ch', '7420', '2024-02-17 01:50:57'),
(18, 'info@lweb.ch', '6428', '2024-02-17 01:51:15'),
(19, 'info@lweb.ch', '5294', '2024-02-17 01:51:17'),
(20, 'Qdqdeq', '3468', '2024-02-17 01:53:06'),
(21, 'Qdqdeq', '8622', '2024-02-17 01:53:38'),
(22, 'info@lweb.ch', '6685', '2024-02-17 01:57:02'),
(23, 'info@lweb.ch', '1536', '2024-02-17 01:59:46'),
(26, 'info@lweb.ch', '1691', '2024-02-17 02:09:19'),
(27, 'info@lweb.ch', '8470', '2024-02-17 02:09:41'),
(28, 'Info@lweb.ch', '9059', '2024-02-17 11:01:40'),
(29, 'Info@lweb.ch', '5217', '2024-02-17 22:41:00'),
(30, 'Info@lweb.ch', '7134', '2024-02-17 22:41:10'),
(31, 'Info@lweb.ch', '7323', '2024-02-17 22:44:15'),
(32, 'Info@lweb.ch', '7536', '2024-02-17 22:44:23'),
(33, 'Info@lweb.ch', '7478', '2024-02-17 22:44:47'),
(34, '', '7010', '2024-02-17 22:44:59'),
(35, 'Info@lweb.ck', '6601', '2024-02-17 22:55:29'),
(36, '', '4050', '2024-02-17 22:55:41'),
(37, '', '8082', '2024-02-17 22:55:43'),
(38, 'r@lweb.ch', '8035', '2024-02-17 23:00:25'),
(39, 'r@lweb.ch', '8474', '2024-02-17 23:00:41'),
(40, 'r@lweb.ch', '6582', '2024-02-17 23:01:11'),
(41, 'Info@lweb.ch', '9661', '2024-02-18 01:08:59'),
(42, 'Info@lweb.ch', '6124', '2024-02-18 01:10:03'),
(43, 'Info@lweb.ch', '4915', '2024-02-18 01:11:58'),
(44, 'Info@lweb.ch', '2369', '2024-02-18 01:40:03'),
(45, 'Info@lweb.ch', '4094', '2024-02-18 01:41:34'),
(46, 'Info@lweb.ch', '6537', '2024-02-18 01:42:42'),
(47, 'Info@lweb.ch', '2185', '2024-02-18 01:43:48'),
(48, 'Info@lweb.ch', '6674', '2024-02-18 01:49:17'),
(49, 'Info@lweb.ch', '5040', '2024-02-18 01:53:31'),
(50, 'Info@lweb.ch', '1606', '2024-02-18 02:24:29'),
(51, 'Info@lweb.ch', '6435', '2024-02-18 02:29:05'),
(52, 'Info@lweb.ch', '2714', '2024-02-18 10:07:23'),
(53, 'Info@lweb.ch', '1694', '2024-02-18 10:07:25'),
(54, 'Info@lweb.ch', '2695', '2024-02-18 10:08:41'),
(55, 'Info@lweb.ch', '3762', '2024-02-18 10:17:22'),
(56, 'Info@lweb.ch', '1186', '2024-02-18 10:31:20'),
(57, 'Info@lweb.ch', '4250', '2024-02-18 10:33:30'),
(58, 'Info@lweb.ch', '1637', '2024-02-18 10:36:44'),
(59, 'Info@lweb.ch', '1162', '2024-02-18 10:42:11'),
(60, 'Info@lweb.ch', '2770', '2024-02-18 10:45:42'),
(61, 'Info@lweb.ch', '4523', '2024-02-18 10:58:48'),
(62, 'Info@lweb.ch', '8255', '2024-02-18 11:00:45'),
(63, 'Info@lweb.ch', '3218', '2024-02-18 11:14:59'),
(64, 'Info@lweb.ch', '7859', '2024-02-18 12:40:14'),
(65, 'Info@lweb.ch', '7232', '2024-02-18 13:08:57'),
(66, 'Info@lweb.ch', '9875', '2024-02-18 13:12:53'),
(67, '', '7856', '2024-02-18 13:18:19'),
(68, '', '5246', '2024-02-18 13:18:21'),
(69, 'Info@lweb.ch', '6624', '2024-02-18 13:19:43'),
(70, 'Info@lweb.ch', '6984', '2024-02-18 13:34:25'),
(71, 'Info@lweb.ch', '8588', '2024-02-18 13:46:55'),
(72, 'Info@lweb.ch', '8398', '2024-02-18 13:53:46'),
(73, 'Info@lweb.ch', '7274', '2024-02-18 13:54:31'),
(74, 'Info@lweb.ch', '4754', '2024-02-18 18:10:32'),
(75, 'Info@lweb.ch', '7289', '2024-02-18 18:13:41'),
(76, 'Info@lweb.ch', '5066', '2024-02-19 14:49:38'),
(77, 'Info@lweb.ch', '8065', '2024-02-19 15:00:01'),
(78, 'Info@lweb.ch', '3974', '2024-02-19 15:02:01'),
(79, 'Info@lweb.ch', '1415', '2024-02-19 15:04:49'),
(80, 'Info@lweb.ch', '2302', '2024-02-19 15:10:25'),
(81, 'Info@lweb.ch', '5522', '2024-02-19 15:10:40'),
(82, 'Info@lweb.ch', '7475', '2024-02-19 15:11:20'),
(83, 'Info@lweb.ch', '3060', '2024-02-19 15:17:17'),
(84, 'Info@lweb.ch', '2589', '2024-02-19 18:11:27'),
(85, 'Info@lweb.ch', '3076', '2024-02-19 19:33:36'),
(86, 'Info@lweb.ch', '8036', '2024-02-19 19:39:53'),
(87, 'Info@lweb.ch', '4793', '2024-02-19 19:41:39'),
(88, 'Info@lweb.ch', '7254', '2024-02-19 19:54:59'),
(89, 'Info@lweb.ch', '9970', '2024-02-19 19:59:15'),
(90, 'Info@lweb.ch', '9797', '2024-02-19 20:00:52'),
(91, 'Info@lweb.ch', '2749', '2024-02-19 20:07:11'),
(92, 'Info@lweb.ch', '2178', '2024-02-19 20:09:03'),
(93, 'Info@lweb.ch', '4676', '2024-02-19 20:11:27'),
(94, 'Info@lweb.ch', '9404', '2024-02-19 23:06:09'),
(95, 'Info@lweb.ch', '1834', '2024-02-19 23:26:19'),
(96, 'Info@lweb.ch', '9324', '2024-02-20 00:40:23'),
(97, 'Info@lweb.ch', '3294', '2024-02-20 01:34:47'),
(98, 'Info@lweb.ch', '2555', '2024-02-20 01:40:35'),
(99, 'Info@lweb.ch', '9815', '2024-02-20 02:03:32'),
(100, '', '4140', '2024-02-20 02:23:28'),
(101, 'Info@lweb.ch', '2823', '2024-02-20 11:26:42'),
(102, 'Info@lweb.ch', '6621', '2024-02-20 14:06:52'),
(103, 'Info@lweb.ch', '2868', '2024-02-20 14:32:12'),
(104, 'Info@lweb.ch', '9999', '2024-02-20 15:08:44'),
(105, 'Info@lweb.ch', '4456', '2024-02-20 15:42:55'),
(106, 'Info@lweb.ch', '9217', '2024-02-23 15:56:03'),
(107, 'Info@lweb.ch', '6656', '2024-02-23 16:17:24'),
(108, 'Info@lweb.ch', '8640', '2024-02-23 16:18:33'),
(109, '', '2232', '2024-02-23 22:46:10'),
(110, 'Info@lweb.ch', '9268', '2024-02-23 22:46:34'),
(111, 'Info@lweb.ch', '8130', '2024-02-23 22:47:46'),
(112, 'Info@lweb.ch', '8159', '2024-02-23 22:48:10'),
(113, 'Info@lweb.ch', '2081', '2024-02-23 23:51:23'),
(114, 'Info@lweb.ch', '7097', '2024-02-24 01:02:20'),
(115, 'Info@lweb.ch', '5881', '2024-02-24 01:18:37'),
(116, 'Info@lweb.ch', '8499', '2024-02-24 01:44:27'),
(117, 'Info@lweb.ch', '8000', '2024-02-24 02:02:19'),
(118, 'Info@lweb.ch', '5713', '2024-02-24 11:02:29'),
(119, 'Info@lweb.ch', '5499', '2024-02-24 11:16:31'),
(120, 'Info@lweb.ch', '3658', '2024-02-24 12:36:09'),
(121, 'Info@lweb.ch', '3941', '2024-02-24 12:37:24'),
(122, 'Info@lweb.ch', '9228', '2024-02-24 13:08:10'),
(123, 'Info@lweb.ch', '6209', '2024-02-24 15:31:51'),
(124, 'Info@lweb.ch', '2713', '2024-02-24 15:32:45'),
(125, 'Info@lweb.ch', '2233', '2024-02-25 02:38:03'),
(126, 'Info@lweb.ch', '7823', '2024-02-25 23:19:24'),
(127, 'Info@lweb.ch', '2570', '2024-02-25 23:21:40'),
(128, 'Info@lweb.ch', '3946', '2024-02-25 23:22:19'),
(129, 'Info@lweb.ch', '1376', '2024-02-25 23:23:50'),
(130, 'Info@lweb.ch', '1712', '2024-02-25 23:26:44'),
(131, 'Info@lweb.ch', '9841', '2024-02-25 23:28:40'),
(132, 'Info@lweb.ch', '1264', '2024-02-25 23:31:10'),
(133, 'Info@lweb.ch', '2224', '2024-02-25 23:38:50'),
(134, 'Info@lweb.ch', '1772', '2024-02-25 23:45:39'),
(135, 'Info@lweb.ch', '8401', '2024-02-26 00:08:26'),
(136, 'Info@lweb.ch', '5958', '2024-02-26 00:14:13'),
(137, 'Info@lweb.ch', '8660', '2024-02-26 00:46:03'),
(138, 'Info@cantinatexmex.ch', '6684', '2024-02-26 02:36:33');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `negocios`
--

CREATE TABLE `negocios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `pagina_web` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `columna_texto_promocional` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `negocios`
--

INSERT INTO `negocios` (`id`, `nombre`, `contrasena`, `direccion`, `telefono`, `pagina_web`, `email`, `avatar`, `columna_texto_promocional`) VALUES
(1, 'Cafetería Central', '$2y$10$ikeoBT5U08TP2L4j46kfhOOo9T/M85SXXk4.6E8qCZC1oxa7ATNRm', 'Calle Falsa 123', '555-1234', 'http://cafeteriacentral.com', 'contacto@cafeteriacentral.com', NULL, NULL),
(47, 'Cantina Tex-Mex', '$2y$10$wgU13zvM4mwexaf2wX7MdOfMcY/hq.6qc944hByenl5fNG6/OIJZe', 'Jkk', 'Jjjnn', 'Nnnn', 'Info@lweb.ch', 'https://mycode.lweb.ch/uploads/avatars/65dcbe12e6939.jpg', '100 puntos = 20% Rebaja'),
(48, 'Restaurante italia', '$2y$10$TzKcZhEB8CMC90PKBlMPUO21/r.Gtvbfy.kPyVs1TIsrlTZ6j5vZq', 'Jnn', 'Jjn', 'Jjn', 'Info@cantinatexmex.ch', 'https://mycode.lweb.ch/uploads/avatars/65dcbd9824c76.jpg', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `negocios_usuarios`
--

CREATE TABLE `negocios_usuarios` (
  `id` int(11) NOT NULL,
  `negocio_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `puntos` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Puntos`
--

CREATE TABLE `Puntos` (
  `ID` int(11) NOT NULL,
  `NegocioID` int(11) DEFAULT NULL,
  `ClienteID` int(11) DEFAULT NULL,
  `Puntos` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `PuntosNegocios`
--

CREATE TABLE `PuntosNegocios` (
  `ID` int(11) NOT NULL,
  `NegocioID` int(11) NOT NULL,
  `ClienteID` int(11) NOT NULL,
  `Puntos` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `PuntosNegocios`
--

INSERT INTO `PuntosNegocios` (`ID`, `NegocioID`, `ClienteID`, `Puntos`) VALUES
(14, 47, 130, 140),
(17, 48, 130, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `confirmado` tinyint(1) DEFAULT 0,
  `avatar` varchar(255) DEFAULT NULL,
  `columna_avatar` varchar(255) DEFAULT NULL,
  `qr_code_identifier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `contraseña`, `confirmado`, `avatar`, `columna_avatar`, `qr_code_identifier`) VALUES
(36, 'Rober', 'info@cantinatexmex.cm', '$2y$10$9fsumTJNzbycdkAS38PsDO/2.iNJlw9938YeeaA5/2G4X24pfg1ty', 0, NULL, NULL, NULL),
(130, 'Roberto', 'Info@lweb.ch', '$2y$10$MrkhQaV88fD7k2MaO2dulONObHI/j1o6qJ9C6Pe9B1L3y1oPKVsRG', 0, 'https://foodscan-ai.com/uploads/avatars/65dcc3459ef56.jpg', NULL, '2c6f0b1d8dee38993c90644966b51da077da178ca5a77c611d5ca42073705062');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `negocios`
--
ALTER TABLE `negocios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indizes für die Tabelle `negocios_usuarios`
--
ALTER TABLE `negocios_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_id` (`negocio_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indizes für die Tabelle `Puntos`
--
ALTER TABLE `Puntos`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_negocio` (`NegocioID`),
  ADD KEY `fk_cliente` (`ClienteID`);

--
-- Indizes für die Tabelle `PuntosNegocios`
--
ALTER TABLE `PuntosNegocios`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `idx_negocio_cliente` (`NegocioID`,`ClienteID`),
  ADD KEY `ClienteID` (`ClienteID`);

--
-- Indizes für die Tabelle `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT für Tabelle `negocios`
--
ALTER TABLE `negocios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT für Tabelle `negocios_usuarios`
--
ALTER TABLE `negocios_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Puntos`
--
ALTER TABLE `Puntos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `PuntosNegocios`
--
ALTER TABLE `PuntosNegocios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT für Tabelle `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `negocios_usuarios`
--
ALTER TABLE `negocios_usuarios`
  ADD CONSTRAINT `negocios_usuarios_ibfk_1` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`),
  ADD CONSTRAINT `negocios_usuarios_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Constraints der Tabelle `Puntos`
--
ALTER TABLE `Puntos`
  ADD CONSTRAINT `fk_cliente` FOREIGN KEY (`ClienteID`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_negocio` FOREIGN KEY (`NegocioID`) REFERENCES `negocios` (`id`);

--
-- Constraints der Tabelle `PuntosNegocios`
--
ALTER TABLE `PuntosNegocios`
  ADD CONSTRAINT `PuntosNegocios_ibfk_1` FOREIGN KEY (`NegocioID`) REFERENCES `negocios` (`id`),
  ADD CONSTRAINT `PuntosNegocios_ibfk_2` FOREIGN KEY (`ClienteID`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
