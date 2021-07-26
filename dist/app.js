"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database = require('./controllers/controller');
const { createDataBase, createUsersTable, createBooksTable, addNewUser, editUserInfo, deleteUserInfo, givePassToUser, getAllUsers, getUser, addBookToBooks, giveBookToUser, returnBookToBooks } = require('./controllers/controller');
const app = express_1.default();
// Вызов функции для создания базы данных
app.get('/createdatabase', (req, res) => {
    createDataBase(req, res);
});
// Вызов функции для создания таблицы пользователей
app.get('/createuserstable', (req, res) => {
    createUsersTable(req, res);
});
// Вызов функции для создания таблицы книг
app.get('/createbookstable', (req, res) => {
    createBooksTable(req, res);
});
// Вызов фукнции для создания нового пользователя
app.get('/adduser/:userName', (req, res) => {
    addNewUser(req, res);
});
// Вызов функции для редактирования пользователя по userId
app.get('/edituser/:userId/:newName', (req, res) => {
    editUserInfo(req, res);
});
// Вызов функции для удаления пользователя по userId
app.get('/deleteuser/:userId', (req, res) => {
    deleteUserInfo(req, res);
});
// Вызов функции для выдачи абонемента
app.get('/givepass/:userId', (req, res) => {
    givePassToUser(req, res);
});
// Вызов функции для получения списка всех пользователей
app.get('/getusers', (req, res) => {
    getAllUsers(req, res);
});
// Вызов функции для получения информации об одном пользователе
app.get('/getuser/:userId', (req, res) => {
    getUser(req, res);
});
// Вызов функции для добавления книги в таблицу
app.get('/addbook/:bookTitle', (req, res) => {
    addBookToBooks(req, res);
});
// Вызов функции для выдачи книги пользователю
app.get('/givebook/:userId/:bookId', (req, res) => {
    giveBookToUser(req, res);
});
// Вызов функции для возвращения книги
app.get('/returnbook/:userId/:bookId', (req, res) => {
    returnBookToBooks(req, res);
});
app.listen(3000, () => console.log('Server is up and running on port : ' + 3000));
