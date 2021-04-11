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
	/*
	т. к. на странице auth используется swig для вывода сообщений о неверном логине или пароле, 
	страницу отображаем таким способом (изначально передавая пустой объект)
	*/
    res.render('auth', {});
});

app.get("/registr.html", (req, res) => {
    res.render('registr', {});
});

let data = {
	secondName: '',
	firstName: '',
	patronymic: '',
	birthDate: '',
	mobilePhone: 0,
	email: '',
	password: ''
}

let sql;

function getDBData() {
	return new Promise(function(resolve, reject) {

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

		sql = `SELECT * FROM Users WHERE email = '${data.email}'`;
		
		connection.query(sql, function(err, res) {
		    if (err) {
		    	reject(err);
		    	console.log(err);
		    }
		    resolve(res);
		    console.log(res);
			data.secondName = res[0].secondName;
			data.firstName = res[0].firstName;
			data.patronymic = res[0].patronymic;
			data.birthDate = res[0].birthDate.toISOString().substr(0, 10);
			data.mobilePhone = res[0].mobilePhone;
		});

	});				
}

//отправляем данные со страницы в БД
app.post("/registr.html", urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    //выводим полученные в результате запроса данные в коносль (node)
    console.log(req.body);
    //посылаем и отображаем данные на странице (клиент)
    //res.send(`${req.body.secondName} - ${req.body.firstName}`);

    //записываем полученные по запросу данные в переменные
	data.secondName = req.body.secondName;
	data.firstName = req.body.firstName;
	data.patronymic = req.body.patronymic;
	data.birthDate = req.body.birthDate;
	data.mobilePhone = req.body.mobilePhone;
	data.email = req.body.email;
	data.password = req.body.password;
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

	sql = `SELECT * FROM Users WHERE email = '${data.email}'`;

	let isAlreadyExistUser = false;

	(function isExistUser() {
		return new Promise(function(resolve, reject) {
			connection.query(sql, function(err, res) {
			    if (err) {
			    	reject(err);
			    	console.log(err);
			    }
			    resolve(res);
			    console.log(res);
			    if (res.length != 0) {
			    	isAlreadyExistUser = true;
			    }
			});			
		});
	}())
	.then(() => {
		if (data.password != passwordCheck) {
			return res.render('registr', {passwordErrMsg: 'Введенные пароли не совпадают!'});
		}
		if (isAlreadyExistUser) {
			return res.render('registr', {isAlreadyExistUserErr: 'Пользователь с таким email уже существует!'});
		} else {
			//сохраняем sql-запрос в переменную для добавления полученных данных в БД в таблицу Users
			sql = `INSERT INTO Users(secondName, firstName, patronymic, birthDate, 
							mobilePhone, email, password) VALUES('${data.secondName}', '${data.firstName}', 
							'${data.patronymic}', '${data.birthDate}', '${data.mobilePhone}', '${data.email}', '${data.password}')`;

			connection.query(sql, function(err, res) {
			    if (err) console.log(err);
			    console.log(res);
			});		
		    getDBData()
		    .then(() => {
				res.render('personal', {secondName: data.secondName, firstName: data.firstName, patronymic: data.patronymic, 
					birthDate: data.birthDate, mobilePhone: data.mobilePhone, email: data.email});
		    });
		}
	    
	    connection.end();
	})

});

let isSuccessAuth = false;

app.post("/auth.html", urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);

	data.email = req.body.email;
	data.password = req.body.password;

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

	sql = `SELECT * FROM Users WHERE email = '${data.email}' and password = '${data.password}'`;

	(function isCorrectValue() {
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
		});
	}())
	.then(() => {
		if (isSuccessAuth) {
			getDBData()
			.then(() => {
				res.render('personal', {secondName: data.secondName, firstName: data.firstName, patronymic: data.patronymic, 
					birthDate: data.birthDate, mobilePhone: data.mobilePhone, email: data.email});
			})
			connection.end();
		} else {
			res.render('auth', {errMsg: 'Неверное имя пользователя или пароль!'});
		}
	})
});

app.get("/personal.html", urlencodedParser, (req, res) => {
    res.render('personal', {});
});

let currentUserEmail;

app.post("/personal.html", urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);

	data.secondName = req.body.secondName;
	data.firstName = req.body.firstName;
	data.patronymic = req.body.patronymic;
	data.birthDate = req.body.birthDate;
	data.mobilePhone = req.body.mobilePhone;
	data.email = req.body.email;

	currentUserEmail = data.email;	

	res.render('personal-change', {secondName: data.secondName, firstName: data.firstName, patronymic: data.patronymic, 
		birthDate: data.birthDate, mobilePhone: data.mobilePhone, email: data.email});
});

app.get("/personal-change.html", urlencodedParser, (req, res) => {
    res.render('personal-change', {});
});

app.post("/personal-change.html", urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);

	data.secondName = req.body.secondName;
	data.firstName = req.body.firstName;
	data.patronymic = req.body.patronymic;
	data.birthDate = req.body.birthDate;
	data.mobilePhone = req.body.mobilePhone;
	data.email = req.body.email;

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

	sql = `UPDATE Users SET secondName = '${data.secondName}', firstName = '${data.firstName}', patronymic = '${data.patronymic}',
		birthDate = '${data.birthDate}', mobilePhone = '${data.mobilePhone}', email = '${data.email}' 
		WHERE email = '${currentUserEmail}'`;

	connection.query(sql, function(err, res) {
	    if (err) console.log(err);
	    console.log(res);
	});

	res.render('personal', {secondName: data.secondName, firstName: data.firstName, patronymic: data.patronymic, 
		birthDate: data.birthDate, mobilePhone: data.mobilePhone, email: data.email});		

});

//"слушаем" запросы на порте 3000
app.listen(3000);

/*

	Need to make:
	1. Check if user already exist when someone try to registr.

*/
