-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 26-11-2018 a las 01:16:21
-- Versión del servidor: 5.7.23
-- Versión de PHP: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `app_clientes-mobile`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--
DROP DATABASE IF EXISTS  `app_clientes-mobile`;
CREATE DATABASE `app_clientes-mobile`;
USE `app_clientes-mobile`;

DROP TABLE IF EXISTS `comentarios`;
CREATE TABLE IF NOT EXISTS `comentarios` (
  `idcomentario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fkidusuario` int(10) UNSIGNED NOT NULL,
  `fkidpublicacion` int(10) UNSIGNED NOT NULL,
  `comentario` text NOT NULL,
  `fecha_publicacion` date DEFAULT NULL,
  PRIMARY KEY (`idcomentario`),
  UNIQUE KEY `idcomentario_UNIQUE` (`idcomentario`),
  KEY `fkidusuario_idx` (`fkidusuario`),
  KEY `fkidpublicacion_idx` (`fkidpublicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`idcomentario`, `fkidusuario`, `fkidpublicacion`, `comentario`, `fecha_publicacion`) VALUES
(1, 3, 3, 'Es mi billetera la perdí hace 2 semanas, me gustaria contactarte para recuperarla, muchas gracias.', '2018-11-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

DROP TABLE IF EXISTS `publicaciones`;
CREATE TABLE IF NOT EXISTS `publicaciones` (
  `idpublicacion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `img` text DEFAULT NULL,
  `fecha_publicacion` date DEFAULT NULL,
  `ubicacion` text NOT NULL,
  `fkidusuario` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`idpublicacion`),
  UNIQUE KEY `idpublicacion_UNIQUE` (`idpublicacion`),
  KEY `fkidusuario_idx` (`fkidusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `publicaciones`
--

INSERT INTO `publicaciones` (`idpublicacion`, `titulo`, `descripcion`, `img`, `fecha_publicacion`, `ubicacion`, `fkidusuario`) VALUES
(1, 'Telefono celular Moto g5', 'Se encontro telefono celular moto g5 tirado en la parada de la calle vicente lopez y triunvirato en quilmes.', NULL, '2018-11-20', 'Quilmes Oeste ', 1),
(2, 'LLaves con llavero de Quilmes', 'Se encontraron llaves con llavero del escudo del club quilmes en la puerta de la panaderia que se encuentra en dorrego al 3000 frente a la gomeria, el viernes por la tarde.', NULL, '2018-11-20', 'Quilmes Este', 3),
(3, 'Billetera con documentos.', 'Se encontro billetera con documentos  que pertenecen a Milton Arce en la Av. Corrientes y Ayacucho el dia martes a las 18 horas. La misma contiene documento y cedula de vehiculo y 300 pesos. ', NULL, '2018-11-20', 'Capital Federal', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `idusuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `fecha_alta` date DEFAULT NULL,
  `password` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `img` text DEFAULT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `idusuario_UNIQUE` (`idusuario`),
  UNIQUE KEY `user_UNIQUE` (`usuario`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idusuario`, `usuario`, `nombre`, `apellido`, `fecha_alta`, `password`, `email`, `img`) VALUES
(1, 'admin', 'Admin', 'Administrador', '2018-11-20', '$2y$10$dZlL62iNlBs8YrrhUAPPeeV5sh4EQj.wj6J10JROzUNyQ5jpveKcS', 'admin@mail.com', NULL),
(2, 'matias.torre', 'Matias', 'Torre', '2018-11-20', '$2y$10$dZlL62iNlBs8YrrhUAPPeeV5sh4EQj.wj6J10JROzUNyQ5jpveKcS', 'mtorre@mail.com', NULL),
(3, 'milton.arce', 'Milton', 'Arce', '2018-11-20', '$2y$10$dZlL62iNlBs8YrrhUAPPeeV5sh4EQj.wj6J10JROzUNyQ5jpveKcS', 'marce@mail.com', NULL);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `idpublicacion` FOREIGN KEY (`fkidpublicacion`) REFERENCES `publicaciones` (`idpublicacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idusuario` FOREIGN KEY (`fkidusuario`) REFERENCES `usuarios` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `fkidusuario` FOREIGN KEY (`fkidusuario`) REFERENCES `usuarios` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
