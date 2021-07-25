"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
// Создаем соединение
const database = mysql_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'librarysql'
});
// Соединение
database.connect((error) => {
    if (error) {
        throw error;
    }
    else {
        console.log('sql connected !');
    }
});
const app = express_1.default();
// Создать базу данных
app.get('/createdatabase', (req, res) => {
    let sql = "CREATE DATABASE librarysql";
    database.query(sql, (error, result) => {
        if (error)
            throw error;
        console.log(result);
        res.send('database created!');
    });
});
// Создать таблицу пользователей:
// userId = номер пользователя (увеличиваем на 1 при создании нового), userName = имя пользователя,
// pass = 0: нет абонемента / 1: есть абонемент, books = число взятых книг.
app.get('/createuserstable', (req, res) => {
    let sql = "CREATE TABLE users(userId int AUTO_INCREMENT, userName VARCHAR(255), pass int, books int, PRIMARY KEY(userId))";
    database.query(sql, (error, result) => {
        if (error)
            throw error;
        console.log(result);
        res.send('Таблица пользователей создана...');
    });
});
// Создаеть таблицу книг:
// bookId = номер книги (увеличиваем на 1 при создании новой), bookTitle = название книги, takenBy = userId пользователя, который взял книгу.
app.get('/createbookstable', (req, res) => {
    let sql = "CREATE TABLE books(bookId int AUTO_INCREMENT, bookTitle VARCHAR(255), ownerId int, PRIMARY KEY(bookId))";
    database.query(sql, (error, result) => {
        if (error)
            throw error;
        console.log(result);
        res.send('Таблица книг создана...');
    });
});
// Добавить пользователя (Изначально абонемента и книг нет, поэтому pass и books = 0)
app.get('/adduser/:userName', (req, res) => {
    let user = { userName: database.escape(req.params.userName), pass: 0, books: 0 };
    let sql = "INSERT INTO users SET ?";
    let query = database.query(sql, user, (error, result) => {
        if (error)
            throw error;
        console.log(result);
        res.send('Пользователь ' + database.escape(req.params.userName) + ' добавлен...');
    });
});
// Отредактировать пользователя по userId
app.get('/edituser/:userId/:newName', (req, res) => {
    let sql = 'UPDATE users SET userName = ' + database.escape(req.params.newName) + ' WHERE userId = ' + database.escape(req.params.userId);
    let query = database.query(sql, (error, result) => {
        if (error)
            throw error;
        console.log(result);
        res.send('Имя пользователя (id: ' + database.escape(req.params.userId) + ') изменено на ' + database.escape(req.params.newName) + ' ...');
    });
});
// Удалить пользователя по userId
app.get('/deleteuser/:userId', (req, res) => {
    let sqlUsers = 'DELETE FROM users WHERE userId = ' + database.escape(req.params.userId);
    let queryUsers = database.query(sqlUsers, (error, result) => {
        if (error)
            throw error;
        console.log(result);
    });
    // Освобождаем книги, которыми владел пользователь
    let sqlBooks = 'UPDATE books SET ownerID = ' + 0 + ' WHERE ownerId = ' + database.escape(req.params.userId);
    let queryBooks = database.query(sqlBooks, (error, result) => {
        if (error)
            throw error;
        console.log(result);
        res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') удален...');
    });
});
// Дать абонемент пользователю по userId
app.get('/givepass/:userId', (req, res) => {
    let sql = 'UPDATE users SET pass = ' + 1 + ' WHERE userId = ' + database.escape(req.params.userId) + ' AND pass = 0';
    let query = database.query(sql, (error, result) => {
        if (error)
            throw error;
        console.log(result);
        // Проверяем есть ли абонемент
        if (result.affectedRows == 0) {
            res.send('У пользователя (id: ' + database.escape(req.params.userId) + ') уже есть абонемент...');
        }
        else {
            res.send('Пользователю (id: ' + database.escape(req.params.userId) + ') выдан абонемент...');
        }
    });
});
// Получить список всех пользователей
app.get('/getusers', (req, res) => {
    let sql = "SELECT * FROM users";
    let query = database.query(sql, (error, results) => {
        if (error)
            throw error;
        console.log(results);
        res.send('Список пользователей получен...');
    });
});
// Получить информацию о пользователе по userId
app.get('/getuser/:userId', (req, res) => {
    let sqlUser = 'SELECT * FROM users WHERE userId = ' + database.escape(req.params.userId);
    let sqlBooks = 'SELECT * FROM books WHERE ownerId = ' + database.escape(req.params.userId);
    // Из таблицы users получаем строку, где совпадает userId, из books - строки, где совпадают ownerId.
    // Объединяем результат в один массив и выводим информацию.
    let query = database.query((sqlUser), (error, result) => {
        if (error)
            throw error;
        let userRes = result;
        let queryBooks = database.query(sqlBooks, (error, result) => {
            if (error)
                throw error;
            result.splice(0, 0, userRes[0]);
            result = 'Информация по пользователе: ' + JSON.stringify(result, null, 4);
            console.log(result);
            res.send(result);
        });
    });
});
// Добавить книгу (Изначально книгу еще не взяли, поэтому userId = 0)
app.get('/addbook/:bookTitle', (req, res) => {
    let book = { bookTitle: database.escape(req.params.bookTitle), ownerId: 0 };
    let sql = "INSERT INTO books SET ?";
    let query = database.query(sql, book, (error, result) => {
        if (error)
            throw error;
        console.log(result);
        res.send('Книга ' + database.escape(req.params.bookTitle) + ' добавлена...');
    });
});
// Выдать книгу. Если у пользователя есть абонемент, меньше 5 книг, а у книги еще нет владельца, 
// то у пользователя количество книг прибавляется на 1, а у книги появляется владелец с userId пользователя.
app.get('/givebook/:userId/:bookId', (req, res) => {
    let sql = 'UPDATE users, books SET users.books = users.books + ' + 1 + ', books.ownerId = ' + database.escape(req.params.userId) +
        ' WHERE users.userId = ' + database.escape(req.params.userId) + ' AND users.pass = ' + 1 + ' AND users.books < ' + 5 +
        ' AND books.bookId = ' + database.escape(req.params.bookId) + ' AND books.ownerId = ' + 0;
    let query = database.query(sql, (error, result) => {
        if (error)
            throw error;
        // Проверяем изменились ли данные
        if (result.affectedRows == 0) {
            res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') не может взять книгу (id: ' + database.escape(req.params.bookId) + ')...');
        }
        else {
            res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') взял книгу (id: ' + database.escape(req.params.bookId) + ')...');
        }
    });
});
// Вернуть книгу. 
app.get('/returnbook/:userId/:bookId', (req, res) => {
    let sql = 'UPDATE users, books SET users.books = users.books - ' + 1 + ', books.ownerId = ' + 0 +
        ' WHERE users.userId = ' + database.escape(req.params.userId) + ' AND users.books > ' + 0 +
        ' AND books.bookId = ' + database.escape(req.params.bookId) + ' AND books.ownerId = ' + database.escape(req.params.userId);
    let query = database.query(sql, (error, result) => {
        if (error)
            throw error;
        // Проверяем изменились ли данные
        if (result.affectedRows == 0) {
            res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') не может вернуть книгу (id: ' + database.escape(req.params.bookId) + ')...');
        }
        else {
            res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') вернул книгу (id: ' + database.escape(req.params.bookId) + ')...');
        }
    });
});
app.listen(3000, () => console.log('Server is up and running on port : ' + 3000));
