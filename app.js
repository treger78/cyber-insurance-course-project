//подключение используемых пакетов, установленных посредством npm install
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const swig = require('swig');

const app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
//app.set('views', __dirname + '/views');
app.set('views', __dirname);

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

app.get("/personal.html", (req, res) => {
    res.sendFile(__dirname + "/personal.html");
});

let email;
let password;
let sql;

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
	email = req.body.email;
	password = req.body.password;
	const passwordCheck = req.body.passwordCheck;

	//подключаемся к БД
	const connection = mysql.createConnection({
	  database: "cyberInsurance",
	  host: "localhost",
	  user: "root",
	  password: ""
	});

	//сохраняем sql-запрос в переменную, задавай кодировку.
	sql = `SET NAMES 'utf8'`;

	/*
		Отправка sql-запроса на выполнение,
		если sql-запрос выполнился без ошибок, выводим результат выполнения,
		иначе - данные об ошибке	
	*/
	connection.query(sql, function(err, res) {
	    if (err) console.log(err);
	    console.log(res);
	});

	//сохраняем sql-запрос в переменную для добавления полученных данных в БД в таблицу Users
	sql = `INSERT INTO Users(secondName, firstName, patronymic, birthDate, 
					mobilePhone, email, password) VALUES('${secondName}', '${firstName}', 
					'${patronymic}', '${birthDate}', '${mobilePhone}', '${email}', '${password}')`;

	connection.query(sql, function(err, res) {
	    if (err) console.log(err);
	    console.log(res);
	});

	connection.end();

    res.sendFile(__dirname + "/registr.html");
});

app.post("/auth.html", urlencodedParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);

	email = req.body.email;
	password = req.body.password;

	const connection = mysql.createConnection({
	  database: "cyberInsurance",
	  host: "localhost",
	  user: "root",
	  password: ""
	});

	sql = `SET NAMES 'utf8'`;

	connection.query(sql, function(err, res) {
	    if (err) console.log(err);
	    console.log(res);
	});

	sql = `SELECT * FROM Users WHERE email = '${email}' and password = '${password}'`;

	let isSuccessAuth = false;

	(function isRegisteredUser() {
		return new Promise(function(resolve, reject) {
			connection.query(sql, function(err, res) {
			    if (err) {
			    	reject(err);
			    	console.log(err);
			    }
			    resolve(res);
			    console.log(res);
			    isSuccessAuth = true;
			    if (!res.length) {
			    	isSuccessAuth = false;
			    	console.log('Неверное имя пользователя или пароль!');
			    }
			});
			connection.end();			
		});
	}())

	.then(() => {
		if (isSuccessAuth == true) {
			res.sendFile(__dirname + "/personal.html");
		} else {
			//res.sendFile(__dirname + "/auth.html");
			res.render('auth', {errMsg: ['Неверное имя пользователя или пароль!']});
		}
	})

});

//"слушаем" запросы на порте 3000
app.listen(3000);

/*

	Need to make:
	1. Check if user already exist when someone try to registr.

*/
