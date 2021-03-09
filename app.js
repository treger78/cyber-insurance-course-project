//подключение используемых пакетов, установленных посредством npm install
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');

const app = express();

//промежуточное ПО для получения данных из формы
const urlencodedParser = bodyParser.urlencoded({extended: true});

//для работы стилей и картинок при разворачивании сайта на сервере
app.use('/public', express.static('public'));

//какую страницу отображать при данном url
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/index.html", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/auth.html", (req, res) => {
    res.sendFile(__dirname + "/auth.html");
});

app.get("/registr.html", (req, res) => {
    res.sendFile(__dirname + "/registr.html");
});

//отправляем данные со страницы в БД
app.post("/registr.html", urlencodedParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);
    //выводим полученные в результате запроса данные в коносль (node)
    console.log(req.body);
    //посылаем и отображаем данные на странице (клиент)
    //res.send(`${req.body.secondName} - ${req.body.firstName}`);

    //записываем полученные по запросу данные в переменные
	const secondName = req.body.secondName;
	const firstName = req.body.firstName;
	const patronymic = req.body.patronymic;
	const birthDate = req.body.birthDate;
	const mobilePhone = req.body.mobilePhone;
	const email = req.body.email;
	const password = req.body.password;
	const passwordCheck = req.body.passwordCheck;

	//подключаемся к БД
	const connection = mysql.createConnection({
	  database: "cyberInsurance",
	  host: "localhost",
	  user: "root",
	  password: ""
	});

	//сохраняем sql-запрос в переменную, задавай кодировку.
	let sql = `SET NAMES 'utf8'`;

	/*
		Отправка sql-запроса на выполнение,
		если sql-запрос выполнился без ошибок, выводим результат выполнения,
		иначе - данные об ошибке	
	*/
	connection.query(sql, function(err, results) {
	    if (err) console.log(err);
	    console.log(results);
	});

	//сохраняем sql-запрос в переменную для добавления полученных данных в БД в таблицу Users
	sql = `INSERT INTO Users(secondName, firstName, patronymic, birthDate, 
					mobilePhone, email, password) VALUES('${secondName}', '${firstName}', 
					'${patronymic}', '${birthDate}', '${mobilePhone}', '${email}', '${password}')`;

	connection.query(sql, function(err, results) {
	    if (err) console.log(err);
	    console.log(results);
	});

	connection.end();

    res.sendFile(__dirname + "/registr.html");
});

	/*
	const connection = mysql.createConnection({
	  database: "reg",
	  host: "localhost",
	  user: "root",
	  password: ""
	});	

	let sql = `SET NAMES 'utf8'`;

	connection.query(sql, function(err, results) {
	    if (err) console.log(err);
	    console.log(results);
	});

	sql = `SELECT * FROM people`;
 
	connection.query(sql, function(err, results) {
	    if(err) console.log(err);
	    console.log(results);
	});
	*/

//"слушаем" запросы на порте 3000
app.listen(3000);