"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model = require('../models/model');
const mysql_1 = __importDefault(require("mysql"));
// Параметры базы данных и подключение MySQL
const database = mysql_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'librarysql'
});
database.connect((error) => {
    if (error) {
        throw error;
    }
    else {
        console.log('Sql подключен');
    }
});
// Функция для создания базы данных
function createDataBase(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield Model.newDatabase();
            database.query(sql, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(result);
                    res.send('База данных создана...');
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Функция для создания таблицы пользователей
function createUsersTable(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield Model.newUsersTable();
            database.query(sql, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(result);
                    res.send('Таблица пользователей создана...');
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Функция для создания таблицы книг
function createBooksTable(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield Model.newBooksTable();
            database.query(sql, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(result);
                    res.send('Таблица книг создана...');
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Функция для создания нового пользователя
// Изначально абонемента и книг нет, поэтому pass и books = 0
function addNewUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield Model.newUser();
            let user = { userName: database.escape(req.params.userName), pass: 0, books: 0 };
            let query = database.query(sql, user, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(result);
                    res.send('Пользователь ' + database.escape(req.params.userName) + ' добавлен...');
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Функция для редактирования пользователя по userId
function editUserInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield Model.editUser(database.escape(req.params.newName), database.escape(req.params.userId));
            let query = database.query(sql, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(result);
                    res.send('Имя пользователя (id: ' + database.escape(req.params.userId) + ') изменено на ' + database.escape(req.params.newName) + ' ...');
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Функция для удаления пользователя по userId
function deleteUserInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Удаляем пользователя из таблицы
            const sqlUsers = yield Model.deleteUser(database.escape(req.params.userId));
            let queryUsers = database.query(sqlUsers, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(result);
                }
            });
            // Освобождаем книги, которыми владел пользователь
            const sqlBooks = yield Model.deleteUserBooks(database.escape(req.params.userId));
            let queryBooks = database.query(sqlBooks, (error, result) => {
                if (error)
                    throw error;
                console.log(result);
                res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') удален...');
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Функция для выдачи абонемента пользователю по userId
function givePassToUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield Model.givePass(database.escape(req.params.userId));
            let query = database.query(sql, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(result);
                    // Проверяем есть ли абонемент
                    if (result.affectedRows == 0) {
                        res.send('У пользователя (id: ' + database.escape(req.params.userId) + ') уже есть абонемент...');
                    }
                    else {
                        res.send('Пользователю (id: ' + database.escape(req.params.userId) + ') выдан абонемент...');
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Функция для получения списка пользователей
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield Model.getUsers();
            let query = database.query(sql, (error, results) => {
                if (error) {
                    console.log(error);
                }
                else {
                    results = 'Список всех пользователей: ' + JSON.stringify(results, null, 4);
                    console.log(results);
                    res.send(results);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Функция для получения информации о пользователе
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sqlUser = yield Model.getUserInfo(database.escape(req.params.userId));
            const sqlBooks = yield Model.getUserBooks(database.escape(req.params.userId));
            // Из таблицы users получаем строку, где совпадает userId, из books - строки, где совпадают ownerId.
            // Объединяем результат в один массив и выводим информацию.
            let query = database.query(sqlUser, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    let userRes = result;
                    let queryBooks = database.query(sqlBooks, (error, result) => {
                        if (error)
                            throw error;
                        result.splice(0, 0, userRes[0]);
                        result = 'Информация по пользователе: ' + JSON.stringify(result, null, 4);
                        console.log(result);
                        res.send(result);
                    });
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Добавить книгу (Изначально книгу еще не взяли, поэтому ownerId = 0)
function addBookToBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let book = { bookTitle: database.escape(req.params.bookTitle), ownerId: 0 };
            const sql = yield Model.addBook();
            let query = database.query(sql, book, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(result);
                    res.send('Книга ' + database.escape(req.params.bookTitle) + ' добавлена...');
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Выдать книгу, если у пользователя есть абонемент, не больше 5 книг, а у книги еще нет владельца.
function giveBookToUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield Model.giveBook(database.escape(req.params.userId), database.escape(req.params.bookId));
            let query = database.query(sql, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    if (result.affectedRows == 0) {
                        res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') не может взять книгу (id: ' + database.escape(req.params.bookId) + ')...');
                    }
                    else {
                        res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') взял книгу (id: ' + database.escape(req.params.bookId) + ')...');
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Вернуть книгу
function returnBookToBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield Model.returnBook(database.escape(req.params.userId), database.escape(req.params.bookId));
            let query = database.query(sql, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    if (result.affectedRows == 0) {
                        res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') не может вернуть книгу (id: ' + database.escape(req.params.bookId) + ')...');
                    }
                    else {
                        res.send('Пользователь (id: ' + database.escape(req.params.userId) + ') вернул книгу (id: ' + database.escape(req.params.bookId) + ')...');
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
module.exports = {
    database,
    createDataBase,
    createUsersTable,
    createBooksTable,
    addNewUser,
    editUserInfo,
    deleteUserInfo,
    givePassToUser,
    getAllUsers,
    getUser,
    addBookToBooks,
    giveBookToUser,
    returnBookToBooks
};
