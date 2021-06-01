-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Май 30 2021 г., 18:39
-- Версия сервера: 5.7.18
-- Версия PHP: 7.1.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `cyberInsurance`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Car`
--

CREATE TABLE `Car` (
  `contractID` int(13) NOT NULL,
  `userID` int(11) NOT NULL,
  `registerSign` text NOT NULL,
  `VIN` text NOT NULL,
  `carCategory` text NOT NULL,
  `Marka` text NOT NULL,
  `Model` text NOT NULL,
  `enginePower` int(11) NOT NULL,
  `releaseDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `DMC`
--

CREATE TABLE `DMC` (
  `userID` int(11) NOT NULL,
  `contractID` int(11) NOT NULL,
  `insuranceCity` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `House`
--

CREATE TABLE `House` (
  `userID` int(11) NOT NULL,
  `contractID` int(11) NOT NULL,
  `objectAddress` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `Polices`
--

CREATE TABLE `Polices` (
  `userID` int(11) NOT NULL,
  `policeID` int(11) NOT NULL,
  `contractID` int(13) NOT NULL,
  `conclusionDate` date NOT NULL,
  `expirationDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `policesID`
--

CREATE TABLE `policesID` (
  `policeID` int(11) NOT NULL,
  `policeType` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `policesID`
--

INSERT INTO `policesID` (`policeID`, `policeType`) VALUES
(1, 'Car'),
(2, 'House'),
(3, 'DMC');

-- --------------------------------------------------------

--
-- Структура таблицы `Users`
--

CREATE TABLE `Users` (
  `ID` int(11) NOT NULL,
  `secondName` text NOT NULL,
  `firstName` text NOT NULL,
  `patronymic` text NOT NULL,
  `birthDate` date NOT NULL,
  `mobilePhone` bigint(20) UNSIGNED NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Users`
--

INSERT INTO `Users` (`ID`, `secondName`, `firstName`, `patronymic`, `birthDate`, `mobilePhone`, `email`, `password`) VALUES
(75, 'Абуков', 'Кирилл', 'Валерьевич', '2021-12-12', 89005001280, '123@mail.ru', '123'),
(76, 'Берсенев', 'Игорь', 'Игоревич', '2021-12-11', 89005001280, '456@mail.ru', '123');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Car`
--
ALTER TABLE `Car`
  ADD PRIMARY KEY (`contractID`),
  ADD KEY `userID` (`userID`);

--
-- Индексы таблицы `DMC`
--
ALTER TABLE `DMC`
  ADD UNIQUE KEY `contractID` (`contractID`),
  ADD KEY `userID` (`userID`);

--
-- Индексы таблицы `House`
--
ALTER TABLE `House`
  ADD UNIQUE KEY `contractID` (`contractID`),
  ADD KEY `userID` (`userID`);

--
-- Индексы таблицы `Polices`
--
ALTER TABLE `Polices`
  ADD UNIQUE KEY `contractID` (`contractID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `policeID` (`policeID`) USING BTREE;

--
-- Индексы таблицы `policesID`
--
ALTER TABLE `policesID`
  ADD UNIQUE KEY `policeID` (`policeID`);

--
-- Индексы таблицы `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Car`
--
ALTER TABLE `Car`
  MODIFY `contractID` int(13) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `policesID`
--
ALTER TABLE `policesID`
  MODIFY `policeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT для таблицы `Users`
--
ALTER TABLE `Users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;
--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Car`
--
ALTER TABLE `Car`
  ADD CONSTRAINT `car_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`ID`);

--
-- Ограничения внешнего ключа таблицы `DMC`
--
ALTER TABLE `DMC`
  ADD CONSTRAINT `dmc_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`ID`);

--
-- Ограничения внешнего ключа таблицы `House`
--
ALTER TABLE `House`
  ADD CONSTRAINT `house_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Polices`
--
ALTER TABLE `Polices`
  ADD CONSTRAINT `polices_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `polices_ibfk_2` FOREIGN KEY (`policeID`) REFERENCES `policesID` (`policeID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
